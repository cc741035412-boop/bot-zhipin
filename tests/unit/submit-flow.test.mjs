import { beforeEach, describe, expect, it, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { buildBotModel } from '../../scripts/lib/bot-model.mjs'
import { pack } from '../../scripts/submission/bundle-core.mjs'
import { encodeToken } from '../../scripts/lib/bundle-web.mjs'
import { submitBot, verifyReceipts } from '../../functions/_lib/submit.ts'
import { sign } from '../../functions/_lib/session.ts'

const now = Date.parse('2026-11-14T17:00:00Z'), user = { id: 123, login: 'Alice' }
const secrets = { SESSION_SECRET: 's'.repeat(40) }
const fixture = (rel) => readFileSync(new URL(`../fixtures/bots/demo-prd-reviewer/${rel}`, import.meta.url), 'utf8')
const rels = ['bot.yaml', 'ROLE.md', 'DESIGN.md', 'routines.md', 'skills/checklist-review/SKILL.md', 'skills/issue-ranking/SKILL.md']
const templateFiles = ['bot.yaml', 'ROLE.md', 'DESIGN.md', 'routines.md', 'skills/example-skill/SKILL.md'].map((rel) => ({ rel, text: readFileSync(new URL(`../../bots/_template/${rel}`, import.meta.url), 'utf8') }))
const context = { index: [], templateModel: buildBotModel('_template', { files: templateFiles }) }
const receipt = (extra = {}, secret = secrets.SESSION_SECRET) => sign(secret, { t: 'r', v: 1, uid: user.id, sha: 'b'.repeat(40), size: 80, format: 'png', exp: now + 1000, ...extra })
function bundle(edit = (files) => files, slug = 'flow-demo') {
  const files = Object.fromEntries(rels.map((rel) => [rel, fixture(rel).replaceAll('demo-prd-reviewer', slug)]))
  edit(files)
  return pack({ slug, screenshots: ['review-result.png'], files: Object.fromEntries(Object.entries(files).map(([rel, text]) => [`bots/${slug}/${rel}`, text])) })
}
let gh, db, deps, tracked, writes, events, limits, input
beforeEach(async () => {
  tracked = []; writes = []; events = []; limits = new Map()
  db = { prepare: (sql) => ({ bind: (...args) => ({
    first: async () => { if (sql.includes('FROM bot_owners')) return null; const key = `${args[0]}:${args[1]}`; const n = (limits.get(key) || 0) + 1; limits.set(key, n); events.push(args[0]); return { n, bytes: 0 } },
    all: async () => ({ results: tracked }),
    run: async () => { writes.push({ sql, args }); return {} },
  }) }) }
  const pr = { number: 7, node_id: 'PR_7', html_url: 'https://github.test/pull/7', state: 'open', merged: false }
  gh = Object.fromEntries(Object.entries({
    installationToken: 'unused', getRef: { object: { sha: '1'.repeat(40) } }, getCommit: { tree: { sha: '2'.repeat(40) } },
    getContent: null, getPr: pr, createTree: '3'.repeat(40), createCommit: '4'.repeat(40),
    upsertRef: {}, findOpenPr: null, createPr: pr, updatePr: pr, enableAutoMerge: true,
  }).map(([name, result]) => [name, vi.fn(async () => { events.push(name); return result })]))
  deps = { github: gh, db, now, secrets, origin: 'https://site.test', context: async () => context, dryRunUserIds: '123' }
  input = { bundle: bundle(), screenshots: [await receipt()], license: true }
})
const noWrites = () => { for (const name of ['createTree', 'createCommit', 'upsertRef', 'createPr', 'updatePr', 'enableAutoMerge']) expect(gh[name]).not.toHaveBeenCalled() }

describe('网站提交流程（纯注入，无网络）', () => {
  it('按序限流、解包；新投稿改写署名和北京时间，写两层安全 tree、单提交、PR 和 upsert', async () => {
    const result = await submitBot(input, user, deps)
    expect(result).toMatchObject({ ok: true, update: false, slug: 'flow-demo', branch: 'submission/web-123-flow-demo', liveUrl: 'https://site.test/bots/flow-demo', autoMerge: true })
    expect(events).toEqual(['submit-try', 'submit-slug', 'installationToken', 'getRef', 'getCommit', 'getContent', 'submit', 'submit-all', 'createTree', 'createTree', 'createCommit', 'upsertRef', 'findOpenPr', 'createPr', 'enableAutoMerge'])
    const [inner, outer] = gh.createTree.mock.calls.map(([v]) => v)
    expect(inner.baseTree).toBeUndefined()
    expect(inner.entries.every((e) => e.mode === '100644' && e.type === 'blob' && !e.path.startsWith('/') && !e.path.includes('..'))).toBe(true)
    expect(inner.entries.find((e) => e.path === 'bot.yaml').content).toMatch(/github: Alice/)
    expect(inner.entries.find((e) => e.path === 'bot.yaml').content).toContain('2026-11-15')
    expect(outer).toEqual({ baseTree: '2'.repeat(40), entries: [{ path: 'bots/flow-demo', mode: '040000', type: 'tree', sha: '3'.repeat(40) }] })
    expect(gh.createCommit.mock.calls[0][0]).toMatchObject({ parents: ['1'.repeat(40)], author: { name: 'Alice', email: '123+Alice@users.noreply.github.com' } })
    expect(gh.createCommit.mock.calls[0][0].committer).toBeUndefined()
    const pr = gh.createPr.mock.calls[0][0]
    expect(pr.body).toContain('<!-- bot-zhipin-web-submission uid=123 slug=flow-demo -->')
    expect(pr.body).toContain('截图是这个 Bot 的真实输出，没有露出隐私、密钥或公司内部信息')
    expect(writes.at(-1).sql).toContain('ON CONFLICT')
    expect(writes.at(-1).args).toEqual([123, 'flow-demo', 7, 'submission/web-123-flow-demo', now])
  })
  it('BZB1 令牌只扣尝试额度，400 拒绝且不访问 GitHub', async () => {
    input.bundle = await encodeToken(input.bundle)
    await expect(submitBot(input, user, deps)).rejects.toMatchObject({ status: 400, code: 'bad_request' })
    expect(limits.get('submit-slug:123:flow-demo')).toBeUndefined()
    expect(limits.get('submit-try:123')).toBe(1)
    expect(gh.installationToken).not.toHaveBeenCalled()
  })
  it('同 slug 第二次请求被 429 拦在 GitHub 前', async () => {
    await submitBot(input, user, deps)
    const count = gh.getRef.mock.calls.length
    await expect(submitBot(input, user, deps)).rejects.toMatchObject({ status: 429, extra: { retryAfter: expect.any(Number) } })
    expect(gh.getRef).toHaveBeenCalledTimes(count)
  })
  it('未授权和不在 dryRun 白名单先返回，甚至不限流', async () => {
    await expect(submitBot({ ...input, license: false }, user, deps)).rejects.toMatchObject({ code: 'license_required' })
    await expect(submitBot({ ...input, dryRun: true }, user, { ...deps, dryRunUserIds: '12,1234' })).rejects.toMatchObject({ status: 403 })
    expect(events).toEqual([])
  })
  it('坏投稿包带安全四项 errors，绝不访问 GitHub', async () => {
    await expect(submitBot({ ...input, bundle: 'wrong' }, user, deps)).rejects.toMatchObject({ code: 'bad_request', extra: { errors: [expect.objectContaining({ file: expect.any(String), where: expect.any(String), problem: expect.any(String), fix: expect.any(String) })] } })
    expect(gh.installationToken).not.toHaveBeenCalled()
  })
  it.each(['forged', 'expired', 'other', 'purpose', 'missing-purpose', 'sha', 'size', 'empty'])('回执 %s 拒绝且带槽位，无 GitHub 请求', async (kind) => {
    const values = { forged: (await receipt()) + 'x', expired: await receipt({ exp: now }), other: await receipt({ uid: 456 }), purpose: await receipt({ t: 's' }), 'missing-purpose': await receipt({ t: undefined }), sha: await receipt({ sha: '../oops' }), size: await receipt({ size: 2097153 }), empty: null }
    input.screenshots = kind === 'empty' ? [] : [values[kind]]
    await expect(submitBot(input, user, deps)).rejects.toMatchObject({ code: 'receipt_invalid', extra: { slots: [0] } })
    expect(gh.installationToken).not.toHaveBeenCalled()
  })
  it('轮换密钥可验证旧回执，多处失败返回全部下标', async () => {
    const old = await receipt({}, 'old-secret')
    expect(await verifyReceipts([old], user, { ...secrets, SESSION_SECRET_PREV: 'old-secret' }, now)).toHaveLength(1)
    await expect(verifyReceipts(['wrong', await receipt(), old], user, secrets, now)).rejects.toMatchObject({ extra: { slots: [0, 2] } })
  })
  it('main HEAD 原作者大小写无关，更新沿用旧 addedAt，不信索引', async () => {
    gh.getContent.mockResolvedValue({ text: fixture('bot.yaml').replace('example-user', 'alice').replace('2026-11-01', '2026-10-20') })
    deps.context = async () => ({ ...context, index: [{ slug: 'flow-demo', authorGithub: 'Mallory', addedAt: '2025-01-01' }] })
    expect((await submitBot(input, user, deps)).update).toBe(true)
    expect(gh.getContent).toHaveBeenCalledWith('bots/flow-demo/bot.yaml', '1'.repeat(40))
    expect(gh.createTree.mock.calls[0][0].entries.find((e) => e.path === 'bot.yaml').content).toContain('2026-10-20')
  })
  it.each(['owner', 'external'])('main 已被占用 %s：409，无写入', async (kind) => {
    gh.getContent.mockResolvedValue({ text: fixture('bot.yaml').replace('example-user', kind === 'owner' ? 'Mallory' : 'Alice') + (kind === 'external' ? '\nexternal: true\n' : '') })
    await expect(submitBot(input, user, deps)).rejects.toMatchObject({ code: 'slug_taken' }); noWrites()
  })
  it.each(['external', 'secret', 'schema', 'yaml', 'skill'])('无效内容 %s：422，校验前没有任何仓库写入', async (kind) => {
    input.bundle = bundle((f) => {
      if (kind === 'external') f['bot.yaml'] += '\nexternal: true\n'
      if (kind === 'secret') f['ROLE.md'] += '\nghp_' + 'a'.repeat(36)
      if (kind === 'schema') f['bot.yaml'] = f['bot.yaml'].replace(/^quotaCost:.*\n/m, '')
      if (kind === 'yaml') f['bot.yaml'] = 'author: ['
      if (kind === 'skill') f['skills/checklist-review/SKILL.md'] = 'no frontmatter'
    })
    try { await submitBot(input, user, deps); expect.fail('must reject') } catch (error) {
      expect(error.code).toBe('invalid'); expect(JSON.stringify(error.extra)).not.toContain('a'.repeat(36))
      expect(error.extra.errors[0]).toMatchObject({ file: expect.any(String), where: expect.any(String), problem: expect.any(String), fix: expect.any(String) })
    }
    noWrites()
  })
  it('dryRun 完成全部校验而不写，返回文件计划', async () => {
    expect(await submitBot({ ...input, dryRun: true }, user, deps)).toMatchObject({ ok: true, dryRun: true, files: expect.arrayContaining(['bots/flow-demo/screenshots/review-result.png']) }); noWrites()
  })
  it('PR 已存在时更新，不新建；自动合并失败只加 warning', async () => {
    gh.findOpenPr.mockResolvedValue({ number: 7 })
    gh.enableAutoMerge.mockRejectedValue(new Error('private upstream text'))
    const result = await submitBot(input, user, deps)
    expect(gh.createPr).not.toHaveBeenCalled(); expect(gh.updatePr).toHaveBeenCalledWith(7, expect.any(Object))
    expect(result.autoMerge).toBe(false)
    expect(result.warnings.at(-1)).toMatchObject({ file: expect.any(String), where: '自动合并', problem: expect.any(String), fix: expect.any(String) })
    expect(JSON.stringify(result)).not.toContain('private upstream')
  })
  it('三个等待 PR 返回 pr_limit 和 pulls', async () => {
    tracked = [1, 2, 3].map((n) => ({ slug: `old-${n}`, pr_number: n }))
    gh.getPr.mockImplementation(async (n) => ({ number: n, html_url: `https://github.test/pull/${n}`, state: 'open' }))
    await expect(submitBot(input, user, deps)).rejects.toMatchObject({ code: 'pr_limit', extra: { pulls: [1, 2, 3].map((n) => ({ number: n, url: `https://github.test/pull/${n}`, slug: `old-${n}` })) } }); noWrites()
  })
  it('数 PR 前清理 merged/closed；已有槽位更新不受三 PR 限制', async () => {
    tracked = ['flow-demo', 'old-2', 'old-3', 'closed', 'merged'].map((slug, i) => ({ slug, pr_number: i + 1 }))
    gh.getPr.mockImplementation(async (n) => ({ number: n, state: n === 4 ? 'closed' : 'open', merged: n === 5 }))
    expect((await submitBot(input, user, deps)).ok).toBe(true)
    expect(writes.filter((w) => w.sql.startsWith('DELETE'))).toHaveLength(2)
  })
  it('路径穿越/非法分支 slug 在写入前拒绝', async () => {
    input.bundle = input.bundle.replaceAll('flow-demo', '../bad')
    await expect(submitBot(input, user, deps)).rejects.toMatchObject({ code: 'bad_request' }); noWrites()
  })
})
