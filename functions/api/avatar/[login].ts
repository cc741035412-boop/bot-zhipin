import type { PagesFunction } from '@cloudflare/workers-types'
import { isLogin, loadAuthors } from '../../_lib/authors'
import { methodNotAllowed } from '../../_lib/http'
import type { Env } from '../../_lib/types'

const LIMIT = 1024 * 1024
const types = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
const error = (status: number) => new Response(null, {
  status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
})

async function imageResponse(upstream: Response) {
  const type = upstream.headers.get('Content-Type') || ''
  const length = upstream.headers.get('Content-Length')
  if (upstream.status !== 200 || !types.has(type.split(';')[0].trim().toLowerCase()) ||
      (length !== null && (Number(length) === 0 || Number(length) > LIMIT)) || !upstream.body) {
    await upstream.body?.cancel()
    return error(502)
  }
  const reader = upstream.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > LIMIT) {
        await reader.cancel()
        return error(502)
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }
  if (!size) return error(502)
  return new Response(new Blob(chunks), { headers: {
    'Content-Type': type,
    'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': "default-src 'none'",
    'Cross-Origin-Resource-Policy': 'same-origin',
  } })
}

export const onRequestGet: PagesFunction<Env, 'login'> = async (context) => {
  const { login } = context.params
  if (!isLogin(login)) return error(404)
  const key = login.toLowerCase()
  try {
    const authors = await loadAuthors(context.env.ASSETS, context.request.url)
    if (!authors.has(key)) return error(404)
  } catch {
    return error(500)
  }
  const cacheKey = new Request(new URL(`/api/avatar/${key}`, context.request.url))
  const cache = typeof caches !== 'undefined' ? caches.default : undefined
  const hit = await cache?.match(cacheKey).catch(() => undefined)
  if (hit) return hit
  try {
    const base = context.env.GITHUB_AVATAR_BASE || 'https://avatars.githubusercontent.com'
    const response = await imageResponse(await fetch(`${base}/${key}?s=256`, {
      redirect: 'manual', signal: AbortSignal.timeout(5000),
    }))
    if (cache && response.ok) context.waitUntil(cache.put(cacheKey, response.clone()))
    return response
  } catch {
    return error(502)
  }
}

export const onRequest: PagesFunction<Env> = () => {
  const response = methodNotAllowed('GET')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  return response
}
