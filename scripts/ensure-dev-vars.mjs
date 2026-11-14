// 本地 wrangler pages dev 需要 .dev.vars（已 gitignore）。没有就从 .dev.vars.example 复制一份。
import { copyFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { ROOT } from './lib/load-bots.mjs'

const target = join(ROOT, '.dev.vars')
if (!existsSync(target)) {
  copyFileSync(join(ROOT, '.dev.vars.example'), target)
  console.log('[dev-vars] 已从 .dev.vars.example 生成 .dev.vars（仅本地使用）')
}
