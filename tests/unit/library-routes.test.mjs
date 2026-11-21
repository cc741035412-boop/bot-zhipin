import { expect, it, vi } from 'vitest'
import { onRequestGet as prompt } from '../../functions/prompts/[slug].ts'
import { onRequestGet as skill } from '../../functions/skills/[slug].ts'

it.each([['prompt', prompt], ['skill', skill]])('%s 只认自己的清单；下架立即走站内 404，读不到清单则放行', async (kind, route) => {
  const next = vi.fn(() => new Response('静态页面'))
  const assets = { fetch(url) {
    if (url.pathname === `/api-data/${kind}-slugs.json`) return Response.json(['published-item'])
    if (url.pathname === '/404.html') return new Response('页面不存在')
    throw new Error('不应读取其他清单')
  } }
  const run = (slug, ASSETS = assets) => route({ params: { slug }, next, env: { ASSETS }, request: new Request(`https://example.test/${kind}s/${slug}`) })
  const removed = await run('removed-item')
  expect(removed.status).toBe(404)
  expect(removed.headers.get('Cache-Control')).toBe('no-store')
  expect(await removed.text()).toBe('页面不存在')
  expect(next).not.toHaveBeenCalled()
  expect(await (await run('published-item.html')).text()).toBe('静态页面')
  expect(await (await run('removed-item', { fetch: () => new Response(null, { status: 503 }) })).text()).toBe('静态页面')
})
