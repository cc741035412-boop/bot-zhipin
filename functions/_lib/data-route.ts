import type { PagesFunction } from '@cloudflare/workers-types'
import { loadSlugs } from './slugs'
import type { Env } from './types'

// 给 AI 用的每条完整数据（/data/<kind>s/<slug>.json，决策 70）的下架兜底，做法和 functions/prompts/[slug].ts 一样：
// 不在清单里的立即返回 404，不让边缘缓存继续给已撤下条目的全文。清单读不到时不拦截，照常返回静态文件。
// /data/index.json 不经过这里：它是新部署整份替换的，不带正文。
export function dataRoute(list: string): PagesFunction<Env, 'slug'> {
  return async (context) => {
    const slug = String(context.params.slug || '').replace(/\.json$/, '')
    let slugs: ReadonlySet<string>
    try {
      slugs = await loadSlugs(context.env.ASSETS, context.request.url, Date.now(), list)
    } catch {
      return context.next()
    }
    if (slugs.has(slug)) return context.next()
    return new Response(JSON.stringify({ error: 'not_found' }) + '\n', {
      status: 404,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' },
    })
  }
}
