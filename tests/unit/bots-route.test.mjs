import { describe, expect, it, vi } from 'vitest'
import { onRequestGet } from '../../functions/bots/[slug].ts'

let n = 0
function ctx(slug, { slugs = ['live-bot'], fail = false } = {}) {
  // 每个用例用新的 ASSETS 对象，避开 loadSlugs 按 ASSETS 缓存
  const assets = {
    fetch: vi.fn(async (url) => {
      const path = new URL(url).pathname
      if (path === '/api-data/slugs.json') return fail ? new Response('x', { status: 500 }) : new Response(JSON.stringify(slugs))
      if (path === '/404.html') return new Response('<h1>页面不存在</h1>', { status: 200 })
      return new Response('page')
    }),
  }
  const next = vi.fn(async () => new Response('static page', { status: 200 }))
  return { next, assets, c: { params: { slug }, env: { ASSETS: assets }, request: new Request(`https://example.test/bots/${slug}?n=${n++}`), next } }
}

describe('详情页下架兜底', () => {
  it('在清单里的 Bot 照常返回静态页面', async () => {
    const { c, next } = ctx('live-bot')
    const res = await onRequestGet(c)
    expect(next).toHaveBeenCalledOnce()
    expect(await res.text()).toBe('static page')
  })
  it('带 .html 后缀也能识别', async () => {
    const { c, next } = ctx('live-bot.html')
    await onRequestGet(c)
    expect(next).toHaveBeenCalledOnce()
  })
  it('已下架的 Bot 返回 404 和站内 404 页面，且不缓存', async () => {
    const { c, next } = ctx('removed-bot')
    const res = await onRequestGet(c)
    expect(next).not.toHaveBeenCalled()
    expect(res.status).toBe(404)
    expect(res.headers.get('Cache-Control')).toBe('no-store')
    expect(await res.text()).toContain('页面不存在')
  })
  it('清单读不到时不拦截', async () => {
    const { c, next } = ctx('anything', { fail: true })
    await onRequestGet(c)
    expect(next).toHaveBeenCalledOnce()
  })
})
