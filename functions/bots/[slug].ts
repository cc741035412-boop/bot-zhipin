import type { PagesFunction } from '@cloudflare/workers-types'
import { loadSlugs } from '../_lib/slugs'
import type { Env } from '../_lib/types'

// 详情页兜底：已下架（不在 /api-data/slugs.json 里）的 Bot 立即返回 404。
// 原因：Cloudflare 边缘缓存会继续给旧部署里已删除的页面供货，直接访问旧链接还能看到下架的 Bot。
// 经过这个函数后，页面一律从当前部署取。清单读不到时不拦截，照常返回静态页面。
export const onRequestGet: PagesFunction<Env, 'slug'> = async (context) => {
  const slug = String(context.params.slug || '').replace(/\.html$/, '')
  let slugs: ReadonlySet<string>
  try {
    slugs = await loadSlugs(context.env.ASSETS, context.request.url, Date.now())
  } catch {
    return context.next()
  }
  if (slugs.has(slug)) return context.next()
  const page = await context.env.ASSETS.fetch(new URL('/404.html', context.request.url))
  return new Response(page.body, {
    status: 404,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}
