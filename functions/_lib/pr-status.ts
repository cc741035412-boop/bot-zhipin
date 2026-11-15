import { ApiError } from './errors'
import { hit, RATE_LIMITS } from './ratelimit'
import type { submissionStatus } from './submit'
import type { Env } from './types'

type Body = Awaited<ReturnType<typeof submissionStatus>>
interface Entry { body: Body; fetchedAt: number }
interface Cache { entries: Map<number, Entry>; pending: Map<number, Promise<Entry>> }
// Separate bindings cannot share results; within each isolate/binding the key is the PR number.
const caches = new WeakMap<Env['DB'], Cache>()
const MAX_MEMORY_ENTRIES = 1000
const states = new Set(['checking', 'failed', 'waiting_review', 'approved', 'merged', 'live', 'closed'])

function remember(cache: Cache, pr: number, entry: Entry): Entry {
  cache.entries.delete(pr)
  cache.entries.set(pr, entry)
  if (cache.entries.size > MAX_MEMORY_ENTRIES) cache.entries.delete(cache.entries.keys().next().value!)
  return entry
}

function fromRow(row: { body: string; fetched_at: number } | null): Entry | undefined {
  if (!row || !Number.isSafeInteger(row.fetched_at)) return
  try {
    const body = JSON.parse(row.body)
    if (body?.ok !== true || !states.has(body.state) || !['pending', 'success', 'failure'].includes(body.checks)
      || !(body.slug === null || (typeof body.slug === 'string' && /^[a-z0-9-]+$/.test(body.slug)))
      || typeof body.url !== 'string') return
    return { body, fetchedAt: row.fetched_at }
  } catch { return }
}

const fresh = (entry: Entry | undefined, now: number) => entry && now >= entry.fetchedAt
  && now - entry.fetchedAt < (entry.body.state === 'checking' ? 30_000 : 120_000)

export async function cachedSubmissionStatus(pr: number, { db, now, origin, fetchStatus }: {
  db: Env['DB']; now: number; origin: string; fetchStatus: () => Promise<Body>
}): Promise<Body> {
  let cache = caches.get(db)
  if (!cache) { cache = { entries: new Map(), pending: new Map() }; caches.set(db, cache) }
  const local = cache.entries.get(pr)
  // liveUrl belongs to this request origin, not the host that populated D1.
  const present = ({ body }: Entry): Body => ({ ...body, liveUrl: body.state === 'live' && body.slug ? `${origin}/bots/${body.slug}` : null })
  if (fresh(local, now)) return present(local!)
  const pending = cache.pending.get(pr)
  if (pending) return present(await pending)
  const refresh = (async (): Promise<Entry> => {
    const row = await db.prepare('SELECT body, fetched_at FROM pr_status WHERE pr = ?1').bind(pr)
      .first<{ body: string; fetched_at: number }>()
    const stored = fromRow(row)
    const cached = stored && (!local || stored.fetchedAt >= local.fetchedAt) ? remember(cache, pr, stored) : local
    if (fresh(cached, now)) return cached!
    const budget = await hit(db, { bucket: 'status-gh', key: '*', ...RATE_LIMITS['status-gh'] }, now)
    if (!budget.ok) {
      if (cached) return cached
      throw new ApiError(503, 'github_error')
    }
    const body = await fetchStatus()
    await db.prepare(`INSERT INTO pr_status (pr, body, fetched_at) VALUES (?1, ?2, ?3)
      ON CONFLICT (pr) DO UPDATE SET body = excluded.body, fetched_at = excluded.fetched_at`)
      .bind(pr, JSON.stringify(body), now).run()
    return remember(cache, pr, { body, fetchedAt: now })
  })()
  cache.pending.set(pr, refresh)
  try { return present(await refresh) }
  finally { cache.pending.delete(pr) }
}
