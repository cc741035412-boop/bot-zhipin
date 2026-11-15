import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { createHash, generateKeyPairSync } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPlatformProxy } from 'wrangler'
import * as start from '../../functions/api/auth/start.ts'
import * as callback from '../../functions/api/auth/callback.ts'
import * as me from '../../functions/api/auth/me.ts'
import * as logout from '../../functions/api/auth/logout.ts'
import { cookieNames, parseCookies, verify } from '../../functions/_lib/session.ts'

const root = fileURLToPath(new URL('../../', import.meta.url))
const origin = 'https://site.test'
const now = 1_800_000_000_000
let directory, proxy, db, pem, env, calls, fetchMock, pending
const cookies = (response) => response.headers.getSetCookie()
const pair = (cookie) => cookie.split(';')[0]
const oauthCookie = (response) => cookies(response).find((c) => c.startsWith(`${cookieNames(env).oauth}=`))
const sessionCookie = (response) => cookies(response).find((c) => c.startsWith(`${cookieNames(env).session}=`))
function context(request, bindings = env) {
  return { request, env: bindings, waitUntil: (promise) => pending.push(promise) }
}
function begin(bindings = env, headers = {}) {
  return start.onRequestGet(context(new Request(`${origin}/api/auth/start?returnTo=https://evil.test`, { headers: { 'CF-Connecting-IP': '192.0.2.1', ...headers } }), bindings))
}
async function finish(options = {}) {
  const response = await begin()
  const location = new URL(response.headers.get('Location'))
  const headers = { Cookie: pair(oauthCookie(response)) }
  const state = options.state ?? location.searchParams.get('state')
  const query = options.query ?? `code=local-code&state=${state}`
  const result = await callback.onRequestGet(context(new Request(`${origin}/api/auth/callback?${query}`, { headers })))
  return { response, location, result }
}
function secure(response) {
  expect(response.headers.get('Cache-Control')).toBe('no-store')
  expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff')
  expect(response.headers.get('Content-Security-Policy')).toBe("frame-ancestors 'none'")
  expect(response.headers.has('Access-Control-Allow-Origin')).toBe(false)
}

beforeAll(async () => {
  directory = await mkdtemp(join(tmpdir(), 'bz-auth-'))
  await copyFile(join(root, 'wrangler.toml'), join(directory, 'wrangler.toml'))
  proxy = await getPlatformProxy({ configPath: join(directory, 'wrangler.toml'), envFiles: [], persist: false, remoteBindings: false })
  db = proxy.env.DB
  for (const name of ['0001_init.sql', '0002_submit.sql']) {
    const sql = await readFile(join(root, 'migrations', name), 'utf8')
    for (const statement of sql.split(';').map((s) => s.trim()).filter(Boolean)) await db.prepare(statement).run()
  }
  pem = generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey.export({ type: 'pkcs8', format: 'pem' })
}, 30_000)
afterAll(async () => {
  await proxy?.dispose()
  if (directory) await rm(directory, { recursive: true, force: true })
})
beforeEach(async () => {
  await db.prepare('DELETE FROM rate_limits').run()
  env = {
    DB: db, ASSETS: { fetch: vi.fn() }, IP_SALT: 'local-ip-salt', SESSION_SECRET: 's'.repeat(40),
    SUBMIT_REPO: 'owner/repo', GITHUB_APP_ID: '42', GITHUB_APP_INSTALLATION_ID: '123', GITHUB_APP_BOT_LOGIN: 'local-app[bot]',
    GITHUB_APP_PRIVATE_KEY: pem, OAUTH_CLIENT_ID: 'local-client', OAUTH_CLIENT_SECRET: 'local-fake',
    ALLOW_TEST_ENDPOINTS: '1', GITHUB_API_BASE: 'http://api.gh.test', GITHUB_OAUTH_BASE: 'http://oauth.gh.test',
  }
  pending = []
  calls = []
  vi.spyOn(Math, 'random').mockReturnValue(0.5)
  vi.spyOn(Date, 'now').mockReturnValue(now)
  fetchMock = vi.fn(async (input, init = {}) => {
    const url = new URL(String(input))
    calls.push({ path: url.pathname, ...init, headers: new Headers(init.headers), body: init.body ? JSON.parse(init.body) : undefined })
    if (url.pathname === '/login/oauth/access_token') return Response.json({ access_token: 'local-user-credential', token_type: 'bearer' })
    if (url.pathname === '/user') return Response.json({ id: 123, login: 'Alice', type: 'User' })
    if (url.pathname === '/applications/local-client/token') return new Response(null, { status: 204 })
    throw new Error('unexpected mock request')
  })
  vi.stubGlobal('fetch', fetchMock)
})
afterEach(async () => {
  await Promise.all(pending)
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('GitHub 登录流程（所有外部请求均为 mock）', () => {
  it('start 零 scope、PKCE S256、32 字节随机数、10 分钟 cookie 和固定 callback', async () => {
    const response = await begin()
    expect(response.status).toBe(302)
    secure(response)
    const url = new URL(response.headers.get('Location'))
    expect(url.origin + url.pathname).toBe('http://oauth.gh.test/login/oauth/authorize')
    expect([...url.searchParams.keys()].sort()).toEqual(['client_id', 'redirect_uri', 'state', 'code_challenge', 'code_challenge_method', 'allow_signup'].sort())
    expect(url.searchParams.get('redirect_uri')).toBe(`${origin}/api/auth/callback`)
    expect(url.searchParams.get('code_challenge_method')).toBe('S256')
    expect(url.searchParams.get('allow_signup')).toBe('true')
    const cookie = oauthCookie(response)
    expect(cookie.split('; ').slice(1)).toEqual(['Max-Age=600', 'Path=/', 'HttpOnly', 'SameSite=Lax'])
    const payload = await verify([env.SESSION_SECRET], parseCookies(cookie).bz_oauth, now)
    expect(Buffer.from(payload.state, 'base64url')).toHaveLength(32)
    expect(Buffer.from(payload.verifier, 'base64url')).toHaveLength(32)
    expect(payload.state).not.toBe(payload.verifier)
    expect(url.searchParams.get('state')).toBe(payload.state)
    expect(url.searchParams.get('code_challenge')).toBe(createHash('sha256').update(payload.verifier).digest('base64url'))
    expect(payload.exp).toBe(now + 600_000)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('callback 交换→读取→立即撤销→签会话，未知跳转参数一律忽略', async () => {
    const s = await begin()
    const state = new URL(s.headers.get('Location')).searchParams.get('state')
    const payload = await verify([env.SESSION_SECRET], parseCookies(oauthCookie(s)).bz_oauth, now)
    const response = await callback.onRequestGet(context(new Request(`${origin}/api/auth/callback?code=local-code&state=${state}&returnTo=https://evil.test&redirect=https://evil.test`, { headers: { Cookie: pair(oauthCookie(s)) } })))
    expect(response.status).toBe(302)
    expect(response.headers.get('Location')).toBe('/submit?login=ok')
    expect(calls.map((c) => [c.path, c.method])).toEqual([
      ['/login/oauth/access_token', 'POST'], ['/user', 'GET'], ['/applications/local-client/token', 'DELETE'],
    ])
    expect(calls[0].body).toMatchObject({ code_verifier: payload.verifier, redirect_uri: `${origin}/api/auth/callback`, client_id: 'local-client' })
    expect(calls[2].body.access_token === 'local-user-credential').toBe(true)
    expect(calls[2].headers.get('Authorization').startsWith('Basic ')).toBe(true)
    const cookie = sessionCookie(response)
    expect(cookie.split('; ').slice(1)).toEqual(['Max-Age=7200', 'Path=/', 'HttpOnly', 'SameSite=Strict'])
    expect(await verify([env.SESSION_SECRET], parseCookies(cookie).bz_s, now)).toEqual({ v: 1, id: 123, login: 'Alice', iat: now, exp: now + 7_200_000 })
    expect(oauthCookie(response)).toContain('Max-Age=0')
    expect(await response.text()).toBe('')
    secure(response)
  })

  it('state 不匹配清 oauth cookie，不换令牌、不签会话', async () => {
    const { result } = await finish({ state: 'wrong' })
    expect(result.headers.get('Location')).toBe('/submit?login=expired')
    expect(oauthCookie(result)).toContain('Max-Age=0')
    expect(sessionCookie(result)).toBeUndefined()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('OAuth cookie 过期或缺失 → expired', async () => {
    const s = await begin()
    const state = new URL(s.headers.get('Location')).searchParams.get('state')
    Date.now.mockReturnValue(now + 600_000)
    for (const headers of [{ Cookie: pair(oauthCookie(s)) }, {}]) {
      const response = await callback.onRequestGet(context(new Request(`${origin}/api/auth/callback?code=c&state=${state}`, { headers })))
      expect(response.headers.get('Location')).toBe('/submit?login=expired')
    }
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it.each([['access_denied', 'cancelled'], ['other_error', 'failed']])('授权错误 %s → %s，忽略 error_description', async (error, expected) => {
    const { result } = await finish({ query: `error=${error}&error_description=private-diagnostic&state=wrong` })
    expect(result.headers.get('Location')).toBe(`/submit?login=${expected}`)
    expect(oauthCookie(result)).toContain('Max-Age=0')
    expect(sessionCookie(result)).toBeUndefined()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it.each([{ id: 1, login: 'Org', type: 'Organization' }, { id: 2, login: 'Bot', type: 'Bot' }, { id: 0, login: 'Alice', type: 'User' }, { id: 123, login: '../evil', type: 'User' }])('非 User 或无效身份拒绝登录但仍撤销（%#）', async (user) => {
    fetchMock.mockResolvedValueOnce(Response.json({ access_token: 'local-user-credential' }))
      .mockResolvedValueOnce(Response.json(user))
    const { result } = await finish()
    expect(result.headers.get('Location')).toBe('/submit?login=failed')
    expect(sessionCookie(result)).toBeUndefined()
    expect(calls.at(-1).method).toBe('DELETE')
  })

  it('取用户失败也撤销；交换失败不去 /user', async () => {
    fetchMock.mockResolvedValueOnce(Response.json({ access_token: 'local-user-credential' })).mockRejectedValueOnce(new Error('private diagnostic'))
    expect((await finish()).result.headers.get('Location')).toBe('/submit?login=failed')
    expect(calls.at(-1).method).toBe('DELETE')
    fetchMock.mockResolvedValueOnce(Response.json({ error: 'bad_verification_code', error_description: 'private diagnostic' }))
    expect((await finish()).result.headers.get('Location')).toBe('/submit?login=failed')
    expect(fetchMock).toHaveBeenCalledTimes(4)
  })

  it('撤销失败仍登录，只记固定无凭据日志', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    fetchMock.mockResolvedValueOnce(Response.json({ access_token: 'local-user-credential' }))
      .mockResolvedValueOnce(Response.json({ id: 123, login: 'Alice', type: 'User' }))
      .mockRejectedValueOnce(new Error('private diagnostic'))
    const { result } = await finish()
    expect(result.headers.get('Location')).toBe('/submit?login=ok')
    expect(warn.mock.calls).toEqual([['GitHub 授权撤销未完成']])
  })

  it('生产忽略测试根地址，oauth/session 都使用 __Host- 和 Secure', async () => {
    env.ALLOW_TEST_ENDPOINTS = undefined
    const { response, location, result } = await finish()
    expect(location.origin).toBe('https://github.com')
    expect(oauthCookie(response)).toMatch(/^__Host-bz_oauth=/)
    expect(oauthCookie(response)).toContain('; Secure;')
    expect(sessionCookie(result)).toMatch(/^__Host-bz_s=/)
    expect(sessionCookie(result)).toContain('; Secure;')
    expect(cookies(result)).toHaveLength(2)
  })

  it('每 IP 小时第 21 次直接跳 failed&retry；只存加盐哈希', async () => {
    for (let i = 0; i < 20; i++) expect((await begin()).headers.get('Location')).toContain('/login/oauth/authorize?')
    const response = await begin()
    expect(response.headers.get('Location')).toBe('/submit?login=failed&retry=3600')
    expect(cookies(response)).toHaveLength(0)
    const rows = (await db.prepare('SELECT * FROM rate_limits').all()).results
    expect(rows).toHaveLength(1)
    expect(rows[0].key).toMatch(/^[a-f0-9]{64}$/)
    expect(JSON.stringify(rows)).not.toContain('192.0.2.1')
    expect(rows[0].n).toBe(21)
  })

  it('登录的 X-Test-IP 仅受 ALLOW_TEST_ENDPOINTS=1 控制，IPv6 /64 合桶', async () => {
    await begin(env, { 'X-Test-IP': '2001:db8:1:2::1' })
    await begin(env, { 'X-Test-IP': '2001:db8:1:2::2' })
    env.ALLOW_TEST_ENDPOINTS = undefined
    env.ALLOW_TEST_IP = '1'
    await begin(env, { 'X-Test-IP': '192.0.2.2' })
    await begin(env, { 'X-Test-IP': '192.0.2.3' })
    expect((await db.prepare('SELECT n FROM rate_limits').all()).results).toEqual([{ n: 2 }, { n: 2 }])
  })

  it('me 有效会话只回身份；轮换可用、篡改/过期/缺失回 401', async () => {
    const { result } = await finish()
    const cookie = pair(sessionCookie(result))
    const request = (value) => new Request(`${origin}/api/auth/me`, { headers: { Cookie: value } })
    const ok = await me.onRequestGet(context(request(cookie)))
    expect(await ok.json()).toEqual({ ok: true, id: 123, login: 'Alice' })
    secure(ok)
    expect((await me.onRequestGet(context(request(cookie), { ...env, SESSION_SECRET: 'n'.repeat(40), SESSION_SECRET_PREV: env.SESSION_SECRET }))).status).toBe(200)
    for (const value of ['', cookie + 'x']) {
      const response = await me.onRequestGet(context(request(value)))
      expect(response.status).toBe(401)
      expect((await response.json()).error).toBe('unauthenticated')
    }
    Date.now.mockReturnValue(now + 7_200_000)
    expect((await me.onRequestGet(context(request(cookie)))).status).toBe(401)
  })

  it('logout 204 清两枚 cookie，不需要有效会话；跨站、same-site 均拒绝', async () => {
    const post = (headers) => logout.onRequestPost(context(new Request(`${origin}/api/auth/logout`, { method: 'POST', headers })))
    const response = await post({ Origin: origin, 'Sec-Fetch-Site': 'same-origin' })
    expect(response.status).toBe(204)
    expect(await response.text()).toBe('')
    expect(cookies(response)).toHaveLength(2)
    for (const cookie of cookies(response)) expect(cookie).toContain('Max-Age=0')
    secure(response)
    for (const headers of [{ Origin: 'https://evil.test' }, { 'Sec-Fetch-Site': 'same-site' }, { 'Sec-Fetch-Site': 'cross-site' }]) {
      const denied = await post(headers)
      expect(denied.status).toBe(403)
      expect((await denied.json()).error).toBe('forbidden_origin')
    }
  })

  it.each(['SUBMIT_REPO', 'GITHUB_APP_ID', 'GITHUB_APP_INSTALLATION_ID', 'GITHUB_APP_BOT_LOGIN', 'GITHUB_APP_PRIVATE_KEY', 'OAUTH_CLIENT_ID', 'OAUTH_CLIENT_SECRET', 'SESSION_SECRET', 'IP_SALT'])('缺必需配置 %s → 四接口 503，不请求 GitHub', async (key) => {
    const bindings = { ...env, [key]: '' }
    for (const [handler, path, method] of [[start.onRequestGet, 'start', 'GET'], [callback.onRequestGet, 'callback', 'GET'], [me.onRequestGet, 'me', 'GET'], [logout.onRequestPost, 'logout', 'POST']]) {
      const response = await handler(context(new Request(`${origin}/api/auth/${path}`, { method }), bindings))
      expect(response.status).toBe(503)
      expect((await response.json()).error).toBe('submit_disabled')
      secure(response)
    }
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('SESSION_SECRET 不足 32 字节关闭登录；线上不依赖测试开关和可选变量', async () => {
    expect((await begin({ ...env, SESSION_SECRET: 'short' })).status).toBe(503)
    expect((await begin({ ...env, ALLOW_TEST_ENDPOINTS: undefined, SESSION_SECRET_PREV: undefined, SUBMIT_DRY_RUN_USER_IDS: undefined })).status).toBe(302)
  })

  it.each([[start, 'start', 'GET'], [callback, 'callback', 'GET'], [me, 'me', 'GET'], [logout, 'logout', 'POST']])('%s 非支持方法包括 OPTIONS/HEAD → 405 无 CORS', async (module, path, allow) => {
    for (const method of ['OPTIONS', 'HEAD', 'PUT']) {
      const response = await module.onRequest(context(new Request(`${origin}/api/auth/${path}`, { method })))
      expect(response.status).toBe(405)
      expect(response.headers.get('Allow')).toBe(allow)
      secure(response)
    }
  })
})

describe('本地变量补齐脚本（只操作临时副本）', () => {
  it('不存在就创建；已有值包括空值不覆盖，只追加缺失键且不打印值，重复执行幂等', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'bz-devvars-'))
    try {
      await mkdir(join(dir, 'scripts/lib'), { recursive: true })
      await copyFile(join(root, 'scripts/ensure-dev-vars.mjs'), join(dir, 'scripts/ensure-dev-vars.mjs'))
      await writeFile(join(dir, 'scripts/lib/load-bots.mjs'), `export const ROOT = ${JSON.stringify(dir)}\n`)
      await copyFile(join(root, '.dev.vars.example'), join(dir, '.dev.vars.example'))
      const run = () => execFileSync(process.execPath, ['scripts/ensure-dev-vars.mjs'], { cwd: dir, encoding: 'utf8', timeout: 10_000 })
      run()
      expect(await readFile(join(dir, '.dev.vars'), 'utf8')).toBe(await readFile(join(dir, '.dev.vars.example'), 'utf8'))
      const existing = '# local\nSESSION_SECRET=preserve-existing\nOAUTH_CLIENT_SECRET=\nexport IP_SALT=preserve-salt'
      await writeFile(join(dir, '.dev.vars'), existing)
      const output = run()
      const result = await readFile(join(dir, '.dev.vars'), 'utf8')
      expect(result.startsWith(existing + '\n')).toBe(true)
      expect((result.match(/^SESSION_SECRET=/gm) || [])).toHaveLength(1)
      expect(result).toContain('ALLOW_TEST_ENDPOINTS=1')
      expect(output).toContain('ALLOW_TEST_ENDPOINTS')
      expect(output).not.toMatch(/preserve-existing|local-fake|preserve-salt|127\.0\.0\.1/)
      expect(run()).toBe('')
      expect(await readFile(join(dir, '.dev.vars'), 'utf8')).toBe(result)
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })
})
