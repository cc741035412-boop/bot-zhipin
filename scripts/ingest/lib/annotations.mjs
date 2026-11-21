import { lstatSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { byId } from './records.mjs'

function readRows(file) {
  const rows = new Map()
  let text
  try { text = readFileSync(file, 'utf8') } catch (error) {
    if (error.code === 'ENOENT') return rows
    throw error
  }
  for (const [i, line] of text.split('\n').entries()) {
    if (!line.trim()) continue
    try {
      const row = JSON.parse(line)
      if (typeof row.id !== 'string' || rows.has(row.id)) throw new Error('id 缺失或重复')
      rows.set(row.id, row)
    } catch (error) { throw new Error(`${file} 第 ${i + 1} 行：请检查注释，${error.message}`) }
  }
  return rows
}
const rubricKeys = ['task', 'input', 'steps', 'acceptance', 'approval']
export function mergeAnnotations(outDir, records, texts) {
  const dir = join(outDir, 'annotations')
  const stat = lstatSync(dir, { throwIfNoEntry: false })
  if (stat && !stat.isDirectory()) throw new Error(`请使用普通注释目录：${dir}`)
  const zh = readRows(join(dir, 'zh.jsonl'))
  const tasks = readRows(join(dir, 'first-tasks.jsonl'))
  const matched = new Map()
  for (const r of records) {
    const a = zh.get(r.id)
    if (!a) continue
    const stale = a.zhStale || (a.bodyHash && a.bodyHash !== r.bodyHash)
    matched.set(r.id, { ...a, bodyHash: r.bodyHash, ...(stale ? { zhStale: true } : {}) })
  }
  for (const t of texts) {
    const a = t.members.map(m => matched.get(m.id)).find(Boolean)
    const task = t.members.map(m => tasks.get(m.id)).find(Boolean)
    t.zh = a?.zh ?? null
    t.rubric = a?.rubric ?? null
    t.score = t.rubric ? rubricKeys.filter(k => t.rubric[k] === true).length : null
    t.extra = { ...t.extra, ...(a?.zhStale ? { zhStale: true } : {}), ...(a?.note ? { note: a.note } : {}) }
    t.firstTask = task?.firstTask ?? null
    t.expect = task?.expect ?? null
  }
  return { rows: [...matched.values()].sort(byId), dropped: zh.size - matched.size }
}
