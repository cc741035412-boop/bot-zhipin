import type { PagesFunction } from '@cloudflare/workers-types'
import { loadSlugs } from '../_lib/slugs'
import type { Env } from '../_lib/types'

// Prompt 详情页兜底，做法和 functions/bots/[slug].ts 一样：
// 已下架（不在 /api-data/prompt-slugs.json 里）的立即返回 404，不让边缘缓存继续给旧页面。
// 收录的内容可能因为原作者要求而撤下，撤下就要立刻看不到。清单读不到时不拦截，照常返回静态页面。
export const onRequestGet: PagesFunction<Env, 'slug'> = async (context) => {
  const slug = String(context.params.slug || '').replace(/\.html$/, '')
  let slugs: ReadonlySet<string>
  try {
    slugs = await loadSlugs(context.env.ASSETS, context.request.url, Date.now(), '/api-data/prompt-slugs.json')
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
