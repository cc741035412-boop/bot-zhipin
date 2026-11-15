import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { copyFile, mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPlatformProxy } from 'wrangler'
import { deleteExpiredLimits, hit, RATE_LIMITS } from '../../functions/_lib/ratelimit.ts'
import { scheduleCleanup } from '../../functions/_lib/http.ts'

const root = fileURLToPath(new URL('../../', import.meta.url))
let proxy, db, directory
beforeAll(async () => {
  directory = await mkdtemp(join(tmpdir(), 'bz-limits-'))
  await copyFile(join(root, 'wrangler.toml'), join(directory, 'wrangler.toml'))
  proxy = await getPlatformProxy({ configPath: join(directory, 'wrangler.toml'), envFiles: [], persist: false, remoteBindings: false })
  db = proxy.env.DB
  for (const file of ['0001_init.sql', '0002_submit.sql']) {
    const sql = await readFile(join(root, 'migrations', file), 'utf8')
    for (const statement of sql.split(';').map((s) => s.trim()).filter(Boolean)) await db.prepare(statement).run()
  }
}, 30_000)
afterAll(async () => {
  await proxy?.dispose()
  if (directory) await rm(directory, { recursive: true, force: true })
})
beforeEach(async () => {
  await db.prepare('DELETE FROM rate_limits').run()
  await db.prepare('DELETE FROM click_dedupe').run()
})
const options = { bucket: 'login', key: 'hashed-test-ip', ...RATE_LIMITS.login }
const now = 1_800_000_000_000

describe('真实临时 D1 限流', () => {
  it('完整九个 bucket 的固定窗口和限额', () => {
    expect(RATE_LIMITS).toEqual({
      login: { windowMs: 3_600_000, limit: 120 },
      shot: { windowMs: 86_400_000, limit: 60, byteLimit: 62_914_560 },
      'shot-all': { windowMs: 86_400_000, limit: 1000 },
      'submit-try': { windowMs: 3_600_000, limit: 40 },
      submit: { windowMs: 86_400_000, limit: 10 },
      'submit-slug': { windowMs: 120_000, limit: 1 },
      'submit-all': { windowMs: 3_600_000, limit: 20 },
      status: { windowMs: 60_000, limit: 30 },
      'status-gh': { windowMs: 3_600_000, limit: 600 },
    })
  })

  it('第 120 次通过，第 121 次拒绝，拒绝仍计数', async () => {
    for (let n = 1; n <= 121; n++) {
      expect(await hit(db, options, now)).toEqual({ ok: n <= 120, n, bytes: 0, retryAfter: 3600 })
    }
  })

  it('窗口结束前向上取整至少 1 秒，边界重置', async () => {
    const end = now + 3_600_000
    expect((await hit(db, options, end - 1001)).retryAfter).toBe(2)
    expect((await hit(db, options, end - 1000)).retryAfter).toBe(1)
    expect((await hit(db, options, end - 1)).retryAfter).toBe(1)
    expect(await hit(db, options, end)).toEqual({ ok: true, n: 1, bytes: 0, retryAfter: 3600 })
  })

  it('次数和字节数任一超限即拒绝，字节相等可接受', async () => {
    const opts = { bucket: 'shot', key: '123', windowMs: 86_400_000, limit: 60, byteLimit: 6, bytes: 3 }
    expect((await hit(db, opts, now)).ok).toBe(true)
    expect(await hit(db, opts, now)).toMatchObject({ ok: true, bytes: 6, n: 2 })
    expect(await hit(db, { ...opts, bytes: 1 }, now)).toMatchObject({ ok: false, bytes: 7, n: 3 })
  })

  it('bucket 和 key 各自独立', async () => {
    await hit(db, options, now)
    expect((await hit(db, { ...options, key: 'other' }, now)).n).toBe(1)
    expect((await hit(db, { ...options, bucket: 'submit' }, now)).n).toBe(1)
    expect((await hit(db, options, now)).n).toBe(2)
  })

  it('30 并发命中由单条 UPSERT 原子累计，无丢次数/字节', async () => {
    const results = await Promise.all(Array.from({ length: 30 }, () => hit(db, { ...options, bytes: 7 }, now)))
    expect(results.filter((r) => r.ok)).toHaveLength(30)
    expect(results.map((r) => r.n).sort((a, b) => a - b)).toEqual(Array.from({ length: 30 }, (_, i) => i + 1))
    expect(await db.prepare('SELECT n, bytes FROM rate_limits').first()).toEqual({ n: 30, bytes: 210 })
  })

  it('清理按各 bucket 时长删已结束窗口，不删当前窗口或投稿记录', async () => {
    for (const [bucket, config] of Object.entries(RATE_LIMITS)) {
      await hit(db, { bucket, key: '*', ...config }, now)
      await hit(db, { bucket, key: '*', ...config }, now - config.windowMs)
    }
    await db.prepare("INSERT INTO web_submissions VALUES (123, 'demo', 1, 'submission/web-123-demo', ?1, ?1)").bind(now).run()
    await deleteExpiredLimits(db, now)
    expect((await db.prepare('SELECT * FROM rate_limits').all()).results).toHaveLength(9)
    expect(await db.prepare('SELECT COUNT(*) AS n FROM web_submissions').first('n')).toBe(1)
  })

  it('scheduleCleanup 同一次 waitUntil 清两张表，1% 以外不清理', async () => {
    await hit(db, options, now - options.windowMs)
    await db.prepare("INSERT INTO click_dedupe (slug, ip_hash, last_at) VALUES ('demo', 'hash', ?1)").bind(now - 86_400_001).run()
    const pending = []
    const context = { env: { DB: db }, waitUntil: (p) => pending.push(p) }
    scheduleCleanup(context, now, () => 0.01)
    expect(pending).toHaveLength(0)
    scheduleCleanup(context, now, () => 0)
    expect(pending).toHaveLength(1)
    await Promise.all(pending)
    expect(await db.prepare('SELECT COUNT(*) AS n FROM rate_limits').first('n')).toBe(0)
    expect(await db.prepare('SELECT COUNT(*) AS n FROM click_dedupe').first('n')).toBe(0)
  })

  it('任一清理失败不影响另一清理或 waitUntil', async () => {
    await hit(db, options, now - options.windowMs)
    const pending = []
    const wrapped = { prepare(sql) { if (sql.includes('click_dedupe')) throw new Error('synthetic failure'); return db.prepare(sql) } }
    scheduleCleanup({ env: { DB: wrapped }, waitUntil: (p) => pending.push(p) }, now, () => 0)
    await expect(Promise.all(pending)).resolves.toEqual([undefined])
    expect(await db.prepare('SELECT COUNT(*) AS n FROM rate_limits').first('n')).toBe(0)
  })

  it('参数不合法不写库', async () => {
    for (const override of [{ windowMs: 0 }, { limit: 0 }, { bytes: -1 }, { byteLimit: -1 }]) {
      await expect(hit(db, { ...options, ...override }, now)).rejects.toThrow('Invalid rate limit')
    }
    expect(await db.prepare('SELECT COUNT(*) AS n FROM rate_limits').first('n')).toBe(0)
  })
})
