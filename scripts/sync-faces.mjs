import { readFile, readdir, writeFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { parse } from 'yaml'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const FACE_FILE = 'site/.vitepress/data/faces.json'
const run = promisify(execFile)

/** Only read the public face fields beside addHref, never paths or eye geometry. */
export function parseFace(html) {
  // Next.js embeds JSON in a JavaScript string; also accept ordinary JSON.
  const text = html.replace(/\\+"/g, '"')
  const match = text.match(/"addHref"\s*:\s*"[^"\r\n]*"\s*,\s*"color"\s*:\s*"(#[0-9a-fA-F]{6})"\s*,\s*"shape"\s*:\s*"([^"\r\n]+)"/)
  if (!match || !match[2].trim()) return null
  return { color: match[1].toLowerCase(), shape: match[2] }
}

export async function syncFaces({ bots, previous, fetchText, today }) {
  const faces = {}
  const warnings = []
  for (const { slug, templateUrl } of bots) {
    let face = null
    let problem = '页面未找到有效的颜色和形状'
    try {
      face = parseFace(await fetchText(templateUrl))
    } catch {
      problem = '抓取失败（网络、HTTP 或超时）'
    }
    if (face) {
      faces[slug] = { ...face, fetchedAt: today }
    } else {
      const retained = Object.hasOwn(previous, slug)
      if (retained) faces[slug] = previous[slug]
      warnings.push(`${FACE_FILE} / ${slug} / ${problem}，${retained ? '保留旧条目' : '没有旧条目，暂不写入'} / 改法：检查模板链接及网络后重新运行同步。`)
    }
  }
  return { faces, warnings }
}

export function checkFaces(obj) {
  const errors = []
  const error = (position, problem, fix) => errors.push(`${FACE_FILE} / ${position} / ${problem} / 改法：${fix}`)
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    error('根对象', '必须是按 slug 索引的对象', '改成 JSON 对象。')
    return errors
  }
  for (const [slug, entry] of Object.entries(obj)) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      error(`${slug}（键）`, 'slug 格式不合法', '只用小写字母、数字，以单个短横线分隔。')
    }
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      error(slug, '条目必须是对象', '填写 color、shape、fetchedAt 三个字段。')
      continue
    }
    for (const key of Object.keys(entry)) {
      if (!['color', 'shape', 'fetchedAt'].includes(key)) error(`${slug}.${key}`, '不允许额外字段', '删除此字段，只保留 color、shape、fetchedAt。')
    }
    if (typeof entry.color !== 'string' || !/^#[0-9a-f]{6}$/.test(entry.color)) {
      error(`${slug}.color`, '缺失或不是小写六位十六进制颜色', '填写形如 #777777 的 #rrggbb 颜色。')
    }
    if (typeof entry.shape !== 'string' || !entry.shape.trim()) {
      error(`${slug}.shape`, '缺失或不是非空字符串', '填写模板页公开的形状名，例如 hex。')
    }
    if (typeof entry.fetchedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(entry.fetchedAt)) {
      error(`${slug}.fetchedAt`, '缺失或日期格式错误', '填写 YYYY-MM-DD 格式的抓取日期。')
    }
  }
  return errors
}

async function fetchText(url) {
  // curl follows the same public, unauthenticated request used by maintainers.
  const { stdout } = await run('curl', ['--fail', '--silent', '--show-error', '--location',
    '--max-time', '25', '--user-agent', 'Mozilla/5.0', '--', url],
  { timeout: 25_000, maxBuffer: 32 * 1024 * 1024, encoding: 'utf8' })
  return stdout
}

async function main(args) {
  const checking = args[0] === '--check'
  if (args.length && !(checking && (args.length === 1 || (args.length === 3 && args[1] === '--file')))) {
    throw new Error('scripts/sync-faces.mjs / 命令行 / 参数不合法 / 改法：使用无参数同步，或 --check [--file <路径>] 离线校验。')
  }
  const file = resolve(ROOT, checking && args[2] ? args[2] : FACE_FILE)
  let previous = {}
  try {
    previous = JSON.parse(await readFile(file, 'utf8'))
  } catch (err) {
    if (checking || err.code !== 'ENOENT') {
      throw new Error(`${file} / 根对象 / 文件不可读或 JSON 语法错误 / 改法：确认文件存在且为有效 JSON。`)
    }
  }
  const errors = checkFaces(previous).map((message) => message.replace(FACE_FILE, file))
  if (errors.length) {
    console.error(errors.join('\n'))
    process.exitCode = 1
    return
  }
  if (checking) {
    console.log(`✓ ${file} 校验通过（离线）`)
    return
  }
  const botsDir = resolve(ROOT, process.env.BOTS_DIR || 'bots')
  const bots = []
  for (const dir of (await readdir(botsDir, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    if (!dir.isDirectory() || dir.name === '_template') continue
    const yamlFile = resolve(botsDir, dir.name, 'bot.yaml')
    let bot
    try {
      bot = parse(await readFile(yamlFile, 'utf8'))
    } catch (err) {
      if (err.code === 'ENOENT') continue
      throw new Error(`${yamlFile} / 根对象 / 无法读取 YAML / 改法：修复 bot.yaml 后重试。`)
    }
    if (typeof bot?.templateUrl !== 'string' || !bot.templateUrl || bot.templateUrl.includes('REPLACE-ME')) continue
    bots.push({ slug: dir.name, templateUrl: bot.templateUrl })
  }
  const { faces, warnings } = await syncFaces({ bots, previous, fetchText, today: new Date().toISOString().slice(0, 10) })
  const invalid = checkFaces(faces)
  if (invalid.length) throw new Error(invalid.join('\n'))
  const sorted = Object.fromEntries(Object.entries(faces).sort(([a], [b]) => a.localeCompare(b)))
  await writeFile(file, JSON.stringify(sorted, null, 2) + '\n')
  for (const { slug } of bots) {
    const face = faces[slug]
    const failed = warnings.some((warning) => warning.includes(` / ${slug} / `))
    console.log(`${failed ? '⚠' : '✓'} ${slug}：${face ? `${face.color} ${face.shape}（${face.fetchedAt}${failed ? '，保留旧数据' : ''}）` : '未写入'}`)
  }
  for (const warning of warnings) console.warn(warning)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch((err) => {
    console.error(err.message)
    process.exitCode = 1
  })
}
