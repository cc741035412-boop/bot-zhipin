import { afterEach, beforeEach, expect, it } from 'vitest'
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import YAML from 'yaml'
import { ROOT, loadAllBots, loadBot } from '../../scripts/lib/load-bots.mjs'
import { validateBots } from '../../scripts/validate.mjs'
import { isPublicBot } from '../../scripts/lib/public-bot.mjs'
import { stripComments, stripDesignFrontmatter } from '../../scripts/lib/design-content.mjs'
import { syncAssets } from '../../scripts/sync-assets.mjs'
import { renderDesigns } from '../../site/.vitepress/data/design-renderer.mjs'

const slug = 'demo-prd-reviewer'
let temp, botsDir
beforeEach(() => {
  temp = mkdtempSync(join(tmpdir(), 'bot-submission-'))
  botsDir = join(temp, 'bots')
  cpSync(join(ROOT, 'tests/fixtures/bots'), botsDir, { recursive: true })
})
afterEach(() => rmSync(temp, { recursive: true, force: true }))
const path = (file, bot = slug) => join(botsDir, bot, file)
function put(file, content, bot = slug) {
  mkdirSync(join(path(file, bot), '..'), { recursive: true })
  writeFileSync(path(file, bot), content)
}
const validate = () => validateBots({ botsDir, now: '2026-11-14T04:00:00Z' })
const render = async (design) => (await renderDesigns([{ slug, design }]))[slug]
function link(file, target, bot = slug) {
  rmSync(path(file, bot), { recursive: true, force: true })
  mkdirSync(join(path(file, bot), '..'), { recursive: true })
  symlinkSync(target, path(file, bot))
}
function change(update, bot = slug) {
  const data = YAML.parse(readFileSync(path('bot.yaml', bot), 'utf8'))
  update(data)
  put('bot.yaml', YAML.stringify(data), bot)
}

// 攻击载荷只在运行时组装并写入临时目录，仓库中不保存可执行样例。
function frontmatterAttack(marker, language) {
  const call = ['process', 'getBuiltinModule'].join('.')
  const write = ['write', 'FileSync'].join('')
  return `---${language}\n(${call}('fs').${write}(${JSON.stringify(marker)}, 'unexpected'), {})\n---\n`
}

it('DESIGN frontmatter：YAML/js/javascript/BOM 均拒绝且渲染不执行', async () => {
  for (const language of ['', 'js', 'javascript']) {
    const marker = join(temp, `executed-${language || 'yaml'}`)
    const content = '\uFEFF' + frontmatterAttack(marker, language) + '# 设计\n\n正文保留'
    put('DESIGN.md', content)
    const errors = validate().errors
    expect(errors.some((e) => e.file.endsWith('DESIGN.md') && e.problem.includes('frontmatter'))).toBe(true)
    const html = await render(readFileSync(path('DESIGN.md'), 'utf8'))
    expect(html).toContain('正文保留')
    expect(html).not.toContain('unexpected')
    expect(existsSync(marker)).toBe(false)
  }
})

it('frontmatter 解析器彻底关闭：去注释/标题后出现的 js 块也不执行', async () => {
  const marker = join(temp, 'not-executed')
  for (const prefix of ['<!-- 成对注释 -->\n', '# 被移除的标题\n']) {
    put('DESIGN.md', prefix + frontmatterAttack(marker, 'js') + '结束正文')
    expect(await render(readFileSync(path('DESIGN.md'), 'utf8'))).toContain('结束正文')
    expect(existsSync(marker)).toBe(false)
  }
})

it('frontmatter 剥离覆盖 CRLF、任意 --- 前缀与未闭合块，外部收录也拒绝', () => {
  expect(stripDesignFrontmatter('---custom\r\nignored\r\n---\r\n正文')).toBe('正文')
  expect(stripDesignFrontmatter('---js\n未闭合')).toBe('')
  put('DESIGN.md', '---\nname: 忽略\n---\n', 'demo-external')
  expect(validate().errors.some((e) => e.file.includes('demo-external/DESIGN.md') && e.problem.includes('frontmatter'))).toBe(true)
})

it('符号链接：文件、目录、悬空链接、循环和整个 Bot 均报告且不读取', async () => {
  const outside = join(temp, 'outside')
  cpSync(join(ROOT, 'tests/fixtures/bots', slug), outside, { recursive: true })
  writeFileSync(join(outside, 'DESIGN.md'), 'PRIVATE-OUTSIDE-CONTENT')
  for (const file of ['bot.yaml', 'ROLE.md', 'DESIGN.md', 'routines.md', 'avatar.png', 'screenshots', 'skills']) {
    link(file, join(outside, file))
  }
  link('dangling', join(temp, 'absent'))
  link('loop', path(''))
  symlinkSync(outside, join(botsDir, 'linked-bot'))
  const bot = loadBot(slug, botsDir)
  expect([bot.raw, bot.role, bot.design, bot.routines, bot.avatar]).toEqual([null, null, null, null, null])
  expect(bot.skills).toEqual([])
  expect(bot.screenshots).toEqual([])
  expect(bot.files).toEqual([])
  expect(bot.symlinks).toHaveLength(9)
  expect(loadBot('linked-bot', botsDir).symlinks).toEqual(['bots/linked-bot'])
  const result = validate()
  expect(result.errors.filter((e) => e.problem.includes('符号链接'))).toHaveLength(10)
  expect(JSON.stringify(result.bots)).not.toContain('PRIVATE-OUTSIDE-CONTENT')
  expect(await render(bot.design)).not.toContain('PRIVATE-OUTSIDE-CONTENT')
})

it('符号链接：嵌套技能、截图文件和隐藏文件均跳过，同步不经过目录链接', () => {
  const original = join(ROOT, 'tests/fixtures/bots', slug)
  const linked = [
    ['skills/checklist-review/SKILL.md', join(original, 'skills/checklist-review/SKILL.md')],
    ['skills/linked-skill', join(original, 'skills/checklist-review')],
    ['screenshots/linked.png', join(original, 'screenshots/review-result.png')],
    ['nested/.hidden', join(original, 'ROLE.md')],
    ['avatar.png', join(original, 'avatar.png')],
  ]
  for (const [file, target] of linked) link(file, target)
  link('screenshots', join(original, 'screenshots'), 'demo-weekly-digest')
  const bot = loadBot(slug, botsDir)
  expect(bot.symlinks).toHaveLength(linked.length)
  expect(bot.skills.map((skill) => skill.name)).toEqual(['checklist-review', 'issue-ranking'])
  expect(bot.skills.find((skill) => skill.name === 'checklist-review').exists).toBe(false)
  expect(bot.files.some((file) => linked.some(([name]) => file.path === path(name)))).toBe(false)
  expect(validate().errors.filter((e) => e.problem.includes('符号链接'))).toHaveLength(6)
  const out = join(temp, 'assets'), apiData = join(temp, 'api')
  syncAssets({ botsDir, out, apiData })
  expect(existsSync(join(out, slug, 'review-result.png'))).toBe(true)
  expect(existsSync(join(out, slug, 'linked.png'))).toBe(false)
  expect(existsSync(join(out, slug, 'avatar.png'))).toBe(false)
  expect(existsSync(join(out, 'demo-weekly-digest'))).toBe(false)
})

it.each(['name', 'tagline', 'pitch'])('%s 禁止 <、>、英文双引号并给中文改法', (field) => {
  for (const char of ['<', '>', '"']) {
    change((data) => { data[field] = `测试文字${char}` })
    const issue = validate().errors.find((e) => e.where === field)
    expect(issue.problem).toContain('不能使用字符 <、>、"')
    expect(issue.fix).toContain('纯文字')
  }
})

it('外链图片只输出普通链接，保留 alt 或默认文案，本地截图仍显示', async () => {
  put('DESIGN.md', [
    '![追踪](https://tracker.example/p.png)',
    '![](//tracker.example/no-alt.png)',
    '![根路径](/outside.png)',
    '![父目录](../outside.png)',
    '![穿越](screenshots/../../outside.png)',
    '![编码穿越](screenshots/%2e%2e/outside.png)',
    '![截图](screenshots/review-result.png)',
    '![点路径](./screenshots/review-result.png)',
    '![中文路径](<screenshots/结果 图.png>)',
    `![编码路径](screenshots/${encodeURIComponent('结果 图.png')})`,
    '![格式 **alt**](https://tracker.example/alt.png)',
  ].join('\n\n'))
  const html = await render(readFileSync(path('DESIGN.md'), 'utf8'))
  expect(html.match(/<img\b/g)).toHaveLength(4)
  expect(html).toContain(`src="/bot-assets/${slug}/review-result.png"`)
  // VitePress image 插件输出解码后的属性值，浏览器请求时再编码。
  expect(html).toContain(`src="/bot-assets/${slug}/结果 图.png" alt="中文路径"`)
  expect(html).toContain(`src="/bot-assets/${slug}/结果 图.png" alt="编码路径"`)
  expect(html).toContain('>追踪</a>')
  expect(html).toContain('>图片链接</a>')
  expect(html).toContain('>格式 alt</a>')
  expect(html).not.toMatch(/<img[^>]+tracker\.example/)
})

it('未闭合注释保留文本与后续正文，成对注释才剥离', async () => {
  const content = '前文<!-- 删除 -->保留<!-- 未闭合 后续正文'
  expect(stripComments(content)).toBe('前文保留<!-- 未闭合 后续正文')
  put('ROLE.md', '<!-- 未闭合注释')
  put('DESIGN.md', '文'.repeat(200) + content)
  expect(validate().errors).toEqual([])
  const html = await render(readFileSync(path('DESIGN.md'), 'utf8'))
  expect(html).toContain('&lt;!-- 未闭合 后续正文')
  expect(html).not.toContain('删除')
})

it.each(['notes.txt', 'nested/.config', 'skills/checklist-review/big.md', 'fake.png'])('%s 非图片大小按 100KB 字节边界检查', (file) => {
  put(file, 'a'.repeat(100 * 1024))
  expect(validate().errors).toEqual([])
  put(file, 'a'.repeat(100 * 1024 + 1))
  expect(validate().errors.some((e) => e.file.endsWith(file) && e.problem.includes('100KB'))).toBe(true)
})

it.each([' '.repeat(95_000), '#'.repeat(95_000) + 'X', '#'.repeat(95_000)])('逐行解析超长标题不回溯，真实图片不受 100KB 限制（%#）', (suffix) => {
  put('DESIGN.md', `## 标题${suffix}\n${'文'.repeat(200)}`)
  const bytes = Buffer.alloc(150 * 1024)
  readFileSync(path('screenshots/review-result.png')).copy(bytes)
  put('screenshots/large.png', bytes)
  const start = performance.now()
  expect(validate().errors).toEqual([])
  expect(performance.now() - start).toBeLessThan(2000)
})

it('slugs.json 与网站使用同一口径：排除坏 YAML、非法/不匹配 slug，保留外部收录', () => {
  const data = YAML.parse(readFileSync(path('bot.yaml'), 'utf8'))
  for (const [folder, content] of [
    ['broken-bot', 'name: [未闭合'],
    ['mismatch-bot', YAML.stringify({ ...data, slug: 'different-bot' })],
    ['Bad-Slug', YAML.stringify({ ...data, slug: 'Bad-Slug' })],
    ['a', YAML.stringify({ ...data, slug: 'a' })],
  ]) put('bot.yaml', content, folder)
  const out = join(temp, 'assets'), apiData = join(temp, 'api')
  syncAssets({ botsDir, out, apiData })
  const slugs = JSON.parse(readFileSync(join(apiData, 'slugs.json'), 'utf8'))
  expect(slugs).toEqual(['demo-external', slug, 'demo-weekly-digest'])
  expect(slugs).toEqual(loadAllBots(botsDir).filter(isPublicBot).map((bot) => bot.slug))
  expect(readFileSync(join(ROOT, 'site/.vitepress/data/bots.mjs'), 'utf8')).toContain('isPublicBot(bot)')
})
