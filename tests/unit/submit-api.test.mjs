import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import * as shot from '../../functions/api/submit/screenshot.ts'
import * as submit from '../../functions/api/submit/index.ts'
import { loadSubmitContext } from '../../functions/_lib/context.ts'
import { sessionSetCookie, readSession, sign } from '../../functions/_lib/session.ts'
import { SCHEMA_SHA256 } from '../../scripts/lib/validate/generated/bot-schema.mjs'
import { GitHubError } from '../../functions/_lib/github.ts'

const gh = vi.hoisted(() => ({ createBlob: vi.fn() }))
vi.mock('../../functions/_lib/github.ts', async (original) => ({ ...await original(), createGitHub: () => gh }))
const origin = 'https://site.test', now = Date.parse('2026-11-14T00:00:00Z')
const png = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13])
let env, cookie, counts, seen, pending
const ctx = (request) => ({ request, env, waitUntil: (p) => pending.push(p) })
const request = (body = png, headers = {}, path = 'screenshot') => new Request(`${origin}/api/submit${path ? '/' + path : ''}`, {
  method: 'POST', headers: { Origin: origin, Cookie: cookie, 'Content-Type': 'image/png', 'Content-Length': String(body.length), ...headers }, body,
})
beforeEach(async () => {
  vi.spyOn(Math, 'random').mockReturnValue(0.5)
  vi.spyOn(Date, 'now').mockReturnValue(now)
  counts = {}; seen = []; pending = []
  env = {
    SESSION_SECRET: 's'.repeat(40), IP_SALT: 'local', ALLOW_TEST_ENDPOINTS: '1', SUBMIT_REPO: 'owner/repo',
    GITHUB_API_BASE: 'http://api.gh.test', GITHUB_OAUTH_BASE: 'http://oauth.gh.test',
    GITHUB_APP_ID: '1', GITHUB_APP_INSTALLATION_ID: '1', GITHUB_APP_BOT_LOGIN: 'local[bot]', GITHUB_APP_PRIVATE_KEY: 'local-mock', OAUTH_CLIENT_ID: 'local', OAUTH_CLIENT_SECRET: 'local',
    DB: { prepare: () => ({ bind: (...args) => ({ first: async () => { seen.push(args); return counts[args[0]] || { n: 1, bytes: args[3] } } }) }) },
  }
  cookie = (await sessionSetCookie(env, { id: 123, login: 'Alice' }, now)).split(';')[0]
  gh.createBlob.mockReset().mockResolvedValue('b'.repeat(40))
})
afterEach(async () => { await Promise.all(pending); vi.restoreAllMocks(); vi.unstubAllGlobals() })
const secure = (res) => {
  expect(res.headers.get('Cache-Control')).toBe('no-store')
  expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff')
  expect(res.headers.get('Content-Security-Policy')).toBe("frame-ancestors 'none'")
  expect(res.headers.has('Access-Control-Allow-Origin')).toBe(false)
}

describe('截图和提交 HTTP 边界', () => {
  it.each([[{}, 200], [{ Cookie: '' }, 401], [{ Origin: 'https://evil.test' }, 403], [{ 'Sec-Fetch-Site': 'same-site' }, 403], [{ 'Content-Type': 'text/plain' }, 415], [{ 'Content-Type': 'image/jpeg' }, 415], [{ 'Content-Length': '2097153' }, 413], [{ 'Content-Length': '-1' }, 413]])('截图响应 %j → %s', async (headers, code) => {
    const res = await shot.onRequestPost(ctx(request(png, headers)))
    expect(res.status).toBe(code); secure(res)
    if (code !== 200) expect(gh.createBlob).not.toHaveBeenCalled()
  })
  it('缺少长度 413；谎报偏小长度或实际分块超过 2MB 立即取消', async () => {
    const req = request(); req.headers.delete('Content-Length')
    expect((await shot.onRequestPost(ctx(req))).status).toBe(413)
    const cancel = vi.fn()
    const streamed = { url: origin + '/api/submit/screenshot', headers: request().headers,
      body: new ReadableStream({ start(c) { c.enqueue(new Uint8Array(2097153)) }, cancel }) }
    expect((await shot.onRequestPost(ctx(streamed))).status).toBe(413)
    expect(cancel).toHaveBeenCalled(); expect(gh.createBlob).not.toHaveBeenCalled()
  })
  it.each(['shot', 'shot-all'])('%s 限额返回 429 和 Retry-After，不上传 blob', async (bucket) => {
    counts[bucket] = { n: bucket === 'shot' ? 61 : 1001, bytes: 0 }
    const res = await shot.onRequestPost(ctx(request()))
    expect(res.status).toBe(429); expect(Number(res.headers.get('Retry-After'))).toBeGreaterThan(0)
    expect((await res.json()).retryAfter).toBeGreaterThan(0)
    expect(gh.createBlob).not.toHaveBeenCalled()
  })
  it('按实际字节扣除，60MB 字节配额也会拒绝', async () => {
    counts.shot = { n: 1, bytes: 60 * 1024 * 1024 + 1 }
    expect((await shot.onRequestPost(ctx(request()))).status).toBe(429)
    expect(seen[0][3]).toBe(png.length)
  })
  it('成功签回执且仅测试环境输出 base64 实现头', async () => {
    const res = await shot.onRequestPost(ctx(request()))
    expect(res.headers.get('X-Base64-Impl')).toMatch(/^(native|buffer)$/)
    expect(await res.json()).toMatchObject({ ok: true, sha: 'b'.repeat(40), size: png.length, format: 'png', exp: now + 86400000, receipt: expect.any(String) })
    env.ALLOW_TEST_ENDPOINTS = undefined
    cookie = (await sessionSetCookie(env, { id: 123, login: 'Alice' }, now)).split(';')[0]
    expect((await shot.onRequestPost(ctx(request()))).headers.has('X-Base64-Impl')).toBe(false)
  })
  it('高位 ASCII 伪 GIF 魔数不能蒙混过关', async () => {
    const bytes = Uint8Array.from(Buffer.from('GIF89a'), (b) => b | 128)
    expect((await shot.onRequestPost(ctx(request(bytes, { 'Content-Type': 'image/gif' })))).status).toBe(415)
  })
  it('GitHub 错误转 502、8 位 requestId，不回显也不记录上游原文', async () => {
    const error = new GitHubError(500); error.message = 'private-upstream-diagnostic'
    gh.createBlob.mockRejectedValue(error)
    const log = vi.spyOn(console, 'error')
    const res = await shot.onRequestPost(ctx(request()))
    expect(res.status).toBe(502)
    const data = await res.json()
    expect(data).toMatchObject({ error: 'github_error', requestId: expect.stringMatching(/^[a-f0-9]{8}$/) })
    expect(JSON.stringify(data)).not.toContain(error.message); expect(log).not.toHaveBeenCalled()
  })
  it.each([[{}, 400], [{ Cookie: '' }, 401], [{ Origin: 'https://evil.test' }, 403], [{ 'Content-Type': 'text/plain' }, 415], [{ 'Content-Length': String(700 * 1024 + 1) }, 413]])('提交 HTTP 解析 %j → %s', async (headers, status) => {
    const res = await submit.onRequestPost(ctx(request('{}', { 'Content-Type': 'application/json', ...headers }, '')))
    expect(res.status).toBe(status); secure(res)
  })
  it('提交无 Content-Length 仍流式限制 700KB，取消后续读取', async () => {
    const cancel = vi.fn(), headers = request().headers
    headers.set('Content-Type', 'application/json'); headers.delete('Content-Length')
    const body = new ReadableStream({ start(c) { c.enqueue(new Uint8Array(700 * 1024 + 1)) }, cancel })
    expect((await submit.onRequestPost(ctx({ url: origin + '/api/submit', headers, body }))).status).toBe(413)
    expect(cancel).toHaveBeenCalled()
  })
  it('OPTIONS 等非支持方法 405，不发 CORS', async () => {
    for (const module of [shot, submit]) {
      const res = await module.onRequest(ctx(new Request(origin, { method: 'OPTIONS' })))
      expect(res.status).toBe(405); secure(res); expect(res.headers.get('Allow')).toBe('POST')
    }
  })
  it('用途混淆：具有完整会话字段但 t=o/r 或缺省均拒绝', async () => {
    for (const t of ['o', 'r', undefined]) {
      const value = await sign(env.SESSION_SECRET, { t, v: 1, id: 123, login: 'Alice', iat: now, exp: now + 7200000 })
      expect(await readSession({ headers: new Headers({ Cookie: `bz_s=${value}` }) }, env, now)).toBeNull()
    }
  })
})

function contextData() {
  const files = Object.fromEntries(['bot.yaml', 'ROLE.md', 'DESIGN.md', 'skills/example-skill/SKILL.md'].map((rel) => [rel, readFileSync(new URL(`../../bots/_template/${rel}`, import.meta.url), 'utf8')]))
  return { v: 1, commit: 'local', schemaSha256: SCHEMA_SHA256, index: [], template: { files }, copy: { permissions: {}, quota: {} }, limits: { files: 30, fileBytes: 102400, totalBytes: 409600, imageBytes: 2097152 } }
}
describe('workerd 请求兼容性', () => {
  it('不支持 error redirect 时使用 manual，3xx 不跟随、不回显上游内容', async () => {
    const RealRequest = Request
    vi.stubGlobal('Request', class extends RealRequest {
      constructor(input, init) {
        if (init?.redirect === 'error') throw new TypeError('Unsupported redirect mode')
        super(input, init)
      }
    })
    vi.resetModules()
    const { createGitHub } = await vi.importActual('../../functions/_lib/github.ts')
    const fetch = vi.fn(async () => new Response('private redirect detail', { status: 302, headers: { Location: 'https://other.test' } }))
    vi.stubGlobal('fetch', fetch)
    await expect(createGitHub(env).getUser('local-test-only')).rejects.toMatchObject({ status: 302, message: 'GitHub request failed' })
    expect(fetch).toHaveBeenCalledOnce()
    expect(fetch.mock.calls[0][1].redirect).toBe('manual')
  })
})

describe('构建上下文', () => {
  it('按 binding/origin 缓存 60 秒；坏数据抛 500，不用过期数据', async () => {
    const assets = { fetch: vi.fn(async () => Response.json(contextData())) }
    const a = await loadSubmitContext(assets, origin, now)
    expect(await loadSubmitContext(assets, origin, now + 59999)).toBe(a)
    expect(assets.fetch).toHaveBeenCalledTimes(1)
    await loadSubmitContext(assets, 'https://other.test', now)
    expect(assets.fetch).toHaveBeenCalledTimes(2)
    assets.fetch.mockResolvedValue(Response.json({ v: 1 }))
    await expect(loadSubmitContext(assets, origin, now + 60000)).rejects.toMatchObject({ status: 500 })
    assets.fetch.mockImplementation(async () => Response.json(contextData()))
    expect(await loadSubmitContext(assets, origin, now + 60001)).not.toBe(a)
  })
  it.each(['schema', 'limits', 'template', 'index', 'http'])('坏的 %s 上下文必须失败', async (kind) => {
    const data = contextData()
    if (kind === 'schema') data.schemaSha256 = 'wrong'
    if (kind === 'limits') data.limits.files = 300
    if (kind === 'template') data.template.files['ROLE.md'] = null
    if (kind === 'index') data.index = [{ slug: '../bad', templateUrl: 'x' }]
    const assets = { fetch: async () => kind === 'http' ? new Response('', { status: 500 }) : Response.json(data) }
    await expect(loadSubmitContext(assets, origin, now)).rejects.toMatchObject({ status: 500 })
  })
})
