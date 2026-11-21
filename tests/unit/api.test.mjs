import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { createHmac, randomBytes } from 'node:crypto'
import { copyFile, mkdtemp, readdir, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPlatformProxy, unstable_splitSqlQuery } from 'wrangler'
import { onRequestPost, onRequest as clickFallback } from '../../functions/api/click.ts'
import { onRequestGet, onRequest as statsFallback } from '../../functions/api/stats.ts'
import { DAY_MS, DEDUPE_SQL, hashIp, readStats, recordClick } from '../../functions/_lib/clicks.ts'
import { clientIp, readClickBody, scheduleCleanup } from '../../functions/_lib/http.ts'
import { loadSlugs } from '../../functions/_lib/slugs.ts'
import { normalizeIp } from '../../functions/_lib/ip.ts'

const root = fileURLToPath(new URL('../../', import.meta.url))
const migrationDir = join(root, 'migrations')
const slugs = new Set(['demo-prd-reviewer', 'demo-weekly-digest', 'demo-external', 'constructor'])
const squad = 'demo-squad'
const squadSlugs = new Set([squad, 'constructor'])
const slug = 'demo-prd-reviewer'
const ip = '192.0.2.10' // Synthetic documentation address, never included in test output.
const otherIp = '192.0.2.11'
const now = 1_800_000_000_000
const validBody = { slug, kind: 'import' }
let proxy, db, directory, migrationFiles, salt, env, pending

function localProxy() {
  return getPlatformProxy({
    configPath: join(directory, 'wrangler.toml'),
    envFiles: [],
    persist: false,
    remoteBindings: false,
  })
}

async function migrate(database, files) {
  for (const file of files) {
    const sql = await readFile(join(migrationDir, file), 'utf8')
    await database.batch(unstable_splitSqlQuery(sql).map((statement) => database.prepare(statement)))
  }
}

beforeAll(async () => {
  directory = await mkdtemp(join(tmpdir(), 'bot-click-unit-'))
  await copyFile(join(root, 'wrangler.toml'), join(directory, 'wrangler.toml'))
  migrationFiles = (await readdir(migrationDir)).filter((file) => file.endsWith('.sql')).sort()
  proxy = await localProxy()
  db = proxy.env.DB
  await migrate(db, migrationFiles)
}, 30_000)

afterAll(async () => {
  await proxy?.dispose()
  if (directory) await rm(directory, { recursive: true, force: true })
})

beforeEach(async () => {
  await db.batch([
    db.prepare('DELETE FROM click_dedupe'),
    db.prepare('DELETE FROM click_counts'),
  ])
  salt = randomBytes(32).toString('hex')
  env = {
    DB: db,
    IP_SALT: salt,
    ALLOW_TEST_IP: '1',
    ASSETS: { fetch: vi.fn(async ({ pathname }) => {
      if (pathname === '/api-data/slugs.json') return Response.json([...slugs])
      if (pathname === '/api-data/squad-slugs.json') return Response.json([...squadSlugs])
      return new Response(null, { status: 404 })
    }) },
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

it('旧库升级：保留全部计数，迁移前的哈希继续挡住 import/prompt，但不挡 starter', async () => {
  const legacy = await localProxy()
  try {
    const database = legacy.env.DB
    const index = migrationFiles.indexOf('0004_click_kinds.sql')
    expect(index).toBeGreaterThan(0)
    await migrate(database, migrationFiles.slice(0, index))
    const hash = createHmac('sha256', salt).update(`${ip}|${slug}`).digest('hex')
    await database.batch([
      database.prepare("INSERT INTO click_counts VALUES (?1, 'import', 9), (?1, 'prompt', 3), ('demo-external', 'prompt', 4)").bind(slug),
      database.prepare('INSERT INTO click_dedupe VALUES (?1, ?2, ?3)').bind(slug, hash, now - 1),
    ])
    const counts = database.prepare('SELECT slug, kind, n FROM click_counts ORDER BY slug, kind')
    const before = (await counts.all()).results
    await migrate(database, migrationFiles.slice(index))
    expect((await counts.all()).results).toEqual(before)
    for (const kind of ['import', 'prompt']) {
      expect(await click({ db: database, kind })).toEqual({ ok: true, counted: false, heat: 12 })
    }
    expect(await click({ db: database, kind: 'starter' })).toEqual({ ok: true, counted: true, heat: 12 })
  } finally {
    await legacy.dispose()
  }
})

describe('真实本地 D1：滚动窗口与原子计数', () => {
  it('首次点击计入', async () => {
    expect(await click()).toEqual({ ok: true, counted: true, heat: 1 })
  })

  it('同 IP 重复不计入', async () => {
    await click()
    expect(await click({ now: now + 1 })).toEqual({ ok: true, counted: false, heat: 1 })
  })

  it('同 IP 从 import 换到 prompt 不计入，归属第一次按钮', async () => {
    await click()
    expect((await click({ kind: 'prompt' })).counted).toBe(false)
    expect((await readStats(db)).byKind[slug]).toEqual({ import: 1, prompt: 0, starter: 0 })
  })

  it.each(['starter', 'kickoff'])('%s 不占导入窗口、不改热度；重复不刷新，到边界可再计', async (kind) => {
    // 在同名 Bot / 小队上验证归一化后的实际去重行，而不只比较两个哈希是否不同。
    const address = '2001:DB8:1:2::ab'
    const copy = (at) => click({ slug: 'constructor', ip: address, kind, now: at, slugs: kind === 'kickoff' ? squadSlugs : slugs })
    await click({ slug: 'constructor', ip: address })
    const heat = kind === 'kickoff' ? 0 : 1
    expect(await copy(now)).toEqual({ ok: true, counted: true, heat })
    expect(await copy(now + DAY_MS - 1)).toEqual({ ok: true, counted: false, heat })
    const hash = createHmac('sha256', salt).update(`2001:0db8:0001:0002::/64|constructor|${kind}`).digest('hex')
    expect(await dedupeRows()).toContainEqual({ slug: 'constructor', ip_hash: hash, last_at: now })
    expect(await copy(now + DAY_MS)).toEqual({ ok: true, counted: true, heat })
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

  it('stats 分开 Bot 和小队，只有开场白的 Bot 热度为 0，没点过的不出现', async () => {
    expect(await readStats(db)).toEqual({ ok: true, heat: {}, byKind: {}, squads: {} })
    await click()
    await click({ kind: 'prompt' })
    await click({ ip: otherIp, kind: 'prompt' })
    await click({ slug: 'demo-weekly-digest', kind: 'prompt' })
    await click({ kind: 'starter' })
    await expectJson(await post({ slug: 'demo-external', kind: 'starter' }), 200, { ok: true, counted: true, heat: 0 })
    await expectJson(await post({ slug: squad, kind: 'kickoff' }), 200, { ok: true, counted: true, heat: 0 })
    await expectJson(await stats(), 200, {
      ok: true,
      heat: { [slug]: 2, 'demo-weekly-digest': 1, 'demo-external': 0 },
      byKind: {
        [slug]: { import: 1, prompt: 1, starter: 1 },
        'demo-weekly-digest': { import: 0, prompt: 1, starter: 0 },
        'demo-external': { import: 0, prompt: 0, starter: 1 },
      },
      squads: { [squad]: { kickoff: 1 } },
    })
  })

  it('Bot 和小队都叫 constructor：三个窗口、三张无原型映射互不串数', async () => {
    for (const [kind, heat] of [['import', 1], ['kickoff', 0], ['starter', 1]]) {
      await expectJson(await post({ slug: 'constructor', kind }), 200, { ok: true, counted: true, heat })
    }
    const { heat, byKind, squads } = await readStats(db)
    for (const map of [heat, byKind, squads]) expect(Object.getPrototypeOf(map)).toBe(null)
    expect(heat.constructor).toBe(1)
    expect(byKind.constructor).toEqual({ import: 1, prompt: 0, starter: 1 })
    expect(squads.constructor).toEqual({ kickoff: 1 })
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
      ok: true, heat: { [slug]: 1 }, byKind: { [slug]: { import: 1, prompt: 0, starter: 0 } }, squads: {},
    })
  })

  it.each([[slug, 'kickoff'], [squad, 'starter'], [squad, 'import'], [squad, 'prompt']])(
    '%s 不在 %s 对应的清单：404 且不占窗口', async (slug, kind) => {
      await expectJson(await post({ slug, kind }), 404, { ok: false, error: 'unknown_slug' })
      expect(await dedupeRows()).toHaveLength(0)
    },
  )

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

  it('真实数据库错误返回通用 500，不记录错误详情', async ({ onTestFinished }) => {
    const log = vi.spyOn(console, 'log')
    const error = vi.spyOn(console, 'error')
    await db.prepare('ALTER TABLE click_counts RENAME TO unavailable_counts').run()
    onTestFinished(() => db.prepare('ALTER TABLE unavailable_counts RENAME TO click_counts').run())
    await expectJson(await post(), 500, { ok: false, error: 'server_error' })
    await expectJson(await stats(), 500, { ok: false, error: 'server_error' })
    expect(log).not.toHaveBeenCalled()
    expect(error).not.toHaveBeenCalled()
  })
})

describe('点击请求来源与媒体类型', () => {
  it.each(['', 'text/plain', 'application/x-www-form-urlencoded', 'application/jsonp', 'multipart/form-data'])('媒体类型 %s 返回 415 且不计数', async (type) => {
    await expectJson(await post(validBody, { headers: { 'Content-Type': type } }), 415, { ok: false, error: 'unsupported_media_type' })
    expect(env.ASSETS.fetch).not.toHaveBeenCalled()
    expect(await dedupeRows()).toHaveLength(0)
  })

  it('缺 Content-Type 返回 415，拒绝前不读取请求体', async () => {
    const request = { url: 'https://example.test/api/click', headers: new Headers(), get body() { throw new Error('不应读取') } }
    await expectJson(await onRequestPost(context(request)), 415, { ok: false, error: 'unsupported_media_type' })
    expect(env.ASSETS.fetch).not.toHaveBeenCalled()
  })

  it.each([
    { Origin: 'https://other.test' },
    { Origin: 'http://example.test' },
    { Origin: 'https://example.test:444' },
    { Origin: 'null' },
    { Origin: '' },
    { 'Sec-Fetch-Site': 'cross-site' },
    { Origin: 'https://example.test', 'Sec-Fetch-Site': 'cross-site' },
  ])('跨站头 %j 返回 403 且不读取 body/清单或计数', async (headers) => {
    const request = {
      url: 'https://example.test/api/click',
      headers: new Headers({ 'Content-Type': 'application/json', ...headers }),
      get body() { throw new Error('不应读取') },
    }
    await expectJson(await onRequestPost(context(request)), 403, { ok: false, error: 'forbidden' })
    expect(env.ASSETS.fetch).not.toHaveBeenCalled()
    expect(await dedupeRows()).toHaveLength(0)
  })

  it.each([
    {},
    { Origin: 'https://example.test', 'Sec-Fetch-Site': 'same-origin' },
    { 'Content-Type': 'application/json; charset=utf-8' },
    { 'Content-Type': 'Application/JSON; Charset=UTF-8' },
  ])('无 Origin/同源/JSON charset 正常计数：%j', async (headers) => {
    await expectJson(await post(validBody, { headers }), 200, { ok: true, counted: true, heat: 1 })
  })
})

describe('IPv6 规范化与 /64 去重', () => {
  it.each([
    ['2001:DB8:1:2::1', '2001:0db8:0001:0002::/64'],
    ['2001:0db8:0001:0002:0000:0000:0000:0001', '2001:0db8:0001:0002::/64'],
    ['2001:db8::1:2', '2001:0db8:0000:0000::/64'],
    ['2001:db8:1:2::', '2001:0db8:0001:0002::/64'],
    ['::', '0000:0000:0000:0000::/64'],
    ['::1', '0000:0000:0000:0000::/64'],
    ['::ffff:1.2.3.4', '1.2.3.4'],
    ['0:0:0:0:0:FFFF:0102:0304', '1.2.3.4'],
    ['::ffff:102:304', '1.2.3.4'],
    ['192.0.2.10', '192.0.2.10'],
    ['2001::db8::1', '0.0.0.0'],
  ])('规范化 %s', (address, expected) => {
    expect(normalizeIp(address)).toBe(expected)
  })

  it('同 /64 不同 IPv6/大小写写法只计一次，不同 /64 可计入', async () => {
    expect((await click({ ip: '2001:DB8:1:2::1' })).counted).toBe(true)
    expect((await click({ ip: '2001:0db8:0001:0002:ffff:ffff:ffff:ffff' })).counted).toBe(false)
    expect((await click({ ip: '2001:db8:1:3::1' })).counted).toBe(true)
    expect(await dedupeRows()).toHaveLength(2)
  })

  it('映射 IPv4 与原 IPv4 共享哈希及去重桶', async () => {
    expect((await click({ ip: '192.0.2.10' })).counted).toBe(true)
    expect((await click({ ip: '::FFFF:192.0.2.10' })).counted).toBe(false)
    expect((await click({ ip: '0:0:0:0:0:ffff:c000:020a' })).counted).toBe(false)
    expect(await hashIp(salt, '::ffff:c000:20a', slug)).toBe(await hashIp(salt, '192.0.2.10', slug))
  })

  it('IPv6 HMAC 使用规范化 /64 而非原地址', async () => {
    const expected = createHmac('sha256', salt).update(`2001:0db8:0001:0002::/64|${slug}`).digest('hex')
    expect(await hashIp(salt, '2001:DB8:1:2::ab', slug)).toBe(expected)
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

  it('清理失败不影响 stats 响应，也不产生未处理拒绝', async ({ onTestFinished }) => {
    await db.prepare('ALTER TABLE click_dedupe RENAME TO unavailable_dedupe').run()
    onTestFinished(() => db.prepare('ALTER TABLE unavailable_dedupe RENAME TO click_dedupe').run())
    Math.random.mockReturnValue(0)
    await expectJson(await stats(), 200, { ok: true, heat: {}, byKind: {}, squads: {} })
    expect(pending).toHaveLength(1)
    await expect(Promise.all(pending)).resolves.toEqual([undefined])
  })
})
