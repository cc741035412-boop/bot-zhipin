// 本地 wrangler pages dev 需要 .dev.vars（已 gitignore）。只补缺失键，绝不覆盖已有值或打印值。
import { appendFileSync, copyFileSync, existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ROOT } from './lib/load-bots.mjs'

const target = join(ROOT, '.dev.vars')
const example = join(ROOT, '.dev.vars.example')
if (!existsSync(target)) {
  copyFileSync(example, target)
  console.log('[dev-vars] 已从 .dev.vars.example 生成 .dev.vars（仅本地使用）')
} else {
  const current = readFileSync(target, 'utf8')
  const keyOf = (line) => /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=/.exec(line)?.[1]
  const keys = new Set(current.split(/\r?\n/).map(keyOf).filter(Boolean))
  const additions = readFileSync(example, 'utf8').split(/\r?\n/).filter((line) => {
    const key = keyOf(line)
    if (!key || keys.has(key)) return false
    keys.add(key)
    return true
  })
  if (additions.length) {
    appendFileSync(target, `${current.endsWith('\n') || !current ? '' : '\n'}\n# 从 example 补齐，仅限本地；线上绝不能设置 ALLOW_TEST_ENDPOINTS。\n${additions.join('\n')}\n`)
    console.log(`[dev-vars] 已追加缺失键：${additions.map(keyOf).join('、')}（保留已有值）`)
  }
}
