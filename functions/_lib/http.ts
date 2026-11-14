import { deleteExpired, validateClick } from './clicks'
import { ApiError } from './errors'
import type { ApiContext, Env } from './types'

const MAX_BODY_BYTES = 1024

export function json(body: unknown, status = 200, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...extraHeaders,
    },
  })
}

export function methodNotAllowed(allow: 'GET' | 'POST') {
  return json({ ok: false, error: 'method_not_allowed' }, 405, { Allow: allow })
}

export function clientIp(request: Pick<Request, 'headers'>, env: Pick<Env, 'ALLOW_TEST_IP'>): string {
  // Do not even read this header unless the explicit local-only switch is set.
  if (env.ALLOW_TEST_IP === '1') {
    const testIp = request.headers.get('X-Test-IP')
    if (testIp) return testIp
  }
  return request.headers.get('CF-Connecting-IP') || '0.0.0.0'
}

export function validateClickHeaders(request: Pick<Request, 'headers' | 'url'>) {
  const mediaType = request.headers.get('Content-Type')?.split(';', 1)[0].trim().toLowerCase()
  if (mediaType !== 'application/json') throw new ApiError(415, 'unsupported_media_type')
  const origin = request.headers.get('Origin')
  if ((origin !== null && origin !== new URL(request.url).origin)
    || request.headers.get('Sec-Fetch-Site')?.toLowerCase() === 'cross-site') {
    throw new ApiError(403, 'forbidden')
  }
}

export async function readClickBody(request: Pick<Request, 'headers' | 'body'>) {
  if (Number(request.headers.get('Content-Length')) > MAX_BODY_BYTES) {
    throw new ApiError(400, 'bad_request')
  }
  if (!request.body) throw new ApiError(400, 'bad_request')
  const reader = request.body.getReader()
  try {
    const decoder = new TextDecoder()
    let bytes = 0
    let text = ''
    for (;;) {
      const { value, done } = await reader.read()
      if (done) break
      bytes += value.byteLength
      if (bytes > MAX_BODY_BYTES) {
        await reader.cancel()
        throw new ApiError(400, 'bad_request')
      }
      text += decoder.decode(value, { stream: true })
    }
    text += decoder.decode()
    return validateClick(JSON.parse(text))
  } catch {
    throw new ApiError(400, 'bad_request')
  } finally {
    reader.releaseLock()
  }
}

export function scheduleCleanup(context: Pick<ApiContext, 'env' | 'waitUntil'>, now: number, random = Math.random) {
  if (random() < 0.01) {
    // Best effort: maintenance must not turn a successful click into a failed one.
    context.waitUntil(deleteExpired(context.env.DB, now).catch(() => {}))
  }
}

export async function handleApi(context: ApiContext, action: (now: number) => Response | Promise<Response>) {
  const now = Date.now()
  try {
    scheduleCleanup(context, now)
    return await action(now)
  } catch (error) {
    if (error instanceof ApiError) return json({ ok: false, error: error.code }, error.status)
    // Database errors can contain bound values; do not log or return their details.
    return json({ ok: false, error: 'server_error' }, 500)
  }
}
