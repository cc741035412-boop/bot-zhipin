import { describe, expect, it, vi } from 'vitest'
import { onRequestGet } from '../../functions/squads/[slug].ts'
import { onRequestGet as botRoute } from '../../functions/bots/[slug].ts'
import { loadSlugs } from '../../functions/_lib/slugs.ts'

let n = 0
function ctx(slug, { squads = ['live-squad'], bots = ['live-bot'], fail = false, base = 'squads' } = {}) {
  // 每个用例用新的 ASSETS 对象，避开 loadSlugs 按 ASSETS 缓存
  const assets = {
    fetch: vi.fn(async (url) => {
      const path = new URL(url).pathname
      if (path === '/api-data/squad-slugs.json') return fail ? new Response('x', { status: 500 }) : new Response(JSON.stringify(squads))
      if (path === '/api-data/slugs.json') return new Response(JSON.stringify(bots))
      if (path === '/404.html') return new Response('<h1>页面不存在</h1>', { status: 200 })
      return new Response('page')
    }),
  }
  const next = vi.fn(async () => new Response('static page', { status: 200 }))
  return { next, assets, c: { params: { slug }, env: { ASSETS: assets }, request: new Request(`https://example.test/${base}/${slug}?n=${n++}`), next } }
}

describe('小队页下架兜底', () => {
  it('在清单里的小队照常返回静态页面', async () => {
    const { c, next, assets } = ctx('live-squad')
    const res = await onRequestGet(c)
    expect(next).toHaveBeenCalledOnce()
    expect(await res.text()).toBe('static page')
    expect(new URL(assets.fetch.mock.calls[0][0]).pathname).toBe('/api-data/squad-slugs.json')
  })
  it('带 .html 后缀也能识别', async () => {
    const { c, next } = ctx('live-squad.html')
    await onRequestGet(c)
    expect(next).toHaveBeenCalledOnce()
  })
  it('已下架的小队返回 404 和站内 404 页面，且不缓存', async () => {
    const { c, next } = ctx('removed-squad')
    const res = await onRequestGet(c)
    expect(next).not.toHaveBeenCalled()
    expect(res.status).toBe(404)
    expect(res.headers.get('Cache-Control')).toBe('no-store')
    expect(await res.text()).toContain('页面不存在')
  })
  it('只认小队清单：和 Bot 同名但不是小队的 slug 照样 404', async () => {
    const { c, next } = ctx('live-bot')
    const res = await onRequestGet(c)
    expect(next).not.toHaveBeenCalled()
    expect(res.status).toBe(404)
  })
  it('清单读不到时不拦截', async () => {
    const { c, next } = ctx('anything', { fail: true })
    await onRequestGet(c)
    expect(next).toHaveBeenCalledOnce()
  })
  it('同一个部署上 Bot 清单和小队清单各缓存各的，互不串', async () => {
    const { c, next, assets } = ctx('live-squad')
    await onRequestGet(c)
    const bot = { ...c, params: { slug: 'live-bot' }, request: new Request('https://example.test/bots/live-bot') }
    await botRoute(bot)
    expect(next).toHaveBeenCalledTimes(2)
    // Bot 路由不认小队的 slug，反过来也一样。
    const wrong = await botRoute({ ...bot, params: { slug: 'live-squad' } })
    expect(wrong.status).toBe(404)
    const lists = assets.fetch.mock.calls.map(([url]) => new URL(url).pathname).filter((path) => path.startsWith('/api-data/'))
    expect(lists).toEqual(['/api-data/squad-slugs.json', '/api-data/slugs.json'])
    const now = Date.now()
    expect(await loadSlugs(assets, 'https://example.test/x', now)).toEqual(new Set(['live-bot']))
    expect(await loadSlugs(assets, 'https://example.test/x', now, '/api-data/squad-slugs.json')).toEqual(new Set(['live-squad']))
  })
})
