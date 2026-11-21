import { afterEach, beforeEach, expect, it } from 'vitest'
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { textKey } from '../../scripts/ingest/lib/textkey.mjs'
import { tmpdir } from 'node:os'
import { basename, dirname, join } from 'node:path'
import { makeRecord } from '../../scripts/ingest/lib/record.mjs'
import { splitFrontmatter } from '../../scripts/ingest/lib/frontmatter.mjs'
import { runIngest } from '../../scripts/ingest/run.mjs'
import { changesFor } from '../../scripts/ingest/lib/output.mjs'
import { cnFit } from '../../scripts/ingest/lib/context.mjs'
import { top50 } from '../../scripts/ingest/lib/ranking.mjs'

const a = 'a'.repeat(21), b = 'b'.repeat(21)
const attr = { by: '测试贡献者', license: 'CC BY 4.0' }
const fixture = new URL('../fixtures/ingest/_pipeline/bots/', import.meta.url)
let temp, outDir, botsDir
beforeEach(() => {
  temp = mkdtempSync(join(tmpdir(), 'ingest-a1-'))
  outDir = join(temp, 'output'); botsDir = join(temp, 'bots'); cpSync(fixture, botsDir, { recursive: true })
})
afterEach(() => rmSync(temp, { recursive: true, force: true }))
function rec(sourceKey, sourcePath, fields = {}) {
  return makeRecord({ sourceKey, sourcePath, sourceRepo: `example/${sourceKey}`, sourceUrl: `https://example.invalid/${sourcePath}`,
    fetchedAt: '2026-01-01T00:00:00Z', license: 'MIT', kind: 'prompt', title: sourcePath, body: sourcePath, ...fields })
}
const link = (key, path, fields) => rec(key, path, { kind: 'bot-link', body: null, shareId: a, ...fields })
function ingest(records, dumpRecords) {
  const keys = [...new Set(records.map(r => r.id.split(':')[0]))]
  const sources = keys.map(key => ({ key, dir: `${key}/repo` }))
  const adapters = Object.fromEntries(keys.map(key => [key, ({ root, source }) => {
    expect(root).toBe(join(temp, key, 'repo')); expect(source.key).toBe(key)
    return { records: records.filter(r => r.id.startsWith(key + ':')), dropped: [{ reason: '不是条目', count: 2 }] }
  }]))
  return runIngest({ srcRoot: temp, sources, adapters, botsDir, outDir, dumpRecords }).stats
}
const put = (file, text) => { mkdirSync(dirname(join(outDir, file)), { recursive: true }); writeFileSync(join(outDir, file), text) }
const read = file => readFileSync(join(outDir, file), 'utf8')
const lines = file => read(file).split('\n').filter(Boolean).map(s => JSON.parse(s))
const annotate = rows => put('annotations/zh.jsonl', rows.map(r => JSON.stringify(r)).join('\n'))
function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).sort((x, y) => x.name.localeCompare(y.name)).flatMap(e => {
    const path = join(dir, e.name); return e.isDirectory() ? files(path) : [path]
  })
}

it('按 bodyHash 合组，许可、来源、id 依次择主；从非主成员找到已上架和对应全文', () => {
  const same = { body: 'one two' }
  const records = [rec('cobus', 'z/a.md', same), rec('cobus', 'a/b.md', same), rec('sitin', 'm.md', { body: 'one\ntwo', shareId: a }),
    rec('cobus', 'c/d.md', { body: 'two', shareId: b }), rec('majiayu', 'q.md', { body: 'two', license: 'CC0-1.0' })]
  const stats = ingest(records)
  const index = lines('index.jsonl')
  expect(index.map(r => [r.id, r.alsoIn, r.listed])).toEqual([[records[1].id, 2, 'listed-sample'], [records[4].id, 1, null]])
  expect(splitFrontmatter(read(index[0].file)).data.alsoIn.map(s => s.id)).toEqual([records[0].id, records[2].id])
  expect(lines('links.jsonl').map(l => [l.shareId, l.fullText, l.listed])).toEqual([[a, [records[1].id], 'listed-sample'], [b, [records[4].id], undefined]])
  expect(lines('links.jsonl')[1]).not.toHaveProperty('listed')
  expect(stats.fullText).toEqual({ before: 5, after: 2 }); expect(stats.dropped).toEqual({ 不是条目: 6 })
})
it('链接字段各自择源，合并分类、标签、集成、集合，retired 须不在当前目录', () => {
  const g = link('grokbotdev', 'template.md', { license: 'CC-BY-4.0', extra: { summary: 'English', collections: ['B'], tags: ['z'], category: 'G' } })
  const bd = link('botdirectory', 'b.md', { author: { name: 'BD' }, integrations: ['Gmail'], extra: { description: 'other', tags: ['a'], category: 'B' } })
  const m = link('majiayu', 'catalog#m', { author: { name: 'M' }, extra: { summaryZh: '首选中文', collections: ['A', 'B'] } })
  const k = link('kydlikebtc', 'retired#k', { extra: { retired: true, summaryZh: '备用中文' } })
  ingest([m, k, bd, g]); const [row] = lines('links.jsonl')
  expect(row).toMatchObject({ title: g.title, author: bd.author, summary: { text: 'English', from: g.sourceRepo, license: g.license },
    summaryZh: { text: '首选中文', from: m.sourceRepo, license: m.license }, status: 'retired', categories: [{ from: g.sourceRepo, value: 'G' }, { from: bd.sourceRepo, value: 'B' }],
    tags: ['a', 'z'], collections: ['A', 'B'], integrations: ['Gmail'], cnFit: { value: '一般', blocked: ['Gmail'] } })
  expect(row.sources.map(s => s.sourceUrl)).toEqual([g, bd, m, k].map(r => r.sourceUrl)); expect(row).not.toHaveProperty('score')
  ingest([k, link('kydlikebtc', 'catalog#k', {})]); expect(lines('links.jsonl')[0].status).toBe('live')
  ingest([bd]); expect(lines('links.jsonl')[0].status).toBe('live')
})
it('许可回溯：归一化等值、60 字符前缀可追，过短、不等和不同分享 ID 不追', () => {
  const prefix = 'p'.repeat(60), from = 'ZeroPointRepo/GrokBotDev'
  const g = link('grokbotdev', 'content/templates/x.md', { sourceRepo: from, extra: { summary: 'Hello,   world!', tagline: prefix + ' more', attribution: attr }, license: 'CC-BY-4.0' })
  const rows = ['hello world', prefix, prefix.slice(1), 'different', 'hello world'].map((summary, i) => link('majiayu', `catalog#${i}`, { shareId: i === 4 ? b : a, extra: { summary }, license: 'CC0-1.0' }))
  const stats = ingest([g, ...rows]); expect(stats.licenseTraced).toBe(2)
  const members = lines('links.jsonl').flatMap(l => l.sources).filter(s => s.sourceRepo.endsWith('/majiayu'))
  expect(members.map(s => s.license)).toEqual(['CC-BY-4.0', 'CC-BY-4.0', 'CC0-1.0', 'CC0-1.0', 'CC0-1.0'])
  for (const m of members.slice(0, 2)) expect(m).toMatchObject({ attribution: attr, licenseTrace: { from, sourcePath: g.sourcePath } })
})
it.each([
  [['Grok', 'X', 'x.ai'], 'Googled google docsify', null, []], [['my-GMAIL-plugin'], '', null, ['Gmail']],
  [[], '看YouTube视频，而非 myYouTube2。', null, ['YouTube']], [[], 'YouTubers', '经 Google Calendar 整理', ['Google Calendar']],

  [[], 'Check the timeline line by line, reply in the email threads, flag a strong signal, medium priority.', null, []],
  [['LINE'], 'Post the recap on medium.com and to the LINE Official Account.', null, ['Medium', 'LINE']],
  [['Signal Messenger'], 'Mirror it to Threads.net.', null, ['Signal', 'Threads']],
])('国内适配：%j / %s', (integrations, body, summary, blocked) => expect(cnFit([{ integrations, body, extra: { summary } }])).toEqual({ value: blocked.length ? '一般' : '好', blocked }))

it('成员注释回退、主注释优先，评分只看五个 true，保留任务与过期标记，清理孤行', () => {
  const p = rec('cobus', 'skills/foo/SKILL.md', { kind: 'skill' }), m = rec('sitin', 'copy.md', { body: p.body })
  const rubric = { task: true, input: true, approval: false, extra: true }
  annotate([{ id: m.id, zh: { title: '成员注释' }, rubric, bodyHash: 'old' }, { id: 'unknown' }]); put('annotations/first-tasks.jsonl', JSON.stringify({ id: m.id, firstTask: '给一条样本', expect: '列出名字' }))
  const s = ingest([m, p]); expect(s.annotations).toEqual({ covered: 1, total: 1, coverage: 1, dropped: 1 })
  expect(lines('annotations/zh.jsonl')).toEqual([{ id: m.id, zh: { title: '成员注释' }, rubric, bodyHash: m.bodyHash, zhStale: true }])
  const [row] = lines('top50.jsonl'); expect(row).toMatchObject({ id: p.id, score: 2, zh: { title: '成员注释' }, firstTask: '给一条样本', expect: '列出名字' })
  expect(splitFrontmatter(read(row.file)).data.extra.zhStale).toBe(true)
  annotate([...lines('annotations/zh.jsonl'), { id: p.id, zh: { title: '主注释' } }]); ingest([m, p])
  expect(lines('top50.jsonl')[0]).toMatchObject({ score: null, zh: { title: '主注释' } }); expect(lines('annotations/zh.jsonl').map(x => x.id)).toEqual([p.id, m.id])
})
it('前 50 先比评分、安全和国内适配，再轮流取来源；同来源按 id', () => {
  const r = (id, score = 5, flag = false, value = '好') => ({ id, score, needsReview: { flag }, cnFit: { value } })
  const rows = [r('sitin:1'), r('cobus:b'), r('grokbotdev:1'), r('cobus:a'), r('majiayu:1', 5, true), r('cobus:c', 5, false, '一般'),
    ...Array.from({ length: 48 }, (_, i) => r(`cobus:low-${i}`, 4))]
  const ranked = top50(rows); expect(ranked).toHaveLength(50); expect(ranked.at(-1).rank).toBe(50)
  expect(ranked.slice(0, 6).map(t => t.id)).toEqual(['cobus:a', 'grokbotdev:1', 'sitin:1', 'cobus:b', 'cobus:c', 'majiayu:1'])
})
it('写盘：文件名清洗、撞名、80 字符上限、frontmatter 顺序、署名与正文', () => {
  const cc = rec('grokbotdev', 'content/use-cases/a B.md', { body: '# 标题\n\n  缩进  \n  下一行', license: 'CC-BY-4.0', extra: { attribution: attr, setup: '另存' } })
  const mit = rec('grokbotdev', 'content/use-cases/a-b.md', { extra: { attribution: attr, promptBlock: false } })
  const long = rec('sitin', `examples/${'t'.repeat(100)}.md`, { kind: 'recipe' })
  ingest([cc, mit, long]); const [x, y, z] = lines('index.jsonl')
  expect([x.file, y.file, z.file]).toEqual(['prompts/grokbotdev--a-b.md', 'prompts/grokbotdev--a-b-2.md', `recipes/sitin--${'t'.repeat(80)}.md`])
  const { data, body } = splitFrontmatter(read(x.file)); expect(body).toBe('\n' + cc.body)
  expect(Object.keys(data)).toEqual(['id', 'kind', 'title', 'source', 'sourceUrl', 'sourcePath', 'license', 'attribution', 'fetchedAt', 'changes', 'bodyHash', 'cnFit', 'needsReview', 'extra'])
  expect(data.attribution).toEqual(attr); expect(read(y.file)).not.toContain('attribution'); expect(x).not.toHaveProperty('body')
  expect(data.changes).toBe('只收「## Prompt」下代码块里的提示词原文，一字未改；原页面的设置步骤和点评没有收；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的')
})
it.each([
  ['cobus', 'profile', '去掉原文件开头的 frontmatter（字段并入本文件头），正文一字未改'], ['cobus', 'team', '原文件全文收录，一字未改'],
  ['sitin', 'recipe', '原文件全文收录，一字未改'], ['majiayu', 'recipe', '原文件全文收录，一字未改'], ['grokbotdev', 'prompt', '去掉 frontmatter，正文一字未改'],
  ['botdirectory', 'prompt', '去掉 frontmatter（字段并入本文件头），正文一字未改'], ['ronglecat', 'prompt', '从 playbook-prompts.zh.md 第 3 节摘出代码块里的提示词，一字未改'],
])('changes 文案：%s / %s', (key, kind, base) => expect(changesFor(rec(key, 'example.md#3', { kind, extra: { promptBlock: false } }))).toBe(base + '；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的'))

it('密钥及超大正文都检查；命中只留标记，所有文件均不含凭据', () => {
  const token = ['gh', 'p_', 'A'.repeat(38)].join('')
  const rs = [rec('sitin', 'short.md', { body: token, shareId: a }), rec('sitin', 'long.md', { body: '甲'.repeat(35000) + token }), rec('sitin', 'large-safe.md', { body: '乙'.repeat(35000) })]
  const s = ingest(rs); expect(s.secretHits).toBe(2); expect(s.needsReview['R-secret']).toBe(2); expect(lines('index.jsonl').map(r => r.id)).toEqual([rs[2].id])
  const [row] = lines('links.jsonl')
  expect(row).not.toHaveProperty('fullText'); expect(row.needsReview).toEqual({ flag: true, rules: ['R-secret'] })
  expect(row.sources).toMatchObject([{ withheld: 'secret' }])
  expect(files(outDir).some(f => readFileSync(f, 'utf8').includes(token))).toBe(false)
})
it('同目录连续跑两遍逐文件字节相同；清理旧生成物但不改人工文件或首任务', () => {
  const full = rec('ronglecat', 'prompts/playbook-prompts.zh.md#7'), only = link('botdirectory', 'bots/test.md', { shareId: null, extra: { pageUrl: 'https://example.invalid/test', linkOnly: { reason: '需要来源' } } })
  const keep = ['LICENSES.md', 'README.md', 'annotations/notes.txt']; for (const f of keep) put(f, '保留\r\n')
  const task = JSON.stringify({ id: full.id, firstTask: '测试' }); put('annotations/first-tasks.jsonl', task)
  put('prompts/stale.md', '待清理'); annotate([{ id: full.id, zh: { title: '测试' }, bodyHash: 'old' }, { id: 'stale' }])
  const snapshot = () => files(outDir).map(f => [f, readFileSync(f).toString('base64')])
  ingest([full, only]); const first = snapshot(); ingest([full, only]); expect(snapshot()).toEqual(first)
  expect(existsSync(join(outDir, 'prompts/stale.md'))).toBe(false); for (const f of keep) expect(read(f)).toBe('保留\r\n')
  expect(read('annotations/first-tasks.jsonl')).toBe(task); expect(lines('index.jsonl')[0].file).toBe('prompts/ronglecat--playbook-7.md')
  expect(lines('link-only.jsonl')).toEqual([{ id: only.id, title: only.title, contributor: null, scoutedBy: null, link: only.extra.pageUrl, reason: '需要来源' }])
})
it('同组收集多个指纹：剔除命中字段后按来源回退，不影响别组', () => {
  const first = 'Shared intro ' + 'x'.repeat(45), second = 'Another intro'
  const g = link('grokbotdev', 'g', { extra: { summary: first.toUpperCase() + ' suffix', tagline: second } })
  const bd = link('botdirectory', 'bd', { extra: { description: second + '!' } })
  const m = link('majiayu', 'm', { extra: { summary: '维护者另写的摘要' } })
  const stats = ingest([g, bd, m, link('kydlikebtc', 'k', { extra: { officialKey: textKey(first), summaryDropped: 'x.ai 分享页原文' } }),
    link('ronglecat', 'r', { extra: { officialKey: textKey(second) } }), link('grokbotdev', 'other', { shareId: b, extra: { tagline: second } })])
  const [group, other] = lines('links.jsonl')
  expect(group.summary).toEqual({ text: m.extra.summary, license: m.license, from: m.sourceRepo })
  expect(other.summary.text).toBe(second)
  expect(stats.sharePageText).toEqual({ grokbotdev: 1, botdirectory: 1, kydlikebtc: 1 })
})
it('全部命中时省略 summary，summaryZh 即使同指纹也保留', () => {
  const summary = '同一段介绍', officialKey = textKey(summary)
  ingest([link('majiayu', 'm', { extra: { summary, summaryZh: summary } }), link('kydlikebtc', 'k', { extra: { officialKey } })])
  const [row] = lines('links.jsonl')
  expect(row).not.toHaveProperty('summary'); expect(row.summaryZh.text).toBe(summary)
})
it('许可回溯两侧独立排除分享页文字，同条中未命中的字段仍可回溯', () => {
  // 两侧按许可规则去标点后相同，但 textKey 将标点转为空格，只命中其中一侧。
  const g = link('grokbotdev', 'g', { extra: { summary: 'one,two', tagline: 'threefour', attribution: attr } })
  const rows = ['onetwo', 'three,four', 'threefour'].map((summary, i) => link('majiayu', `m${i}`, { extra: { summary } }))
  const keys = ['one,two', 'three,four'].map((text, i) => link('kydlikebtc', `k${i}`, { extra: { officialKey: textKey(text) } }))
  const stats = ingest([g, ...rows, ...keys]); expect(stats.licenseTraced).toBe(1)
  expect(lines('links.jsonl')[0].sources.filter(s => s.sourceRepo === rows[0].sourceRepo).map(s => s.license)).toEqual(['MIT', 'MIT', 'CC-BY-4.0'])
})
it('链接行保留必填和非空字段，只省略相同作者；全文仍保留安全摘录', () => {
  const author = { name: '甲', role: 'sharer' }, distinct = { name: '甲' }
  const g = rec('grokbotdev', 'g.md', { author, shareId: b, body: '自动回复客户' })
  ingest([g, link('majiayu', 'm', { author, shareId: b }), link('kydlikebtc', 'k', { author: distinct, shareId: b }),
    link('sitin', 's', { shareId: b }), link('botdirectory', 'bare', { extra: { attribution: {} }, license: 'CC-BY-4.0' })])
  const [bare, row] = lines('links.jsonl')
  expect(Object.keys(bare).sort()).toEqual(['cnFit', 'listed', 'needsReview', 'shareId', 'sources', 'status', 'title'])
  expect(bare.sources[0]).not.toHaveProperty('attribution'); expect(bare.cnFit).toEqual({ value: '好' })
  expect(bare.needsReview).toEqual({ flag: false }); expect(row.author).toEqual(author)
  expect(row.sources.map(s => s.author)).toEqual([undefined, undefined, distinct, undefined])
  expect(row.needsReview).toEqual({ flag: true, rules: ['R-send'] })
  expect(splitFrontmatter(read(lines('index.jsonl')[0].file)).data.needsReview.hits).toEqual([{ rule: 'R-send', excerpt: g.body }])
})
it('排查文件保留每条记录的原格式，但先执行许可回溯、分享页剔除和安全扣留', () => {
  const g = link('grokbotdev', 'g', { extra: { summary: '独立说明', tagline: '分享介绍', attribution: attr } })
  const m = link('majiayu', 'm', { extra: { summary: g.extra.summary } })
  const k = link('kydlikebtc', 'k', { extra: { officialKey: textKey(g.extra.tagline) } })
  const secret = rec('sitin', 's', { body: ['gh', 'p_', 'B'.repeat(38)].join('') })
  const path = join(temp, 'debug.jsonl'); ingest([secret, m, k, g], path)
  const data = readFileSync(path, 'utf8'), rows = data.trimEnd().split('\n').map(s => JSON.parse(s))
  expect(rows.map(r => r.id)).toEqual([g.id, k.id, m.id, secret.id]); expect(Object.keys(rows[0])).toEqual(Object.keys(g))
  expect(rows[2]).toMatchObject({ license: 'CC-BY-4.0', extra: { attribution: attr, licenseTrace: { sourcePath: g.sourcePath } } })
  expect(rows[3]).toMatchObject({ body: null, extra: { withheld: 'secret' } }); expect(data).not.toContain(secret.body); expect(data).not.toContain(g.extra.tagline)
})
it('--dump-records 通过 CLI 导出全部 fixture 记录，一行一条，按 id 排序', () => {
  const { sources } = JSON.parse(readFileSync('scripts/ingest/sources.json', 'utf8'))
  for (const { key, dir } of sources) cpSync(fileURLToPath(new URL(`../fixtures/ingest/${key}/`, import.meta.url)), join(temp, dir), { recursive: true })
  const path = join(temp, '排查.jsonl')
  execFileSync(process.execPath, ['scripts/ingest/run.mjs', '--src', temp, '--out', outDir, '--bots', botsDir, '--dump-records', path])
  const counts = Object.values(JSON.parse(read('stats.json')).sources).flatMap(s => Object.values(s.records))
  const ids = readFileSync(path, 'utf8').trimEnd().split('\n').map(line => JSON.parse(line).id)
  expect(ids.length).toBeGreaterThan(1); expect(ids).toHaveLength(counts.reduce((a, b) => a + b, 0)); expect(ids).toEqual([...ids].sort())
})
it('适配器抛错指明来源，不动输出', () => {
  expect(() => runIngest({ sources: [{ key: 'sitin', dir: '.' }], adapters: { sitin() { throw Error('读失败') } }, srcRoot: temp, outDir, botsDir })).toThrow(/sitin.*读失败/)
  expect(existsSync(outDir)).toBe(false)
})
it('站点数据加载器、配置和构建资产脚本与原料仓隔离', () => {
  const loaders = files('site/.vitepress').filter(f => /\.data\.|^config\./.test(basename(f)))
  expect(loaders.length).toBeGreaterThan(1)
  for (const f of [...loaders, 'scripts/sync-assets.mjs', 'scripts/lib/load-bots.mjs']) expect(readFileSync(f, 'utf8'), f).not.toContain('library')
})
