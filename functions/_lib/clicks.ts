import type { D1Database } from '@cloudflare/workers-types'
import { ApiError } from './errors'
import { normalizeIp } from './ip'
import type { ClickBody, ClickKind } from './types'

export const DAY_MS = 86_400_000
export const DEDUPE_SQL = `
  INSERT INTO click_dedupe (slug, ip_hash, last_at) VALUES (?1, ?2, ?3)
  ON CONFLICT (slug, ip_hash) DO UPDATE SET last_at = excluded.last_at
  WHERE click_dedupe.last_at <= ?3 - 86400000
`

export function isValidSlug(slug: unknown): slug is string {
  return typeof slug === 'string' && slug.length >= 2 && slug.length <= 40
    && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)
}

export function validateClick(body: unknown): ClickBody {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new ApiError(400, 'bad_request')
  }
  const { slug, kind } = body as Partial<ClickBody>
  if (!isValidSlug(slug) || (kind !== 'import' && kind !== 'prompt')) {
    throw new ApiError(400, 'bad_request')
  }
  return { slug, kind }
}

export async function hashIp(salt: string | undefined, ip: string, slug: string): Promise<string> {
  if (!salt) throw new ApiError(500, 'server_error')
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(salt), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(`${normalizeIp(ip)}|${slug}`))
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export async function recordClick({ db, salt, slugs, ip, slug, kind, now }: {
  db: D1Database
  salt: string | undefined
  slugs: ReadonlySet<string>
  ip: string
  slug: string
  kind: ClickKind
  now: number
}) {
  if (!salt) throw new ApiError(500, 'server_error')
  validateClick({ slug, kind })
  if (!slugs.has(slug)) throw new ApiError(404, 'unknown_slug')

  const ipHash = await hashIp(salt, ip, slug)
  const result = await db.prepare(DEDUPE_SQL).bind(slug, ipHash, now).run()
  const counted = result.meta.changes === 1
  if (counted) {
    // Only the request that acquired the dedupe window may increment the count.
    await db.prepare(`
      INSERT INTO click_counts (slug, kind, n) VALUES (?1, ?2, 1)
      ON CONFLICT (slug, kind) DO UPDATE SET n = n + 1
    `).bind(slug, kind).run()
  }
  const heat = await db.prepare('SELECT COALESCE(SUM(n), 0) AS heat FROM click_counts WHERE slug = ?1')
    .bind(slug).first<number>('heat')
  return { ok: true, counted, heat: heat ?? 0 }
}

export async function readStats(db: D1Database) {
  const { results } = await db.prepare('SELECT slug, kind, n FROM click_counts')
    .all<{ slug: string; kind: ClickKind; n: number }>()
  // A valid slug may be "constructor"; never use inherited object properties.
  const heat: Record<string, number> = Object.create(null)
  const byKind: Record<string, Record<ClickKind, number>> = Object.create(null)
  for (const { slug, kind, n } of results) {
    heat[slug] = (heat[slug] ?? 0) + n
    byKind[slug] ??= { import: 0, prompt: 0 }
    byKind[slug][kind] = n
  }
  return { ok: true, heat, byKind }
}

export async function deleteExpired(db: D1Database, now: number): Promise<void> {
  await db.prepare('DELETE FROM click_dedupe WHERE last_at < ?1').bind(now - DAY_MS).run()
}
