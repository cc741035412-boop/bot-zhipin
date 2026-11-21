import { readFileSync } from 'node:fs'
import { parseArgs } from 'node:util'
import { pathToFileURL } from 'node:url'
import { runIngest } from './lib/pipeline.mjs'

export { runIngest }
const usage = '用法：node scripts/ingest/run.mjs --src <克隆目录> [--out <输出目录，默认 library>] [--bots <已上架目录，默认 bots>] [--dump-records <文件>]\n--dump-records：导出许可回溯和安全扣留后、去重前的记录（按 id 排序的 JSONL）；仅供排查，请写到仓库外。\n使用 --help 查看本说明。'
async function main() {
  const { values } = parseArgs({ options: { src: { type: 'string' }, out: { type: 'string' }, bots: { type: 'string' }, 'dump-records': { type: 'string' }, help: { type: 'boolean' } } })
  if (values.help) { console.log(usage); return }
  if (!values.src) throw new Error(`缺少 --src。${usage}`)
  const { sources } = JSON.parse(readFileSync(new URL('./sources.json', import.meta.url), 'utf8'))
  const adapters = await import('./adapters/index.mjs')
  const { stats: s, annotationsPruned } = runIngest({ sources, adapters, srcRoot: values.src, outDir: values.out, botsDir: values.bots, dumpRecords: values['dump-records'] })
  console.log(`入库完成：${sources.length} 个来源，全文 ${s.fullText.before} → ${s.fullText.after} 组，链接 ${s.links.before} → ${s.links.after} 组。\n许可回溯 ${s.licenseTraced} 行，密钥扣留 ${s.secretHits} 条；已上架全文 ${s.listed.fullText} 组、链接 ${s.listed.links} 组。\n中文注释覆盖 ${s.annotations.covered}/${s.annotations.total} 个全文组，本次清理失配注释 ${annotationsPruned} 行。详细分布见输出目录的 stats.json。`)
}
if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  main().catch(error => { console.error(`入库失败：${error.message}`); process.exitCode = 1 })
}
