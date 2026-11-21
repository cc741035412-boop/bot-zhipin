import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { execFileSync, spawnSync } from 'node:child_process'
import { join } from 'node:path'
import YAML from 'yaml'
import { ROOT, loadEnums } from '../../scripts/lib/load-bots.mjs'
import { validateBots, formatResult } from '../../scripts/validate.mjs'
import { MAX_IMAGE_BYTES } from '../../scripts/lib/validate/images.mjs'

const fixtureDir = join(ROOT, 'tests/fixtures/bots')
const reviewer = 'demo-prd-reviewer'
const weekly = 'demo-weekly-digest'
const external = 'demo-external'
const skillPath = 'skills/checklist-review/SKILL.md'
const now = new Date('2026-11-14T04:00:00Z')
let temp, botsDir
beforeEach(() => {
  temp = execFileSync('mktemp', ['-d'], { encoding: 'utf8' }).trim()
  botsDir = join(temp, 'bots')
  cpSync(fixtureDir, botsDir, { recursive: true })
})
afterEach(() => rmSync(temp, { recursive: true, force: true }))

function path(file, slug = reviewer) { return join(botsDir, slug, file) }
function put(file, text, slug = reviewer) {
  const target = path(file, slug)
  mkdirSync(join(target, '..'), { recursive: true })
  writeFileSync(target, text)
}
function remove(file, slug = reviewer) { rmSync(path(file, slug), { recursive: true, force: true }) }
function change(update, slug = reviewer) {
  const data = YAML.parse(readFileSync(path('bot.yaml', slug), 'utf8'))
  update(data)
  put('bot.yaml', YAML.stringify(data), slug)
}
function run(options = {}) { return validateBots({ botsDir, now, ...options }) }
function issues(result = run()) { return result.errors.map((e) => e.problem).join('\n') }
function cli(args = [], env = {}) {
  return spawnSync(process.execPath, [join(ROOT, 'scripts/validate.mjs'), ...args], {
    cwd: ROOT, env: { ...process.env, BOTS_DIR: '', ...env }, encoding: 'utf8', timeout: 15000,
  })
}
function fieldErrors(field) { return run().errors.filter((e) => e.file.endsWith(`${reviewer}/bot.yaml`) && e.where === field) }

it('真实 bots/ 通过', () => {
  expect(validateBots({ botsDir: join(ROOT, 'bots'), now }).errors).toEqual([])
})
it('三个合法示例通过，外部收录不要求正文、技能、截图和 github', () => {
  const result = validateBots({ botsDir: fixtureDir, now })
  expect(result.bots).toHaveLength(3)
  expect(result.errors).toEqual([])
  expect(result.warnings).toEqual([])
  expect(formatResult(result)).toBe('✓ 校验通过：3 个 Bot（其中 1 个外部收录）')
})
it('bot.yaml 缺失也报告 YAML 格式错误和行号', () => {
  remove('bot.yaml')
  expect(issues()).toMatch(/YAML 格式错误（第 1 行）：找不到 bot.yaml/)
})
it('YAML 语法错误包含行号且不回显原文', () => {
  put('bot.yaml', 'slug: demo-prd-reviewer\nname: [未闭合\n')
  const result = run()
  expect(issues(result)).toMatch(/YAML 格式错误（第 \d+ 行）/)
  expect(formatResult(result)).not.toContain('name: [未闭合')
})
it.each(['', 'null', '- a\n- b', '不是映射'])('YAML 顶层非法：%s', (text) => {
  put('bot.yaml', text)
  expect(issues()).toContain('YAML 格式错误')
})
it('缺少必填 quotaCost 给出完整中文改法', () => {
  change((data) => { delete data.quotaCost })
  expect(fieldErrors('quotaCost')).toEqual([{
    file: `bots/${reviewer}/bot.yaml`, where: 'quotaCost',
    problem: '缺少必填字段 quotaCost（额度消耗）',
    fix: '加一行 quotaCost: 中（可选值：低、中、高）',
  }])
})
it('非外部 author.github 必填', () => {
  change((data) => { delete data.author.github })
  expect(issues()).toContain('缺少必填字段 author.github')
})
it.each([
  ['category', '不存在的分组', 'categories'],
  ['quotaCost', '中等', 'quotaCosts'],
  ['permissions', ['不存在的权限'], 'permissions'],
])('枚举 %s 列出全部可选值', (field, value, key) => {
  change((data) => { data[field] = value })
  const text = issues()
  expect(text).toContain('不是可选的值')
  for (const option of loadEnums()[key]) expect(text).toContain(option)
})
it.each([
  ['quota_cost', 'quotaCost', false],
  ['githb', 'github', true],
])('未知字段 %s 按编辑距离建议 %s', (wrong, right, nested) => {
  change((data) => { (nested ? data.author : data)[wrong] = '值' })
  expect(issues()).toContain(`不认识的字段 ${nested ? 'author.' : ''}${wrong}，是不是想写 ${right}`)
})
it.each(['', '长'.repeat(21)])('字符串长度给出当前值和范围：%s', (name) => {
  change((data) => { data.name = name })
  const errors = fieldErrors('name')
  expect(errors).toHaveLength(1)
  expect(errors[0].problem).toContain(JSON.stringify(name))
  expect(errors[0].problem).toContain('1～20 个字符')
})
it('格式错误给出当前值和正则要求', () => {
  change((data) => { data.author.github = '@invalid' })
  expect(fieldErrors('author.github')[0].problem).toMatch(/@invalid.*格式不正确.*要求.*正则/)
})
it.each([null, {}, false, '', [], ['']])('prerequisites anyOf 只保留一个有用错误：%j', (value) => {
  change((data) => { data.prerequisites = value })
  const errors = run().errors.filter((e) => e.where.startsWith('prerequisites'))
  expect(errors).toHaveLength(1)
  expect(errors[0].problem).toContain('要求')
})
it('类型和列表重复各有可操作诊断', () => {
  change((data) => { data.external = 'true'; data.permissions = ['联网', '联网'] })
  expect(issues()).toContain('要求 boolean')
  expect(issues()).toContain('含重复项')
})
it('slug 和文件夹名不一致', () => {
  change((data) => { data.slug = 'different-slug' })
  expect(issues()).toContain('和文件夹名不一致')
})
it('templateUrl 前缀与 schema pattern 合并成一次错误', () => {
  change((data) => { data.templateUrl = 'https://example.com/bot/abc' })
  const errors = fieldErrors('templateUrl')
  expect(errors).toHaveLength(1)
  expect(errors[0].problem).toContain('必须以 https://x.ai/bot/ 开头')
})
it.each(['https://x.ai/bot/', 'https://x.ai/bot/id?foo=bar'])('templateUrl 正确前缀但非法 ID：%s', (url) => {
  change((data) => { data.templateUrl = url })
  expect(fieldErrors('templateUrl')).toHaveLength(1)
  expect(issues()).toContain('非空 ID')
})
it.each(['slug', 'templateUrl'])('跨 Bot 的 %s 重复', (field) => {
  const data = YAML.parse(readFileSync(path('bot.yaml'), 'utf8'))
  change((other) => { other[field] = data[field] }, weekly)
  expect(issues()).toContain(`${field} 重复`)
})
it.each(['2026-02-30', '2025-02-29', '2026-13-01', '2026-00-01', '2026-01-00', '2026-1-1'])('addedAt 非真实日期：%s', (date) => {
  change((data) => { data.addedAt = date })
  expect(fieldErrors('addedAt')).toHaveLength(1)
  expect(issues()).toContain('不是有效日期')
})
it('addedAt 接受真实闰日', () => {
  change((data) => { data.addedAt = '2024-02-29' })
  expect(run().errors).toEqual([])
})
it('addedAt 未来日期报错', () => {
  change((data) => { data.addedAt = '2099-01-01' })
  expect(issues()).toContain('不能晚于今天')
})
it('addedAt 北京时间跨日并允许多一天，超过容差才报错', () => {
  change((data) => { data.addedAt = '2026-11-16' })
  expect(issues(run({ now: new Date('2026-11-14T15:59:59Z') }))).toContain('不能晚于今天')
  expect(run({ now: new Date('2026-11-14T16:00:00Z') }).errors).toEqual([])
})
it.each([['no-such-bot', '找不到'], [reviewer, '不能是自己']])('forkedFrom %s', (slug, message) => {
  change((data) => { data.forkedFrom = slug })
  expect(issues()).toContain(message)
})
it.each([null, '<!-- 只有注释 -->\n\t'])('ROLE.md 缺失或去注释后为空：%s', (text) => {
  if (text === null) remove('ROLE.md'); else put('ROLE.md', text)
  expect(run().errors.some((e) => e.file.endsWith('ROLE.md'))).toBe(true)
})
it('DESIGN.md 缺失', () => {
  remove('DESIGN.md')
  expect(issues()).toContain('缺少 DESIGN.md')
})
it('DESIGN.md 去标题、HTML 注释、空白后按 Unicode 字符计数', () => {
  put('DESIGN.md', `# 标题\n  ## 标题也不计数\n<!-- ${'注'.repeat(250)} -->\n 正 文 😀 \n`)
  expect(issues()).toContain('正文只有 3 字，至少要 200 字')
})
it('DESIGN.md 200 字正文达标，缺五个二级标题只提醒', () => {
  put('DESIGN.md', '文'.repeat(200))
  const result = run()
  expect(result.errors).toEqual([])
  expect(result.warnings).toHaveLength(1)
  for (const title of ['解决谁的什么问题', '现在的做法哪里不好', '这个 Bot 是怎么设计的', '实际效果', '已知局限和下一步']) expect(result.warnings[0].problem).toContain(title)
})
it('skills/ 至少一个技能文件夹，普通文件不能代替', () => {
  remove('skills')
  put('skills/readme.md', '不是技能文件夹')
  expect(issues()).toContain('至少需要一个技能文件夹')
})
it('每个技能文件夹必须有 SKILL.md', () => {
  remove(skillPath)
  expect(issues()).toContain('缺少 SKILL.md')
})
it('SKILL.md 缺少 frontmatter 并给出示例', () => {
  put(skillPath, '# 普通正文')
  const error = run().errors.find((e) => e.file.endsWith(skillPath))
  expect(error.problem).toContain('缺少 frontmatter')
  expect(error.fix).toContain('---\\nname: checklist-review\\ndescription:')
})
it.each(['---\nname: [坏掉\n---\n', '---\n- 列表不合法\n---\n'])('SKILL.md 非法 frontmatter：%s', (text) => {
  put(skillPath, text)
  expect(issues()).toContain('frontmatter YAML 格式错误')
})
it.each(['name', 'description'])('frontmatter 缺少或空白 %s', (field) => {
  for (const value of [undefined, '', '  ', null, []]) {
    put(skillPath, `---\n${YAML.stringify({ name: 'checklist-review', description: '真实描述', [field]: value })}---\n`)
    expect(issues()).toContain(`frontmatter 缺少 ${field}`)
  }
})
it('frontmatter.name 和文件夹不同只提醒', () => {
  put(skillPath, '---\nname: other-name\ndescription: 真实描述\n---\n')
  const result = run()
  expect(result.errors).toEqual([])
  expect(result.warnings[0].where).toBe('frontmatter.name')
})
it('截图可选（第 43 条）：非外部 Bot 没有截图也通过，点开头文件忽略', () => {
  remove('screenshots')
  expect(run().errors).toEqual([])
  put('screenshots/.gitkeep', '不是图片')
  expect(run().errors).toEqual([])
})
const designRefErrors = (result = run()) => result.errors.filter((e) => e.where === '图片引用')
it('DESIGN.md 引用了不存在的本地截图报「图片引用」，去重并给出改法', () => {
  const design = readFileSync(path('DESIGN.md'), 'utf8')
  put('DESIGN.md', `${design}\n![甲](screenshots/missing.png)\n![乙](<./screenshots/other.jpg>)\n[链接](screenshots/missing.png)\n`)
  const errors = designRefErrors()
  // 同一文件同一位置的问题由内核合并成一条，按出现顺序、去重。
  expect(errors.map((e) => e.problem)).toEqual(['引用了 screenshots/missing.png，但没有这张图；引用了 screenshots/other.jpg，但没有这张图'])
  expect(errors[0].file).toBe(`bots/${reviewer}/DESIGN.md`)
  expect(errors[0].fix).toContain('删掉这行图片引用')
  expect(errors[0].fix).toContain('实际效果')
  expect(issues()).not.toContain('至少需要一张截图')
})
it('DESIGN.md 引用存在的截图（含 URL 编码）、注释里的引用、外链图片都不报', () => {
  const design = readFileSync(path('DESIGN.md'), 'utf8')
  put('DESIGN.md', `${design}\n![结果](screenshots/review-result.png)\n![编码](./screenshots/review%2Dresult.png)\n<!-- ![示例](screenshots/screenshot-1.png) -->\n![外链](https://example.com/a.png)\n`)
  expect(designRefErrors()).toEqual([])
  remove('screenshots')
  expect(designRefErrors().map((e) => e.problem)).toEqual(['引用了 screenshots/review-result.png，但没有这张图'])
})
it.each(['screenshots/big.png', 'avatar.png'])('%s 超过 2MB 显示实际字节数，恰好 2MB 通过', (file) => {
  const bytes = Buffer.alloc(MAX_IMAGE_BYTES + 1)
  readFileSync(path('screenshots/review-result.png')).copy(bytes)
  put(file, bytes)
  expect(issues()).toContain(`超过 2MB：实际 ${MAX_IMAGE_BYTES + 1} 字节`)
  put(file, bytes.subarray(0, MAX_IMAGE_BYTES))
  expect(run().errors).toEqual([])
})
it('截图扩展名只允许五种格式', () => {
  put('screenshots/shot.bmp', 'x')
  expect(issues()).toMatch(/shot|扩展名/)
  expect(issues()).toContain('png、jpg、jpeg、webp、gif')
})
it.each(['screenshots/fake.png', 'avatar.png'])('%s 伪装图片文件头报错', (file) => {
  put(file, 'not an image')
  expect(issues()).toContain('图片文件头与扩展名 .png 不符')
})
it('图片文件头有效但与扩展名不匹配仍报错', () => {
  put('screenshots/fake.gif', readFileSync(path('screenshots/review-result.png')))
  expect(issues()).toContain('真实格式为 png')
})
it.each([
  ['jpg', [255, 216, 255, 224]], ['jpeg', [255, 216, 255, 224]],
  ['gif', 'GIF89a'], ['webp', 'RIFF0000WEBP'], ['PNG', [137, 80, 78, 71, 13, 10, 26, 10]],
])('允许 %s 魔数（按规格只检查文件头）', (ext, header) => {
  remove('screenshots')
  put(`screenshots/shot.${ext}`, Buffer.from(header))
  expect(run().errors).toEqual([])
})
it('外部收录有截图或头像时仍检查大小和格式', () => {
  put('screenshots/fake.png', '不是 PNG', external)
  put('avatar.png', Buffer.alloc(MAX_IMAGE_BYTES + 1), external)
  const errors = run().errors.filter((e) => e.file.includes(external))
  expect(errors.some((e) => e.problem.includes('超过 2MB'))).toBe(true)
  expect(errors.some((e) => e.problem.includes('文件头'))).toBe(true)
})
it('原样复制 _template 报出全部模板残留', () => {
  cpSync(join(ROOT, 'bots/_template'), join(botsDir, 'my-bot'), { recursive: true })
  const errors = run().errors.filter((e) => e.file.startsWith('bots/my-bot/') && e.problem.includes('还是模板里的示例'))
  expect(errors).toHaveLength(7)
  for (const field of ['slug', 'templateUrl', 'author.github', 'tagline', 'pitch', 'frontmatter.description', '正文']) expect(errors.some((e) => e.where === field)).toBe(true)
})
it('模板原文从 _template 读取，删掉可选 routines 和 pitch 不误报', () => {
  const template = YAML.parse(readFileSync(join(ROOT, 'bots/_template/bot.yaml'), 'utf8'))
  change((data) => { data.tagline = template.tagline; delete data.pitch })
  remove('routines.md')
  expect(issues()).toContain('tagline 还是模板里的示例')
  expect(run().errors.filter((e) => e.problem.includes('还是模板里的示例'))).toHaveLength(1)
})

// 所有疑似凭据都在测试运行时拼接，绝不存完整形态字面量。
const credentialCases = [
  ...['p', 'o', 'u', 's', 'r'].map((kind) => [`GitHub ${kind}`, () => `gh${kind}_` + 'A'.repeat(36)]),
  ['GitHub PAT', () => 'github_' + 'pat_' + 'B'.repeat(60)],
  ...['', 'proj-', 'ant-'].map((kind) => [`sk ${kind || 'basic'}`, () => 'sk-' + kind + 'C'.repeat(40)]),
  ['xai', () => 'xai-' + 'D'.repeat(40)],
  ...['AKIA', 'ASIA'].map((kind) => [kind, () => kind + 'E'.repeat(16)]),
  ['私钥', () => '-----BEGIN ' + 'OPENSSH PRIVATE KEY' + '-----'],
  ['无算法名私钥', () => '-----BEGIN ' + 'PRIVATE KEY' + '-----'],
  ['Google', () => 'AIza' + 'F'.repeat(35)],
  ...['a', 'b', 'p', 'r', 's'].map((kind) => [`Slack ${kind}`, () => `xox${kind}-` + '1234567890-'.repeat(3)]),
]
describe('密钥扫描', () => {
  it.each(credentialCases)('%s：扫描嵌套文件、行号、脱敏和撤销提示', (_, make) => {
    const secret = make()
    put('skills/checklist-review/deep/notes.txt', `配置说明\r\n令牌：${secret}\r\n`)
    const result = run()
    const errors = result.errors.filter((e) => e.problem.includes('疑似密钥'))
    expect(errors).toHaveLength(1)
    expect(errors[0].file).toBe(`bots/${reviewer}/skills/checklist-review/deep/notes.txt`)
    expect(errors[0].problem).toContain('第 2 行')
    expect(errors[0].problem).toContain(secret.slice(0, 4) + '***')
    expect(errors[0].fix).toBe('删掉它；如果这个密钥曾经推到过 GitHub，就当它已经泄露，马上到对应平台撤销重建。')
    expect(formatResult(result).includes(secret)).toBe(false)
    expect(JSON.stringify(errors).includes(secret)).toBe(false)
  })
  it.each(['token', 'secret', 'password', 'api_key'])('通用 %s 长串只提醒', (field) => {
    const secret = 'generic' + 'Z'.repeat(30)
    put('config.txt', `${field} = "${secret}"\n`)
    const result = run()
    expect(result.errors).toEqual([])
    expect(result.warnings).toHaveLength(1)
    expect(result.warnings[0].problem).toContain('疑似通用凭据')
    expect(formatResult(result).includes(secret)).toBe(false)
  })
  it('已知密钥不再产生重复通用提醒', () => {
    put('config.txt', 'token = ' + credentialCases[0][1]())
    const result = run()
    expect(result.errors).toHaveLength(1)
    expect(result.warnings).toHaveLength(0)
  })
  it('schema 的当前值、未知字段、YAML 错误和路径也不能泄露密钥', () => {
    const secret = credentialCases[0][1]()
    change((data) => { data.name = secret; data.category = secret; data[secret] = 'unknown' })
    put(`nested/${secret}.txt`, secret)
    let result = run()
    expect(formatResult(result).includes(secret)).toBe(false)
    expect(JSON.stringify([...result.errors, ...result.warnings]).includes(secret)).toBe(false)
    put('bot.yaml', `name: [${secret}\n`)
    result = run()
    expect(issues(result)).toContain('YAML 格式错误')
    expect(issues(result)).toContain('疑似密钥')
    expect(formatResult(result).includes(secret)).toBe(false)
  })
  it('不扫描真实图片，但扫描伪装 .png 文本及隐藏文本文件', () => {
    const secret = credentialCases[0][1]()
    const png = readFileSync(path('screenshots/review-result.png'))
    put('image.png', Buffer.concat([png, Buffer.from(secret)]))
    expect(run().errors).toEqual([])
    put('not-image.png', secret)
    put('.config', secret)
    expect(run().errors.filter((e) => e.problem.includes('疑似密钥'))).toHaveLength(2)
  })
})

it('结构化诊断只含 file/where/problem/fix，--dir 名称不影响 bots/ 相对路径', () => {
  const elsewhere = join(temp, 'custom-name')
  cpSync(botsDir, elsewhere, { recursive: true })
  rmSync(join(elsewhere, reviewer, 'bot.yaml'))
  const result = run({ botsDir: elsewhere })
  for (const item of [...result.errors, ...result.warnings]) {
    expect(Object.keys(item).sort()).toEqual(['file', 'fix', 'problem', 'where'])
    expect(item.file.startsWith('bots/')).toBe(true)
    expect(item.file.includes(temp)).toBe(false)
  }
})
it('错误、提醒和汇总严格按约定格式输出', () => {
  change((data) => { delete data.quotaCost })
  put(skillPath, '---\nname: x\ndescription: 实际技能\n---\n')
  const output = formatResult(run())
  expect(output).toContain(`✗ bots/${reviewer}/bot.yaml\n  位置：quotaCost\n  问题：缺少必填字段 quotaCost（额度消耗）\n  改法：加一行 quotaCost: 中（可选值：低、中、高）\n\n`)
  expect(output).toContain(`! bots/${reviewer}/${skillPath}\n  位置：frontmatter.name\n  提醒：`)
  expect(output).toContain('\n  建议：')
  expect(output).toContain('校验未通过：1 个 Bot 共 1 处错误（另有 1 条提醒）。按上面的「改法」逐条修改后，重新运行 npm run validate。')
})
it('跨 Bot 多处错误全部列出并汇总受影响 Bot 数量', () => {
  change((data) => { delete data.quotaCost })
  change((data) => { data.category = '不支持' }, weekly)
  const result = run()
  expect(result.errors).toHaveLength(2)
  expect(formatResult(result)).toContain('校验未通过：2 个 Bot 共 2 处错误')
})
it('CLI 默认目录通过、环境变量有效、--dir 优先于环境变量', () => {
  expect(cli().status).toBe(0)
  const environment = cli([], { BOTS_DIR: 'tests/fixtures/bots' })
  expect(environment.status).toBe(0)
  expect(environment.stdout).toContain('3 个 Bot（其中 1 个外部收录），1 支小队')
  remove('bot.yaml')
  expect(cli([], { BOTS_DIR: botsDir }).status).toBe(1)
  expect(cli(['--dir', fixtureDir], { BOTS_DIR: botsDir }).status).toBe(0)
})
it('CLI 错误退出 1，只有提醒退出 0 且先列提醒', () => {
  put(skillPath, '---\nname: x\ndescription: 实际技能\n---\n')
  const warning = cli(['--dir', botsDir])
  expect(warning.status).toBe(0)
  expect(warning.stdout.startsWith('! bots/')).toBe(true)
  // CLI 做全量校验，成功时同时报 Bot、小队、Prompt、Skill 的数量；临时目录旁边没有这几个目录，所以都是 0。
  expect(warning.stdout.trim().endsWith('✓ 校验通过：3 个 Bot（其中 1 个外部收录），0 支小队，0 条 Prompt，0 个 Skill')).toBe(true)
  remove('bot.yaml')
  const failure = cli(['--dir', botsDir])
  expect(failure.status).toBe(1)
  expect(failure.stdout).toContain('校验未通过')
})
it('CLI 未知参数或缺 --dir 值退出 1 并给用法', () => {
  for (const args of [['--dir'], ['--unknown'], ['--dir', '--other']]) {
    const result = cli(args)
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('用法：')
  }
})
