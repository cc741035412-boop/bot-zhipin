import { isValidSlug } from './clicks'
import { ApiError } from './errors'
import type { Env } from './types'

const TTL_MS = 60_000
// Keep deployments/bindings and origins separate, including mocked ASSETS in tests.
const cache = new WeakMap<Env['ASSETS'], Map<string, { expiresAt: number; slugs: ReadonlySet<string> }>>()

export async function loadSlugs(assets: Env['ASSETS'], requestUrl: string, now: number): Promise<ReadonlySet<string>> {
  const url = new URL('/api-data/slugs.json', requestUrl)
  const cached = cache.get(assets)?.get(url.origin)
  if (cached && now < cached.expiresAt) return cached.slugs

  try {
    const response = await assets.fetch(url)
    if (!response.ok) throw new ApiError(500, 'server_error')
    const data: unknown = await response.json()
    if (!Array.isArray(data) || !data.every(isValidSlug)) throw new ApiError(500, 'server_error')
    const slugs = new Set<string>(data)
    const entries = cache.get(assets) ?? new Map()
    entries.set(url.origin, { expiresAt: now + TTL_MS, slugs })
    cache.set(assets, entries)
    return slugs
  } catch {
    // Never serve a stale allowlist or expose an ASSETS error to the client.
    throw new ApiError(500, 'server_error')
  }
}
