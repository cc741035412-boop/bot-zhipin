import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { generateKeyPairSync, verify as verifySignature } from 'node:crypto'
import { Buffer } from 'node:buffer'
import { toBase64 } from '../../functions/_lib/bytes.ts'

let privateKey, publicKey, createGitHub, GitHubError, SUBMISSION_BRANCH_RE, env, fetchMock, calls
const sha = 'a'.repeat(40)
const branch = 'submission/web-123-demo-bot'
const now = 1_800_000_000_000
beforeAll(() => {
  const keys = generateKeyPairSync('rsa', { modulusLength: 2048 })
  privateKey = keys.privateKey.export({ type: 'pkcs8', format: 'pem' })
  publicKey = keys.publicKey
})
beforeEach(async () => {
  vi.resetModules()
  ;({ createGitHub, GitHubError, SUBMISSION_BRANCH_RE } = await import('../../functions/_lib/github.ts'))
  vi.spyOn(Date, 'now').mockReturnValue(now)
  env = {
    ALLOW_TEST_ENDPOINTS: '1', GITHUB_API_BASE: 'http://api.gh.test', GITHUB_OAUTH_BASE: 'http://oauth.gh.test',
    SUBMIT_REPO: 'owner/repo', GITHUB_APP_ID: '42', GITHUB_APP_INSTALLATION_ID: '777',
    GITHUB_APP_PRIVATE_KEY: privateKey, OAUTH_CLIENT_ID: 'client', OAUTH_CLIENT_SECRET: 'local-fake',
  }
  calls = []
  fetchMock = vi.fn(async (input, init = {}) => {
    const url = new URL(String(input))
    calls.push({ url, ...init, headers: new Headers(init.headers), body: init.body ? JSON.parse(init.body) : undefined })
    if (url.pathname === '/app/installations/777/access_tokens') {
      return Response.json({ token: 'local-installation', expires_at: new Date(Date.now() + 3_600_000).toISOString() }, { status: 201 })
    }
    return Response.json({ sha }, { status: 201 })
  })
  vi.stubGlobal('fetch', fetchMock)
})
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals() })
const tokenCalls = () => calls.filter((call) => call.url.pathname.startsWith('/app/installations/'))
const repoCalls = () => calls.filter((call) => call.url.pathname.startsWith('/repos/'))

describe('受限 GitHub 客户端', () => {
  it('仅暴露约定的 19 个操作，不暴露通用 request', () => {
    const gh = createGitHub(env)
    expect(Object.keys(gh).sort()).toEqual(['exchangeCode', 'getUser', 'revokeToken', 'installationToken', 'createBlob', 'getRef', 'getCommit', 'getContent', 'createTree', 'createCommit', 'upsertRef', 'findOpenPr', 'createPr', 'updatePr', 'enableAutoMerge', 'getPr', 'getChecks', 'getReviews', 'compare'].sort())
    expect(gh.request).toBeUndefined()
  })

  it.each(['submission/web-1-x', 'submission/web-123-demo-bot', `submission/web-${'9'.repeat(20)}-a0`])('分支正例：%s', (value) => {
    expect(SUBMISSION_BRANCH_RE.test(value)).toBe(true)
  })

  it.each(['main', 'refs/heads/main', 'submission/issue-1', 'submission/web-0-x', 'submission/web-01-x', 'submission/web-1-', 'submission/web-1-Bad', 'submission/web-1-a--b', 'submission/web-1-a-', 'submission/web-1-a/b', 'submission/web-1-a_b', `submission/web-${'9'.repeat(21)}-x`])('分支反例且写前拒绝：%s', async (value) => {
    expect(SUBMISSION_BRANCH_RE.test(value)).toBe(false)
    await expect(createGitHub(env).upsertRef(value, sha)).rejects.toBeInstanceOf(GitHubError)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('安装令牌 JWT 为可验的 RS256/PKCS#8，权限和仓库降权，跨实例缓存', async () => {
    const gh = createGitHub(env)
    await Promise.all([gh.installationToken(), gh.installationToken(), createGitHub(env).createBlob(new Uint8Array([1, 2, 3]))])
    expect(tokenCalls()).toHaveLength(1)
    const call = tokenCalls()[0]
    expect(call.body).toEqual({ repositories: ['repo'], permissions: { contents: 'write', pull_requests: 'write' } })
    const [header, payload, signature] = call.headers.get('Authorization').slice(7).split('.')
    expect(JSON.parse(Buffer.from(header, 'base64url'))).toEqual({ alg: 'RS256', typ: 'JWT' })
    expect(JSON.parse(Buffer.from(payload, 'base64url'))).toEqual({ iat: now / 1000 - 60, exp: now / 1000 + 540, iss: '42' })
    expect(verifySignature('RSA-SHA256', Buffer.from(`${header}.${payload}`), publicKey, Buffer.from(signature, 'base64url'))).toBe(true)
    for (const sent of calls) {
      expect(sent.headers.get('Accept')).toBe('application/vnd.github+json')
      expect(sent.headers.get('X-GitHub-Api-Version')).toBe('2022-11-28')
      expect(sent.headers.get('User-Agent')).toBe('bot-zhipin-submit')
      expect(sent.redirect).toBe('error')
    }
  })

  it('缓存最多 50 分钟，到期前 10 分钟即刷新', async () => {
    const gh = createGitHub(env)
    await gh.installationToken()
    Date.now.mockReturnValue(now + 50 * 60_000 - 1)
    await gh.installationToken()
    expect(tokenCalls()).toHaveLength(1)
    Date.now.mockReturnValue(now + 50 * 60_000)
    await gh.installationToken()
    expect(tokenCalls()).toHaveLength(2)
  })

  it('即使服务端给很长有效期，缓存仍不得超过 50 分钟', async () => {
    fetchMock.mockResolvedValueOnce(Response.json({ token: 'long-lived', expires_at: new Date(now + 86_400_000).toISOString() }))
    const gh = createGitHub(env)
    await gh.installationToken()
    Date.now.mockReturnValue(now + 50 * 60_000)
    await gh.installationToken()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('短期安装令牌提前刷新，仓库与 API 不串缓存', async () => {
    fetchMock.mockResolvedValueOnce(Response.json({ token: 'short-lived', expires_at: new Date(now + 20 * 60_000).toISOString() }))
    const gh = createGitHub(env)
    await gh.installationToken()
    Date.now.mockReturnValue(now + 10 * 60_000)
    await gh.installationToken()
    expect(fetchMock).toHaveBeenCalledTimes(2)
    await createGitHub({ ...env, SUBMIT_REPO: 'owner/other' }).installationToken()
    await createGitHub({ ...env, GITHUB_API_BASE: 'http://other.test' }).installationToken()
    expect(fetchMock).toHaveBeenCalledTimes(4)
  })

  it('安装请求失败不缓存；随后可以重新申请', async () => {
    fetchMock.mockRejectedValueOnce(new Error('private network detail'))
    const gh = createGitHub(env)
    await expect(gh.installationToken()).rejects.toMatchObject({ status: 502, message: 'GitHub request failed' })
    await gh.installationToken()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('非测试模式忽略自定义根地址，且每次读取 globalThis.fetch', async () => {
    const gh = createGitHub({ ...env, ALLOW_TEST_ENDPOINTS: undefined, GITHUB_API_BASE: 'https://evil.test', GITHUB_OAUTH_BASE: 'https://evil.test' })
    const first = vi.fn(async () => Response.json({ id: 123, login: 'Alice', type: 'User' }))
    vi.stubGlobal('fetch', first)
    await gh.getUser('local-user')
    expect(first.mock.calls[0][0]).toBe('https://api.github.com/user')
    const next = vi.fn(async () => Response.json({ access_token: 'local-user', token_type: 'bearer' }))
    vi.stubGlobal('fetch', next)
    await gh.exchangeCode({ code: 'code', redirectUri: 'https://site.test/api/auth/callback', verifier: 'verifier' })
    expect(next.mock.calls[0][0]).toBe('https://github.com/login/oauth/access_token')
    expect(first).toHaveBeenCalledOnce()
  })

  it.each(['../outside/repo', 'owner/../user', 'owner/repo/../../user', 'https://evil.test/repo', 'owner/repo?x=1', 'owner/repo%2f..', 'owner/.'])('仓库白名单拒绝目标注入：%s', (SUBMIT_REPO) => {
    expect(() => createGitHub({ ...env, SUBMIT_REPO })).toThrow(GitHubError)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it.each(['https://evil.test/path', 'https://user:pass@evil.test', 'file:///tmp/foo', 'http://api.gh.test/#fragment'])('测试地址也不得夹路径/凭据/非 HTTP：%s', (GITHUB_API_BASE) => {
    if (GITHUB_API_BASE.startsWith('file:')) {
      expect(() => createGitHub({ ...env, GITHUB_API_BASE })).toThrowError(expect.objectContaining({ status: 503, code: 'submit_disabled' }))
    } else expect(() => createGitHub({ ...env, GITHUB_API_BASE })).toThrow(GitHubError)
  })

  it('每个带路径的读取方法拒绝白名单外 URL/编码穿越，不先申请令牌', async () => {
    const gh = createGitHub(env)
    for (const value of ['../../../../user', 'https://evil.test/user', '%2e%2e/user', 'a\\b', '/absolute', 'a?query']) {
      for (const action of [() => gh.getRef(value), () => gh.getCommit(value), () => gh.getContent(value, 'main'), () => gh.getChecks(value), () => gh.compare('main', value)]) {
        await expect(action()).rejects.toBeInstanceOf(GitHubError)
      }
    }
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('上游重定向、异常、错误响应的原文都不会进入错误消息', async () => {
    const gh = createGitHub(env)
    fetchMock.mockResolvedValueOnce(new Response('private diagnostic', { status: 302, headers: { Location: 'https://evil.test' } }))
    await expect(gh.getUser('local-user')).rejects.toMatchObject({ status: 302, message: 'GitHub request failed' })
    fetchMock.mockRejectedValueOnce(new Error('private network diagnostic'))
    await expect(gh.getUser('local-user')).rejects.toMatchObject({ status: 502, message: 'GitHub request failed' })
    fetchMock.mockResolvedValueOnce(new Response('private diagnostic', { status: 401 }))
    await expect(gh.getUser('local-user')).rejects.toMatchObject({ status: 401, message: 'GitHub request failed' })
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  it('OAuth 交换、读取用户、Basic 撤销都是固定端点', async () => {
    fetchMock.mockImplementation(async (url, init) => {
      calls.push({ url: new URL(url), ...init, headers: new Headers(init.headers), body: init.body ? JSON.parse(init.body) : undefined })
      if (url.endsWith('/access_token')) return Response.json({ access_token: 'local-user', token_type: 'bearer' })
      if (url.endsWith('/user')) return Response.json({ id: 123, login: 'Alice', type: 'User' })
      return new Response(null, { status: 204 })
    })
    const gh = createGitHub(env)
    const token = await gh.exchangeCode({ code: 'code', redirectUri: 'https://site.test/api/auth/callback', verifier: 'verifier' })
    await gh.getUser(token)
    await gh.revokeToken(token)
    expect(calls.map((c) => [c.url.href, c.method])).toEqual([
      ['http://oauth.gh.test/login/oauth/access_token', 'POST'], ['http://api.gh.test/user', 'GET'], ['http://api.gh.test/applications/client/token', 'DELETE'],
    ])
    expect(calls[0].headers.get('Accept')).toBe('application/json')
    expect(calls[0].body).toEqual({ client_id: 'client', client_secret: 'local-fake', code: 'code', redirect_uri: 'https://site.test/api/auth/callback', code_verifier: 'verifier' })
    expect(calls[2].headers.get('Authorization') === `Basic ${Buffer.from('client:local-fake').toString('base64')}`).toBe(true)
    expect(calls[2].body.access_token === token).toBe(true)
  })

  it('createBlob 返回 sha，tree/commit 映射字段且不设置 committer', async () => {
    const gh = createGitHub(env)
    expect(await gh.createBlob(new Uint8Array([1, 2, 3]))).toBe(sha)
    const entries = [{ path: 'ROLE.md', mode: '100644', type: 'blob', content: '你好' }]
    expect(await gh.createTree({ entries })).toBe(sha)
    expect(await gh.createTree({ entries, baseTree: sha })).toBe(sha)
    expect(await gh.createCommit({ message: '新增', tree: sha, parents: [sha], author: { name: 'Alice', email: '123+Alice@users.noreply.github.com' } })).toBe(sha)
    expect(repoCalls().map((c) => c.body)).toEqual([
      { encoding: 'base64', content: 'AQID' }, { tree: entries }, { tree: entries, base_tree: sha },
      { message: '新增', tree: sha, parents: [sha], author: { name: 'Alice', email: '123+Alice@users.noreply.github.com' } },
    ])
  })

  it('getContent 解码 UTF-8、编码 ref 查询，404 返回 null、其他失败抛出', async () => {
    const gh = createGitHub(env)
    await gh.installationToken()
    fetchMock.mockResolvedValueOnce(Response.json({ sha, encoding: 'base64', content: Buffer.from('你好\n').toString('base64') + '\n' }))
    expect(await gh.getContent('bots/demo/bot.yaml', 'main&not-a-query=1')).toEqual({ sha, text: '你好\n' })
    const url = new URL(fetchMock.mock.calls.at(-1)[0])
    expect([...url.searchParams.keys()]).toEqual(['ref'])
    expect(url.searchParams.get('ref')).toBe('main&not-a-query=1')
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 404 }))
    expect(await gh.getContent('bots/demo/bot.yaml', 'main')).toBeNull()
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 403 }))
    await expect(gh.getContent('bots/demo/bot.yaml', 'main')).rejects.toMatchObject({ status: 403 })
  })

  it('安装端点的 404 不能误当作新文件或新分支', async () => {
    const gh = createGitHub(env)
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 404 }))
    await expect(gh.getContent('bots/demo/bot.yaml', 'main')).rejects.toMatchObject({ status: 404 })
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 404 }))
    await expect(gh.upsertRef(branch, sha)).rejects.toMatchObject({ status: 404 })
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(repoCalls()).toHaveLength(0)
  })

  it('upsertRef 存在 PATCH force、不存在 POST，只接受网站分支', async () => {
    const gh = createGitHub(env)
    await gh.installationToken()
    await gh.upsertRef(branch, sha)
    expect(repoCalls().at(-1)).toMatchObject({ method: 'PATCH', body: { sha, force: true } })
    expect(repoCalls().at(-1).url.pathname).toBe(`/repos/owner/repo/git/refs/heads/${branch}`)
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 404 }))
    await gh.upsertRef(branch, sha)
    expect(repoCalls().at(-1)).toMatchObject({ method: 'POST', body: { ref: `refs/heads/${branch}`, sha } })
    expect(repoCalls().at(-1).url.pathname).toBe('/repos/owner/repo/git/refs')
  })

  it('PR 查询、创建、更新及状态读取路径与 body', async () => {
    const gh = createGitHub(env)
    await gh.installationToken()
    fetchMock.mockResolvedValueOnce(Response.json([{ number: 12 }]))
    expect(await gh.findOpenPr(branch)).toEqual({ number: 12 })
    const search = new URL(fetchMock.mock.calls.at(-1)[0]).searchParams
    expect(Object.fromEntries(search)).toEqual({ state: 'open', head: `owner:${branch}`, base: 'main' })
    fetchMock.mockResolvedValueOnce(Response.json([]))
    expect(await gh.findOpenPr(branch)).toBeNull()
    await gh.createPr({ title: '标题', body: '正文', head: branch, base: 'main' })
    await gh.updatePr(12, { title: '新标题', body: '新正文' })
    await gh.getPr(12)
    await gh.getRef('heads/main')
    await gh.getCommit(sha)
    await gh.getChecks(sha)
    await gh.getReviews(12)
    await gh.compare('main', sha)
    expect(repoCalls().map((c) => c.url.pathname)).toEqual([
      '/repos/owner/repo/pulls', '/repos/owner/repo/pulls/12', '/repos/owner/repo/pulls/12',
      '/repos/owner/repo/git/ref/heads/main', `/repos/owner/repo/git/commits/${sha}`,
      `/repos/owner/repo/commits/${sha}/check-runs`, '/repos/owner/repo/pulls/12/reviews', `/repos/owner/repo/compare/main...${sha}`,
    ])
    expect(repoCalls()[0].body).toEqual({ title: '标题', body: '正文', head: branch, base: 'main' })
    expect(repoCalls()[1]).toMatchObject({ method: 'PATCH', body: { title: '新标题', body: '新正文' } })
  })

  it('GraphQL MERGE 用变量，不插值 nodeId；失败返回 false', async () => {
    const gh = createGitHub(env)
    await gh.installationToken()
    fetchMock.mockResolvedValueOnce(Response.json({ data: { enablePullRequestAutoMerge: { pullRequest: { id: 'node-id' } } } }))
    expect(await gh.enableAutoMerge('node-id')).toBe(true)
    const [url, init] = fetchMock.mock.calls.at(-1)
    expect(url).toBe('http://api.gh.test/graphql')
    const body = JSON.parse(init.body)
    expect(body.query).toContain('mergeMethod: MERGE')
    expect(body.query).not.toContain('node-id')
    expect(body.variables).toEqual({ id: 'node-id' })
    fetchMock.mockResolvedValueOnce(Response.json({ errors: [{ message: 'private diagnostic' }] }))
    expect(await gh.enableAutoMerge('node-id')).toBe(false)
    fetchMock.mockRejectedValueOnce(new Error('private diagnostic'))
    expect(await gh.enableAutoMerge('node-id')).toBe(false)
  })
})

describe('原生 base64，无 JS 编码回退', () => {
  it('空数组、中文、2MB 及 subarray 的结果与 Buffer 一致', () => {
    for (const bytes of [new Uint8Array(), new TextEncoder().encode('中文'), new Uint8Array(2 * 1024 * 1024).fill(251), new Uint8Array([0, 1, 2, 3, 4]).subarray(1, 4)]) {
      expect(toBase64(bytes) === Buffer.from(bytes).toString('base64')).toBe(true)
    }
  })
  it('优先原生 toBase64，否则 Buffer；都没有就报错', () => {
    const bytes = new Uint8Array([1, 2, 3])
    const native = vi.fn(() => 'AQID')
    Object.defineProperty(bytes, 'toBase64', { value: native, configurable: true })
    expect(toBase64(bytes)).toBe('AQID')
    expect(native).toHaveBeenCalledOnce()
    Object.defineProperty(bytes, 'toBase64', { value: undefined })
    expect(toBase64(bytes)).toBe('AQID')
    vi.stubGlobal('Buffer', undefined)
    expect(() => toBase64(bytes)).toThrow('Native base64 unavailable')
  })
})
