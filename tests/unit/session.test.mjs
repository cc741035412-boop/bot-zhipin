import { afterEach, describe, expect, it, vi } from 'vitest'
import { createHmac, randomBytes } from 'node:crypto'
import { clearCookie, cookieNames, oauthSetCookie, parseCookies, readSession, sessionSetCookie, sign, verify } from '../../functions/_lib/session.ts'

const now = 1_800_000_000_000
const secret = randomBytes(32).toString('hex')
const env = { SESSION_SECRET: secret }
const user = { id: 123, login: 'Alice' }
const request = (cookie) => new Request('https://example.test/api/auth/me', { headers: { Cookie: cookie.split(';')[0] } })
afterEach(() => vi.restoreAllMocks())

describe('HMAC 会话和 cookie', () => {
  it('签名格式与 node:crypto 独立实现相同，支持 UTF-8', async () => {
    const payload = { text: '你好', exp: now + 1 }
    const token = await sign(secret, payload)
    const [text, signature] = token.split('.')
    expect(Buffer.from(text, 'base64url').toString()).toBe(JSON.stringify(payload))
    expect(signature === createHmac('sha256', secret).update(text).digest('base64url')).toBe(true)
    expect(await verify([secret], token, now)).toEqual(payload)
  })

  it('会话被篡改或签名被替换时拒绝', async () => {
    const token = await sign(secret, { exp: now + 1, id: 123 })
    const [text, sig] = token.split('.')
    expect(await verify([secret], `${text}.${sig[0] === 'A' ? 'B' : 'A'}${sig.slice(1)}`, now)).toBeNull()
    expect(await verify([secret], `${Buffer.from(JSON.stringify({ exp: now + 1, id: 456 })).toString('base64url')}.${sig}`, now)).toBeNull()
  })

  it('恰好到期即失效，前一毫秒有效', async () => {
    const token = await sign(secret, { exp: now })
    expect(await verify([secret], token, now - 1)).toEqual({ exp: now })
    expect(await verify([secret], token, now)).toBeNull()
    expect(await verify([secret], token, now + 1)).toBeNull()
  })

  it.each([{}, { exp: '9999999999999' }, { exp: null }, { exp: -1 }, ['array']])('拒绝缺失或非数字 exp、非对象载荷：%j', async (payload) => {
    expect(await verify([secret], await sign(secret, payload), now)).toBeNull()
  })

  it.each(['', 'x', 'a.b.c', 'a.!!', 'a.A', null, 'x'.repeat(8193)])('畸形 token 返回 null（%#）', async (token) => {
    expect(await verify([secret], token, now)).toBeNull()
  })

  it('轮换时依次验当前密钥、旧密钥；去掉旧密钥后失效', async () => {
    const token = await sign(secret, { exp: now + 10 })
    const current = randomBytes(32).toString('hex')
    expect(await verify([current, secret], token, now)).toEqual({ exp: now + 10 })
    expect(await verify([undefined, secret], token, now)).not.toBeNull()
    expect(await verify([current], token, now)).toBeNull()
    expect(await verify([], token, now)).toBeNull()
  })

  it('使用 WebCrypto verify，不自行用字符串比较 MAC', async () => {
    const token = await sign(secret, { exp: now + 1 })
    const spy = vi.spyOn(crypto.subtle, 'verify')
    await verify([secret], token, now)
    expect(spy).toHaveBeenCalledWith('HMAC', expect.anything(), expect.any(Uint8Array), expect.any(Uint8Array))
  })

  it('生产会话的全部属性及载荷：仅含用户身份和时效，不复制额外字段', async () => {
    const cookie = await sessionSetCookie(env, { ...user, ignored: 'not-for-cookie' }, now)
    expect(cookieNames(env)).toEqual({ session: '__Host-bz_s', oauth: '__Host-bz_oauth' })
    expect(cookie.split('; ').slice(1)).toEqual(['Max-Age=7200', 'Path=/', 'HttpOnly', 'Secure', 'SameSite=Strict'])
    expect(cookie).not.toMatch(/Domain=/i)
    const token = parseCookies(cookie)['__Host-bz_s']
    expect(await verify([secret], token, now)).toEqual({ t: 's', v: 1, ...user, iat: now, exp: now + 7_200_000 })
    expect(await readSession(request(cookie), env, now)).toEqual(user)
  })

  it('生产 OAuth cookie 的全部属性及 10 分钟有效期', async () => {
    const cookie = await oauthSetCookie(env, 'state', 'verifier', now)
    expect(cookie.split('; ').slice(1)).toEqual(['Max-Age=600', 'Path=/', 'HttpOnly', 'Secure', 'SameSite=Lax'])
    expect(cookie.startsWith('__Host-bz_oauth=')).toBe(true)
    expect(await verify([secret], parseCookies(cookie)['__Host-bz_oauth'], now)).toEqual({ t: 'o', state: 'state', verifier: 'verifier', exp: now + 600_000 })
  })

  it('仅字符串 1 启用本地 cookie；clear 保留对应 SameSite 并 Max-Age=0', async () => {
    const local = { ...env, ALLOW_TEST_ENDPOINTS: '1' }
    expect(cookieNames(local)).toEqual({ session: 'bz_s', oauth: 'bz_oauth' })
    const cookie = await sessionSetCookie(local, user, now)
    expect(cookie).not.toContain('Secure')
    expect(cookie).not.toContain('__Host-')
    expect(clearCookie(local, 'bz_s')).toBe('bz_s=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict')
    expect(clearCookie(env, '__Host-bz_oauth')).toBe('__Host-bz_oauth=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax')
    for (const flag of [undefined, 'true', '0', 1]) expect(cookieNames({ ALLOW_TEST_ENDPOINTS: flag })).toEqual(cookieNames(env))
  })

  it('cookie 解析保留 =，忽略坏段、防原型污染和重复覆盖', () => {
    const result = parseCookies(' first=a=b; malformed; __proto__=safe; first=second; encoded=%2F ')
    expect(Object.getPrototypeOf(result)).toBeNull()
    expect(result).toEqual({ first: 'a=b', ['__proto__']: 'safe', encoded: '%2F' })
    expect(Object.hasOwn(result, '__proto__')).toBe(true)
    expect(result.__proto__).toBe('safe')
    expect(Object.keys(parseCookies(null))).toHaveLength(0)
  })

  it('readSession 验轮换密钥，过期/缺失时不暴露身份', async () => {
    const cookie = await sessionSetCookie(env, user, now)
    expect(await readSession(request(cookie), { ...env, SESSION_SECRET: 'new-secret', SESSION_SECRET_PREV: secret }, now)).toEqual(user)
    expect(await readSession(request(cookie), env, now + 7_200_000)).toBeNull()
    expect(await readSession(request('other=none'), env, now)).toBeNull()
  })

  it.each([{ v: 2 }, { id: 0 }, { id: '123' }, { login: 'bad/name' }, { iat: now + 1 }, { exp: now + 1 }])('拒绝签过但结构错误的会话 %j', async (override) => {
    const token = await sign(secret, { t: 's', v: 1, ...user, iat: now, exp: now + 7_200_000, ...override })
    expect(await readSession(request(`__Host-bz_s=${token}`), env, now)).toBeNull()
  })
})
