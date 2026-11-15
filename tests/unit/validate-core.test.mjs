import { afterEach, expect, it } from 'vitest'
import { cpSync, mkdtempSync, rmSync, writeFileSync, symlinkSync, mkdirSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, relative, resolve } from 'node:path'
import YAML from 'yaml'
import { ROOT, loadAllBots, loadBot } from '../../scripts/lib/load-bots.mjs'
import { buildBotModel, modelFromBundle, parseFrontmatter } from '../../scripts/lib/bot-model.mjs'
import { validateModels } from '../../scripts/lib/validate/core.mjs'
import { validateBots } from '../../scripts/lib/validate/index.mjs'
import { syncAssets } from '../../scripts/sync-assets.mjs'
import { explanations } from '../../site/.vitepress/data/bots.mjs'
import { SCHEMA_SHA256 } from '../../scripts/lib/validate/generated/bot-schema.mjs'
import { LIMITS } from '../../scripts/submission/bundle-core.mjs'
import { MAX_IMAGE_BYTES } from '../../scripts/lib/validate/images.mjs'

const fixture = join(ROOT, 'tests/fixtures/bots'), now = '2026-11-14T04:00:00Z'
const slug = 'demo-prd-reviewer'
function memory(bot) {
  return buildBotModel(bot.slug, {
    files: bot.files.map((file) => ({ ...file, rel: relative(bot.dir, file.path) })),
    dirs: bot.skills.map((skill) => `skills/${skill.name}`),
    symlinks: bot.symlinks.map((link) => relative(bot.dir, resolve(bot.dir, '../..', link))),
  })
}
const template = memory(loadBot('_template', join(ROOT, 'bots')))
const valid = () => memory(loadBot(slug, fixture))
const check = (bot, options = {}) => validateModels([bot], { template, now, ...options })
const temps = []
afterEach(() => { for (const temp of temps.splice(0)) rmSync(temp, { recursive: true, force: true }) })
const temporary = () => { const temp = mkdtempSync(join(tmpdir(), 'core-test-')); temps.push(temp); return temp }

it('内存模型与 fs 适配器在整个 fixture 上诊断逐字一致', () => {
  const disk = validateBots({ botsDir: fixture, now })
  expect(validateModels(loadAllBots(fixture).map(memory), { template, now })).toEqual({ errors: disk.errors, warnings: disk.warnings })
})
it.each(['bad-yaml', 'short-design', 'secret', 'symlink', 'empty-skill'])('变异 %s 在内存和 fs 上结果一致', (kind) => {
  const botsDir = join(temporary(), 'custom-bots')
  cpSync(fixture, botsDir, { recursive: true })
  const dir = join(botsDir, slug)
  if (kind === 'bad-yaml') writeFileSync(join(dir, 'bot.yaml'), 'name: [坏掉\n')
  if (kind === 'short-design') writeFileSync(join(dir, 'DESIGN.md'), '太短')
  if (kind === 'secret') writeFileSync(join(dir, 'hidden.txt'), 'gh' + 'p_' + 'a'.repeat(36))
  if (kind === 'symlink') symlinkSync('missing', join(dir, 'link'))
  if (kind === 'empty-skill') mkdirSync(join(dir, 'skills/empty'))
  const disk = validateBots({ botsDir, now })
  expect(disk.errors.length).toBeGreaterThan(0)
  expect(validateModels(loadAllBots(botsDir).map(memory), { template, now })).toEqual({ errors: disk.errors, warnings: disk.warnings })
})
it.each(['slug', 'templateUrl'])('others 的 %s 重复只报在投稿上', (field) => {
  const bot = valid(), other = { slug: 'existing-bot', templateUrl: 'https://x.ai/bot/other' }
  other[field] = bot.data[field]
  const errors = check(bot, { others: [other] }).errors
  expect(errors).toHaveLength(1)
  expect(errors[0]).toMatchObject({ file: `bots/${slug}/bot.yaml`, where: field })
  expect(errors[0].problem).toContain('重复')
})
it('others 提供 forkedFrom 的存在性，不对 others 做内容校验', () => {
  const bot = valid(); bot.data.forkedFrom = 'upstream-bot'
  expect(check(bot, { others: [{ slug: 'upstream-bot' }] }).errors).toEqual([])
  expect(check(bot).errors[0].where).toBe('forkedFrom')
})
it('投稿策略禁止 external', () => {
  const bot = valid(); bot.data.external = true
  expect(check(bot, { policy: { submission: { login: bot.data.author.github } } }).errors[0]).toMatchObject({ where: 'external', file: `bots/${slug}/bot.yaml` })
})
it('投稿策略拒绝冒名，用户名比较不区分大小写', () => {
  const bot = valid()
  expect(check(bot, { policy: { submission: { login: 'other-user' } } }).errors[0].where).toBe('author.github')
  expect(check(bot, { policy: { submission: { login: bot.data.author.github.toUpperCase() } } }).errors).toEqual([])
})
it('仅 format 的截图回执可替代 head；显式 null 不当作图片', () => {
  const bot = valid()
  const bundle = { slug, files: Object.fromEntries(bot.files.filter((f) => f.text !== null).map((f) => [`bots/${slug}/${f.rel}`, f.text])), screenshots: ['shot.png'] }
  const model = modelFromBundle(bundle, [{ name: 'shot.png', size: 10, format: 'png' }])
  expect(model.screenshots[0].head).toBeUndefined()
  expect(check(model).errors).toEqual([])
  model.screenshots[0].format = null
  expect(check(model).errors.some((error) => error.where === '文件头')).toBe(true)
})
it('模型保持相对路径、Unicode 字节数和缺失技能语义', () => {
  const bot = buildBotModel('test-bot', { files: [{ rel: 'ROLE.md', text: '中文', size: 6 }], dirs: ['skills/empty'] })
  expect(bot.skills[0]).toMatchObject({ path: 'skills/empty/SKILL.md', rel: 'skills/empty/SKILL.md', exists: false })
  expect(bot.files[0].path).toBe('ROLE.md')
  expect(parseFrontmatter('---\nname: x\n---\n正文').body).toBe('正文')
})
it('上下文只发布约定字段，模板/文案/限额/哈希与真源一致', () => {
  const temp = temporary(), apiData = join(temp, 'api')
  syncAssets({ botsDir: fixture, out: join(temp, 'assets'), apiData })
  const context = JSON.parse(readFileSync(join(apiData, 'submit-context.json'), 'utf8'))
  expect(context).toMatchObject({ v: 1, schemaSha256: SCHEMA_SHA256, copy: explanations(), limits: {
    files: LIMITS.files, fileBytes: LIMITS.fileBytes, totalBytes: LIMITS.totalBytes, imageBytes: MAX_IMAGE_BYTES,
  } })
  expect(context.index.map((item) => item.slug)).toEqual(loadAllBots(fixture).map((bot) => bot.slug))
  expect(context.index[0].authorGithub).toBe(null)
  // 中文叫法只在写了的时候带上：示例里只有外部收录那个有。
  for (const item of context.index) expect(Object.keys(item).sort()).toEqual(['addedAt', 'authorGithub', 'external', 'name', ...(item.slug === 'demo-external' ? ['nameZh'] : []), 'slug', 'templateUrl'])
  expect(context.index.find((item) => item.slug === 'demo-external')).toMatchObject({ name: 'Demo External Helper', nameZh: '示例·外部收录' })
  expect(YAML.parse(context.template.files['bot.yaml'])).toEqual(template.data)
  expect(context.template.files['DESIGN.md']).toBe(template.design)
  const build = JSON.parse(readFileSync(join(apiData, 'build.json'), 'utf8'))
  expect(build.commit).toBe(context.commit)
  expect(Number.isNaN(Date.parse(build.builtAt))).toBe(false)
})
