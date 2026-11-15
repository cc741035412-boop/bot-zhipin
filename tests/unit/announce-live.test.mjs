import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import YAML from 'yaml'
import { announceLive, main } from '../../scripts/announce-live.mjs'

const marker = '<!-- bot-zhipin-live -->'
const options = { sha: 'merged-sha', repo: 'owner/repo', siteUrl: 'https://site.invalid', appBotLogin: 'submit[bot]', timeoutMs: 30, intervalMs: 10 }
const pr = (overrides = {}) => ({
  number: 7, merged_at: '2026-11-14T00:00:00Z', base: { ref: 'main' },
  head: { ref: 'submission/web-123-demo-bot' }, user: { login: 'submit[bot]' },
  body: '- 投稿人：@Jakob', ...overrides,
})
function harness(prs = [pr()]) {
  let clock = 0
  const github = {
    pullsForCommit: vi.fn(async () => prs),
    prFiles: vi.fn(async () => [{ filename: 'bots/demo-bot/bot.yaml', status: 'modified' }]),
    compare: vi.fn(async () => ({ status: 'behind' })),
    listComments: vi.fn(async () => []),
    createComment: vi.fn(async () => {}),
    deleteBranch: vi.fn(async () => {}),
  }
  const deps = {
    github,
    fetchSite: vi.fn(async (url) => url.endsWith('build.json') ? Response.json({ commit: options.sha }) : new Response('OK')),
    now: () => clock,
    sleep: vi.fn(async (ms) => { clock += ms }),
  }
  return { github, deps, run: (changes = {}) => announceLive({ ...options, ...changes }, deps) }
}
beforeEach(() => {
  // 任何未注入的网络访问都是测试错误，绝不连接真实服务。
  vi.stubGlobal('fetch', vi.fn(() => { throw new Error('禁止真实网络') }))
})
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.restoreAllMocks() })

it('网站直投：相同提交部署后评论 PR 并删除分支', async () => {
  const { run, github } = harness()
  expect(await run()).toEqual({ announced: [{ pr: 7, slug: 'demo-bot', liveUrl: 'https://site.invalid/bots/demo-bot' }], skipped: [] })
  expect(github.pullsForCommit).toHaveBeenCalledWith(options.sha)
  expect(github.compare).not.toHaveBeenCalled()
  expect(github.createComment).toHaveBeenCalledWith(7, `🎉 已上线：https://site.invalid/bots/demo-bot\n\n感谢 @Jakob，你已成为 Bot 直聘的贡献者。\n\n${marker}`)
  expect(github.deleteBranch).toHaveBeenCalledWith('submission/web-123-demo-bot')
  expect(github.createComment.mock.invocationCallOrder[0]).toBeLessThan(github.deleteBranch.mock.invocationCallOrder[0])
})

it('Issue 来源：APP login 为空仍处理 actions bot，PR 和来源 Issue 都评论', async () => {
  const { run, github } = harness([pr({ head: { ref: 'submission/issue-42' }, user: { login: 'github-actions[bot]' }, body: 'Closes #42\n- 投稿人：@alice' })])
  await run({ appBotLogin: '' })
  expect(github.createComment.mock.calls.map(([number]) => number)).toEqual([7, 42])
  expect(github.createComment.mock.calls[1][1]).toContain('感谢 @alice')
})

it('更新已有 Bot：旧页面即使 200，也必须先等部署提交推进', async () => {
  const { run, deps, github } = harness()
  deps.fetchSite.mockImplementationOnce(async () => Response.json({ commit: 'old-sha' }))
  await run()
  expect(github.compare).toHaveBeenCalledWith('merged-sha', 'old-sha')
  expect(deps.sleep).toHaveBeenCalledOnce()
  expect(deps.fetchSite.mock.calls.map(([url]) => url)).toEqual([
    'https://site.invalid/api-data/build.json', 'https://site.invalid/api-data/build.json', 'https://site.invalid/bots/demo-bot',
  ])
})

it.each(['ahead', 'identical'])('compare 返回 %s 代表目标提交已部署', async (status) => {
  const { run, deps, github } = harness()
  deps.fetchSite.mockImplementationOnce(async () => Response.json({ commit: 'new-sha' }))
  github.compare.mockResolvedValue({ status })
  expect((await run()).announced).toHaveLength(1)
  expect(github.compare).toHaveBeenCalledWith(options.sha, 'new-sha')
})

it.each(['behind', 'diverged'])('compare 返回 %s 不能上线，达到总预算后超时', async (status) => {
  const { run, deps, github } = harness()
  deps.fetchSite.mockImplementation(async () => Response.json({ commit: 'other-sha' }))
  github.compare.mockResolvedValue({ status })
  await expect(run()).rejects.toThrow('等待部署超时：')
  expect(deps.now()).toBe(30)
  expect(github.createComment).not.toHaveBeenCalled()
  expect(github.deleteBranch).not.toHaveBeenCalled()
})

it('已部署但详情页尚未 200 时继续等，共用超时预算', async () => {
  const { run, deps, github } = harness()
  deps.fetchSite.mockImplementation(async (url) => url.endsWith('build.json') ? Response.json({ commit: options.sha }) : new Response('', { status: 404 }))
  await expect(run()).rejects.toThrow('等待部署超时：')
  expect(deps.fetchSite.mock.calls.filter(([url]) => url.endsWith('build.json'))).toHaveLength(1)
  expect(github.createComment).not.toHaveBeenCalled()
})

it('详情页短暂失败后 200 才评论', async () => {
  const { run, deps } = harness()
  deps.fetchSite.mockImplementationOnce(async () => Response.json({ commit: options.sha }))
    .mockImplementationOnce(async () => new Response('', { status: 503 }))
  expect((await run()).announced).toHaveLength(1)
  expect(deps.sleep).toHaveBeenCalledOnce()
})

it('build.json 的 HTTP、JSON、网络或空提交故障均重试至超时', async () => {
  for (const response of [() => new Response('', { status: 404 }), () => new Response('not json'), () => Response.json({}), () => { throw new Error('offline') }]) {
    const { run, deps } = harness()
    deps.fetchSite.mockImplementation(async () => response())
    await expect(run()).rejects.toThrow('等待部署超时：')
  }
})

it('评论查重分别作用于 PR 和 Issue，重复运行仍尝试清理分支', async () => {
  const { run, github } = harness([pr({ head: { ref: 'submission/issue-42' }, body: 'Closes #42' })])
  const comments = new Map([[7, [{ body: marker }]], [42, []]])
  github.listComments.mockImplementation(async (number) => comments.get(number))
  github.createComment.mockImplementation(async (number, body) => { comments.get(number).push({ body }) })
  await run()
  await run()
  expect(github.createComment).toHaveBeenCalledOnce()
  expect(github.createComment.mock.calls[0][0]).toBe(42)
  expect(github.listComments.mock.calls.map(([number]) => number)).toEqual([7, 42, 7, 42])
  expect(github.deleteBranch).toHaveBeenCalledTimes(2)
})

it.each([
  [[{ filename: 'bots/one/bot.yaml' }, { filename: 'bots/two/ROLE.md' }], '多个 slug'],
  [[{ filename: 'README.md' }], '以外'],
  [[{ filename: 'bots/one/ROLE.md', previous_filename: 'README.md' }], '以外'],
  [[], '没有改动文件'],
])('不能确定唯一 Bot 范围时跳过：%j', async (files, reason) => {
  const { run, github, deps } = harness()
  github.prFiles.mockResolvedValue(files)
  expect(await run()).toEqual({ announced: [], skipped: [{ pr: 7, reason: expect.stringContaining(reason) }] })
  expect(deps.fetchSite).not.toHaveBeenCalled()
  expect(github.deleteBranch).not.toHaveBeenCalled()
})

it.each([
  [{ merged_at: null }, '尚未合并'],
  [{ base: { ref: 'dev' } }, '不是 main'],
  [{ user: { login: 'outsider' } }, '不是受信'],
  [{ user: { login: 'other[bot]' } }, '不是受信'],
  [{ head: { ref: 'submission/web-0-demo' } }, '合法的投稿分支'],
  [{ head: { ref: 'submission/web-123456789012345678901-demo' } }, '合法的投稿分支'],
  [{ head: { ref: 'submission/web-1-demo--bot' } }, '合法的投稿分支'],
  [{ head: { ref: 'submission/issue-01' } }, '合法的投稿分支'],
  [{ head: { ref: 'feature/demo' } }, '合法的投稿分支'],
])('筛选不满足条件的 PR：%j', async (changes, reason) => {
  const { run, github } = harness([pr(changes)])
  expect((await run()).skipped).toEqual([{ pr: 7, reason: expect.stringContaining(reason) }])
  expect(github.prFiles).not.toHaveBeenCalled()
})

it('没有配置 App login 时不信任任意 App 机器人', async () => {
  const { run } = harness()
  expect((await run({ appBotLogin: '' })).skipped).toHaveLength(1)
})

it('一次 push 多个 PR 共用部署检查，并分别确认详情页', async () => {
  const { run, deps, github } = harness([pr(), pr({ number: 8, head: { ref: 'submission/web-124-other-bot' } })])
  github.prFiles.mockImplementation(async (n) => [{ filename: `bots/${n === 7 ? 'demo-bot' : 'other-bot'}/bot.yaml` }])
  expect((await run()).announced).toHaveLength(2)
  expect(deps.fetchSite).toHaveBeenCalledTimes(3)
  expect(github.createComment).toHaveBeenCalledTimes(2)
})

it('分支已经删除或清理失败不影响成功通知', async () => {
  const { run, github } = harness()
  github.deleteBranch.mockRejectedValue(new Error('delete failed'))
  expect((await run()).announced).toHaveLength(1)
})

it('投稿人缺失时不 @，网站来源也不评论正文中的 Closes Issue', async () => {
  const { run, github } = harness([pr({ body: 'Closes #42' })])
  await run({ siteUrl: 'https://site.invalid/' })
  expect(github.createComment).toHaveBeenCalledOnce()
  expect(github.createComment.mock.calls[0][1]).not.toContain('@')
  expect(github.createComment.mock.calls[0][1]).toContain('感谢，你已成为')
})

it('评论失败必须抛错，不提前删除分支', async () => {
  const { run, github } = harness()
  github.createComment.mockRejectedValue(new Error('forbidden'))
  await expect(run()).rejects.toThrow('forbidden')
  expect(github.deleteBranch).not.toHaveBeenCalled()
})

it('main 的原生 fetch 适配器处理分页、比较、查重、发评论、删分支及缓存绕过', async () => {
  for (const [key, value] of Object.entries({ GH_TOKEN: 'offline-test', SHA: options.sha, REPO: options.repo, SITE_URL: options.siteUrl, APP_BOT_LOGIN: options.appBotLogin })) vi.stubEnv(key, value)
  const calls = []
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.stubGlobal('fetch', vi.fn(async (input, init) => {
    const url = new URL(input)
    calls.push({ url, init })
    if (url.origin === options.siteUrl) return url.pathname.endsWith('build.json') ? Response.json({ commit: 'new-sha' }) : new Response('OK')
    expect(url.origin).toBe('https://api.github.com')
    if (url.pathname.endsWith('/pulls')) return Response.json([pr()])
    if (url.pathname.endsWith('/files')) {
      if (url.searchParams.get('page') === '1') return Response.json([{ filename: 'bots/demo-bot/bot.yaml' }], { headers: { link: '<https://api.github.com/next>; rel="next"' } })
      return Response.json([{ filename: 'bots/demo-bot/ROLE.md' }])
    }
    if (url.pathname.includes('/compare/')) return Response.json({ status: 'ahead' })
    if (url.pathname.endsWith('/comments')) {
      if (init.method === 'POST') return Response.json({ id: 1 })
      return Response.json([])
    }
    if (init.method === 'DELETE') return new Response(null, { status: 204 })
    throw new Error(`未 mock 的路径 ${url.pathname}`)
  }))
  await main()
  expect(calls.some(({ url }) => url.pathname.endsWith('/files') && url.searchParams.get('page') === '2')).toBe(true)
  expect(calls.find(({ init }) => init.method === 'POST').init.body).toContain(marker)
  expect(calls.find(({ init }) => init.method === 'DELETE').url.pathname).toBe('/repos/owner/repo/git/refs/heads/submission/web-123-demo-bot')
  const siteCalls = calls.filter(({ url }) => url.origin === options.siteUrl)
  expect(siteCalls).toHaveLength(2)
  for (const { url, init } of siteCalls) {
    expect(init.cache).toBe('no-store')
    expect(url.searchParams.get('_live')).toBeTruthy()
    expect(init.headers).toBeUndefined()
  }
  expect(siteCalls[0].url.searchParams.get('_live')).not.toBe(siteCalls[1].url.searchParams.get('_live'))
})

it('工作流仅 main push、可信 checkout、限定权限，新增 run 不插值表达式', () => {
  const workflow = YAML.parse(readFileSync(new URL('../../.github/workflows/announce-live.yml', import.meta.url), 'utf8'))
  expect(workflow.on).toEqual({ push: { branches: ['main'] } })
  expect(workflow.permissions).toEqual({ contents: 'write', 'pull-requests': 'write', issues: 'write' })
  expect(workflow.concurrency).toEqual({ group: 'announce-live', 'cancel-in-progress': false })
  const job = workflow.jobs['announce-live']
  expect(job['timeout-minutes']).toBe(15)
  expect(job.steps[0]).toEqual({ uses: 'actions/checkout@v5', with: { ref: '${{ github.event.repository.default_branch }}', 'persist-credentials': false } })
  expect(job.steps[1]).toEqual({ uses: 'actions/setup-node@v5', with: { 'node-version-file': '.nvmrc' } })
  const step = job.steps[2]
  expect(step.run).toBe('node scripts/announce-live.mjs')
  expect(step.env).toEqual({ GH_TOKEN: '${{ github.token }}', SHA: '${{ github.sha }}', REPO: '${{ github.repository }}', SITE_URL: 'https://bot-zhipin.pages.dev', APP_BOT_LOGIN: '${{ vars.SUBMIT_APP_BOT_LOGIN }}' })
  const ci = YAML.parse(readFileSync(new URL('../../.github/workflows/ci.yml', import.meta.url), 'utf8'))
  const debug = ci.jobs['validate-and-build'].steps[1]
  expect(debug.name).toBe('打印 PR 作者关联（联调用）')
  expect(debug.if).toBe("github.event_name == 'pull_request'")
  expect(debug.env).toEqual({ ASSOCIATION: '${{ github.event.pull_request.author_association }}', PR_AUTHOR: '${{ github.event.pull_request.user.login }}' })
  expect(debug.run).toBe('echo "author_association=$ASSOCIATION pr_author=$PR_AUTHOR"')
  for (const step of [...job.steps, debug]) expect(step.run || '').not.toContain('${{')
  expect(readFileSync(new URL('../../.github/CODEOWNERS', import.meta.url), 'utf8')).toBe('* @jakob52123\n')
})
