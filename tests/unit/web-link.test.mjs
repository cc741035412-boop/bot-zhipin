import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { randomBytes } from 'node:crypto'
import YAML from 'yaml'
import { ROOT } from '../../scripts/lib/load-bots.mjs'
import * as validation from '../../scripts/lib/validate/index.mjs'
import { makeSubmissionLink, makeWebSubmissionLink, readBundleDirectory } from '../../scripts/make-submission-link.mjs'
import { decode, encode, pack, unpack } from '../../scripts/submission/bundle.mjs'
import { URL_LIMITS } from '../../scripts/submission/bundle-core.mjs'
import { FORM_LABELS, LICENSE_TEXT, parseSubmission } from '../../scripts/submission/issue.mjs'
import { submitIssue } from '../../scripts/submission/from-issue.mjs'
import { SITE, CONTRIBUTE_URL, submitPrompt } from '../../site/.vitepress/meta.mjs'

const slug = 'demo-prd-reviewer'
const yamlPath = `bots/${slug}/bot.yaml`
const fixture = join(ROOT, 'tests/fixtures/bots', slug)
const cli = join(ROOT, 'scripts/make-submission-link.mjs')
const originalYaml = readFileSync(join(fixture, 'bot.yaml'), 'utf8')
const withoutGithub = originalYaml.replace(/^  github:.*\n/m, '')
let temp, dir
beforeEach(() => {
  temp = mkdtempSync(join(tmpdir(), 'web-link-test-'))
  dir = join(temp, 'source', slug)
  cpSync(fixture, dir, { recursive: true })
  vi.stubGlobal('fetch', vi.fn(() => { throw new Error('禁止真实联网') }))
})
afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
  vi.unstubAllGlobals()
  rmSync(temp, { recursive: true, force: true })
})
function setYaml(text) { writeFileSync(join(dir, 'bot.yaml'), text) }
function runCli(args) {
  return execFileSync(process.execPath, [cli, ...args], { encoding: 'utf8', timeout: 15_000, stdio: ['ignore', 'pipe', 'pipe'] })
}
function issueInput(text = readBundleDirectory(dir).plaintext) {
  return {
    login: 'actual-author', id: '12345', number: '42',
    body: `### ${FORM_LABELS.bundle}\n\n${text}\n\n### ${FORM_LABELS.screenshots}\n\n![截图](https://github.com/user-attachments/assets/test-image)\n\n### ${FORM_LABELS.license}\n\n- [x] ${LICENSE_TEXT}`,
  }
}
function fakeAdapters() {
  const root = join(temp, 'issue')
  const png = readFileSync(join(fixture, 'screenshots/review-result.png'))
  return {
    context: { repo: 'jakob52123/bot-zhipin', defaultBranch: 'main', template: '## 投稿检查\n' },
    assertClean: vi.fn(), readExisting: vi.fn(() => null), download: vi.fn(() => png),
    writeFiles: vi.fn((plan) => {
      for (const [path, content] of Object.entries(plan.files)) {
        mkdirSync(dirname(join(root, path)), { recursive: true })
        writeFileSync(join(root, path), content)
      }
    }),
    validate: vi.fn(() => validation.validateBots({ botsDir: join(root, 'bots') })),
    checkScope: vi.fn(() => []), publish: vi.fn(() => `${SITE.repo}/pull/17`),
    dispatch: vi.fn(), comment: vi.fn(),
  }
}

describe('网站投稿链接', () => {
  it('网站片段逐字往返，返回结构与第一行符合契约', () => {
    const result = makeWebSubmissionLink(dir)
    expect(Object.keys(result).sort()).toEqual(['bundle', 'long', 'output', 'token', 'url'])
    expect(result.long).toBe(false)
    expect(result.url).toBe(`${SITE.url}/submit#${result.token}`)
    expect(result.url.length).toBeLessThanOrEqual(URL_LIMITS.submitUrl)
    expect(new URL(result.url).search).toBe('')
    expect(decode(new URL(result.url).hash.slice(1))).toBe(result.bundle)
    expect(unpack(result.bundle)).toEqual(readBundleDirectory(dir).bundle)
    expect(result.output.split('\n')[0]).toBe(result.url)
  })
  it('超过网站限额给裸地址、说明和完整单行令牌，不截断', () => {
    writeFileSync(join(dir, 'notes.txt'), randomBytes(24_000).toString('hex'))
    const result = makeWebSubmissionLink(dir)
    expect(`${SITE.url}/submit#${result.token}`.length).toBeGreaterThan(URL_LIMITS.submitUrl)
    expect(result.long).toBe(true)
    expect(result.url).toBe(`${SITE.url}/submit`)
    expect(result.output.split('\n').slice(0, 3)).toEqual([
      result.url, '打开后把下面这一行粘进『已有投稿包』', result.token,
    ])
    expect(result.token).toMatch(/^BZB1:[A-Za-z0-9_-]+$/)
    expect(decode(result.token)).toBe(readBundleDirectory(dir).plaintext)
  })
  it('两种链接均使用注入校验器，并保留校验错误', () => {
    const errors = [{ file: yamlPath, where: 'name', problem: '测试错误', fix: '修正' }]
    for (const make of [makeWebSubmissionLink, makeSubmissionLink]) {
      const validate = vi.fn(() => ({ errors, warnings: [] }))
      expect(() => make(dir, { validate })).toThrow('测试错误')
      expect(validate).toHaveBeenCalledWith(expect.objectContaining({ bundle: readBundleDirectory(dir).bundle }), dir)
    }
  })
  it.each([[false], [true]])('CLI 位置参数与 --dir 输出相同（Issue=%s）', (issue) => {
    const flags = issue ? ['--issue'] : []
    const first = runCli([dir, ...flags])
    expect(runCli(['--dir', dir, ...flags])).toBe(first)
    const url = new URL(first.split('\n')[0])
    const token = issue ? url.searchParams.get('bundle') : url.hash.slice(1)
    expect(decode(token)).toBe(readBundleDirectory(dir).plaintext)
    expect(url.origin).toBe(issue ? 'https://github.com' : SITE.url)
  })
  it.each(['before', 'middle', 'after'])('--issue 在 %s 位置均走原 Issue 链路', (position) => {
    const args = position === 'before' ? ['--issue', '--dir', dir]
      : position === 'middle' ? ['--dir', '--issue', dir] : ['--dir', dir, '--issue']
    expect(runCli(args).trimEnd()).toBe(makeSubmissionLink(dir).output)
  })
  it.each([[], ['--dir'], ['--unknown'], ['--issue', '--issue'], ['one', 'two']])('非法参数 %j 输出更新后的用法', (...args) => {
    let error
    try { runCli(args) } catch (caught) { error = caught }
    expect(error.status).toBe(1)
    expect(error.stdout).toBe('')
    expect(error.stderr).toContain('[--issue]')
    expect(error.stderr).toContain('默认生成网站链接')
  })
  it.each([makeWebSubmissionLink, makeSubmissionLink])('缺 author.github 时真实校验通过，原文件与投稿包不改（%#）', (make) => {
    setYaml(withoutGithub)
    const result = make(dir)
    expect(readFileSync(join(dir, 'bot.yaml'), 'utf8')).toBe(withoutGithub)
    expect(unpack(result.bundle).files[yamlPath]).toBe(withoutGithub)
    expect(decode(result.token)).toBe(readBundleDirectory(dir).plaintext)
    for (const value of [result.bundle, result.url, result.output, result.token, issueInput(result.bundle).body]) {
      expect(value).not.toContain('submitter')
    }
  })
  it('占位账号仅在临时副本中，沿用原日期，校验后副本删除', () => {
    setYaml(withoutGithub)
    const realValidate = validation.validateBots
    let copiedPath
    vi.spyOn(validation, 'validateBots').mockImplementation((options) => {
      copiedPath = join(options.botsDir, slug, 'bot.yaml')
      const copied = YAML.parse(readFileSync(copiedPath, 'utf8'))
      expect(copied.author.github).toBe('submitter')
      expect(copied.addedAt).toBe(YAML.parse(originalYaml).addedAt)
      expect(copiedPath).not.toBe(join(dir, 'bot.yaml'))
      return realValidate(options)
    })
    makeWebSubmissionLink(dir)
    expect(existsSync(copiedPath)).toBe(false)
  })
  it('没有 addedAt 时临时副本用北京时间当天，投稿包仍然不补', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-11-14T17:00:00Z'))
    const text = withoutGithub.replace(/^addedAt:.*\n/m, '')
    setYaml(text)
    const realValidate = validation.validateBots
    vi.spyOn(validation, 'validateBots').mockImplementation((options) => {
      expect(YAML.parse(readFileSync(join(options.botsDir, slug, 'bot.yaml'), 'utf8')).addedAt).toBe('2026-11-15')
      return realValidate(options)
    })
    expect(unpack(makeWebSubmissionLink(dir).bundle).files[yamlPath]).toBe(text)
  })
  it('缺作者仍执行其他必填校验，不能绕过校验器', () => {
    setYaml(withoutGithub.replace(/^quotaCost:.*\n/m, ''))
    for (const make of [makeWebSubmissionLink, makeSubmissionLink]) expect(() => make(dir)).toThrow('quotaCost')
    expect(readFileSync(join(dir, 'bot.yaml'), 'utf8')).not.toContain('submitter')
  })
  it('已填写但非法的 author.github 不替换成占位账号', () => {
    setYaml(originalYaml.replace('example-user', 'invalid_user'))
    expect(() => makeWebSubmissionLink(dir)).toThrow('author.github')
  })
  it('步骤按实际截图张数和投稿包顺序显示，并提示省略头像', () => {
    cpSync(join(dir, 'screenshots/review-result.png'), join(dir, 'screenshots/a-first.png'))
    const output = makeWebSubmissionLink(dir).output
    expect(output).toContain('1. 点开链接，先看一眼你的 Bot 在网站上长什么样。\n2. 点「用 GitHub 登录」。\n3. 把 2 张截图拖进去（按顺序：a-first.png、review-result.png）。\n4. 勾选授权，点提交。')
    expect(output).toContain('投稿包不传头像，将使用网站默认头像。')
  })
  it('无图片时沿用 DESIGN 引用顺序，而不是按文件名排序', () => {
    rmSync(join(dir, 'screenshots'), { recursive: true })
    const design = readFileSync(join(dir, 'DESIGN.md'), 'utf8')
    writeFileSync(join(dir, 'DESIGN.md'), design + '\n![先](screenshots/z.png)\n![后](screenshots/a.jpg)')
    expect(makeWebSubmissionLink(dir).output).toContain('把 2 张截图拖进去（按顺序：z.png、a.jpg）')
  })
  it('无截图声明提示至少 1 张，没有头像则不提示省略', () => {
    rmSync(join(dir, 'screenshots'), { recursive: true })
    rmSync(join(dir, 'avatar.png'))
    const result = makeWebSubmissionLink(dir)
    expect(unpack(result.bundle).screenshots).toEqual([])
    expect(result.output).toContain('至少 1 张截图拖进去')
    expect(result.output).not.toContain('按顺序')
    expect(result.output).not.toContain('头像')
  })
})

describe('Issue 备用链路', () => {
  it.each(['plain', 'token'])('缺 github 时补真实作者并重新解析，兼容 %s', (kind) => {
    setYaml(withoutGithub)
    const source = readBundleDirectory(dir)
    const parsed = parseSubmission(issueInput(kind === 'token' ? encode(source.plaintext) : source.plaintext))
    expect(parsed.data.author.github).toBe('actual-author')
    expect(YAML.parse(parsed.bundle.files[yamlPath])).toEqual(parsed.data)
    expect(parsed.data.addedAt).toBe(YAML.parse(originalYaml).addedAt)
    const stripAuthor = (text) => text.replace(/^author:\n(?:[ \t]+.*\n)*/m, '')
    expect(stripAuthor(parsed.bundle.files[yamlPath])).toBe(stripAuthor(withoutGithub))
    expect(parsed.fields.bundle).toBe(kind === 'token' ? encode(source.plaintext) : source.plaintext.trimEnd())
    expect(pack(parsed.bundle)).not.toContain('submitter')
  })
  it('没有 author 时创建 name 和 github', () => {
    setYaml(withoutGithub.replace(/^author:\n(?:[ \t]+.*\n)*/m, ''))
    expect(parseSubmission(issueInput()).data.author).toEqual({ name: 'actual-author', github: 'actual-author' })
  })
  it.each(['addedAt: 123 # 保留数字\n', 'addedAt: null # 保留空值\n', 'addedAt: [bad, date]\n', ''])('非法或缺失日期原文保持，不补日期：%s', async (dateLine) => {
    const text = withoutGithub.replace(/^addedAt:.*\n/m, dateLine)
    setYaml(text)
    const parsed = parseSubmission(issueInput())
    expect(parsed.data.addedAt).toEqual(YAML.parse(text).addedAt)
    if (dateLine) expect(parsed.bundle.files[yamlPath]).toContain(dateLine)
    else expect(parsed.bundle.files[yamlPath]).not.toContain('addedAt')
    const adapters = fakeAdapters()
    const result = await submitIssue(issueInput(), adapters)
    expect(result.ok).toBe(false)
    expect(result.errors.some((error) => error.where.includes('addedAt'))).toBe(true)
    expect(adapters.publish).not.toHaveBeenCalled()
  })
  it.each(['{slug: demo-prd-reviewer}', '{author: {name: 姓名}, addedAt: 123}', '{addedAt: [bad, date]}'])('流式 YAML 也保留缺失或非法日期：%s', (text) => {
    setYaml(text)
    const parsed = parseSubmission(issueInput())
    expect(parsed.data.author.github).toBe('actual-author')
    expect(parsed.data.addedAt).toEqual(YAML.parse(text).addedAt)
    expect(Object.hasOwn(parsed.data, 'addedAt')).toBe(Object.hasOwn(YAML.parse(text), 'addedAt'))
  })
  it.each(['someone-else', '', null, 123])('已填 github=%s 不能作为缺失处理或冒名', (github) => {
    const data = YAML.parse(originalYaml)
    data.author.github = github
    setYaml(YAML.stringify(data))
    expect(() => parseSubmission(issueInput())).toThrow('author.github')
  })
  it('已填正确账号仍忽略大小写，投稿原文不动', () => {
    setYaml(originalYaml.replace('example-user', 'ACTUAL-author'))
    const source = readBundleDirectory(dir)
    expect(parseSubmission(issueInput()).bundle).toEqual(source.bundle)
  })
  it('完整 mock 流程补作者、真实校验通过，成功评论末尾引导网站', async () => {
    setYaml(withoutGithub)
    const adapters = fakeAdapters()
    const result = await submitIssue(issueInput(), adapters)
    expect(result.ok).toBe(true)
    expect(YAML.parse(result.plan.files[yamlPath]).author.github).toBe('actual-author')
    expect(result.details.body).not.toContain('submitter')
    expect(adapters.publish).toHaveBeenCalledOnce()
    expect(adapters.comment).toHaveBeenCalledOnce()
    const comment = adapters.comment.mock.calls[0][1]
    expect(comment).toContain('✓ 检查通过，已自动创建 PR：')
    expect(comment.split('\n').at(-1)).toBe(`下次可以直接在网站上投稿，更快：${SITE.url}/submit`)
  })
})

describe('站点配置', () => {
  it('submitPrompt 逐字等于定稿，5 行且无末尾换行', () => {
    expect(submitPrompt()).toBe([
      '请帮我把我做的 Grok Bot 投稿到「Bot 直聘」：https://github.com/jakob52123/bot-zhipin',
      '1. 先完整读一遍仓库根目录的 AGENTS.md，严格按它的步骤做。',
      '2. 能从你自己（或我的 Bot 配置）里查到的信息直接用，查不到的再一次问清我；不要编造效果和截图。',
      '3. 不要向我要 GitHub 令牌或密码。',
      '4. 最后给我一个 https://bot-zhipin.pages.dev/submit 开头的投稿链接。',
    ].join('\n'))
  })
  it('提示词从 SITE 动态拼接仓库和站点地址', () => {
    const { repo, url } = SITE
    try {
      SITE.repo = 'https://example.invalid/repository'
      SITE.url = 'https://example.invalid'
      expect(submitPrompt().split('\n')[0]).toBe(`请帮我把我做的 Grok Bot 投稿到「Bot 直聘」：${SITE.repo}`)
      expect(submitPrompt().split('\n')[4]).toBe(`4. 最后给我一个 ${SITE.url}/submit 开头的投稿链接。`)
    } finally { Object.assign(SITE, { repo, url }) }
  })
  it('CONTRIBUTE_URL 是站内投稿页，SITE.url 是正式站点', () => {
    expect(CONTRIBUTE_URL).toBe('/submit')
    expect(SITE.url).toBe('https://bot-zhipin.pages.dev')
  })
})
