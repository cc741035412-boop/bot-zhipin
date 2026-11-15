import { cpSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, dirname, extname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { SITE } from '../site/.vitepress/meta.mjs'
import { ROOT, IMAGE_EXTS } from './lib/load-bots.mjs'
import { validateBots } from './lib/validate/index.mjs'
import { MAX_IMAGE_BYTES } from './lib/validate/images.mjs'
import { assertFilename, assertPath, assertSlug, encode, LIMITS, pack, TEXT_EXTS } from './submission/bundle.mjs'
import { SubmissionError, fail, formatErrors } from './submission/errors.mjs'
import { parseBotMetadata } from './submission/issue.mjs'

// 仅供临时副本校验缺图场景；绝不进入投稿包，也不能充当真实截图投稿。
const placeholder = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64')

export function readBundleDirectory(directory) {
  const dir = resolve(directory), slug = assertSlug(basename(dir))
  const files = Object.create(null), images = Object.create(null)
  let avatarOmitted = false
  const walk = (path, rel = '') => {
    const stat = lstatSync(path)
    if (stat.isSymbolicLink() || (!stat.isFile() && !stat.isDirectory())) fail('投稿目录', '文件类型', '不能读取符号链接或特殊文件。', '改用 Bot 目录内的普通文件和目录。')
    if (rel && rel !== 'screenshots/.gitkeep') assertPath(`bots/${slug}/${rel}`, slug)
    if (stat.isDirectory()) {
      for (const name of readdirSync(path).sort()) walk(join(path, name), rel ? `${rel}/${name}` : name)
    } else if (rel === 'screenshots/.gitkeep') {
      // 模板自带的空目录占位文件，不是投稿内容。
    } else if (rel === 'avatar.png') {
      avatarOmitted = true
    } else if (rel.startsWith('screenshots/') && rel.split('/').length === 2 && IMAGE_EXTS.includes(extname(rel).toLowerCase())) {
      if (stat.size > MAX_IMAGE_BYTES) fail(rel, '文件大小', '截图超过 2MB。', '先压缩到 2MB 以内再生成链接。')
      images[basename(rel)] = readFileSync(path)
    } else if (TEXT_EXTS.has(extname(rel).toLowerCase())) {
      if (stat.size > LIMITS.fileBytes) fail(rel, '文件大小', '单个文本文件不能超过 100KB。', '缩减文件后重试。')
      files[`bots/${slug}/${rel}`] = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(readFileSync(path))
    } else {
      fail(rel, '文件类型', '投稿包只收 .yaml .yml .md .txt .json 文本及截图文件名。', '移除无关文件；头像不会通过 Issue 投稿传输，网站会使用默认头像。')
    }
  }
  walk(dir)
  let screenshots = Object.keys(images)
  if (!screenshots.length) {
    const design = files[`bots/${slug}/DESIGN.md`] || ''
    screenshots = [...new Set([...design.matchAll(/\]\(<?(?:\.\/)?screenshots\/([^\s)>]+)>?\)/g)].map((match) => match[1]))]
    screenshots.forEach(assertFilename)
  }
  const bundle = { slug, files, screenshots }
  return { bundle, plaintext: pack(bundle), images, avatarOmitted }
}

function validateLocally({ bundle, images }, directory) {
  const temp = mkdtempSync(join(tmpdir(), 'bot-link-'))
  try {
    const botsDir = join(temp, 'bots')
    // 默认分支的其他 Bot 用于重复链接和 forkedFrom 校验；写入仅发生在临时副本。
    cpSync(join(ROOT, 'bots'), botsDir, { recursive: true, dereference: false })
    // 使用 fixtures 或独立 bots 目录时，也保留同目录的直接改编来源。
    const sourceText = bundle.files[`bots/${bundle.slug}/bot.yaml`] || ''
    const data = parseBotMetadata(sourceText, bundle.slug)
    if (typeof data.forkedFrom === 'string') {
      assertSlug(data.forkedFrom)
      const sibling = join(dirname(resolve(directory)), data.forkedFrom)
      if (!lstatSync(join(botsDir, data.forkedFrom), { throwIfNoEntry: false }) && lstatSync(sibling, { throwIfNoEntry: false })?.isDirectory()) {
        cpSync(sibling, join(botsDir, data.forkedFrom), { recursive: true, dereference: false })
      }
    }
    const dir = join(botsDir, bundle.slug)
    rmSync(dir, { recursive: true, force: true })
    for (const [path, contents] of Object.entries(bundle.files)) {
      const target = join(temp, path)
      mkdirSync(dirname(target), { recursive: true })
      writeFileSync(target, contents)
    }
    mkdirSync(join(dir, 'screenshots'), { recursive: true })
    if (Object.keys(images).length) {
      for (const [name, bytes] of Object.entries(images)) writeFileSync(join(dir, 'screenshots', name), bytes)
    } else writeFileSync(join(dir, 'screenshots/submission-placeholder.png'), placeholder)
    return validateBots({ botsDir })
  } finally { rmSync(temp, { recursive: true, force: true }) }
}

/** 返回数据而非打印，便于 AI/测试复用。超过 URL 限额只改变呈现，不截断投稿内容。 */
export function makeSubmissionLink(directory, { validate = validateLocally } = {}) {
  const source = readBundleDirectory(directory)
  const result = validate(source, directory)
  if (result.errors.length) throw new SubmissionError(result.errors)
  const data = parseBotMetadata(source.bundle.files[`bots/${source.bundle.slug}/bot.yaml`], source.bundle.slug)
  const baseUrl = `${SITE.repo}/issues/new?template=submit-bot.yml&title=${encodeURIComponent(`投稿：${data.name}`)}`
  const token = encode(source.plaintext)
  const fullUrl = `${baseUrl}&bundle=${encodeURIComponent(token)}`
  const plain = fullUrl.length > 7500
  const url = plain ? baseUrl : fullUrl
  const steps = [
    url,
    '1. 点开链接（先登录 GitHub）。',
    `2. 截图要在提交页里拖进去（至少一张${source.bundle.screenshots.length ? `，按此顺序：${source.bundle.screenshots.join('、')}` : ''}）。`,
    '3. 确认有权公开内容与截图，勾选 CC BY 4.0 授权，点 Submit new issue（提交）。',
  ]
  if (source.avatarOmitted) steps.push('提示：Issue 投稿不传头像，将使用网站默认头像。')
  if (plain) steps.push(`\n链接超过 7500 字符。打开 ${baseUrl}，把下面整段粘到「投稿包」里：\n`, source.plaintext)
  return { url, fullUrlLength: fullUrl.length, plain, token, bundle: source.plaintext, output: steps.join('\n') }
}

function main(args) {
  const directory = args.length === 1 && !args[0].startsWith('--') ? args[0] : args.length === 2 && args[0] === '--dir' ? args[1] : null
  if (!directory || directory.startsWith('--')) {
    console.error('用法：node scripts/make-submission-link.mjs bots/<slug>（或 --dir <Bot 文件夹>）')
    process.exitCode = 1
    return
  }
  try { console.log(makeSubmissionLink(directory).output) } catch (error) {
    const errors = error instanceof SubmissionError ? error.errors : [{
      file: '投稿目录', where: '读取文件', problem: '无法读取 Bot 文件夹或文本不是有效 UTF-8。',
      fix: '检查 --dir 路径、文件权限和 UTF-8 编码，确保目录及文件没有被替换成符号链接。',
    }]
    console.error(formatErrors(errors))
    console.error('还没通过检查。请让 AI 按「改法」修复后重新生成链接；截图要在提交页里拖进去。')
    process.exitCode = 1
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main(process.argv.slice(2))
