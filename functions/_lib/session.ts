import { fromBase64Url, toBase64Url } from './bytes'
import type { Env } from './types'

const encoder = new TextEncoder()
const SESSION_MS = 2 * 60 * 60 * 1000
export interface SessionUser { id: number; login: string }

async function hmacKey(secret: string, usage: 'sign' | 'verify') {
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [usage])
}

export async function sign(secret: string, payload: object): Promise<string> {
  const text = toBase64Url(encoder.encode(JSON.stringify(payload)))
  const signature = await crypto.subtle.sign('HMAC', await hmacKey(secret, 'sign'), encoder.encode(text))
  return `${text}.${toBase64Url(new Uint8Array(signature))}`
}

export async function verify(secrets: (string | undefined)[], token: string, now: number): Promise<Record<string, unknown> | null> {
  try {
    if (typeof token !== 'string' || token.length > 8192 || !Number.isFinite(now)) return null
    const parts = token.split('.')
    if (parts.length !== 2) return null
    const [text, signature] = parts
    const sig = fromBase64Url(signature)
    if (sig.length !== 32) return null
    let valid = false
    for (const secret of secrets) {
      if (!secret) continue
      // Native WebCrypto verification performs the constant-time MAC comparison.
      if (await crypto.subtle.verify('HMAC', await hmacKey(secret, 'verify'), sig, encoder.encode(text))) {
        valid = true
        break
      }
    }
    if (!valid) return null
    const payload = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(fromBase64Url(text)))
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)
      || typeof payload.exp !== 'number' || !Number.isFinite(payload.exp) || payload.exp <= now) return null
    return payload
  } catch {
    return null
  }
}

export function cookieNames(env: Env) {
  const prefix = env.ALLOW_TEST_ENDPOINTS === '1' ? '' : '__Host-'
  return { session: `${prefix}bz_s`, oauth: `${prefix}bz_oauth` }
}

export function parseCookies(header: string | null | undefined): Record<string, string> {
  const cookies: Record<string, string> = Object.create(null)
  for (const item of (header || '').split(';')) {
    const equals = item.indexOf('=')
    if (equals <= 0) continue
    const name = item.slice(0, equals).trim()
    // First occurrence wins, without decoding/normalizing signed values.
    if (!Object.hasOwn(cookies, name)) cookies[name] = item.slice(equals + 1).trim()
  }
  return cookies
}

export function isSessionUser(user: unknown): user is SessionUser {
  if (!user || typeof user !== 'object') return false
  const { id, login } = user as SessionUser
  return Number.isSafeInteger(id) && id > 0 && typeof login === 'string'
    && /^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(login)
}

export async function readSession(request: Pick<Request, 'headers'>, env: Env, now: number): Promise<SessionUser | null> {
  const token = parseCookies(request.headers.get('Cookie'))[cookieNames(env).session]
  const payload = await verify([env.SESSION_SECRET, env.SESSION_SECRET_PREV], token, now)
  if (!payload || payload.v !== 1 || !isSessionUser(payload)
    || typeof payload.iat !== 'number' || !Number.isFinite(payload.iat)
    || payload.iat > now || Number(payload.exp) - payload.iat !== SESSION_MS) return null
  return { id: payload.id, login: payload.login }
}

function setCookie(env: Env, name: string, value: string, maxAge: number, sameSite: 'Strict' | 'Lax') {
  return `${name}=${value}; Max-Age=${maxAge}; Path=/; HttpOnly${env.ALLOW_TEST_ENDPOINTS === '1' ? '' : '; Secure'}; SameSite=${sameSite}`
}

export async function sessionSetCookie(env: Env, user: SessionUser, now: number): Promise<string> {
  if (!env.SESSION_SECRET || !isSessionUser(user)) throw new Error('Invalid session configuration')
  const value = await sign(env.SESSION_SECRET, { v: 1, id: user.id, login: user.login, iat: now, exp: now + SESSION_MS })
  return setCookie(env, cookieNames(env).session, value, SESSION_MS / 1000, 'Strict')
}

export async function oauthSetCookie(env: Env, state: string, verifier: string, now: number): Promise<string> {
  if (!env.SESSION_SECRET) throw new Error('Invalid session configuration')
  const value = await sign(env.SESSION_SECRET, { state, verifier, exp: now + 600_000 })
  return setCookie(env, cookieNames(env).oauth, value, 600, 'Lax')
}

export function clearCookie(env: Env, name: string): string {
  const names = cookieNames(env)
  if (name !== names.session && name !== names.oauth) throw new Error('Unknown cookie')
  return setCookie(env, name, '', 0, name === names.session ? 'Strict' : 'Lax')
}
