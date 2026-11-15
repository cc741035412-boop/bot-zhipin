import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as status from '../../functions/api/submit/status.ts'
import * as callback from '../../functions/api/auth/callback.ts'
import { sign } from '../../functions/_lib/session.ts'
import { GitHubError } from '../../functions/_lib/github.ts'
const gh = vi.hoisted(() => ({ getPr: vi.fn(), getChecks: vi.fn(), getReviews: vi.fn(), compare: vi.fn() }))
vi.mock('../../functions/_lib/github.ts', async (original) => ({ ...await original(), createGitHub: () => gh }))
const origin = 'https://site.test', merge = 'c'.repeat(40)
let env, pr, count
const ctx = (request) => ({ request, env, waitUntil() {} })
const get = (query = 'pr=7') => status.onRequestGet(ctx(new Request(`${origin}/api/submit/status?${query}`)))
beforeEach(() => {
  vi.spyOn(Math, 'random').mockReturnValue(0.5)
  count = 1
  const cached = new Map()
  vi.spyOn(Date, 'now').mockReturnValue(1_800_000_000_000)
  env = { SESSION_SECRET: 's'.repeat(40), IP_SALT: 'local', ALLOW_TEST_ENDPOINTS: '1', SUBMIT_REPO: 'owner/repo',
    GITHUB_APP_ID: '1', GITHUB_APP_INSTALLATION_ID: '1', GITHUB_APP_BOT_LOGIN: 'local[bot]', GITHUB_APP_PRIVATE_KEY: 'local-mock', OAUTH_CLIENT_ID: 'local', OAUTH_CLIENT_SECRET: 'local',
    GITHUB_API_BASE: 'http://api.gh.test', GITHUB_OAUTH_BASE: 'http://oauth.gh.test',
    DB: { prepare: (sql) => ({ bind: (...args) => ({
      first: async () => sql.includes('FROM pr_status') ? cached.get(args[0]) ?? null : { n: count, bytes: 0 },
      run: async () => { cached.set(args[0], { body: args[1], fetched_at: args[2] }); return {} },
    }) }) },
    ASSETS: { fetch: vi.fn(async () => Response.json({ commit: merge, builtAt: 'now' })) },
  }
  pr = { number: 7, html_url: 'https://github.test/pull/7', state: 'open', merged: false, merge_commit_sha: merge, head: { ref: 'submission/web-123-status-demo', sha: 'd'.repeat(40) } }
  gh.getPr.mockReset().mockImplementation(async () => pr)
  gh.getChecks.mockReset().mockResolvedValue({ check_runs: [{ name: 'validate-and-build', status: 'completed', conclusion: 'success' }] })
  gh.getReviews.mockReset().mockResolvedValue([])
  gh.compare.mockReset().mockResolvedValue({ status: 'behind' })
})
afterEach(() => vi.restoreAllMocks())

describe('投稿状态七态', () => {
  it.each(['checking', 'failed', 'waiting_review', 'approved', 'merged', 'live', 'closed'])('%s', async (state) => {
    if (state === 'checking') gh.getChecks.mockResolvedValue({ check_runs: [] })
    if (state === 'failed') gh.getChecks.mockResolvedValue({ check_runs: [{ name: 'validate-and-build', status: 'completed', conclusion: 'failure' }] })
    if (state === 'approved') gh.getReviews.mockResolvedValue([{ id: 1, user: { login: 'Owner' }, state: 'APPROVED', submitted_at: '2026-11-14' }])
    if (['merged', 'live'].includes(state)) { pr.merged = true; pr.state = 'closed' }
    if (state === 'merged') env.ASSETS.fetch.mockResolvedValue(Response.json({ commit: 'b'.repeat(40), builtAt: 'old' }))
    if (state === 'closed') pr.state = 'closed'
    const res = await get()
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true, state, checks: ['waiting_review', 'approved', 'merged', 'live'].includes(state) ? 'success' : state === 'failed' ? 'failure' : 'pending', slug: 'status-demo', url: pr.html_url, liveUrl: state === 'live' ? `${origin}/bots/status-demo` : null })
  })
  it('部署在 merge 之后也 live，compare 方向是 merge...部署', async () => {
    pr.merged = true
    env.ASSETS.fetch.mockResolvedValue(Response.json({ commit: 'e'.repeat(40), builtAt: 'now' }))
    gh.compare.mockResolvedValue({ status: 'ahead' })
    expect((await (await get()).json()).state).toBe('live')
    expect(gh.compare).toHaveBeenCalledWith(merge, 'e'.repeat(40))
    expect(String(env.ASSETS.fetch.mock.calls[0][0])).toBe(`${origin}/api-data/build.json`)
  })
  it('dismissed/re-request changes 撤销批准；COMMENTED 不撤销', async () => {
    const base = { user: { login: 'Owner' }, submitted_at: '2026-11-14' }
    gh.getReviews.mockResolvedValue([{ ...base, id: 1, state: 'APPROVED' }, { ...base, id: 2, state: 'DISMISSED' }])
    expect((await (await get()).json()).state).toBe('waiting_review')
    Date.now.mockReturnValue(Date.now() + 120_000) // Refresh only after the new status cache expires.
    gh.getReviews.mockResolvedValue([{ ...base, id: 1, state: 'APPROVED' }, { ...base, id: 2, state: 'COMMENTED' }])
    expect((await (await get()).json()).state).toBe('approved')
  })
  it.each(['feature/a', 'submission/web-x-demo', 'submission/web-1-demo/extra', 'submission/issue-1/extra'])('head 非白名单 %s → 404', async (branch) => {
    pr.head.ref = branch
    expect((await get()).status).toBe(404); expect(gh.getChecks).not.toHaveBeenCalled()
  })
  it('issue 分支允许且 slug/liveUrl 可以 null', async () => {
    pr.head.ref = 'submission/issue-42'; pr.merged = true
    expect(await (await get()).json()).toMatchObject({ state: 'live', slug: null, liveUrl: null })
  })
  it.each(['', 'pr=0', 'pr=-1', 'pr=01', 'pr=1.5', 'pr=1e2', 'pr=1000000000', 'pr=1&pr=2'])('PR 参数严格 1–9 位正整数：%s', async (query) => {
    expect((await get(query)).status).toBe(400); expect(gh.getPr).not.toHaveBeenCalled()
  })
  it('第 31 次返回 429；缺配置 503；OPTIONS 405', async () => {
    count = 31
    const res = await get(); expect(res.status).toBe(429); expect(res.headers.has('Retry-After')).toBe(true)
    env.SESSION_SECRET = ''
    expect((await get()).status).toBe(503)
    expect((await status.onRequest(ctx(new Request(origin, { method: 'OPTIONS' })))).status).toBe(405)
  })
  it('GitHub 404 映射 not_found，其他错误 502 隐去原文', async () => {
    gh.getPr.mockRejectedValue(new GitHubError(404))
    expect((await get()).status).toBe(404)
    gh.getPr.mockRejectedValue(new GitHubError(500))
    const res = await get(); expect(res.status).toBe(502)
    expect(await res.json()).toMatchObject({ error: 'github_error', requestId: expect.stringMatching(/^[a-f0-9]{8}$/) })
  })
  it('坏 build 数据不误报 live', async () => {
    pr.merged = true; env.ASSETS.fetch.mockResolvedValue(Response.json({}))
    expect((await get()).status).toBe(500)
  })
  it('完整 OAuth 字段也不能用 t=s/r 或缺用途的载荷登录', async () => {
    for (const t of ['s', 'r', undefined]) {
      const state = 'a'.repeat(43)
      const value = await sign(env.SESSION_SECRET, { t, state, verifier: 'b'.repeat(43), exp: Date.now() + 600000 })
      const res = await callback.onRequestGet(ctx(new Request(`${origin}/api/auth/callback?code=local&state=${state}`, { headers: { Cookie: `bz_oauth=${value}` } })))
      expect(res.headers.get('Location')).toBe('/submit?login=expired')
    }
  })
})
