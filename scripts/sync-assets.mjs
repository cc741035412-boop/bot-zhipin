// 把每个 Bot 的截图和头像复制到 site/public/bot-assets/<slug>/，网站用 /bot-assets/<slug>/<文件名> 引用。
// 同时生成 site/public/api-data/slugs.json（全部 slug），计数接口靠它判断 slug 是否存在，见 docs/dev/API.md；
// 以及 squad-slugs.json（全部小队 slug），小队页的下架兜底（functions/squads/[slug].ts）靠它。
// 这两个目录都是生成物，已 gitignore；每次 dev / build 前重建。
import { copyFileSync, lstatSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { basename, join, relative, resolve, sep } from 'node:path'
import { pathToFileURL } from 'node:url'
import { execFileSync } from 'node:child_process'
import { ROOT, BOTS_DIR, loadAllBots, loadBot } from './lib/load-bots.mjs'
import { SCHEMA_SHA256 } from './lib/validate/generated/bot-schema.mjs'
import { MAX_IMAGE_BYTES } from './lib/validate/images.mjs'
import { LIMITS } from './submission/bundle-core.mjs'
import { explanations, shelfData } from '../site/.vitepress/data/bots.mjs'
import { isPublicBot, isPublicSquad } from './lib/public-bot.mjs'
import { loadAllSquads, squadsDirFor } from './lib/load-squads.mjs'

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

export function syncAssets({ botsDir = BOTS_DIR, squadsDir = squadsDirFor(botsDir), out = OUT, apiData = API_DATA } = {}) {
  rmSync(out, { recursive: true, force: true })
  const bots = loadAllBots(botsDir).filter(isPublicBot)
  mkdirSync(apiData, { recursive: true })
  writeFileSync(join(apiData, 'slugs.json'), JSON.stringify(bots.map((b) => b.slug)) + '\n')
  // 和网站生成页面用同一个口径（shelfData），清单里有的小队才有页面。
  const squads = shelfData(bots, { squads: loadAllSquads(squadsDir).filter(isPublicSquad), curation: {} }).squads.map((squad) => squad.slug)
  writeFileSync(join(apiData, 'squad-slugs.json'), JSON.stringify(squads) + '\n')
  let commit = process.env.CF_PAGES_COMMIT_SHA
  if (!commit) {
    try { commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() } catch { /* 仓库导出包没有 git 元数据 */ }
  }
  commit ||= 'local'
  const template = loadBot('_template', join(ROOT, 'bots'))
  const context = {
    v: 1, commit, schemaSha256: SCHEMA_SHA256,
    index: bots.map(({ slug, data }) => ({
      slug, name: data.name, templateUrl: data.templateUrl, authorGithub: data.author?.github || null,
      addedAt: data.addedAt, external: data.external === true,
      // 中文叫法只在写了的时候带上（投稿预览里「改编自」那一行用）
      ...(typeof data.nameZh === 'string' && data.nameZh ? { nameZh: data.nameZh } : {}),
    })).sort((a, b) => a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0),
    template: { files: Object.fromEntries(template.files.filter((file) => file.text !== null && /\.(?:yaml|md)$/.test(file.path))
      .map((file) => [relative(template.dir, file.path).split('\\').join('/'), file.text])) },
    copy: explanations(),
    limits: { files: LIMITS.files, fileBytes: LIMITS.fileBytes, totalBytes: LIMITS.totalBytes, imageBytes: MAX_IMAGE_BYTES },
  }
  writeFileSync(join(apiData, 'submit-context.json'), JSON.stringify(context) + '\n')
  writeFileSync(join(apiData, 'build.json'), JSON.stringify({ commit, builtAt: new Date().toISOString() }) + '\n')
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
  return { bots: bots.length, squads: squads.length, images: n }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const { bots, squads, images } = syncAssets()
  console.log(`[sync-assets] ${bots} 个 Bot、${squads} 支小队；已复制 ${images} 个图片文件到 site/public/bot-assets/，已写 site/public/api-data/slugs.json 和 squad-slugs.json`)
}
