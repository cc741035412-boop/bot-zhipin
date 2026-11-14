// 把每个 Bot 的截图和头像复制到 site/public/bot-assets/<slug>/，网站用 /bot-assets/<slug>/<文件名> 引用。
// 同时生成 site/public/api-data/slugs.json（全部 slug），计数接口靠它判断 slug 是否存在，见 docs/dev/API.md。
// 这两个目录都是生成物，已 gitignore；每次 dev / build 前重建。
import { copyFileSync, lstatSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { basename, join, relative, resolve, sep } from 'node:path'
import { pathToFileURL } from 'node:url'
import { ROOT, BOTS_DIR, loadAllBots } from './lib/load-bots.mjs'
import { isPublicBot } from './lib/public-bot.mjs'

const OUT = join(ROOT, 'site', 'public', 'bot-assets')
const API_DATA = join(ROOT, 'site', 'public', 'api-data')
function safeFile(root, file) {
  const parts = relative(root, file).split(sep)
  if (parts.includes('..') || !lstatSync(root, { throwIfNoEntry: false })?.isDirectory()) return false
  let path = root
  return parts.every((part, index) => {
    path = join(path, part)
    const stat = lstatSync(path, { throwIfNoEntry: false })
    return index === parts.length - 1 ? stat?.isFile() : stat?.isDirectory()
  })
}

export function syncAssets({ botsDir = BOTS_DIR, out = OUT, apiData = API_DATA } = {}) {
  rmSync(out, { recursive: true, force: true })
  const bots = loadAllBots(botsDir).filter(isPublicBot)
  mkdirSync(apiData, { recursive: true })
  writeFileSync(join(apiData, 'slugs.json'), JSON.stringify(bots.map((b) => b.slug)) + '\n')
  let n = 0
  for (const bot of bots) {
    const dest = join(out, bot.slug)
    const files = [...bot.screenshots.filter((s) => s.isImage).map((s) => s.path), ...(bot.avatar ? [bot.avatar.path] : [])]
    for (const file of files) {
      // 复制前再次检查整个相对路径，不能经过符号链接目录或复制链接文件。
      if (!safeFile(botsDir, file)) continue
      mkdirSync(dest, { recursive: true })
      copyFileSync(file, join(dest, basename(file)))
      n++
    }
  }
  return { bots: bots.length, images: n }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const { bots, images } = syncAssets()
  console.log(`[sync-assets] ${bots} 个 Bot；已复制 ${images} 个图片文件到 site/public/bot-assets/，已写 site/public/api-data/slugs.json`)
}
