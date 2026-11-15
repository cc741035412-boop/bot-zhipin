import { afterEach, beforeEach, expect, it } from 'vitest'
import { spawnSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import YAML from 'yaml'
import { ROOT } from '../../scripts/lib/load-bots.mjs'
import config from '../../site/.vitepress/config.mts'

let temp, work, botsDir
beforeEach(() => {
  temp = mkdtempSync(join(tmpdir(), 'bot-build-security-'))
  work = join(temp, 'work')
  mkdirSync(work)
  for (const name of ['scripts', 'schema', 'site', 'bots']) {
    cpSync(join(ROOT, name), join(work, name), {
      recursive: true,
      filter: (path) => !/(?:^|\/)(?:dist|cache|bot-assets|api-data)(?:\/|$)/.test(path),
    })
  }
  cpSync(join(ROOT, 'package.json'), join(work, 'package.json'))
  symlinkSync(join(ROOT, 'node_modules'), join(work, 'node_modules'))
  botsDir = join(temp, 'bots')
  cpSync(join(ROOT, 'tests/fixtures/bots'), botsDir, { recursive: true })
})
afterEach(() => rmSync(temp, { recursive: true, force: true }))
function run(command, args) {
  return spawnSync(command, args, { cwd: work, env: { ...process.env, BOTS_DIR: botsDir, CI: '1' }, encoding: 'utf8', timeout: 90_000, maxBuffer: 2 * 1024 * 1024 })
}
function successful(result) { expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0) }

it('description 仅进入 head，SSR transformHead 恢复被 VitePress 过滤的 meta', () => {
  const page = {
    params: { bot: { name: '测试', tagline: '一句介绍' } }, description: '旧描述',
    frontmatter: { description: '旧描述', head: [['meta', { name: 'description', content: '旧描述' }], ['meta', { name: 'other', content: '保留' }]] },
  }
  config.transformPageData(page)
  // 客户端路由切换要用 pageData.description；SSR 因 transformHead 已提供 description 而不输出未转义的那行（见下一条测试）
  expect(page.description).toBe('一句介绍')
  expect(page.frontmatter).not.toHaveProperty('description')
  expect(page.frontmatter.head).toHaveLength(2)
  expect(config.transformHead({ pageData: page })).toEqual([['meta', { name: 'description', content: '一句介绍' }]])
})

it('npm build 必须先校验：非法 Bot 阻止同步素材和 VitePress 构建', () => {
  const script = JSON.parse(readFileSync(join(work, 'package.json'), 'utf8')).scripts.build
  expect(script).toBe('node scripts/validate.mjs && node scripts/sync-assets.mjs && vitepress build site')
  writeFileSync(join(botsDir, 'demo-prd-reviewer/bot.yaml'), 'name: [不合法\n')
  const sentinel = join(work, 'site/public/bot-assets/unchanged')
  mkdirSync(join(sentinel, '..'), { recursive: true })
  writeFileSync(sentinel, '同步尚未运行')
  const result = run('npm', ['run', 'build'])
  expect(result.status).toBe(1)
  expect(result.stdout).toContain('校验未通过')
  expect(readFileSync(sentinel, 'utf8')).toBe('同步尚未运行')
  expect(existsSync(join(work, 'site/.vitepress/dist'))).toBe(false)
})

it('绕过校验直接构建：无 eval/链接泄露/XSS/外链图片，description 唯一且转义', () => {
  const slug = 'demo-prd-reviewer'
  const yamlPath = join(botsDir, slug, 'bot.yaml')
  const data = YAML.parse(readFileSync(yamlPath, 'utf8'))
  const tagline = ['"><img src=x onerror=', 'alert(1)>'].join('')
  data.tagline = tagline
  writeFileSync(yamlPath, YAML.stringify(data))
  const marker = join(temp, 'executed')
  const method = ['write', 'FileSync'].join('')
  const module = ['process', 'getBuiltinModule'].join('.')
  const attack = `---javascript\n(${module}('fs').${method}(${JSON.stringify(marker)}, 'unexpected'), {})\n---\n`
  const design = '# 设计\n\n![追踪](https://tracker.example/p.png)\n\n<!-- 未闭合 KEEP-RENDERED-TEXT'
  writeFileSync(join(botsDir, slug, 'DESIGN.md'), attack + design)
  const privateFile = join(temp, 'private.txt')
  writeFileSync(privateFile, 'PRIVATE-LINK-CONTENT')
  const other = join(botsDir, 'demo-weekly-digest')
  rmSync(join(other, 'DESIGN.md'))
  symlinkSync(privateFile, join(other, 'DESIGN.md'))
  rmSync(join(other, 'screenshots'), { recursive: true })
  const outside = join(temp, 'outside-images')
  mkdirSync(outside)
  cpSync(join(ROOT, 'tests/fixtures/bots', slug, 'avatar.png'), join(outside, 'leaked.png'))
  symlinkSync(outside, join(other, 'screenshots'))
  mkdirSync(join(botsDir, 'bad-bot'))
  writeFileSync(join(botsDir, 'bad-bot/bot.yaml'), YAML.stringify({ ...data, slug: 'mismatch' }))
  successful(run(process.execPath, ['scripts/sync-assets.mjs']))
  successful(run(process.execPath, [join(ROOT, 'node_modules/vitepress/bin/vitepress.js'), 'build', 'site']))
  expect(existsSync(marker)).toBe(false)
  const html = readFileSync(join(work, 'site/.vitepress/dist/bots', slug + '.html'), 'utf8')
  const metas = html.match(/<meta\s+name="description"[^>]*>/g) || []
  expect(metas).toHaveLength(1)
  expect(metas[0]).toContain('&quot;&gt;&lt;img src=x onerror=alert(1)&gt;')
  expect(html).not.toContain(tagline)
  expect(html).not.toMatch(/<img[^>]*tracker\.example/)
  expect(html).toContain('>追踪</a>')
  expect(html).toContain('KEEP-RENDERED-TEXT')
  const otherHtml = readFileSync(join(work, 'site/.vitepress/dist/bots/demo-weekly-digest.html'), 'utf8')
  expect(otherHtml).not.toContain('PRIVATE-LINK-CONTENT')
  expect(existsSync(join(work, 'site/.vitepress/dist/bot-assets/demo-weekly-digest/leaked.png'))).toBe(false)
  expect(existsSync(join(work, 'site/.vitepress/dist/bots/bad-bot.html'))).toBe(false)
  expect(JSON.parse(readFileSync(join(work, 'site/public/api-data/slugs.json'), 'utf8'))).not.toContain('bad-bot')
}, 120_000)
