// 读取 bots/ 下所有 Bot 的共享代码。校验器（scripts/validate.mjs）和网站（site/）都用它。
// 这里只负责「读」和「如实报告读到了什么」，不做任何校验判断；校验规则在 scripts/lib/validate/。
// 改这个文件会同时影响校验器和网站，改之前看 docs/dev/ARCHITECTURE.md。

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import YAML from 'yaml'

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
// 测试时可以用环境变量 BOTS_DIR 指向别的目录（比如 tests/fixtures/bots），相对路径按仓库根目录算
export const BOTS_DIR = process.env.BOTS_DIR ? resolve(ROOT, process.env.BOTS_DIR) : join(ROOT, 'bots')
export const SCHEMA_PATH = join(ROOT, 'schema', 'bot.schema.json')

export const IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.webp', '.gif']

/** 读 schema 里的枚举值：分类、权限、额度。网站和校验器都从这里取，别处不要写死。 */
export function loadEnums() {
  const schema = JSON.parse(readFileSync(SCHEMA_PATH, 'utf8'))
  const p = schema.properties
  return {
    categories: p.category.enum,
    permissions: p.permissions.items.enum,
    quotaCosts: p.quotaCost.enum,
  }
}

/** bots/ 下的 Bot 文件夹名。以 _ 或 . 开头的（比如 _template）不算 Bot。 */
export function listBotDirs(botsDir = BOTS_DIR) {
  if (!existsSync(botsDir)) return []
  return readdirSync(botsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('_') && !d.name.startsWith('.'))
    .map((d) => d.name)
    .sort()
}

/**
 * 解析 Markdown 开头的 YAML frontmatter（--- 包起来的那段）。
 * 返回 { data, body, error }：没有 frontmatter 时 data 为 null、error 为 null；
 * frontmatter 写坏了时 data 为 null、error 是说明文字。
 */
export function parseFrontmatter(text) {
  const src = text.replace(/^\uFEFF/, '')
  const m = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/.exec(src)
  if (!m) return { data: null, body: src, error: null }
  const doc = YAML.parseDocument(m[1], { prettyErrors: true })
  if (doc.errors.length) return { data: null, body: src.slice(m[0].length), error: doc.errors[0].message }
  const data = doc.toJS()
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    return { data: null, body: src.slice(m[0].length), error: 'frontmatter 不是「键: 值」的格式' }
  }
  return { data, body: src.slice(m[0].length), error: null }
}

function readIf(path) {
  return existsSync(path) ? readFileSync(path, 'utf8') : null
}

function walk(dir, out = []) {
  for (const d of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, d.name)
    if (d.isDirectory()) walk(p, out)
    else if (d.isFile()) out.push(p)
  }
  return out
}

/**
 * 读一个 Bot 文件夹。不抛异常：读不到或写坏的东西都如实放进返回值里。
 * @param {string} slug 文件夹名
 * @param {string} botsDir bots 目录（测试时可以指向 fixtures）
 */
export function loadBot(slug, botsDir = BOTS_DIR) {
  const dir = join(botsDir, slug)
  const base = dirname(botsDir) // 让 rel 形如 bots/<slug>/...
  const rel = (p) => relative(base, p).split('\\').join('/')

  const yamlPath = join(dir, 'bot.yaml')
  const raw = readIf(yamlPath)
  let data = null
  let yamlError = null
  if (raw === null) {
    yamlError = '找不到 bot.yaml'
  } else {
    const doc = YAML.parseDocument(raw, { prettyErrors: true })
    if (doc.errors.length) {
      const e = doc.errors[0]
      yamlError = e.message
    } else {
      data = doc.toJS()
      if (data === null || typeof data !== 'object' || Array.isArray(data)) {
        yamlError = 'bot.yaml 不是「键: 值」的格式'
        data = null
      }
    }
  }

  const skillsDir = join(dir, 'skills')
  const skills = existsSync(skillsDir)
    ? readdirSync(skillsDir, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name)
        .sort()
        .map((name) => {
          const path = join(skillsDir, name, 'SKILL.md')
          const text = readIf(path)
          const fm = text === null ? { data: null, body: '', error: null } : parseFrontmatter(text)
          return {
            name, // 文件夹名
            path,
            rel: rel(path),
            exists: text !== null,
            raw: text,
            frontmatter: fm.data,
            frontmatterError: fm.error,
            body: fm.body,
          }
        })
    : []

  const shotsDir = join(dir, 'screenshots')
  const screenshots = existsSync(shotsDir)
    ? readdirSync(shotsDir, { withFileTypes: true })
        .filter((d) => d.isFile() && !d.name.startsWith('.'))
        .map((d) => d.name)
        .sort()
        .map((file) => {
          const path = join(shotsDir, file)
          const ext = file.slice(file.lastIndexOf('.')).toLowerCase()
          return { file, path, rel: rel(path), size: statSync(path).size, isImage: IMAGE_EXTS.includes(ext) }
        })
    : []

  const avatarPath = join(dir, 'avatar.png')

  return {
    slug,
    dir,
    rel: rel(dir),
    yamlPath,
    yamlRel: rel(yamlPath),
    raw,
    data,
    yamlError,
    role: readIf(join(dir, 'ROLE.md')),
    design: readIf(join(dir, 'DESIGN.md')),
    routines: readIf(join(dir, 'routines.md')),
    avatar: existsSync(avatarPath) ? { path: avatarPath, rel: rel(avatarPath), size: statSync(avatarPath).size } : null,
    skills,
    screenshots,
    // 文件夹里所有文件，给密钥扫描用
    files: existsSync(dir) ? walk(dir).map((p) => ({ path: p, rel: rel(p), size: statSync(p).size })) : [],
  }
}

/** 读全部 Bot，按 slug 排序。 */
export function loadAllBots(botsDir = BOTS_DIR) {
  return listBotDirs(botsDir).map((slug) => loadBot(slug, botsDir))
}
