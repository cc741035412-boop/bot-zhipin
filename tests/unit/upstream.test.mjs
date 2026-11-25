import { expect, it, vi } from 'vitest'
import { checkUpstream, report, planIssue } from '../../scripts/lib/upstream.mjs'
const bot = { slug: 'b', name: 'Bot', templateUrl: 'https://x.ai/bot/b', templateVersion: 1, permissions: ['外部账号'] }
const ok = { ok: true, published: true, version: 2 }
const sha = 'a'.repeat(40), url = `https://github.com/O/R/tree/${sha}`
const skill = path => ({ slug: path || 'root', name: path, source: { url: `${url}/${path}` } })
const run = options => checkUpstream({ bots: [], skills: [], checkedAt: 'now', ...options })
it.each([[ok, 1, 'changed'], [ok, undefined, 'missing'], [{ ok: false, kind: 'not_found' }, 2, 'gone'], [{ ...ok, published: false }, 2, 'unpublished'], [{ ok: false, kind: 'error' }, 2, 'error']])('Bot %j %s → %s', async (meta, templateVersion, kind) => {
  const r = await run({ bots: [{ ...bot, templateVersion }], templateMeta: async () => meta })
  expect(r.bots.findings).toMatchObject([{ kind, sensitive: true }]); expect(r.attention).toBe(true)
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
it('全部一致时无空节', async () => expect(report(await run({}))).toMatch(/^全部和审过的版本一致：0 个 Bot、0 个 Skill。\n\n处理办法见/))
it('报告节按优先级排列', async () => {
  const r = await run({ bots: [bot, { ...bot, permissions: [] }, { ...bot, templateVersion: null }], templateMeta: async () => ok, skills: [skill('docs')], github: gh() })
  expect(report(r).match(/^## .+$/gm)).toEqual(['## 需要先看', '## Bot 模板改过', '## 没记审过的版本', '## Skill 上游改过'])
})
it.each([[null, true, ['create']], [{ body: '<!-- upstream-watch keys=["k"] -->' }, true, ['update']], [{ body: '' }, true, ['update', 'comment']], [{}, false, ['comment', 'close']], [null, false, []]])('issue %j %s', (open, attention, expected) => {
  expect(planIssue({ open, attention, keys: ['k'], body: '报告' }).map(a => a.action)).toEqual(expected)
})
