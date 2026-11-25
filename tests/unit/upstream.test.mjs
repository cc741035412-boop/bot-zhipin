import { expect, it, vi } from 'vitest'
import { checkUpstream, report, findingKeys, findingLines, planIssue } from '../../scripts/lib/upstream.mjs'
const bot = { slug: 'b', name: 'Bot', templateUrl: 'https://x.ai/bot/b', templateVersion: 1, permissions: ['外部账号'] }
const ok = { ok: true, published: true, version: 2, updatedAt: '2026-09-25T16:15:00Z' }
const sha = 'a'.repeat(40), url = `https://github.com/O/R/tree/${sha}`
const skill = path => ({ slug: path || 'root', name: path, source: { url: `${url}/${path}` } })
const run = options => checkUpstream({ bots: [], skills: [], checkedAt: '2026-11-24T16:07:59Z', ...options })
it.each([[ok, 1, 'changed'], [ok, undefined, 'missing'], [{ ok: false, kind: 'not_found' }, 2, 'gone'], [{ ...ok, published: false }, 2, 'unpublished'], [{ ok: false, kind: 'error' }, 2, 'error']])('Bot %j %s → %s', async (meta, templateVersion, kind) => {
  const r = await run({ bots: [{ ...bot, templateVersion }], templateMeta: async () => meta })
  expect(r.bots.findings).toMatchObject([{ kind, sensitive: true }]); expect(r.attention).toBe(true)
})
it('Bot 查询最多同时进行两项，结果仍按输入顺序排列', async () => {
  let active = 0, peak = 0
  const templateMeta = vi.fn(async () => {
    peak = Math.max(peak, ++active)
    await Promise.resolve()
    active--
    return ok
  })
  const bots = Array.from({ length: 5 }, (_, i) => ({ ...bot, slug: `b-${i}`, templateUrl: `${bot.templateUrl}-${i}` }))
  const result = await run({ bots, templateMeta })
  expect(peak).toBe(2)
  expect(templateMeta).toHaveBeenCalledTimes(bots.length)
  expect(result.bots.findings.map(f => f.slug)).toEqual(bots.map(b => b.slug))
})
const repo = { full_name: 'o/r', default_branch: 'main' }
const diff = { files: [{ filename: 'docs/a' }], html_url: url, ahead_by: 4 }
function gh(info = repo, compare = diff, commits = []) {
  return vi.fn(async path => path.includes('/commits?') ? commits : path.includes('/compare/') ? compare : info)
}
it('同组只比一次；匹配整仓和子目录，不误算相同前缀', async () => {
  const github = gh(), r = await run({ skills: ['docs', 'doc', ''].map(skill), github })
  expect(github).toHaveBeenCalledTimes(2)
  expect(r.skills.findings.map(f => [f.kind, f.slug, f.files])).toEqual([['changed', 'docs', ['docs/a']], ['changed', 'root', ['docs/a']]])
})
it.each([[[], 0], [[{ sha }], 0], [[{ sha: 'new' }], 1]])('截断改用路径提交 %j', async (commits, length) => {
  const github = gh(repo, { ...diff, base_commit: { commit: { committer: { date: 'date' } } }, files: Array(300).fill({ filename: 'other' }) }, commits)
  const r = await run({ skills: [skill('docs')], github })
  expect(r.skills.findings).toHaveLength(length); expect(github).toHaveBeenCalledWith(expect.stringContaining('sha=main&path=docs&since=date'))
})
it.each([[gh({ ...repo, archived: true }), 'archived'], [gh({ full_name: 'other/name' }), 'moved'], [async () => { throw Object.assign(new Error(), { status: 404 }) }, 'gone']])('仓库状态 → %s', async (github, kind) => {
  expect((await run({ skills: [skill('docs')], github })).skills.findings[0].kind).toBe(kind)
})
it('链接无 SHA', async () => expect((await run({ skills: [{ source: { url: 'other' } }] })).skills.findings[0].kind).toBe('unparsed'))
it.each([[1, false], [2, true]])('四项中 %i 次查询失败', async (n, attention) => {
  let i = 0
  const r = await run({ bots: Array(4).fill(bot), templateMeta: async () => i++ < n ? { ok: false, kind: 'error' } : { ...ok, version: 1 } })
  expect(r.attention).toBe(attention); expect(report(r)).toContain('## 核对失败')
})
it('全部一致时无空节', async () => expect(report(await run({}))).toBe('核对时间：2026-11-25 00:07（北京时间）\n\n全部和审过的版本一致：0 个 Bot、0 个 Skill。\n\n处理办法见 `docs/dev/MAINTAINING.md` 的「上游核对」一节。'))
it('报告节按优先级排列', async () => {
  const r = await run({ bots: [bot, { ...bot, permissions: [] }, { ...bot, templateVersion: null }], templateMeta: async () => ok, skills: [skill('docs')], github: gh() })
  expect(report(r).match(/^## .+$/gm)).toEqual(['## 需要先看', '## Bot 模板改过', '## 没记审过的版本', '## Skill 上游改过'])
})
it.each([[null, true, ['create']], [{ body: '<!-- upstream-watch keys=["k"] -->' }, true, ['update']], [{ body: '' }, true, ['update', 'comment']], [{}, false, ['comment', 'close']], [null, false, []]])('issue %j %s', (open, attention, expected) => {
  expect(planIssue({ open, attention, keys: ['k'], lines: new Map([['k', '- 待复核条目']]), body: '报告' }).map(a => a.action)).toEqual(expected)
})

const botSite = '[本站](https://bot.jiachengbo.com/bots/b)'
const botLinks = `[x.ai 模板](${bot.templateUrl}) · ${botSite}`
const botChange = '审过 v1，现在 v2（2026-09-26 改的）'
const botRow = text => `- **Bot**（\`b\`）：${text}`
const rows = result => report(result).split('\n').filter(line => line.startsWith('- '))
it.each([
  ['changed', {}, `${botChange} · ${botLinks}`],
  ['changed', { sensitive: true, permissions: ['浏览器 Cookie', '联网', '代我发消息'] }, `${botChange}，带「浏览器 Cookie」「代我发消息」 · ${botLinks}`],
  ['missing', {}, `没记审过的版本，现在是 v2 · ${botLinks}`],
  ['gone', {}, `x.ai 上找不到这个模板了 · ${botSite}`],
  ['unpublished', {}, `作者把模板设成不公开了 · ${botLinks}`],
  ['error', { message: 'HTTP 429' }, '没查成（请求太频繁，被限流了）'],
  ['error', {}, '没查成（查询失败）'],
])('Bot %s 的报告行：%j', async (kind, extra, expected) => {
  const result = await run({})
  result.bots.findings.push({ ...bot, reviewed: 1, current: 2, updatedAt: ok.updatedAt, kind, ...extra })
  expect(rows(result)).toEqual([botRow(expected)])
})

const skillLinks = ` · [看改动](${url}) · [本站](https://bot.jiachengbo.com/skills/docs)`
const skillChange = '`O/R` 的 `docs` 在审过之后'
it.each([
  ['changed', { files: ['docs/SKILL.md'] }, `${skillChange}改了 1 个文件（SKILL.md）${skillLinks}`],
  ['changed', { files: ['docs/a', 'docs/b', 'docs/x/c', 'docs/d', 'docs/e', 'docs/f'] }, `${skillChange}改了 6 个文件（a、b、x/c、d、e等 6 个）${skillLinks}`],
  ['changed', { path: '', files: ['docs/a'] }, `\`O/R\` 的整个仓库在审过之后改了 1 个文件（docs/a）${skillLinks}`],
  ['changed', { files: [] }, `${skillChange}有新提交（改动太多，没列文件）${skillLinks}`],
  ['gone', {}, '仓库或审过的那次提交找不到了'],
  ['moved', { current: 'new/repo' }, '仓库改名或转移到了 `new/repo`'],
  ['archived', {}, '仓库已归档'],
  ['unparsed', {}, 'source.url 不是 tree/<提交号> 的形式'],
  ['error', { message: 'GitHub HTTP 503' }, '没查成（上游返回错误，状态码 503）'],
  ['error', { message: 'fetch failed' }, '没查成（网络错误）'],
  ['error', { message: 'unknown upstream message' }, '没查成（查询失败）'],
])('Skill %s 的报告行：%j', async (kind, extra, expected) => {
  const result = await run({})
  result.skills.findings.push({ ...skill('docs'), repo: 'O/R', path: 'docs', compareUrl: url, kind, ...extra })
  expect(rows(result)).toEqual([`- **docs**（\`docs\`）：${expected}`])
})

it('评论只列新增的报告行，正文仍用机器键比对', async () => {
  const result = await run({ bots: [bot, { ...bot, slug: 'old' }], templateMeta: async () => ok })
  const keys = findingKeys(result), body = report(result)
  expect(keys).toEqual(['bot:b:changed:2', 'bot:old:changed:2'])
  const actions = planIssue({ open: { body: '<!-- upstream-watch keys=["bot:old:changed:2"] -->' }, attention: true, body, keys, lines: findingLines(result) })
  expect(actions).toEqual([
    { action: 'update', body: `${body}\n\n<!-- upstream-watch keys=["bot:b:changed:2","bot:old:changed:2"] -->` },
    { action: 'comment', body: `新增待复核：\n${rows(result)[0]}` },
  ])
})

it.each([false, true])('同时有 Bot 和 Skill 查询失败；有新增待复核项：%s', async hasNew => {
  const result = await run({
    bots: [bot, { ...bot, slug: 'failed', templateUrl: 'https://x.ai/bot/failed' }],
    templateMeta: async id => id === 'failed' ? { ok: false, kind: 'error', message: 'HTTP 429' } : ok,
    skills: [skill('docs')], github: async () => { throw new Error('fetch failed') },
  })
  const previous = hasNew ? [] : ['bot:b:changed:2', 'bot:old:error:1']
  const open = { body: `旧报告\n\n<!-- upstream-watch keys=${JSON.stringify(previous)} -->` }
  const body = report(result), keys = findingKeys(result), lines = findingLines(result)
  expect(body).toContain('## 核对失败\n\n- **Bot**（`failed`）：没查成（请求太频繁，被限流了）\n- **docs**（`docs`）：没查成（网络错误）')
  expect([...lines.keys()]).toEqual(['bot:b:changed:2'])
  expect(planIssue({ open, attention: result.attention, body, keys, lines })).toEqual([
    { action: 'update', body: `${body}\n\n<!-- upstream-watch keys=["bot:b:changed:2"] -->` },
    ...(hasNew ? [{ action: 'comment', body: `新增待复核：\n${botRow(`${botChange}，带「外部账号」 · ${botLinks}`)}` }] : []),
  ])
})
