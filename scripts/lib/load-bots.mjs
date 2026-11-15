// Node 读取适配器：不跟随符号链接；模型解析和校验由纯内核完成。
import { lstatSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildBotModel } from './bot-model.mjs'
import { imageFormat } from './validate/images.mjs'
export { IMAGE_EXTS, parseFrontmatter } from './bot-model.mjs'

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
export const BOTS_DIR = process.env.BOTS_DIR ? resolve(ROOT, process.env.BOTS_DIR) : join(ROOT, 'bots')
export const SCHEMA_PATH = join(ROOT, 'schema', 'bot.schema.json')

export function loadEnums() {
  const p = JSON.parse(readFileSync(SCHEMA_PATH, 'utf8')).properties
  return { categories: p.category.enum, permissions: p.permissions.items.enum, quotaCosts: p.quotaCost.enum }
}

export function listBotDirs(botsDir = BOTS_DIR) {
  if (!lstatSync(botsDir, { throwIfNoEntry: false })?.isDirectory()) return []
  return readdirSync(botsDir, { withFileTypes: true })
    .filter((d) => (d.isDirectory() || d.isSymbolicLink()) && !d.name.startsWith('_') && !d.name.startsWith('.'))
    .map((d) => d.name).sort()
}

function walk(path, files, directories, symlinks, rel) {
  const stat = lstatSync(path, { throwIfNoEntry: false })
  if (!stat) return
  if (stat.isSymbolicLink()) symlinks.push(rel(path))
  else if (stat.isDirectory()) {
    directories.add(path)
    for (const name of readdirSync(path).sort()) walk(join(path, name), files, directories, symlinks, rel)
  } else if (stat.isFile()) files.set(path, { path, rel: rel(path), size: stat.size })
}

export function loadBot(slug, botsDir = BOTS_DIR) {
  const dir = join(botsDir, slug), base = dirname(botsDir)
  const rel = (p) => relative(base, p).split('\\').join('/')
  const local = (p) => relative(dir, p).split('\\').join('/')
  const files = new Map(), directories = new Set(), symlinks = []
  if (lstatSync(botsDir, { throwIfNoEntry: false })?.isSymbolicLink()) symlinks.push(rel(botsDir))
  else walk(dir, files, directories, symlinks, rel)
  const entries = [...files.values()].map((file) => {
    const bytes = readFileSync(file.path)
    return { rel: local(file.path), size: file.size, head: new Uint8Array(bytes.subarray(0, 16)), text: bytes.toString('utf8') }
  })
  // 保留旧 loadBot 的 raw/role/design/技能正文，即使文件过大；扫描用的 FileEntry 则遵守文本限额。
  const model = buildBotModel(slug, { files: entries, dirs: [...directories].map(local) })
  const decorate = (file) => ({ ...file, path: join(dir, file.rel), rel: rel(join(dir, file.rel)) })
  const bounded = (file) => ({ ...file, text: file.size > 100 * 1024 || imageFormat(file.head) ? null : file.text })
  return {
    ...model, dir, rel: rel(dir), yamlPath: join(dir, 'bot.yaml'), yamlRel: rel(join(dir, 'bot.yaml')),
    skills: model.skills.map(decorate), screenshots: model.screenshots.map((file) => decorate(bounded(file))),
    avatar: model.avatar ? decorate(bounded(model.avatar)) : null,
    files: model.files.map((file) => decorate(bounded(file))), symlinks,
  }
}

export function loadAllBots(botsDir = BOTS_DIR) {
  return listBotDirs(botsDir).map((slug) => loadBot(slug, botsDir))
}
