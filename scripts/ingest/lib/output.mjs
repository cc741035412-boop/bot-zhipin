import { mkdirSync, mkdtempSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, posix } from 'node:path'
import { stringify } from 'yaml'
import { shareUrlOf } from './record.mjs'
import { sourceKey } from './records.mjs'
import { top50 } from './ranking.mjs'

const directories = { profile: 'profiles', prompt: 'prompts', skill: 'skills', routine: 'routines', team: 'teams', recipe: 'recipes' }
export function changesFor(r) {
  let base = '原文件全文收录，一字未改'
  const key = sourceKey(r)
  if (key === 'cobus' && r.kind === 'profile') base = '去掉原文件开头的 frontmatter（字段并入本文件头），正文一字未改'
  if (key === 'botdirectory') base = '去掉 frontmatter（字段并入本文件头），正文一字未改'
  if (key === 'grokbotdev') base = r.extra.promptBlock === false ? '去掉 frontmatter，正文一字未改' : '只收「## Prompt」下代码块里的提示词原文，一字未改；原页面的设置步骤和点评没有收'
  if (key === 'ronglecat') base = `从 playbook-prompts.zh.md 第 ${r.sourcePath.split('#')[1]} 节摘出代码块里的提示词，一字未改`
  return base + '；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的'
}
function filename(r, used) {
  const key = sourceKey(r), dir = directories[r.kind]
  if (!dir || !/^[a-z0-9-]+$/.test(key)) throw new Error(`不支持的全文类型或来源：${r.id}`)
  let raw = posix.parse(r.sourcePath).name
  if (key === 'cobus') raw = posix.basename(posix.dirname(r.sourcePath))
  if (key === 'ronglecat') raw = 'playbook-' + r.sourcePath.split('#')[1]
  const base = raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'item'
  for (let n = 1; ; n++) {
    const suffix = n === 1 ? '' : `-${n}`
    const slug = base.slice(0, 80 - suffix.length).replace(/-+$/g, '') + suffix
    const file = `${dir}/${key}--${slug}.md`
    if (!used.has(file)) { used.add(file); return file }
  }
}
function markdown(r) {
  const { attribution, ...extra } = r.extra
  const header = { id: r.id, kind: r.kind, title: r.title, zh: r.zh, source: r.sourceRepo, sourceUrl: r.sourceUrl,
    sourcePath: r.sourcePath, author: r.author, license: r.license, attribution: r.license === 'CC-BY-4.0' ? attribution : null,
    fetchedAt: r.fetchedAt, changes: changesFor(r), shareId: r.shareId, integrations: r.integrations, bodyHash: r.bodyHash,
    alsoIn: r.alsoIn, listed: r.listed, score: r.score, rubric: r.rubric, cnFit: r.cnFit, needsReview: r.needsReview,
    firstTask: r.firstTask, expect: r.expect, extra: Object.keys(extra).length ? extra : null }
  const entries = Object.entries(header).filter(([, v]) => v != null && v !== '' && !(Array.isArray(v) && !v.length))
  return `---\n${stringify(Object.fromEntries(entries), { aliasDuplicateObjects: false, lineWidth: 0 })}---\n\n${r.body}`
}
const jsonl = rows => rows.map(r => JSON.stringify(r) + '\n').join('')
export function dumpRecordsFile(file, records) {
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, jsonl(records.map(({ needsReview, ...record }) => record)))
}

const requiredLinkFields = new Set(['shareId', 'title', 'sources', 'status', 'cnFit'])
function compact(value, required) {
  if (Array.isArray(value)) return value.map(item => compact(item))
  if (value === null || typeof value !== 'object') return value
  const entries = Object.entries(value).map(([key, v]) => [key, compact(v)])
  return Object.fromEntries(entries.filter(([key, v]) => required?.has(key) ||
    (v != null && (typeof v !== 'object' || Object.keys(v).length > 0))))
}

export function writeOutput({ outDir, texts, links, records, rows, stats }) {
  // 先在独立目录生成；序列化失败时不清空上一版。最终只替换白名单中的名字。
  mkdirSync(outDir, { recursive: true })
  const stage = mkdtempSync(join(outDir, '.ingest-'))
  try {
    for (const d of Object.values(directories)) mkdirSync(join(stage, d))
    const used = new Set(), index = []
    for (const r of texts) {
      r.file = filename(r, used)
      writeFileSync(join(stage, r.file), markdown(r))
      const { id, kind, title, zh, file, license, score, cnFit, listed, shareId } = r
      index.push({ id, kind, title, zh, file, license, score, cnFit, needsReview: r.needsReview.flag, listed, alsoIn: r.alsoIn.length, shareId })
    }
    const linkOnly = records.filter(r => r.extra.linkOnly).map(r => ({ id: r.id, title: r.title,
      contributor: r.author?.name ?? null, scoutedBy: r.extra.scoutedBy ?? null,
      link: shareUrlOf(r.shareId) ?? r.extra.pageUrl, reason: r.extra.linkOnly.reason }))
    const files = { 'links.jsonl': jsonl(links.map(row => compact(row, requiredLinkFields))), 'index.jsonl': jsonl(index), 'link-only.jsonl': jsonl(linkOnly),
      'top50.jsonl': jsonl(top50(texts)), 'stats.json': JSON.stringify(stats, null, 2) + '\n' }
    for (const [name, data] of Object.entries(files)) writeFileSync(join(stage, name), data)
    writeFileSync(join(stage, 'zh.jsonl'), jsonl(rows))
    mkdirSync(join(outDir, 'annotations'), { recursive: true })
    for (const dir of Object.values(directories)) {
      rmSync(join(outDir, dir), { recursive: true, force: true })
      renameSync(join(stage, dir), join(outDir, dir))
    }
    for (const name of Object.keys(files)) renameSync(join(stage, name), join(outDir, name))
    renameSync(join(stage, 'zh.jsonl'), join(outDir, 'annotations/zh.jsonl'))
  } finally { rmSync(stage, { recursive: true, force: true }) }
}
