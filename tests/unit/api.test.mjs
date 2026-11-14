import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { createHmac, randomBytes } from 'node:crypto'
import { copyFile, mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPlatformProxy } from 'wrangler'
import { onRequestPost, onRequest as clickFallback } from '../../functions/api/click.ts'
import { onRequestGet, onRequest as statsFallback } from '../../functions/api/stats.ts'
import { DAY_MS, DEDUPE_SQL, hashIp, readStats, recordClick } from '../../functions/_lib/clicks.ts'
import { clientIp, readClickBody, scheduleCleanup } from '../../functions/_lib/http.ts'
import { loadSlugs } from '../../functions/_lib/slugs.ts'

const root = fileURLToPath(new URL('../../', import.meta.url))
const slugs = new Set(['demo-prd-reviewer', 'demo-weekly-digest', 'demo-external'])
const slug = 'demo-prd-reviewer'
const ip = '192.0.2.10' // Synthetic documentation address, never included in test output.
const otherIp = '192.0.2.11'
const now = 1_800_000_000_000
const validBody = { slug, kind: 'import' }
let proxy, db, directory, migration, salt, env, pending

beforeAll(async () => {
  directory = await mkdtemp(join(tmpdir(), 'bot-click-unit-'))
  await copyFile(join(root, 'wrangler.toml'), join(directory, 'wrangler.toml'))
  migration = (await readFile(join(root, 'migrations/0001_init.sql'), 'utf8'))
    .split(';').map((statement) => statement.trim()).filter(Boolean)
  proxy = await getPlatformProxy({
    configPath: join(directory, 'wrangler.toml'),
    envFiles: [],
    persist: false,
    remoteBindings: false,
  })
  db = proxy.env.DB
}, 30_000)

afterAll(async () => {
  await proxy?.dispose()
  if (directory) await rm(directory, { recursive: true, force: true })
})

beforeEach(async () => {
  await db.batch([
    ...migration.map((statement) => db.prepare(statement)),
    db.prepare('DELETE FROM click_dedupe'),
    db.prepare('DELETE FROM click_counts'),
  ])
  salt = randomBytes(32).toString('hex')
  env = {
    DB: db,
    IP_SALT: salt,
    ALLOW_TEST_IP: '1',
    ASSETS: { fetch: vi.fn(async () => Response.json([...slugs])) },
  }
  pending = []
  vi.spyOn(Math, 'random').mockReturnValue(0.5)
})

afterEach(async () => {
  await Promise.all(pending)
  vi.restoreAllMocks()
})

function click(overrides = {}) {
  return recordClick({ db, salt, slugs, ip, slug, kind: 'import', now, ...overrides })
}

function context(request, bindings = env) {
  return { request, env: bindings, waitUntil: (promise) => pending.push(promise) }
}

function post(body = validBody, { headers = {}, bindings = env } = {}) {
  return onRequestPost(context(new Request('https://example.test/api/click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Test-IP': ip, ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  }), bindings))
}

function stats(bindings = env) {
  return onRequestGet(context(new Request('https://example.test/api/stats'), bindings))
}

async function expectJson(response, status, body) {
  expect(response.status).toBe(status)
  expect(response.headers.get('Content-Type')).toBe('application/json; charset=utf-8')
  expect(response.headers.get('Cache-Control')).toBe('no-store')
  expect(await response.json()).toEqual(body)
}

async function dedupeRows() {
  return (await db.prepare('SELECT * FROM click_dedupe').all()).results
}

describe('真实本地 D1：滚动窗口与原子计数', () => {
  it('首次点击计入', async () => {
    expect(await click()).toEqual({ ok: true, counted: true, heat: 1 })
  })

  it('同 IP 重复不计入', async () => {
    await click()
    expect(await click({ now: now + 1 })).toEqual({ ok: true, counted: false, heat: 1 })
  })

  it('同 IP 换 kind 不计入，归属第一次按钮', async () => {
    await click()
    expect((await click({ kind: 'prompt' })).counted).toBe(false)
    expect((await readStats(db)).byKind[slug]).toEqual({ import: 1, prompt: 0 })
  })

  it('换 IP 计入', async () => {
    await click()
    expect(await click({ ip: otherIp, kind: 'prompt' })).toEqual({ ok: true, counted: true, heat: 2 })
  })

  it('换 slug 计入，且同 IP 的哈希随 slug 改变', async () => {
    await click()
    expect((await click({ slug: 'demo-weekly-digest' })).counted).toBe(true)
    expect(new Set((await dedupeRows()).map((row) => row.ip_hash)).size).toBe(2)
  })

  it.each([24, 25])('注入 now：%i 小时后再计入', async (hours) => {
    await click()
    expect(await click({ now: now + hours * 3_600_000 })).toEqual({ ok: true, counted: true, heat: 2 })
  })

  it('23 小时的重复不刷新窗口，25 小时仍计入', async () => {
    await click()
    expect((await click({ now: now + 23 * 3_600_000 })).counted).toBe(false)
    expect((await dedupeRows())[0].last_at).toBe(now)
    expect((await click({ now: now + 25 * 3_600_000 })).counted).toBe(true)
  })

  it('未知 slug 不写库', async () => {
    await expect(click({ slug: 'no-such-bot' })).rejects.toMatchObject({ status: 404, code: 'unknown_slug' })
    expect(await dedupeRows()).toHaveLength(0)
  })

  it('Web Crypto HMAC 与独立实现一致，所有业务表均无原始 IP', async () => {
    await click()
    const rows = await dedupeRows()
    const expected = createHmac('sha256', salt).update(`${ip}|${slug}`).digest('hex')
    expect(rows[0].ip_hash).toBe(expected)
    expect(rows[0].ip_hash).toMatch(/^[0-9a-f]{64}$/)
    expect(Object.keys(rows[0]).sort()).toEqual(['ip_hash', 'last_at', 'slug'])
    const counts = await db.prepare('SELECT * FROM click_counts').all()
    expect(JSON.stringify([rows, counts.results]).includes(ip)).toBe(false)
    expect(JSON.stringify([rows, counts.results]).includes(salt)).toBe(false)
  })

  it('20 个并发同 IP 请求只有一次计入（混合按钮）', async () => {
    const results = await Promise.all(Array.from({ length: 20 }, (_, index) =>
      click({ kind: index % 2 ? 'prompt' : 'import' })))
    expect(results.filter((result) => result.counted)).toHaveLength(1)
    expect(await dedupeRows()).toHaveLength(1)
    const result = await readStats(db)
    expect(result.heat[slug]).toBe(1)
    expect(result.byKind[slug].import + result.byKind[slug].prompt).toBe(1)
  })

  it('实测 meta.changes：插入 1、冲突且 WHERE 不成立 0、窗口更新 1', async () => {
    const hash = await hashIp(salt, ip, slug)
    const run = (at) => db.prepare(DEDUPE_SQL).bind(slug, hash, at).run()
    expect((await run(now)).meta.changes).toBe(1)
    expect((await run(now)).meta.changes).toBe(0)
    expect((await run(now + DAY_MS - 1)).meta.changes).toBe(0)
    expect((await dedupeRows())[0].last_at).toBe(now)
    expect((await run(now + DAY_MS)).meta.changes).toBe(1)
    expect((await dedupeRows())[0].last_at).toBe(now + DAY_MS)
  })

  it('stats 聚合 heat/byKind，未点击的 Bot 不出现', async () => {
    expect(await readStats(db)).toEqual({ ok: true, heat: {}, byKind: {} })
    await click()
    await click({ kind: 'prompt' })
    await click({ ip: otherIp, kind: 'prompt' })
    await click({ slug: 'demo-weekly-digest', kind: 'prompt' })
    await expectJson(await stats(), 200, {
      ok: true,
      heat: { [slug]: 2, 'demo-weekly-digest': 1 },
      byKind: { [slug]: { import: 1, prompt: 1 }, 'demo-weekly-digest': { import: 0, prompt: 1 } },
    })
  })

  it('合法 slug constructor 不受对象原型影响', async () => {
    await click({ slug: 'constructor', slugs: new Set(['constructor']) })
    expect((await readStats(db)).heat.constructor).toBe(1)
    expect((await readStats(db)).byKind.constructor).toEqual({ import: 1, prompt: 0 })
  })
})

describe('HTTP 校验、响应头与错误', () => {
  it('POST 成功与重复响应遵循接口', async () => {
    await expectJson(await post(), 200, { ok: true, counted: true, heat: 1 })
    await expectJson(await post(), 200, { ok: true, counted: false, heat: 1 })
    const requestedUrl = env.ASSETS.fetch.mock.calls[0][0]
    expect(requestedUrl.href).toBe('https://example.test/api-data/slugs.json')
  })

  it('20 个并发 HTTP handler 请求只有一次计入', async () => {
    const responses = await Promise.all(Array.from({ length: 20 }, () => post()))
    expect(responses.every((response) => response.status === 200)).toBe(true)
    const bodies = await Promise.all(responses.map((response) => response.json()))
    expect(bodies.filter((body) => body.counted)).toHaveLength(1)
    await expectJson(await stats(), 200, {
      ok: true, heat: { [slug]: 1 }, byKind: { [slug]: { import: 1, prompt: 0 } },
    })
  })

  it('未知 slug 返回 404', async () => {
    await expectJson(await post({ slug: 'no-such-bot', kind: 'import' }), 404, { ok: false, error: 'unknown_slug' })
  })

  it.each([
    ['坏 JSON', '{'],
    ['空 body', ''],
    ['null body', 'null'],
    ['数组 body', '[]'],
    ['缺 slug', { kind: 'import' }],
    ['缺 kind', { slug }],
    ['未知 kind', { slug, kind: 'like' }],
    ['非字符串 kind', { slug, kind: 1 }],
    ['slug 太短', { slug: 'a', kind: 'import' }],
    ['slug 太长', { slug: 'a'.repeat(41), kind: 'import' }],
    ['slug 路径穿越', { slug: '../etc', kind: 'import' }],
    ['slug 大写', { slug: 'Bot', kind: 'import' }],
    ['slug 下划线', { slug: 'my_bot', kind: 'import' }],
    ['slug 连续连字符', { slug: 'my--bot', kind: 'import' }],
    ['slug 尾连字符', { slug: 'my-bot-', kind: 'import' }],
    ['slug 非字符串', { slug: 42, kind: 'import' }],
  ])('%s 返回 400 且不写库', async (_name, body) => {
    await expectJson(await post(body), 400, { ok: false, error: 'bad_request' })
    expect(await dedupeRows()).toHaveLength(0)
  })

  it.each([2, 40])('slug 长度边界 %i 合法', async (length) => {
    const boundarySlug = 'a'.repeat(length)
    env.ASSETS.fetch.mockImplementation(async () => Response.json([boundarySlug]))
    await expectJson(await post({ slug: boundarySlug, kind: 'prompt' }), 200, { ok: true, counted: true, heat: 1 })
  })

  it('Content-Length 超限时不读取 body', async () => {
    await expect(readClickBody({
      headers: new Headers({ 'Content-Length': '1025' }),
      get body() { throw new Error('must not read body') },
    })).rejects.toMatchObject({ status: 400, code: 'bad_request' })
    await expectJson(await post(validBody, { headers: { 'Content-Length': '1025' } }), 400, { ok: false, error: 'bad_request' })
  })

  it.each([
    ['无 Content-Length', {}],
    ['伪造较小 Content-Length', { 'Content-Length': '1' }],
  ])('%s 仍检查实际字节数', async (_name, headers) => {
    await expectJson(await post({ ...validBody, extra: 'a'.repeat(1024) }, { headers }), 400, { ok: false, error: 'bad_request' })
  })

  it('多字节文本按 UTF-8 字节而非字符数限长', async () => {
    const body = JSON.stringify({ ...validBody, extra: '中'.repeat(400) })
    expect(body.length).toBeLessThan(1024)
    await expectJson(await post(body), 400, { ok: false, error: 'bad_request' })
  })

  it('恰好 1024 字节可接受', async () => {
    const body = JSON.stringify(validBody).padEnd(1024, ' ')
    await expectJson(await post(body), 200, { ok: true, counted: true, heat: 1 })
  })

  it('分块 body 累计超限即取消后续读取', async () => {
    const cancel = vi.fn()
    let chunks = 0
    const body = new ReadableStream({
      pull(controller) { chunks++; controller.enqueue(new Uint8Array(600)) },
      cancel,
    })
    await expect(readClickBody({ headers: new Headers(), body })).rejects.toMatchObject({ status: 400 })
    expect(cancel).toHaveBeenCalledOnce()
    expect(chunks).toBeLessThanOrEqual(3)
  })

  it.each(['GET', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'])('click 的 %s 返回 405 和 Allow', async (method) => {
    const response = await clickFallback(context(new Request('https://example.test/api/click', { method })))
    expect(response.headers.get('Allow')).toBe('POST')
    await expectJson(response, 405, { ok: false, error: 'method_not_allowed' })
  })

  it.each(['POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'])('stats 的 %s 返回 405 和 Allow', async (method) => {
    const response = await statsFallback(context(new Request('https://example.test/api/stats', { method })))
    expect(response.headers.get('Allow')).toBe('GET')
    await expectJson(response, 405, { ok: false, error: 'method_not_allowed' })
  })

  it.each([undefined, ''])('缺失或空盐直接 500，绝不退化或写库（%#）', async (missingSalt) => {
    await expectJson(await post(validBody, { bindings: { ...env, IP_SALT: missingSalt } }), 500, { ok: false, error: 'server_error' })
    await expect(click({ salt: missingSalt })).rejects.toMatchObject({ status: 500 })
    expect(await dedupeRows()).toHaveLength(0)
  })

  it('真实数据库错误返回通用 500，不记录错误详情', async () => {
    const log = vi.spyOn(console, 'log')
    const error = vi.spyOn(console, 'error')
    await db.prepare('DROP TABLE click_counts').run()
    await expectJson(await post(), 500, { ok: false, error: 'server_error' })
    await expectJson(await stats(), 500, { ok: false, error: 'server_error' })
    expect(log).not.toHaveBeenCalled()
    expect(error).not.toHaveBeenCalled()
  })
})

describe('IP 来源与静态 slug 清单', () => {
  it('ALLOW_TEST_IP 未设时不同测试头被忽略，同 CF 地址只计一次', async () => {
    const bindings = { ...env, ALLOW_TEST_IP: undefined }
    await expectJson(await post(validBody, { bindings, headers: { 'CF-Connecting-IP': ip } }), 200, { ok: true, counted: true, heat: 1 })
    await expectJson(await post(validBody, { bindings, headers: { 'CF-Connecting-IP': ip, 'X-Test-IP': otherIp } }), 200, { ok: true, counted: false, heat: 1 })
  })

  it.each([undefined, '0', 'true', 1])('开关不为字符串 1 时从不读取 X-Test-IP（%#）', (flag) => {
    const headers = new Headers({ 'CF-Connecting-IP': ip, 'X-Test-IP': otherIp })
    const get = vi.spyOn(headers, 'get')
    expect(clientIp({ headers }, { ALLOW_TEST_IP: flag }) === ip).toBe(true)
    expect(get).not.toHaveBeenCalledWith('X-Test-IP')
  })

  it('本地显式开关优先测试头，否则依次回退 CF 与零地址', () => {
    expect(clientIp({ headers: new Headers({ 'CF-Connecting-IP': ip, 'X-Test-IP': otherIp }) }, env) === otherIp).toBe(true)
    expect(clientIp({ headers: new Headers({ 'CF-Connecting-IP': ip }) }, env) === ip).toBe(true)
    expect(clientIp({ headers: new Headers() }, env) === '0.0.0.0').toBe(true)
  })

  it.each([
    ['非成功状态', async () => new Response('missing', { status: 404 })],
    ['坏 JSON', async () => new Response('{')],
    ['非数组', async () => Response.json({ slugs: [] })],
    ['非法元素', async () => Response.json([null])],
    ['读取失败', async () => { throw new Error('assets unavailable') }],
  ])('slugs.json %s 返回 500 且不写库', async (_name, fetch) => {
    env.ASSETS.fetch.mockImplementation(fetch)
    await expectJson(await post(), 500, { ok: false, error: 'server_error' })
    expect(await dedupeRows()).toHaveLength(0)
  })

  it('模块缓存 60 秒，到期重新读取；失败不沿用过期清单、不缓存失败', async () => {
    const assets = env.ASSETS
    const url = 'https://example.test/api/click'
    await loadSlugs(assets, url, now)
    await loadSlugs(assets, url, now + 59_999)
    expect(assets.fetch).toHaveBeenCalledTimes(1)
    assets.fetch.mockRejectedValueOnce(new Error('unavailable'))
    await expect(loadSlugs(assets, url, now + 60_000)).rejects.toMatchObject({ status: 500 })
    expect(await loadSlugs(assets, url, now + 60_001)).toEqual(slugs)
    expect(assets.fetch).toHaveBeenCalledTimes(3)
  })

  it('缓存不串 ASSETS 绑定或 origin', async () => {
    const otherAssets = { fetch: vi.fn(async () => Response.json(['another-bot'])) }
    await loadSlugs(env.ASSETS, 'https://example.test/api/click', now)
    expect(await loadSlugs(otherAssets, 'https://example.test/api/click', now)).toEqual(new Set(['another-bot']))
    await loadSlugs(env.ASSETS, 'https://other.test/api/click', now)
    expect(env.ASSETS.fetch).toHaveBeenCalledTimes(2)
  })
})

describe('概率清理（真实 D1）', () => {
  it('1% 分支通过 waitUntil 只删除严格过期行，不删边界、不改计数', async () => {
    await click({ now: now - DAY_MS - 1 })
    await click({ ip: otherIp, now: now - DAY_MS })
    await click({ slug: 'demo-weekly-digest', now })
    const before = await readStats(db)
    scheduleCleanup(context(new Request('https://example.test/api/stats')), now, () => 0.009)
    expect(pending).toHaveLength(1)
    await Promise.all(pending)
    const rows = await dedupeRows()
    expect(rows).toHaveLength(2)
    expect(rows.map((row) => row.last_at).sort()).toEqual([now - DAY_MS, now])
    expect(await readStats(db)).toEqual(before)
  })

  it('其余 99% 不安排清理', () => {
    scheduleCleanup(context(new Request('https://example.test/api/stats')), now, () => 0.01)
    scheduleCleanup(context(new Request('https://example.test/api/stats')), now, () => 0.99)
    expect(pending).toHaveLength(0)
  })

  it('清理失败不影响 stats 响应，也不产生未处理拒绝', async () => {
    await db.prepare('DROP TABLE click_dedupe').run()
    Math.random.mockReturnValue(0)
    await expectJson(await stats(), 200, { ok: true, heat: {}, byKind: {} })
    expect(pending).toHaveLength(1)
    await expect(Promise.all(pending)).resolves.toEqual([undefined])
  })
})
