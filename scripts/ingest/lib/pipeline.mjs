import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { mergeAnnotations } from './annotations.mjs'
import { loadListed } from './context.mjs'
import { deduplicate } from './groups.mjs'
import { traceLicenses } from './license.mjs'
import { dumpRecordsFile, writeOutput } from './output.mjs'
import { byId } from './records.mjs'
import { RULES, screen } from './review.mjs'
import { stripSharePageText } from './share-page.mjs'

function tally(values, keys = []) {
  const counts = new Map(keys.map(k => [k, 0]))
  for (const k of values) counts.set(k, (counts.get(k) ?? 0) + 1)
  return Object.fromEntries(counts)
}
function previousPruned(outDir) {
  // 孤行已经从注释输入里消失；把累计清理数留在 stats，重跑时不会变回 0。
  try {
    const n = JSON.parse(readFileSync(join(outDir, 'stats.json'), 'utf8')).annotations?.dropped
    return Number.isSafeInteger(n) && n >= 0 ? n : 0
  } catch (e) { if (e.code === 'ENOENT' || e instanceof SyntaxError) return 0; throw e }
}
export function runIngest({ sources, adapters, srcRoot, outDir = 'library', botsDir = 'bots', dumpRecords }) {
  const raw = [], perSource = {}, dropped = new Map()
  for (const source of sources) {
    try {
      const result = adapters[source.key]({ root: resolve(srcRoot, source.dir), source })
      for (const r of result.records) raw.push(r)
      const reasons = new Map()
      for (const { reason, count = 1 } of result.dropped) {
        reasons.set(reason, (reasons.get(reason) ?? 0) + count)
        dropped.set(reason, (dropped.get(reason) ?? 0) + count)
      }
      perSource[source.key] = { records: tally(result.records.map(r => r.kind)), dropped: Object.fromEntries(reasons) }
    } catch (error) { throw new Error(`来源 ${source.key} 入库失败：${error.message}`, { cause: error }) }
  }
  const cleaned = stripSharePageText(raw.sort(byId))
  const traced = traceLicenses(cleaned.records), records = traced.records.map(screen)
  if (dumpRecords) dumpRecordsFile(dumpRecords, records)
  const { texts, links } = deduplicate(records, loadListed(botsDir))
  const annotations = mergeAnnotations(outDir, records, texts)
  const covered = texts.filter(t => t.zh).length
  const withheld = records.filter(r => r.extra.withheld === 'secret').map(({ id, needsReview, extra }) => ({ id, needsReview, withheld: extra.withheld }))
  const stats = {
    sources: perSource, sharePageText: cleaned.sharePageText, dropped: Object.fromEntries(dropped), fullText: { before: records.filter(r => r.body).length, after: texts.length },
    links: { before: records.filter(r => r.shareId).length, after: links.length }, licenses: tally(records.map(r => r.license)), licenseTraced: traced.traced,
    scores: tally(texts.map(r => r.score), [0, 1, 2, 3, 4, 5, null]),
    cnFit: { fullText: tally(texts.map(r => r.cnFit.value)), links: tally(links.map(r => r.cnFit.value)) },
    needsReview: tally(records.flatMap(r => r.needsReview.rules), [...RULES.map(r => r.id), 'R-secret']),
    listed: { fullText: texts.filter(r => r.listed).length, links: links.filter(r => r.listed).length },
    annotations: { covered, total: texts.length, coverage: texts.length ? covered / texts.length : 0, dropped: previousPruned(outDir) + annotations.dropped },
    secretHits: withheld.length, withheld,
  }
  writeOutput({ outDir, texts, links, records, rows: annotations.rows, stats })
  return { stats, annotationsPruned: annotations.dropped }
}
