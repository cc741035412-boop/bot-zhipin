import { afterAll, afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { randomBytes } from 'node:crypto'
import { copyFile, mkdtemp, readdir, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { getPlatformProxy, unstable_splitSqlQuery } from 'wrangler'
import { onRequestPost, onRequest } from '../../functions/api/events.ts'
import { hashIp } from '../../functions/_lib/clicks.ts'

const sid = 'abcdefghijklmnop', time = Date.parse('2026-11-22T16:00:00Z')
const event = { name: 'page_view', page: 'bot', slug: 'my-bot', path: '/bots/my-bot' }
const batch = { v: 1, sid, device: 'desktop', events: [event] }
const ip = '192.0.2.3', ua = 'Browser/1', url = 'https://example.test/api/events'
let dir, proxy, db, env, pending, clock, random
beforeAll(async () => {
  dir = await mkdtemp(join(tmpdir(), 'events-unit-'))
  const configPath = join(dir, 'wrangler.toml')
  await copyFile('wrangler.toml', configPath)
  proxy = await getPlatformProxy({ configPath, envFiles: [], persist: false, remoteBindings: false })
  db = proxy.env.DB
  for (const file of (await readdir('migrations')).filter(f => f.endsWith('.sql')).sort()) {
    const sql = await readFile(join('migrations', file), 'utf8')
    await db.batch(unstable_splitSqlQuery(sql).map(s => db.prepare(s)))
  }
}, 30_000)
afterAll(async () => {
  await proxy?.dispose()
  if (dir) await rm(dir, { recursive: true, force: true })
})
beforeEach(async () => {
  pending = []
  env = { DB: db, IP_SALT: randomBytes(32).toString('hex') }
  await db.batch(['events', 'rate_limits'].map(t => db.prepare(`DELETE FROM ${t}`)))
  clock = vi.spyOn(Date, 'now').mockReturnValue(time)
  random = vi.spyOn(Math, 'random').mockReturnValue(0.5)
})
afterEach(async () => {
  try {
    await Promise.all(pending)
    for (const t of ['click_counts', 'click_dedupe']) expect(await count(t)).toBe(0)
  } finally { vi.restoreAllMocks() }
})
const count = table => db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).first('n')
const rows = async () => (await db.prepare('SELECT * FROM events ORDER BY id').all()).results
const context = request => ({ request, env, waitUntil: p => pending.push(p) })
function post(body = batch, headers = {}, country) {
  const request = new Request(url, { method: 'POST', duplex: 'half', headers: {
    'Content-Type': 'application/json', 'User-Agent': ua, 'CF-Connecting-IP': ip, ...headers,
  }, body: typeof body === 'string' || body instanceof ReadableStream ? body : JSON.stringify(body) })
  request.cf = { country }
  return onRequestPost(context(request))
}
const send = (...items) => post({ ...batch, events: items.map(item => ({ ...event, ...item })) })
async function error(response, status, code) {
  expect(response.status).toBe(status)
  expect(response.headers.get('Cache-Control')).toBe('no-store')
  expect(response.headers.get('Content-Type')).toMatch(/^application\/json/)
  expect(await response.json()).toEqual({ ok: false, error: code })
}
async function success(response) {
  expect(response.status).toBe(204)
  expect(response.headers.get('Cache-Control')).toBe('no-store')
  expect(await response.text()).toBe('')
}

it('一批跨北京午夜：按实际发生时间逐列落库', async () => {
  await success(await post({ ...batch, events: [{ ...event, ago: 1, props: { ref: 'example.test', landing: false } }, event] }, {}, 'CN'))
  const data = await rows()
  expect(data).toHaveLength(2)
  for (const [i, row] of data.entries()) {
    const day = ['2026-11-22', '2026-11-23'][i]
    expect(row).toEqual({ id: expect.any(Number), at: time - 1 + i, day, ...event, sid, device: 'desktop', country: 'CN',
      props: i ? '{}' : '{"landing":false,"ref":"example.test"}', vid: (await hashIp(env.IP_SALT, ip, 'v|' + day + '|' + ua)).slice(0, 16) })
    expect(row.vid).toMatch(/^[a-f0-9]{16}$/)
  }
  expect(data[0].vid).not.toBe(data[1].vid)
})
it.each([
  ['非 JSON', '{'], ['数组', '[]'], ['null', 'null'], ['版本', { ...batch, v: '1' }],
  ['短 sid', { ...batch, sid: 'x'.repeat(15) }], ['长 sid', { ...batch, sid: 'x'.repeat(33) }],
  ['非法 sid', { ...batch, sid: sid + '/' }], ['非数组', { ...batch, events: {} }],
  ['空批', { ...batch, events: [] }], ['31 条', { ...batch, events: Array(31).fill(event) }],
])('整批拒绝：%s', async (_, body) => {
  await error(await post(body), 400, 'bad_request')
  expect(await count('events')).toBe(0)
  expect(await count('rate_limits')).toBe(0)
})
const padded = size => JSON.stringify(batch).padEnd(size, ' ')
it('恰好 16384 字节照收', async () => {
  await success(await post(padded(16384), { 'Content-Length': '16384' }))
  expect(await count('events')).toBe(1)
})
it('声明长度超限', async () => { await error(await post(batch, { 'Content-Length': '16385' }), 400, 'bad_request') })
it.each(['少报', '分块'])('累计到 16385 字节时取消读取：%s', async mode => {
  const chunks = [padded(16384), ' '], cancel = vi.fn()
  const body = new ReadableStream({ pull(c) { if (chunks.length) c.enqueue(new TextEncoder().encode(chunks.shift())) }, cancel })
  await error(await post(body, mode === '少报' ? { 'Content-Length': '16' } : {}), 400, 'bad_request')
  expect(cancel).toHaveBeenCalledOnce()
})
it.each([
  [{ 'Content-Type': 'text/plain' }, 415, 'unsupported_media_type'], [{ Origin: 'null' }, 403, 'forbidden'],
  [{ Origin: 'https://elsewhere.test' }, 403, 'forbidden'], [{ 'Sec-Fetch-Site': 'cross-site' }, 403, 'forbidden'],
])('请求头先于盐和内容校验 %#', async (headers, status, code) => {
  delete env.IP_SALT
  await error(await post('{', headers), status, code)
})
it.each(['GET', 'OPTIONS', 'HEAD'])('%s 限定 POST', async method => {
  const res = await onRequest(context(new Request(url, { method })))
  expect(res.headers.get('Allow')).toBe('POST')
  await error(res, 405, 'method_not_allowed')
})
it('单条丢弃不影响同批其他行', async () => {
  await success(await send({ name: 'missing' }, { name: 'constructor' }, { path: 'relative' }, { path: '/' + 'a'.repeat(200) }, { path: null }, { page: 'invalid', slug: '!', path: '/ok?q=1#x' }, { path: '/ok#only' }))
  const data = await rows()
  expect(data).toHaveLength(2)
  expect(data[0]).toMatchObject({ page: 'other', slug: null, path: '/ok', country: null, at: time })
  expect(data[1].path).toBe('/ok')
})
it('非法 device 和 country 降级', async () => {
  await success(await post({ ...batch, device: 'tablet' }, {}, 'cn'))
  expect((await rows())[0]).toMatchObject({ country: null, device: 'unknown' })
})
it('ago 缺省、非法和边界', async () => {
  await success(await send({}, { ago: -10 }, { ago: 1.5 }, { ago: 600001 }))
  expect((await rows()).map(r => r.at)).toEqual([time, time, time, time - 600000])
})
it.each([
  ['bot_copy_starter', { ok: 'true', index: 51, unknown: 0 }, {}], ['bot_copy_starter', { ok: true, index: 0.5 }, { ok: true }],
  ['bot_import', { from: ' Card', direct: 0 }, {}], ['filter', { results: 0, value: '  x\u0000   y  ' }, { value: 'x y', results: 0 }],
  ['page_view', { ref: '   ', utm_source: '😀'.repeat(41) }, { utm_source: '😀'.repeat(40) }],
  ['search', JSON.parse('{"__proto__":{"q":"bad"},"constructor":true}'), {}],
  ['search', { q: '123456 1234567 ' + 'x'.repeat(45) + '@example.test' }, { q: '【数字】 【邮箱】' }],
  ['library_search', { q: '123456789', cat: '123456789' }, { q: '【数字】', cat: '123456789' }],
])('字段白名单和清洗：%s %#', async (name, props, expected) => {
  await success(await send({ name, props }))
  expect((await rows())[0].props).toBe(JSON.stringify(expected))
})
it.each(['TestSpider', ''])('UA 过滤先于读包 %#', async agent => {
  await success(await post('invalid', { 'User-Agent': agent }))
  expect(await count('events')).toBe(0)
  expect(await count('rate_limits')).toBe(0)
})
it('本地允许无头浏览器', async () => {
  env.ALLOW_TEST_IP = '1'
  await success(await post(batch, { 'User-Agent': 'HeadlessChrome' }))
  expect(await count('events')).toBe(1)
})
it('同 IP 第 61 批不写；换 IP、换窗口恢复', async () => {
  for (let i = 0; i < 61; i++) await success(await post())
  expect(await count('events')).toBe(60)
  await success(await post(batch, { 'CF-Connecting-IP': '192.0.2.4' }))
  expect(await count('events')).toBe(61)
  clock.mockReturnValue(time + 60000)
  await success(await post())
  expect(await count('events')).toBe(62)
})
it.each([['@', 16000], ['a@', 5000]])('长搜索词限制处理范围：%s', async (fragment, n) => {
  const start = performance.now()
  const response = await send({ name: 'search', props: { q: fragment.repeat(n) } })
  expect(performance.now() - start).toBeLessThan(500)
  await success(response)
  expect(JSON.parse((await rows())[0].props).q).toBe(fragment.repeat(n).slice(0, 40))
})
it.each(['138 1234 5678', '138-1234-5678', '１３８１２３４５６７８', '123456'])('数字清洗：%s', async q => {
  await success(await send({ name: 'search', props: { q } }))
  expect(JSON.parse((await rows())[0].props).q).toBe(q.length === 6 ? q : '【数字】')
})
it('每分钟允许 300 条，再来一批不写', async () => {
  for (let i = 0; i < 10; i++) await success(await post({ ...batch, events: Array(30).fill(event) }))
  await success(await send(event, event))
  expect(await count('events')).toBe(300)
})
it('全站按合格条数共享 UTC 日额度', async () => {
  await db.prepare("INSERT INTO rate_limits VALUES ('events-day','all',?,1,9999)").bind(Math.floor(time / 86400000) * 86400000).run()
  await success(await send(event, { name: 'invalid' }))
  await success(await post(batch, { 'CF-Connecting-IP': '192.0.2.4' }))
  expect(await count('events')).toBe(1)
})
it('无合格条目不占任何桶', async () => {
  await success(await send({ path: 'invalid' }))
  expect(await count('rate_limits')).toBe(0)
})
it('清理保留边界日期的较早事件', async () => {
  clock.mockReturnValue(time - 400 * 86400000)
  await success(await send({ ago: 1 }, {}))
  clock.mockReturnValue(time + 3600000)
  random.mockReturnValue(0)
  await success(await post())
  await Promise.all(pending)
  expect((await rows()).map(r => r.at)).toEqual([time - 400 * 86400000, time + 3600000])
})
it('相同 IP 或 IPv6 /64 同日同 UA 的 vid 相同，换 UA 不同', async () => {
  for (const [address, agent] of [['2001:db8::1', ua], ['2001:db8::1', ua], ['2001:db8::2', ua], ['2001:db8::2', ua + 'x']]) {
    await success(await post(batch, { 'CF-Connecting-IP': address, 'User-Agent': agent }))
  }
  const [a,b,c,d] = (await rows()).map(r => r.vid)
  expect(a).toBe(b); expect(b).toBe(c); expect(c).not.toBe(d)
})
it('缺盐先于 UA 过滤', async () => {
  delete env.IP_SALT
  await error(await post(batch, { 'User-Agent': '' }), 500, 'server_error')
  expect(await count('events')).toBe(0)
})
it('事件表不存在只回通用错误', async () => {
  await db.prepare('DROP TABLE events').run()
  try { await error(await post(), 500, 'server_error') } finally {
    const sql = await readFile('migrations/0005_events.sql', 'utf8')
    await db.batch(unstable_splitSqlQuery(sql).map(s => db.prepare(s)))
  }
})
it.each([false, true])('400 天清理严格边界，维护失败不影响响应（失败=%s）', async fail => {
  const cutoff = time - 400 * 86400000
  clock.mockReturnValue(cutoff)
  await success(await send({ ago: 1 }, {}))
  if (fail) await db.prepare("CREATE TRIGGER keep_events BEFORE DELETE ON events BEGIN SELECT RAISE(ABORT, 'blocked'); END").run()
  try {
    clock.mockReturnValue(time)
    random.mockReturnValue(0)
    await success(await post())
    await Promise.all(pending)
    expect((await rows()).map(r => r.at)).toEqual(fail ? [cutoff-1, cutoff, time] : [cutoff, time])
  } finally { if (fail) await db.prepare('DROP TRIGGER keep_events').run() }
})
