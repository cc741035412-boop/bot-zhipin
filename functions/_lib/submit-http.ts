import { ApiError } from './errors'
import { fail } from './respond'
import { readSession } from './session'
import type { Env } from './types'

export async function requireUser(request: Pick<Request, 'headers'>, env: Env, now: number) {
  const user = await readSession(request, env, now)
  if (!user) fail('unauthenticated')
  return user
}

export async function readBytes(request: Pick<Request, 'headers' | 'body'>, max: number, requireLength = false): Promise<Uint8Array> {
  const raw = request.headers.get('Content-Length')
  if ((requireLength && raw === null) || (raw !== null && (!/^\d+$/.test(raw) || Number(raw) > max))) fail('too_large')
  if (!request.body) fail('bad_request')
  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let length = 0
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      length += value.byteLength
      if (length > max || (raw !== null && length > Number(raw))) {
        await reader.cancel()
        fail('too_large')
      }
      chunks.push(value)
    }
    if (raw !== null && length !== Number(raw)) fail('bad_request')
    const bytes = new Uint8Array(length)
    let offset = 0
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length }
    return bytes
  } catch (error) {
    if (error instanceof ApiError) throw error
    fail('bad_request')
  } finally {
    reader.releaseLock()
  }
}

export async function readSubmitBody(request: Pick<Request, 'headers' | 'body'>): Promise<Record<string, unknown>> {
  const bytes = await readBytes(request, 700 * 1024)
  try {
    const body = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes))
    if (!body || typeof body !== 'object' || Array.isArray(body)) fail('bad_request')
    return body
  } catch { fail('bad_request') }
}
