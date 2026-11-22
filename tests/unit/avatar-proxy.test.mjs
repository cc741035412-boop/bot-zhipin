import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { onRequest, onRequestGet as avatar } from '../../functions/api/avatar/[login]'
import { onRequestGet as page } from '../../functions/authors/[login]'

const bytes = Uint8Array.of(0xff, 0xd8, 0xff)
const image = (body = bytes, headers = {}) => new Response(body, { headers: { 'Content-Type': 'image/jpeg; example=1', ...headers } })
let cache, ctx, upstream
beforeEach(() => {
  cache = { match: vi.fn().mockResolvedValue(undefined), put: vi.fn().mockResolvedValue(undefined) }
  upstream = vi.fn(async () => image())
  vi.stubGlobal('caches', { default: cache })
  vi.stubGlobal('fetch', upstream)
  ctx = { request: new Request('https://site.test/api/avatar/A?ignored=yes'), params: { login: 'a' },
    env: { ASSETS: { fetch: vi.fn(async url => {
      if (url.pathname === '/404.html') return new Response('已下架')
      expect(url.pathname).toBe('/api-data/authors.json')
      return Response.json(['a'])
    }) } }, waitUntil: vi.fn(), next: vi.fn(() => new Response('next')) }
})
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks() })

async function failure(status) {
  const r = await avatar(ctx)
  expect(r.status).toBe(status)
  expect(r.headers.get('Cache-Control')).toBe('no-store')
  expect(r.headers.get('X-Content-Type-Options')).toBe('nosniff')
  expect(await r.text()).toBe('')
  expect(cache.put).not.toHaveBeenCalled()
}

it('返回图片原文和安全缓存头，用规范 GET 键写入缓存', async () => {
  const r = await avatar(ctx)
  expect(r.status).toBe(200)
  expect(new Uint8Array(await r.arrayBuffer())).toEqual(bytes)
  expect(Object.fromEntries(r.headers)).toMatchObject({
    'content-type': 'image/jpeg; example=1', 'content-security-policy': "default-src 'none'",
    'cross-origin-resource-policy': 'same-origin', 'x-content-type-options': 'nosniff',
    'cache-control': 'public, max-age=86400, stale-while-revalidate=604800',
  })
  expect(upstream.mock.calls[0][0]).toBe('https://avatars.githubusercontent.com/a?s=256')
  const [key, copy] = cache.put.mock.calls[0]
  expect(key.method).toBe('GET'); expect(key.url).toBe('https://site.test/api/avatar/a')
  expect(cache.match.mock.calls[0][0]).toBe(key)
  expect(new Uint8Array(await copy.arrayBuffer())).toEqual(bytes)
  expect(ctx.waitUntil.mock.calls[0][0]).toBe(cache.put.mock.results[0].value)
})
it('大写登录名按小写查询', async () => {
  ctx.params.login = 'A'
  ctx.request = new Request('https://site.test/api/avatar/A?v=1')
  expect((await avatar(ctx)).status).toBe(200)
  expect(cache.match.mock.calls[0][0].url).toBe('https://site.test/api/avatar/a')
  expect(cache.put.mock.calls[0][0].url).toBe('https://site.test/api/avatar/a')
  expect(upstream.mock.calls[0][0]).toContain('/a?s=256')
})
it('未上架作者不查缓存也不访问上游', async () => {
  ctx.params.login = 'other'; await failure(404)
  expect(cache.match).not.toHaveBeenCalled(); expect(upstream).not.toHaveBeenCalled()
})
it.each(['../x', 'a--b', '-a', 'a-', 'a'.repeat(40), ''])('拒绝非法登录名 %j', async login => {
  ctx.params.login = login; await failure(404)
  expect(ctx.env.ASSETS.fetch).not.toHaveBeenCalled(); expect(upstream).not.toHaveBeenCalled()
})
it.each([404, 500])('上游 %i 返回 502', async status => {
  upstream.mockResolvedValue(new Response(bytes, { status, headers: { 'Content-Type': 'image/jpeg' } })); await failure(502)
})
it.each(['text/html', 'image/svg+xml'])('拒绝类型 %s', async type => {
  upstream.mockResolvedValue(image(bytes, { 'Content-Type': type })); await failure(502)
})
it.each(['image/png', 'image/gif', 'image/webp'])('放行 %s，透传完整类型', async type => {
  const header = `${type}; example=1`
  upstream.mockResolvedValue(image(bytes, { 'Content-Type': header }))
  const r = await avatar(ctx)
  expect(r.status).toBe(200); expect(r.headers.get('Content-Type')).toBe(header)
})
it.each([true, false])('恰好 1 MiB 放行（声明长度：%s）', async declared => {
  const size = 1024 ** 2
  upstream.mockResolvedValue(image(new Uint8Array(size), declared ? { 'Content-Length': String(size) } : {}))
  const r = await avatar(ctx)
  expect(r.status).toBe(200); expect((await r.arrayBuffer()).byteLength).toBe(size)
})
it('上游 302 不跟随，返回 502', async () => {
  upstream.mockResolvedValue(new Response(null, { status: 302, headers: { Location: '/other' } }))
  await failure(502)
  expect(upstream).toHaveBeenCalledTimes(1)
  const [, opts] = upstream.mock.calls[0]
  expect(opts.redirect).toBe('manual'); expect(opts.signal).toBeInstanceOf(AbortSignal)
})
it.each([true, false])('空正文拒绝缓存（声明零长度：%s）', async declared => {
  upstream.mockResolvedValue(image(new Uint8Array(), declared ? { 'Content-Length': '0' } : {}))
  await failure(502)
})
it('即使正文非空也拒绝零长度声明', async () => {
  upstream.mockResolvedValue(image(bytes, { 'Content-Length': '0' })); await failure(502)
})
it('声明长度超限，即使正文很小也拒绝', async () => {
  upstream.mockResolvedValue(image(bytes, { 'Content-Length': String(1024 ** 2 + 1) })); await failure(502)
})
it('没有长度头时累计多块大小并取消超限流', async () => {
  const cancel = vi.fn()
  upstream.mockResolvedValue(image(new ReadableStream({ pull(c) { c.enqueue(new Uint8Array(65536)) }, cancel })))
  await failure(502); expect(cancel).toHaveBeenCalled()
})
it('5 秒截止信号中断上游时返回 502', async () => {
  const signal = AbortSignal.abort(new DOMException('timeout', 'TimeoutError'))
  const timeout = vi.spyOn(AbortSignal, 'timeout').mockReturnValue(signal)
  upstream.mockImplementation(async (_, opts) => { opts.signal.throwIfAborted() })
  await failure(502); expect(timeout).toHaveBeenCalledWith(5000)
})
it('清单不可读，返回 500 而非回退到图片缓存', async () => {
  ctx.env.ASSETS.fetch.mockRejectedValue(new Error()); await failure(500)
  expect(cache.match).not.toHaveBeenCalled(); expect(upstream).not.toHaveBeenCalled()
})
it('命中缓存直接返回', async () => {
  const hit = image(); cache.match.mockResolvedValue(hit)
  expect(await avatar(ctx)).toBe(hit); expect(upstream).not.toHaveBeenCalled(); expect(cache.put).not.toHaveBeenCalled()
})
it('没有 caches 也可返回图片', async () => {
  vi.stubGlobal('caches', undefined); expect((await avatar(ctx)).status).toBe(200)
})
it('使用本地上游覆盖地址', async () => {
  ctx.env.GITHUB_AVATAR_BASE = 'https://fake.test'; expect((await avatar(ctx)).status).toBe(200)
  expect(upstream.mock.calls[0][0]).toBe('https://fake.test/a?s=256')
})
it('非 GET 返回 405', async () => {
  const r = await onRequest(ctx); expect(r.status).toBe(405); expect(r.headers.get('Allow')).toBe('GET')
  expect(r.headers.get('Cache-Control')).toBe('no-store'); expect(r.headers.get('X-Content-Type-Options')).toBe('nosniff')
})
it.each([['A.html', ''], ['A', ''], ['A', '?from=x&from=y%2Fz']])('在架作者页 %s%s 跳到小写路径', async (login, search) => {
  ctx.params.login = login; ctx.request = new Request(`https://site.test/authors/${login}${search}`)
  const r = await page(ctx)
  expect(r.status).toBe(308); expect(r.headers.get('Location')).toBe(`/authors/a${search}`)
})
it('在架小写加 .html 交给静态层', async () => {
  ctx.params.login = 'a.html'
  expect(await page(ctx)).toBe(ctx.next.mock.results[0].value)
})
it('名单外大写不跳转', async () => {
  ctx.params.login = 'Removed'; const r = await page(ctx)
  expect(r.status).toBe(404); expect(r.headers.get('Location')).toBeNull()
})
it('下架作者页返回站点 404 页面且不缓存', async () => {
  ctx.params.login = 'removed'; const r = await page(ctx)
  expect(r.status).toBe(404); expect(r.headers.get('Cache-Control')).toBe('no-store'); expect(await r.text()).toBe('已下架')
})
it('清单不可读时不拦截静态作者页', async () => {
  ctx.env.ASSETS.fetch.mockRejectedValue(new Error()); expect(await (await page(ctx)).text()).toBe('next')
})
