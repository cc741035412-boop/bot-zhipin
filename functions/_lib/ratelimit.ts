import type { D1Database } from '@cloudflare/workers-types'

export const RATE_LIMITS = {
  login: { windowMs: 3_600_000, limit: 120 },
  shot: { windowMs: 86_400_000, limit: 60, byteLimit: 60 * 1024 * 1024 },
  'shot-all': { windowMs: 86_400_000, limit: 1000 },
  'submit-try': { windowMs: 3_600_000, limit: 40 },
  submit: { windowMs: 86_400_000, limit: 10 },
  'submit-slug': { windowMs: 120_000, limit: 1 },
  'submit-all': { windowMs: 3_600_000, limit: 20 },
  status: { windowMs: 60_000, limit: 30 },
  'status-gh': { windowMs: 3_600_000, limit: 600 },
} as const

interface Limit {
  bucket: string
  key: string
  windowMs: number
  limit: number
  bytes?: number
  byteLimit?: number
}

export async function hit(db: D1Database, { bucket, key, windowMs, limit, bytes = 0, byteLimit }: Limit, now: number) {
  if (!Number.isSafeInteger(windowMs) || windowMs <= 0 || !Number.isSafeInteger(limit) || limit < 1
    || !Number.isSafeInteger(bytes) || bytes < 0 || !Number.isSafeInteger(now)
    || (byteLimit !== undefined && (!Number.isSafeInteger(byteLimit) || byteLimit < 0))) {
    throw new Error('Invalid rate limit')
  }
  // Fixed windows are represented by their start timestamp in milliseconds.
  const window = Math.floor(now / windowMs) * windowMs
  const row = await db.prepare(`
    INSERT INTO rate_limits (bucket, key, window, n, bytes) VALUES (?1, ?2, ?3, 1, ?4)
    ON CONFLICT (bucket, key, window) DO UPDATE SET n = n + 1, bytes = bytes + ?4
    RETURNING n, bytes
  `).bind(bucket, key, window, bytes).first<{ n: number; bytes: number }>()
  if (!row) throw new Error('Rate limit unavailable')
  return {
    ok: row.n <= limit && (byteLimit === undefined || row.bytes <= byteLimit),
    n: row.n,
    bytes: row.bytes,
    retryAfter: Math.max(1, Math.ceil((window + windowMs - now) / 1000)),
  }
}

export async function deleteExpiredLimits(db: D1Database, now: number): Promise<void> {
  // Each known bucket has its own lifetime; unknown buckets are retained conservatively for a day.
  const clauses = Object.entries(RATE_LIMITS).map(([bucket, { windowMs }]) => `WHEN '${bucket}' THEN ${windowMs}`).join(' ')
  await db.prepare(`DELETE FROM rate_limits WHERE window + CASE bucket ${clauses} ELSE 86400000 END <= ?1`)
    .bind(now).run()
}
