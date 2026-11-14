// 把每个 Bot 的截图和头像复制到 site/public/bot-assets/<slug>/，网站用 /bot-assets/<slug>/<文件名> 引用。
// 同时生成 site/public/api-data/slugs.json（全部 slug），计数接口靠它判断 slug 是否存在，见 docs/dev/API.md。
// 这两个目录都是生成物，已 gitignore；每次 dev / build 前重建。
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { ROOT, loadAllBots } from './lib/load-bots.mjs'

const OUT = join(ROOT, 'site', 'public', 'bot-assets')
const API_DATA = join(ROOT, 'site', 'public', 'api-data')
rmSync(OUT, { recursive: true, force: true })
const bots = loadAllBots()
mkdirSync(API_DATA, { recursive: true })
writeFileSync(join(API_DATA, 'slugs.json'), JSON.stringify(bots.map((b) => b.slug)) + '\n')
let n = 0
for (const bot of bots) {
  const dest = join(OUT, bot.slug)
  const files = [...bot.screenshots.filter((s) => s.isImage).map((s) => s.path), ...(bot.avatar ? [bot.avatar.path] : [])]
  if (!files.length) continue
  mkdirSync(dest, { recursive: true })
  for (const f of files) {
    cpSync(f, join(dest, f.split('/').pop()))
    n++
  }
}
console.log(`[sync-assets] ${bots.length} 个 Bot；已复制 ${n} 个图片文件到 site/public/bot-assets/，已写 site/public/api-data/slugs.json`)
