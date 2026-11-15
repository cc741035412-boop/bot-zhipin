import { fail } from './errors.mjs'

export const LIMITS = Object.freeze({ files: 30, fileBytes: 100 * 1024, totalBytes: 400 * 1024, expandedBytes: 512 * 1024 })
export const URL_LIMITS = Object.freeze({ submitUrl: 16000, issueUrl: 7500 })
const byteLength = (text) => new TextEncoder().encode(text).length
export const TEXT_EXTS = new Set(['.yaml', '.yml', '.md', '.txt', '.json'])
const VERSION = 'BOT-ZHIPIN-BUNDLE v1'
const bad = (problem, fix = '请让 AI 按 BOT-ZHIPIN-BUNDLE v1 格式重新生成投稿包。') => fail('投稿包', '格式与安全边界', problem, fix)

export function assertSlug(slug) {
  if (typeof slug !== 'string' || slug.length < 2 || slug.length > 40 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    bad('slug 必须是 2～40 位小写字母、数字和短横线，不能以短横线开头或结尾。')
  }
  return slug
}

export function assertFilename(name) {
  if (typeof name !== 'string' || name.length > 255 || !/^[A-Za-z0-9_-][A-Za-z0-9._-]*$/.test(name) || name.includes('..')) {
    bad('文件名段只允许英文字母、数字、点、下划线、短横线；不能以点开头，不能含 ..。')
  }
  return name
}

/** 不做路径归一化：先拒绝危险输入，再允许调用者拼接到可信仓库根目录。 */
export function assertPath(file, slug) {
  if (typeof file !== 'string' || file.length > 1024) bad('文件路径无效或过长。')
  const parts = file.split('/')
  if (parts.length < 3 || parts[0] !== 'bots') bad('只接受 bots/<slug>/ 下的相对路径，禁止绝对路径和跨目录。')
  parts.forEach(assertFilename)
  assertSlug(parts[1])
  if (slug && parts[1] !== slug) bad('所有文件必须属于同一个 slug。')
  return parts[1]
}

export function assertFileSet(paths) {
  const seen = new Set()
  for (const path of paths) {
    const key = path.toLowerCase()
    if (seen.has(key)) bad('文件名重复（忽略大小写），请使用不同文件名。')
    seen.add(key)
  }
  for (const path of seen) {
    const parts = path.split('/')
    for (let i = 1; i < parts.length; i++) {
      if (seen.has(parts.slice(0, i).join('/'))) bad('同一路径不能同时作为文件和目录。')
    }
  }
  if (paths.length > LIMITS.files) bad('最多允许 30 个文件（包括截图）。')
}

export function stripFence(value) {
  const text = String(value ?? '').trim()
  const lines = text.split('\n')
  const first = /^(`{3,}|~{3,})[^`~]*\r?$/.exec(lines[0])
  if (first && lines.length >= 2 && new RegExp(`^${first[1][0]}{${first[1].length},}\\s*$`).test(lines.at(-1))) {
    return lines.slice(1, -1).join('\n').trim()
  }
  return text
}

/** files 的键是 bots/<slug>/...；文本字节（包括原有尾换行）原样往返。 */
export function pack({ slug, files, screenshots = [] }) {
  assertSlug(slug)
  const entries = files instanceof Map ? [...files] : Object.entries(files)
  const sections = entries.sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([path, text]) => {
    assertPath(path, slug)
    if (typeof text !== 'string' || /^=== .* ===\r?$/m.test(text)) bad('文本内容包含保留的分段标记行，或不是 UTF-8 文本。')
    return `=== ${path} ===\n${text}\n`
  })
  const text = `${VERSION}\n${sections.join('')}=== bots/${slug}/screenshots ===\n${screenshots.join('\n')}\n=== end ===\n`
  unpack(text)
  return text
}

export function unpack(input) {
  if (typeof input !== 'string' || byteLength(input) > LIMITS.expandedBytes) bad('投稿包展开后不能超过 512KB。')
  if (!input.isWellFormed()) bad('投稿包不是良构 UTF-16 文本，不能包含孤立的代理码元。')
  const text = stripFence(input)
  const first = /^BOT-ZHIPIN-BUNDLE v1\r?\n/.exec(text)
  if (!first) bad('投稿包版本或开头不正确。')
  const headers = [...text.matchAll(/^=== ([^\r\n]+) ===\r?$/gm)]
  if (!headers.length || headers[0].index !== first[0].length || headers.at(-1)[1] !== 'end' || headers.at(-1).index + headers.at(-1)[0].length !== text.length) {
    bad('分段标记不完整，必须以 === end === 结束，结尾不能有其他内容。')
  }
  const files = Object.create(null)
  let slug, screenshots, total = 0
  for (let i = 0; i < headers.length - 1; i++) {
    const header = headers[i], path = header[1]
    slug = assertPath(path, slug)
    const start = header.index + header[0].length + 1
    const end = headers[i + 1].index
    // 每段末尾的一个换行属于容器；额外换行属于原文件，不能 trim。
    if (end < start + 1 || text[end - 1] !== '\n') bad('每段内容后必须换行再写下一个分段标记。')
    let value = text.slice(start, end - 1)
    if (header[0].endsWith('\r') && value.endsWith('\r')) value = value.slice(0, -1)
    if (path === `bots/${slug}/screenshots`) {
      if (screenshots) bad('screenshots 段只能出现一次。')
      screenshots = value.split(/\r?\n/).filter(Boolean)
      screenshots.forEach(assertFilename)
    } else {
      if (!TEXT_EXTS.has(path.slice(path.lastIndexOf('.')).toLowerCase())) bad('只允许 .yaml .yml .md .txt .json 文本文件；图片请在提交页拖入。')
      if (Object.hasOwn(files, path)) bad('文件路径重复。')
      const bytes = byteLength(value)
      if (bytes > LIMITS.fileBytes) bad('单个文本文件不能超过 100KB。')
      total += bytes
      if (total > LIMITS.totalBytes) bad('文本文件总量不能超过 400KB。')
      if (value.includes('\0')) bad('文本文件不能包含 NUL 字节。')
      files[path] = value
    }
  }
  if (!slug || !Object.keys(files).length || !screenshots) bad('必须包含文本文件和 screenshots 段（尚无文件名时可留空）。')
  assertFileSet([...Object.keys(files), ...screenshots.map((name) => `bots/${slug}/screenshots/${name}`)])
  return { slug, files, screenshots }
}
