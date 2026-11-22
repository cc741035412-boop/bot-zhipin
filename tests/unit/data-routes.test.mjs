import { expect, it, vi } from 'vitest'
import { onRequestGet as prompt } from '../../functions/data/prompts/[slug].ts'
import { onRequestGet as skill } from '../../functions/data/skills/[slug].ts'
import { onRequestGet as bot } from '../../functions/data/bots/[slug].ts'

it.each([
  ['prompt', prompt, '/api-data/prompt-slugs.json'],
  ['skill', skill, '/api-data/skill-slugs.json'],
  ['bot', bot, '/api-data/slugs.json'],
])('/data/%ss/<slug>.json 只认自己的清单；下架立即返回 JSON 404，读不到清单则放行', async (kind, route, list) => {
  const next = vi.fn(() => new Response('{"slug":"published-item"}'))
  const assets = { fetch(url) {
    if (url.pathname === list) return Response.json(['published-item'])
    throw new Error('不应读取其他清单')
  } }
  const run = (slug, ASSETS = assets) => route({ params: { slug }, next, env: { ASSETS }, request: new Request(`https://example.test/data/${kind}s/${slug}`) })
  const removed = await run('removed-item.json')
  expect(removed.status).toBe(404)
  expect(removed.headers.get('Cache-Control')).toBe('no-store')
  expect(removed.headers.get('Content-Type')).toContain('application/json')
  expect(await removed.json()).toEqual({ error: 'not_found' })
  expect(next).not.toHaveBeenCalled()
  expect(await (await run('published-item.json')).text()).toBe('{"slug":"published-item"}')
  expect(await (await run('removed-item.json', { fetch: () => new Response(null, { status: 503 }) })).text()).toBe('{"slug":"published-item"}')
})
