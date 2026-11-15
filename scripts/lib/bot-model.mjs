// 与存储无关的 Bot 模型。所有路径均相对 Bot 目录，图片内容由适配器提供。
import YAML from 'yaml'

export const IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.webp', '.gif']

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

export function buildBotModel(slug, { files, dirs = [], symlinks = [] }) {
  const entries = files.map((file) => ({ ...file, path: file.rel }))
  const byPath = new Map(entries.map((file) => [file.rel, file]))
  const readIf = (path) => byPath.get(path)?.text ?? null
  // 文件路径可推导非空目录；显式 dirs 保留空技能目录的诊断。
  const directories = new Set(dirs)
  for (const file of entries) {
    const parts = file.rel.split('/')
    for (let i = 1; i < parts.length; i++) directories.add(parts.slice(0, i).join('/'))
  }
  const raw = readIf('bot.yaml')
  let data = null, yamlError = null
  if (raw === null) yamlError = '找不到 bot.yaml'
  else {
    const doc = YAML.parseDocument(raw, { prettyErrors: true })
    if (doc.errors.length) yamlError = doc.errors[0].message
    else {
      data = doc.toJS()
      if (data === null || typeof data !== 'object' || Array.isArray(data)) {
        yamlError = 'bot.yaml 不是「键: 值」的格式'
        data = null
      }
    }
  }
  const skills = [...directories].filter((path) => /^skills\/[^/]+$/.test(path)).sort().map((dir) => {
    const name = dir.slice(7), path = `${dir}/SKILL.md`, text = readIf(path)
    const fm = text === null ? { data: null, body: '', error: null } : parseFrontmatter(text)
    return { name, path, rel: path, exists: text !== null, raw: text, frontmatter: fm.data, frontmatterError: fm.error, body: fm.body }
  })
  const screenshots = entries.filter(({ rel }) => /^screenshots\/[^./][^/]*$/.test(rel)).map((entry) => {
    const file = entry.rel.slice(12), dot = file.lastIndexOf('.')
    // 与旧读取器一致：无点时 slice(-1)，仍判为非图片。
    const ext = file.slice(dot).toLowerCase()
    return { ...entry, file, isImage: IMAGE_EXTS.includes(ext) }
  })
  return {
    slug, rel: '', yamlPath: 'bot.yaml', yamlRel: 'bot.yaml', raw, data, yamlError,
    role: readIf('ROLE.md'), design: readIf('DESIGN.md'), routines: readIf('routines.md'),
    avatar: byPath.get('avatar.png') || null, skills, screenshots, files: entries, symlinks: [...symlinks],
  }
}

/** bundle 是 unpack 的结果；images 使用 planScreenshots 确定的最终 name。 */
export function modelFromBundle(bundle, images = []) {
  const prefix = `bots/${bundle.slug}/`
  const files = Object.entries(bundle.files).map(([path, text]) => ({
    rel: path.slice(prefix.length), size: new TextEncoder().encode(text).length, text,
  }))
  for (const { name, size, format } of images) files.push({ rel: `screenshots/${name}`, size, format, text: null })
  files.sort((a, b) => a.rel < b.rel ? -1 : a.rel > b.rel ? 1 : 0)
  return buildBotModel(bundle.slug, { files })
}
