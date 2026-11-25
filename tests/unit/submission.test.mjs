import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { gzipSync } from 'node:zlib'
import { randomBytes } from 'node:crypto'
import YAML from 'yaml'
import { ROOT } from '../../scripts/lib/load-bots.mjs'
import { validateBots } from '../../scripts/lib/validate/index.mjs'
import { MAX_IMAGE_BYTES } from '../../scripts/lib/validate/images.mjs'
import { pack, unpack, encode, decode, LIMITS } from '../../scripts/submission/bundle.mjs'
import { FORM_LABELS, LICENSE_TEXT, parseForm, parseSubmission, checkOwnership } from '../../scripts/submission/issue.mjs'
import { COMMENT_MARKER, failureComment } from '../../scripts/submission/errors.mjs'
import { assertImageUrl, extractImageUrls, downloadImage, makeFilePlan } from '../../scripts/submission/screenshots.mjs'
import { createAdapters, scopeErrors } from '../../scripts/submission/adapters.mjs'
import { submitIssue } from '../../scripts/submission/from-issue.mjs'
import { makeSubmissionLink, readBundleDirectory } from '../../scripts/make-submission-link.mjs'

const slug = 'demo-prd-reviewer'
const prefix = `bots/${slug}/`
const fixture = join(ROOT, 'tests/fixtures/bots', slug)
const png = readFileSync(join(fixture, 'screenshots/review-result.png'))
const attachment = 'https://github.com/user-attachments/assets/test-image'
const repo = 'jakob52123/bot-zhipin'
const prUrl = `https://github.com/${repo}/pull/17`
const sha = 'a'.repeat(40)
let temp, root, source

beforeEach(() => {
  temp = mkdtempSync(join(tmpdir(), 'issue-submission-test-'))
  root = join(temp, 'repo')
  mkdirSync(join(root, 'bots'), { recursive: true })
  mkdirSync(join(root, '.github'))
  cpSync(join(ROOT, '.github/pull_request_template.md'), join(root, '.github/pull_request_template.md'))
  source = readBundleDirectory(fixture)
  vi.stubGlobal('fetch', vi.fn(() => { throw new Error('测试禁止真实联网') }))
})
afterEach(() => {
  vi.unstubAllGlobals()
  rmSync(temp, { recursive: true, force: true })
})
const rawBundle = (paths, contents = '测试内容') => `BOT-ZHIPIN-BUNDLE v1\n${paths.map((path) => `=== ${path} ===\n${contents}\n`).join('')}=== ${prefix}screenshots ===\nreview-result.png\n=== end ===\n`
// 新表单没有截图栏（第 43 条）；传入 screenshots 字符串时生成旧表单的截图栏，用来测兼容。
function form(bundle = encode(source.plaintext), screenshots = null, license = `- [x] ${LICENSE_TEXT}`) {
  const shots = screenshots === null ? '' : `### ${FORM_LABELS.screenshots}\n\n${screenshots}\n\n`
  return `### ${FORM_LABELS.bundle}\n\n\`\`\`text\n${bundle}\n\`\`\`\n\n${shots}### ${FORM_LABELS.license}\n\n${license}`
}
const LEGACY_LICENSE_TEXT = '我同意以 CC BY 4.0 授权这次投稿，并确认内容和截图都是我有权公开的'
const input = (body = form(), other = {}) => ({ body, login: 'example-user', id: '12345', number: '42', ...other })
function changedBundle(change) {
  const bundle = unpack(source.plaintext)
  const data = YAML.parse(bundle.files[`${prefix}bot.yaml`])
  change(data, bundle)
  bundle.files[`${prefix}bot.yaml`] = YAML.stringify(data)
  return pack(bundle)
}
function fakeCommands({ comments = [], prs = [], changed = [`${prefix}bot.yaml`], dirty = false, dispatchFails = false } = {}) {
  return vi.fn((file, args) => {
    if (file === 'git') {
      if (args[0] === 'status') return dirty ? '?? unexpected\0' : ''
      if (args[0] === 'rev-parse') return sha
      if (args[0] === 'diff') return changed.map((path) => `${path}\0`).join('')
      if (args[0] === 'ls-files') return ''
      return ''
    }
    if (file !== 'gh') throw new Error('未知命令')
    if (args[0] === 'pr' && args[1] === 'list') return JSON.stringify(prs)
    if (args[0] === 'pr' && args[1] === 'create') return prUrl
    if (args[0] === 'api' && args.includes('--slurp')) return JSON.stringify([comments])
    if (args[0] === 'workflow' && dispatchFails) throw new Error('模拟派发失败')
    return ''
  })
}
function setup(options = {}) {
  const run = fakeCommands(options)
  const fetchImpl = vi.fn(async () => new Response(png))
  const adapters = createAdapters({ root, repo, defaultBranch: 'main', run, fetchImpl })
  adapters.templateMeta = async () => ({ ok: false, kind: 'error' })
  adapters.validate = () => validateBots({ botsDir: join(root, 'bots'), now: '2026-11-14T04:00:00Z' })
  return { run, adapters, fetchImpl }
}
it('Issue 投稿将查到的模板版本写入 PR 文件', async () => {
  const { adapters } = setup()
  adapters.templateMeta = async () => ({ ok: true, version: 3 })
  const result = await submitIssue(input(), adapters)
  expect(result.plan.files[`${prefix}bot.yaml`]).toContain('\ntemplateVersion: 3\n')
})
function commentsWritten(run) {
  return run.mock.calls.filter(([file, args]) => file === 'gh' && args[0] === 'api' && args.includes('--input')).map(([, args, options]) => ({ args, body: JSON.parse(options.input).body }))
}
const didPublish = (run) => run.mock.calls.some(([file, args]) => file === 'git' && ['checkout', 'push'].includes(args[0]))
function listFiles(dir, base = '') {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? listFiles(join(dir, entry.name), `${base}${entry.name}/`) : [`${base}${entry.name}`]).sort()
}
function copySource() {
  const dir = join(temp, 'source/bots', slug)
  cpSync(fixture, dir, { recursive: true })
  return dir
}

describe('投稿包格式与资源边界', () => {
  it('包含中文、BOM、CRLF、空文件、尾换行的文本逐字往返', () => {
    const files = Object.fromEntries(['中文\n尾行', '无尾换行', '\uFEFF中文\r\n', '', '多尾换行\n\n', '```text\n内容\n```\n'].map((text, i) => [`${prefix}file-${i}.md`, text]))
    const bundle = { slug, files, screenshots: ['a.png', 'b.jpg'] }
    expect(unpack(pack(bundle))).toEqual(bundle)
  })
  it('真实示例全部文本逐字往返，不带截图（第 43 条）、头像和二进制', () => {
    expect(unpack(source.plaintext)).toEqual(source.bundle)
    expect(source.bundle.screenshots).toEqual([])
    expect(source.screenshotsOmitted).toBe(true)
    expect(Object.keys(source.bundle.files)).toHaveLength(6)
    expect(source.plaintext).not.toContain('avatar.png')
    expect(source.plaintext).not.toContain('review-result.png')
  })
  it('压缩令牌一行 base64url 往返', () => {
    const token = encode(source.plaintext)
    expect(token).toMatch(/^BZB1:[A-Za-z0-9_-]+$/)
    expect(decode(token)).toBe(source.plaintext)
    expect(unpack(decode(` \n\`\`\`text\n${token}\n\`\`\`\n `))).toEqual(source.bundle)
  })
  it('兼容手工明文与 CRLF 分段边界', () => {
    expect(unpack(rawBundle([`${prefix}ROLE.md`]).replaceAll('\n', '\r\n')).files[`${prefix}ROLE.md`]).toBe('测试内容')
  })
  it.each([
    () => `${prefix}${['..', 'outside.md'].join('/')}`,
    () => `/${prefix}ROLE.md`,
    () => `C:/${prefix}ROLE.md`,
    () => `${prefix}.hidden.md`,
    () => `${prefix}skills/.hidden/SKILL.md`,
    () => `${prefix}x..y.md`,
    () => `${prefix}skills//SKILL.md`,
    () => `${prefix}skills\\other.md`,
    () => `${prefix}skills/%2e%2e/other.md`,
    () => `${prefix}ROLE.${['s', 'h'].join('')}`,
    () => `${prefix}run.${['m', 'js'].join('')}`,
    () => `${prefix}image.png`,
    () => 'bots/_template/bot.yaml',
    () => 'bots/a/bot.yaml',
    () => 'bots/Upper/bot.yaml',
    () => `bots/${'x'.repeat(41)}/bot.yaml`,
    () => `${prefix}${'x'.repeat(256)}.md`,
  ])('恶意或非法路径在解包阶段被拒绝（%#）', (path) => {
    expect(() => unpack(rawBundle([path()]))).toThrow()
  })
  it('跨 slug 不允许', () => {
    expect(() => unpack(rawBundle([`${prefix}ROLE.md`, 'bots/another-bot/ROLE.md']))).toThrow('同一个 slug')
  })
  it('重复、大小写冲突和文件/目录冲突均拒绝', () => {
    for (const paths of [[`${prefix}ROLE.md`, `${prefix}ROLE.md`], [`${prefix}ROLE.md`, `${prefix}role.md`], [`${prefix}dir.md`, `${prefix}dir.md/file.md`]]) {
      expect(() => unpack(rawBundle(paths))).toThrow()
    }
  })
  it('截图文件名不能穿越或隐藏，重复名称也拒绝', () => {
    for (const name of [['..', 'out.png'].join('/'), '.hidden.png', 'x\\y.png', 'x.png\nx.png', ' x.png']) {
      expect(() => unpack(rawBundle([`${prefix}ROLE.md`]).replace('review-result.png', name))).toThrow()
    }
  })
  it('超过 30 个文件拒绝（计入截图）', () => {
    expect(() => unpack(rawBundle(Array.from({ length: 30 }, (_, i) => `${prefix}file-${i}.txt`)))).toThrow('30')
  })
  it('单文件 100KB 可用，多一个字节拒绝', () => {
    expect(unpack(rawBundle([`${prefix}ROLE.md`], 'x'.repeat(LIMITS.fileBytes))).slug).toBe(slug)
    expect(() => unpack(rawBundle([`${prefix}ROLE.md`], 'x'.repeat(LIMITS.fileBytes + 1)))).toThrow('100KB')
  })
  it('总文件 400KB 可用，多一个字节拒绝', () => {
    const files = Object.fromEntries(Array.from({ length: 4 }, (_, i) => [`${prefix}file-${i}.txt`, 'x'.repeat(LIMITS.fileBytes)]))
    expect(() => pack({ slug, files, screenshots: [] })).not.toThrow()
    files[`${prefix}extra.md`] = 'x'
    expect(() => pack({ slug, files, screenshots: [] })).toThrow('400KB')
  })
  it('解压炸弹由 maxOutputLength 拦截', () => {
    const bomb = `BZB1:${gzipSync(Buffer.alloc(LIMITS.expandedBytes + 1, 65)).toString('base64url')}`
    expect(() => decode(bomb)).toThrow('512KB')
  })
  it('破损令牌、无效 UTF-8 与 NUL 文本拒绝', () => {
    for (const value of ['BZB1:bad', 'BZB1:***', `BZB1:${gzipSync(Buffer.from([255])).toString('base64url')}`]) expect(() => decode(value)).toThrow()
    expect(() => unpack(rawBundle([`${prefix}ROLE.md`], '\0'))).toThrow('NUL')
  })
  it('缺失结束段、段外尾文本、重复截图段和正文保留标记均拒绝', () => {
    for (const value of [source.plaintext.replace('=== end ===', ''), source.plaintext + '多余内容', source.plaintext.replace('=== end ===', `=== ${prefix}screenshots ===\nx.png\n=== end ===`)]) {
      expect(() => unpack(value)).toThrow()
    }
    expect(() => pack({ slug, files: { [`${prefix}ROLE.md`]: '=== end ===' }, screenshots: [] })).toThrow('保留')
  })
})

describe('Issue 表单与身份', () => {
  it('解析 render:text 围栏和明文；正文中的 ### 不拆坏文件', () => {
    const parsed = parseSubmission(input(form(source.plaintext)))
    expect(parsed.bundle).toEqual(source.bundle)
    expect(parseSubmission(input(form())).bundle).toEqual(source.bundle)
  })
  it('明文文件包含同长代码围栏或与表单同名标题时仍完整解析', () => {
    const bundle = unpack(source.plaintext)
    bundle.files[`${prefix}ROLE.md`] += `\n\`\`\`text\n### ${FORM_LABELS.license}\n这只是文件内容\n\`\`\`\n`
    const text = pack(bundle)
    expect(parseSubmission(input(form(text))).bundle).toEqual(bundle)
    const unwrapped = form(text).replace('```text\nBOT-ZHIPIN', 'BOT-ZHIPIN').replace('=== end ===\n\n```', '=== end ===')
    expect(parseSubmission(input(unwrapped)).bundle).toEqual(bundle)
  })
  it('新表单没有截图栏，解析出空字符串；旧表单截图栏仍按字段识别，不并进投稿包', () => {
    expect(parseForm(form()).screenshots).toBe('')
    const legacy = parseForm(form(undefined, `![真实截图](${attachment})`))
    expect(legacy.screenshots).toBe(`![真实截图](${attachment})`)
    expect(legacy.bundle).not.toContain(attachment)
  })
  it('授权勾选认新文字，也认第 43 条之前的旧文字；新文字不提截图', () => {
    expect(LICENSE_TEXT).not.toContain('截图')
    for (const text of [LICENSE_TEXT, LEGACY_LICENSE_TEXT]) expect(parseSubmission(input(form(undefined, null, `- [x] ${text}`))).slug).toBe(slug)
    expect(() => parseSubmission(input(form(undefined, null, `- [ ] ${LEGACY_LICENSE_TEXT}`)))).toThrow('授权')
  })
  it('_No response_ 转为空字段', () => {
    const parsed = parseForm(form('_No response_', '_No response_', '_No response_'))
    expect(parsed.bundle).toBe('')
    expect(parsed.screenshots).toBe('')
    expect(parsed.license).toBe('')
    expect(() => parseSubmission(input(form('', '', '_No response_')))).toThrow('授权')
  })
  it('明文前后空白、较长围栏和 tilde 围栏兼容', () => {
    for (const fence of ['````', '~~~~']) {
      const body = form().replace('```text', `${fence}text`).replace('\n```\n', `\n${fence}\n`)
      expect(parseSubmission(input(`\n ${body}\n`)).slug).toBe(slug)
    }
  })
  it('重复字段拒绝', () => {
    expect(() => parseForm(`${form()}\n### ${FORM_LABELS.license}\n- [x] ${LICENSE_TEXT}`)).toThrow('重复')
  })
  it('未勾选授权拒绝', () => {
    expect(() => parseSubmission(input(form(undefined, undefined, `- [ ] ${LICENSE_TEXT}`)))).toThrow('授权')
  })
  it.each(['fence', 'comment', 'indent'])('授权文字放在 %s 中不能代替勾选', (kind) => {
    const checked = `- [x] ${LICENSE_TEXT}`
    const license = kind === 'fence' ? `\`\`\`text\n${checked}\n\`\`\`` : kind === 'comment' ? `<!--\n${checked}\n-->` : `    ${checked}`
    expect(() => parseSubmission(input(form(undefined, undefined, license)))).toThrow('授权')
  })
  it('作者必须等于 Issue login，比较忽略大小写', () => {
    expect(parseSubmission(input(form(), { login: 'EXAMPLE-user' })).slug).toBe(slug)
    expect(() => parseSubmission(input(form(), { login: 'someone-else' }))).toThrow('author.github')
  })
  it.each([{ login: '-bad' }, { number: '42;other' }, { id: '0' }, { id: '9007199254740993' }])('拒绝非法身份参数 %j', (other) => {
    expect(() => parseSubmission(input(form(), other))).toThrow('身份')
  })
  it('slug 被别人使用时拒绝，原目录缺少元数据也不能覆盖', () => {
    const submission = parseSubmission(input())
    expect(() => checkOwnership(submission, { author: { github: 'someone-else' } })).toThrow('这个 slug 已被别人使用，换一个')
    expect(() => checkOwnership(submission, {})).toThrow('这个 slug 已被别人使用，换一个')
  })
  it('同作者更新不许改 addedAt；原日期相同可更新', () => {
    const submission = parseSubmission(input())
    expect(checkOwnership(submission, null)).toBe(false)
    expect(checkOwnership(submission, submission.data)).toBe(true)
    expect(() => checkOwnership(submission, { ...submission.data, addedAt: '2026-01-01' })).toThrow('addedAt')
  })
})

describe('截图来源、大小、类型', () => {
  it('GitHub 官方附件存储桶只允许作为重定向目标，其他 S3 主机一律拒绝', () => {
    const bucket = 'https://github-production-user-asset-6210df.s3.amazonaws.com/1/2-abc.png?X-Amz-Signature=x'
    expect(assertImageUrl(bucket)).toBe(new URL(bucket).href)
    expect(() => assertImageUrl(bucket, true)).toThrow()
    expect(() => assertImageUrl('https://evil-bucket.s3.amazonaws.com/x.png')).toThrow()
    expect(() => assertImageUrl('https://github-production-user-asset-6210df.s3.amazonaws.com.evil.example/x.png')).toThrow()
  })
  it('Markdown 和 HTML img 按出现顺序提取', () => {
    const urls = extractImageUrls(`![图](${attachment})\n<img width="20" src="${attachment}-2">\n<img src='${attachment}-3'>`)
    expect(urls).toEqual([attachment, `${attachment}-2`, `${attachment}-3`])
  })
  it.each([
    'https://evil.example/x.png', 'http://github.com/user-attachments/assets/x',
    'https://github.com.evil.example/user-attachments/assets/x', 'https://github.com/elsewhere/x.png',
    'https://github.com@evil.example/user-attachments/assets/x', 'https://github.com/user-attachments/assets/../outside',
  ])('初始地址拒绝 %s', (url) => {
    expect(() => extractImageUrls(`![图](${url})`)).toThrow('白名单')
  })
  it('截图可选（第 43 条）：空值、缺省、普通链接、裸文本都返回空列表', () => {
    for (const text of ['', undefined, '_No response_', attachment, `[链接](${attachment})`]) expect(extractImageUrls(text)).toEqual([])
  })
  it('跟随白名单重定向；请求不携带凭据，且带 20 秒取消信号', async () => {
    const target = 'https://private-user-images.githubusercontent.com/demo/one.png'
    const fetchImpl = vi.fn().mockResolvedValueOnce(new Response(null, { status: 302, headers: { location: target } })).mockResolvedValueOnce(new Response(png))
    expect(await downloadImage(attachment, { fetchImpl })).toEqual(png)
    expect(fetchImpl.mock.calls[1][0]).toBe(target)
    expect(fetchImpl.mock.calls[0][1]).toMatchObject({ redirect: 'manual', credentials: 'omit', signal: expect.any(AbortSignal) })
    expect(fetchImpl.mock.calls[0][1]).not.toHaveProperty('headers')
  })
  it.each(['https://evil.example/x', 'https://127.0.0.1/x', 'http://github.com/x', 'https://githubusercontent.com.evil.example/x'])('重定向到 %s 在请求前拒绝', async (location) => {
    const fetchImpl = vi.fn(async () => new Response(null, { status: 302, headers: { location } }))
    await expect(downloadImage(attachment, { fetchImpl })).rejects.toThrow('白名单')
    expect(fetchImpl).toHaveBeenCalledTimes(1)
  })
  it('重定向循环有次数上限', async () => {
    const fetchImpl = vi.fn(async () => new Response(null, { status: 302, headers: { location: attachment } }))
    await expect(downloadImage(attachment, { fetchImpl })).rejects.toThrow('重定向')
    expect(fetchImpl).toHaveBeenCalledTimes(6)
  })
  it('即使适配器自动跟随，最终响应 URL 也要检查', async () => {
    const response = new Response(png)
    Object.defineProperty(response, 'url', { value: 'https://evil.example/x' })
    await expect(downloadImage(attachment, { fetchImpl: async () => response })).rejects.toThrow('白名单')
    expect(() => assertImageUrl('https://safe.githubusercontent.com/image', false)).not.toThrow()
  })
  it('文件头决定真实格式，不信扩展名或 content-type', async () => {
    const bytes = await downloadImage(attachment + '.jpg', { fetchImpl: async () => new Response(png, { headers: { 'content-type': 'image/jpeg' } }) })
    const bundle = unpack(source.plaintext)
    bundle.screenshots = ['named-as-jpg.jpg']
    bundle.files[`${prefix}DESIGN.md`] += '\n![结果](screenshots/named-as-jpg.jpg)'
    const plan = makeFilePlan(bundle, [bytes])
    expect(plan.files[`${prefix}screenshots/named-as-jpg.png`]).toEqual(png)
    expect(plan.files[`${prefix}DESIGN.md`]).toContain('](screenshots/named-as-jpg.png)')
  })
  it.each(['png', 'jpg', 'webp', 'gif'])('支持 %s 文件头，并给额外图片自动命名', (format) => {
    const bytes = format === 'png' ? png : format === 'jpg' ? Buffer.from([255, 216, 255, 0]) : Buffer.from(format === 'gif' ? 'GIF89a' : 'RIFF0000WEBP')
    const plan = makeFilePlan({ ...source.bundle, screenshots: [] }, [bytes])
    expect(plan.files[`${prefix}screenshots/screenshot-1.${format}`]).toEqual(bytes)
  })
  it('额外图片按总序号命名，合法 jpeg 后缀保留', () => {
    const jpeg = Buffer.from([255, 216, 255, 0])
    const plan = makeFilePlan({ ...source.bundle, screenshots: ['first.jpeg'] }, [jpeg, png])
    expect(plan.files[`${prefix}screenshots/first.jpeg`]).toEqual(jpeg)
    expect(plan.files[`${prefix}screenshots/screenshot-2.png`]).toEqual(png)
  })
  it('文本伪装 png 被拒绝', async () => {
    await expect(downloadImage(attachment + '.png', { fetchImpl: async () => new Response('不是图片') })).rejects.toThrow('文件头')
  })
  it('声明超过 2MB 立即拒绝', async () => {
    await expect(downloadImage(attachment, { fetchImpl: async () => new Response(png, { headers: { 'content-length': String(MAX_IMAGE_BYTES + 1) } }) })).rejects.toThrow('2MB')
  })
  it('实际流超过 2MB 即中止，不信伪造 content-length', async () => {
    let canceled = false
    const stream = new ReadableStream({
      start(controller) { controller.enqueue(Buffer.alloc(MAX_IMAGE_BYTES)); controller.enqueue(Buffer.alloc(1)) },
      cancel() { canceled = true },
    })
    await expect(downloadImage(attachment, { fetchImpl: async () => new Response(stream, { headers: { 'content-length': '1' } }) })).rejects.toThrow('2MB')
    expect(canceled).toBe(true)
  })
  it('恰好 2MB 的真实格式允许', async () => {
    const bytes = Buffer.alloc(MAX_IMAGE_BYTES)
    png.copy(bytes)
    expect((await downloadImage(attachment, { fetchImpl: async () => new Response(bytes) })).length).toBe(MAX_IMAGE_BYTES)
  })
  it('请求或响应体挂起都受同一超时限制', async () => {
    await expect(downloadImage(attachment, { fetchImpl: () => new Promise(() => {}), timeoutMs: 5 })).rejects.toThrow('20 秒')
    await expect(downloadImage(attachment, { fetchImpl: async () => new Response(new ReadableStream()), timeoutMs: 5 })).rejects.toThrow('20 秒')
  })
  it('少传图片、扩展名修正后重名、总文件超量均拒绝', () => {
    expect(() => makeFilePlan({ ...source.bundle, screenshots: ['a.png', 'b.png'] }, [png])).toThrow('数量')
    expect(() => makeFilePlan({ ...source.bundle, screenshots: ['a.jpg', 'a.png'] }, [png, png])).toThrow('冲突')
    expect(() => makeFilePlan(source.bundle, Array.from({ length: 30 }, () => png))).toThrow('30')
  })
})

describe('处理流程与可替换适配器（网络/git/gh 全假）', () => {
  it('正常投稿写正确文件集合、单提交身份、创建 PR 并派发 CI，最后一条成功评论', async () => {
    const { adapters, run } = setup()
    const result = await submitIssue(input(), adapters)
    expect(result.ok).toBe(true)
    expect(listFiles(join(root, 'bots', slug))).toEqual(Object.keys(source.bundle.files).map((file) => file.slice(prefix.length)).sort())
    for (const [file, text] of Object.entries(source.bundle.files)) expect(readFileSync(join(root, file), 'utf8')).toBe(text)
    expect(result.details.author).toEqual({ name: 'example-user', email: '12345+example-user@users.noreply.github.com' })
    const commits = run.mock.calls.filter(([file, args]) => file === 'git' && args.includes('commit'))
    expect(commits).toHaveLength(1)
    expect(commits[0][2].env).toMatchObject({ GIT_AUTHOR_NAME: 'example-user', GIT_AUTHOR_EMAIL: '12345+example-user@users.noreply.github.com', GIT_COMMITTER_NAME: 'github-actions[bot]' })
    expect(run.mock.calls).toContainEqual(['git', ['checkout', '-B', 'submission/issue-42', sha], expect.any(Object)])
    expect(run.mock.calls).toContainEqual(['git', ['push', '--force', 'origin', 'HEAD:refs/heads/submission/issue-42'], expect.any(Object)])
    const create = run.mock.calls.find(([file, args]) => file === 'gh' && args[1] === 'create')[1]
    expect(create).toContain(repo)
    expect(result.details.body).toContain('Closes #42')
    expect(result.details.body).toContain('- [x] 本地运行 `npm run validate` 已通过')
    expect(result.details.body).toContain('- [x] 我同意以 CC BY 4.0')
    expect(result.details.body).toContain('- [ ] 模板链接能打开')
    expect(run.mock.calls).toContainEqual(['gh', ['workflow', 'run', 'ci.yml', '--repo', repo, '--ref', 'submission/issue-42'], expect.any(Object)])
    expect(commentsWritten(run)).toHaveLength(1)
    expect(commentsWritten(run)[0].body).toContain(`✓ 检查通过，已自动创建 PR：${prUrl}`)
    expect(result.details.body).toContain('并确认内容有权公开')
    expect(result.details.body).toContain('设计说明与权限已做机器校验')
    expect(result.details.body).not.toMatch(/内容和截图|截图与权限|截图是这个 Bot/)
  })
  it('新表单不下载任何图片，也不写 screenshots/', async () => {
    const { adapters, fetchImpl } = setup()
    expect((await submitIssue(input(), adapters)).ok).toBe(true)
    expect(fetchImpl).not.toHaveBeenCalled()
    expect(existsSync(join(root, prefix, 'screenshots'))).toBe(false)
  })
  it('旧表单截图栏带图仍兼容：下载并按投稿包声明命名，没声明按序号命名', async () => {
    const legacy = form(undefined, `![真实截图](${attachment})`, `- [x] ${LEGACY_LICENSE_TEXT}`)
    let { adapters, fetchImpl } = setup()
    expect((await submitIssue(input(legacy), adapters)).ok).toBe(true)
    expect(fetchImpl).toHaveBeenCalledOnce()
    expect(readFileSync(join(root, prefix, 'screenshots/screenshot-1.png'))).toEqual(png)
    rmSync(join(root, 'bots', slug), { recursive: true })
    const declared = changedBundle((_data, bundle) => { bundle.screenshots = ['review-result.png'] });
    ({ adapters } = setup())
    expect((await submitIssue(input(form(declared, `![真实截图](${attachment})`)), adapters)).ok).toBe(true)
    expect(listFiles(join(root, prefix, 'screenshots'))).toEqual(['review-result.png'])
  })
  it('作者不一致：无网络、无写盘、无分支/PR，给中文四项诊断', async () => {
    const { adapters, run, fetchImpl } = setup()
    // 用带图的旧表单：证明身份检查在任何下载之前。
    const result = await submitIssue(input(form(undefined, `![真实截图](${attachment})`), { login: 'another-user' }), adapters)
    expect(result.ok).toBe(false)
    expect(result.internal).toBe(false) // 投稿本身的问题：工作流按成功结束，不给投稿人发失败邮件
    expect(fetchImpl).not.toHaveBeenCalled()
    expect(existsSync(join(root, 'bots', slug))).toBe(false)
    expect(didPublish(run)).toBe(false)
    const [{ body }] = commentsWritten(run)
    for (const text of [COMMENT_MARKER, '还没通过检查', '文件：', '位置：', '问题：', '改法：', 'author.github', '```text', '把这条评论整段发给你的 AI', '右上角 ··· → Edit']) expect(body).toContain(text)
  })
  it('内部错误（比如推送失败）标记为 internal，工作流才算失败', async () => {
    const { adapters } = setup()
    const boom = { ...adapters, publish: async () => { throw new Error('push rejected') } }
    const result = await submitIssue(input(), boom)
    expect(result.ok).toBe(false)
    expect(result.internal).toBe(true)
  })
  it('他人占用 slug 保持原目录不动', async () => {
    cpSync(fixture, join(root, 'bots', slug), { recursive: true })
    const file = join(root, prefix, 'bot.yaml')
    const original = readFileSync(file, 'utf8').replace('example-user', 'different-user')
    writeFileSync(file, original)
    const { adapters, run, fetchImpl } = setup()
    expect((await submitIssue(input(form(undefined, `![真实截图](${attachment})`)), adapters)).ok).toBe(false)
    expect(readFileSync(file, 'utf8')).toBe(original)
    expect(fetchImpl).not.toHaveBeenCalled()
    expect(didPublish(run)).toBe(false)
    expect(commentsWritten(run)[0].body).toContain('这个 slug 已被别人使用，换一个')
  })
  it('同作者改变 addedAt 不删除旧目录', async () => {
    cpSync(fixture, join(root, 'bots', slug), { recursive: true })
    const { adapters, run } = setup()
    const body = form(changedBundle((data) => { data.addedAt = '2026-11-14' }))
    expect((await submitIssue(input(body), adapters)).ok).toBe(false)
    expect(existsSync(join(root, prefix, 'avatar.png'))).toBe(true)
    expect(didPublish(run)).toBe(false)
    expect(commentsWritten(run)[0].body).toContain('addedAt')
  })
  it('同作者更新先清旧文件，现有 PR 只编辑，不重复新建', async () => {
    cpSync(fixture, join(root, 'bots', slug), { recursive: true })
    writeFileSync(join(root, prefix, 'obsolete.txt'), '旧内容')
    const { adapters, run } = setup({ prs: [{ number: 17, url: prUrl, isCrossRepository: false, headRefName: 'submission/issue-42' }] })
    expect((await submitIssue(input(), adapters)).ok).toBe(true)
    expect(existsSync(join(root, prefix, 'obsolete.txt'))).toBe(false)
    expect(existsSync(join(root, prefix, 'avatar.png'))).toBe(false)
    expect(run.mock.calls.some(([file, args]) => file === 'gh' && args[0] === 'pr' && args[1] === 'edit')).toBe(true)
    expect(run.mock.calls.some(([file, args]) => file === 'gh' && args[1] === 'create')).toBe(false)
  })
  it('同名 fork PR 不会被编辑；gh pr list 使用受支持的纯分支名参数', async () => {
    const { adapters, run } = setup({ prs: [{ number: 18, url: `https://github.com/${repo}/pull/18`, isCrossRepository: true, headRefName: 'submission/issue-42' }] })
    expect((await submitIssue(input(), adapters)).ok).toBe(true)
    const listArgs = run.mock.calls.find(([file, args]) => file === 'gh' && args[1] === 'list')[1]
    expect(listArgs[listArgs.indexOf('--head') + 1]).toBe('submission/issue-42')
    expect(run.mock.calls.some(([file, args]) => file === 'gh' && args[1] === 'edit')).toBe(false)
    expect(run.mock.calls.some(([file, args]) => file === 'gh' && args[1] === 'create')).toBe(true)
  })
  it('校验器错误不建分支也不建 PR，保留原诊断格式', async () => {
    const { adapters, run } = setup()
    const body = form(changedBundle((data) => { delete data.quotaCost }))
    const result = await submitIssue(input(body), adapters)
    expect(result.ok).toBe(false)
    expect(didPublish(run)).toBe(false)
    expect(commentsWritten(run)[0].body).toContain('缺少必填字段 quotaCost')
  })
  it('范围检查拒绝所有其他目录（含其他 slug），并阻止发布', async () => {
    const changed = [`${prefix}bot.yaml`, 'site/index.md', 'bots/other-bot/ROLE.md']
    expect(scopeErrors(changed, slug)).toHaveLength(2)
    const { adapters, run } = setup({ changed })
    expect((await submitIssue(input(), adapters)).ok).toBe(false)
    expect(didPublish(run)).toBe(false)
    expect(commentsWritten(run)[0].body).toContain('越界文件')
  })
  it('目录脏时不覆盖本地改动', async () => {
    const { adapters, run } = setup({ dirty: true })
    expect((await submitIssue(input(), adapters)).ok).toBe(false)
    expect(didPublish(run)).toBe(false)
    expect(existsSync(join(root, 'bots', slug))).toBe(false)
  })
  it.each(['bot', 'nested', 'bots'])('写入遇到 %s 符号链接即停止，不碰链接目标', async (kind) => {
    const outside = join(temp, 'outside')
    cpSync(fixture, outside, { recursive: true })
    if (kind === 'bots') {
      rmSync(join(root, 'bots'), { recursive: true })
      symlinkSync(outside, join(root, 'bots'))
    } else if (kind === 'bot') symlinkSync(outside, join(root, 'bots', slug))
    else {
      cpSync(fixture, join(root, 'bots', slug), { recursive: true })
      symlinkSync(outside, join(root, prefix, 'linked'))
    }
    const before = readFileSync(join(outside, 'bot.yaml'), 'utf8')
    const { adapters, run } = setup()
    expect((await submitIssue(input(), adapters)).ok).toBe(false)
    expect(readFileSync(join(outside, 'bot.yaml'), 'utf8')).toBe(before)
    expect(didPublish(run)).toBe(false)
  })
  it('只编辑 actions bot 的标记评论，忽略同标记的人类评论', async () => {
    const comments = [
      { id: 100, body: COMMENT_MARKER, user: { login: 'example-user', type: 'User' } },
      { id: 101, body: '其他工作流', user: { login: 'github-actions[bot]', type: 'Bot' } },
      { id: 102, body: COMMENT_MARKER + '\n旧结果', user: { login: 'github-actions[bot]', type: 'Bot' } },
    ]
    const { adapters, run } = setup({ comments })
    await submitIssue(input(form(), { login: 'mismatch' }), adapters)
    const written = commentsWritten(run)
    expect(written).toHaveLength(1)
    expect(written[0].args).toContain('PATCH')
    expect(written[0].args).toContain(`repos/${repo}/issues/comments/102`)
  })
  it('只有伪造标记时新发评论，不编辑伪造评论', async () => {
    const { adapters, run } = setup({ comments: [{ id: 100, body: COMMENT_MARKER, user: { login: 'example-user', type: 'User' } }] })
    await submitIssue(input(form(), { login: 'mismatch' }), adapters)
    expect(commentsWritten(run)[0].args).toContain('POST')
  })
  it('派发失败不能报告成功；重试能复用现有 PR', async () => {
    const { adapters, run } = setup({ dispatchFails: true })
    expect((await submitIssue(input(), adapters)).ok).toBe(false)
    expect(commentsWritten(run)[0].body).toContain('还没通过检查')
    expect(commentsWritten(run)[0].body).not.toContain('✓ 检查通过')
  })
  it('诊断中的代码块不能逃逸，密钥只在运行时生成且被脱敏', () => {
    const credential = ['gh', 'p_', 'z'.repeat(36)].join('')
    const body = failureComment([{ file: 'Issue', where: '正文', problem: `含 \`\`\`\n${credential}`, fix: '删除' }])
    expect(body).not.toContain(credential)
    expect(body).toContain('````text')
  })
  it('超长诊断和反引号也不会超过评论长度上限', () => {
    const body = failureComment([{ file: 'Issue', where: '正文', problem: '`'.repeat(50_000) + '文'.repeat(50_000), fix: '缩短' }])
    expect(body.length).toBeLessThan(65_536)
    expect(body).toContain('错误过多')
  })
  it('投稿内容中的命令样文本仅当数据写入，不交给命令适配器执行', async () => {
    const marker = join(temp, 'must-not-exist')
    const payload = ['$(', 'touch ', marker, ')'].join('')
    const bundle = changedBundle((_data, contents) => { contents.files[`${prefix}ROLE.md`] += `\n${payload}` })
    const { adapters, run } = setup()
    expect((await submitIssue(input(form(bundle)), adapters)).ok).toBe(true)
    expect(existsSync(marker)).toBe(false)
    expect(run.mock.calls.every(([file, args]) => ['git', 'gh'].includes(file) && Array.isArray(args) && !args.some((arg) => arg.includes(payload)))).toBe(true)
  })
})

describe('本地生成链接', () => {
  it('短投稿第一行是预填链接，令牌解回所有原文本，URL 不超过 7500', () => {
    const result = makeSubmissionLink(fixture)
    expect(result.plain).toBe(false)
    expect(result.url).toMatch(/^https:\/\/github.com\/jakob52123\/bot-zhipin\/issues\/new\?template=submit-bot.yml&title=.+&bundle=BZB1/)
    expect(result.output.split('\n')[0]).toBe(result.url)
    expect(result.fullUrlLength).toBeLessThanOrEqual(7500)
    const url = new URL(result.url)
    expect(url.searchParams.get('title')).toBe('投稿：示例·PRD 评审员')
    expect(unpack(decode(url.searchParams.get('bundle')))).toEqual(source.bundle)
    expect(result.output.split('\n').slice(1, 3)).toEqual(['1. 点开链接（先登录 GitHub）。', '2. 确认有权公开这些内容，勾选 CC BY 4.0 授权，点 Submit new issue（提交）。'])
    expect(result.output).not.toContain('拖进去')
    expect(result.output).toContain('提示：投稿不收截图，screenshots/ 里的图片不会上传。')
  })
  it('长且不可压缩的投稿输出完整明文，首行 URL 不带 bundle', () => {
    const dir = copySource()
    writeFileSync(join(dir, 'notes.txt'), randomBytes(12_000).toString('hex'))
    const result = makeSubmissionLink(dir)
    expect(result.fullUrlLength).toBeGreaterThan(7500)
    expect(result.plain).toBe(true)
    expect(new URL(result.url).searchParams.has('bundle')).toBe(false)
    expect(result.output).toContain('把下面整段粘到「投稿包」里')
    expect(result.output).toContain(readFileSync(join(dir, 'notes.txt'), 'utf8'))
    expect(unpack(result.bundle).files[`${prefix}notes.txt`]).toBe(readFileSync(join(dir, 'notes.txt'), 'utf8'))
  })
  it('DESIGN 引用本地截图时本地校验报「图片引用」，不再放占位图，原目录不动', () => {
    const dir = copySource()
    rmSync(join(dir, 'screenshots'), { recursive: true })
    writeFileSync(join(dir, 'DESIGN.md'), readFileSync(join(dir, 'DESIGN.md'), 'utf8') + '\n![图一](screenshots/first.png)\n![图二](screenshots/second.jpg)\n![重复](screenshots/first.png)')
    expect(() => makeSubmissionLink(dir)).toThrow('引用了 screenshots/first.png，但没有这张图；引用了 screenshots/second.jpg，但没有这张图')
    expect(existsSync(join(dir, 'screenshots'))).toBe(false)
  })
  it('本地 screenshots/ 里有图也不进投稿包，所以 DESIGN 引用它同样报错（和网站看到的一致）', () => {
    const dir = copySource()
    writeFileSync(join(dir, 'DESIGN.md'), readFileSync(join(dir, 'DESIGN.md'), 'utf8') + '\n![结果](screenshots/review-result.png)')
    expect(() => makeSubmissionLink(dir)).toThrow('引用了 screenshots/review-result.png，但没有这张图')
  })
  it('没图片也没引用能生成链接，输出里不提截图', () => {
    const dir = copySource()
    rmSync(join(dir, 'screenshots'), { recursive: true })
    const result = makeSubmissionLink(dir)
    expect(unpack(result.bundle).screenshots).toEqual([])
    expect(result.output).not.toContain('截图')
  })
  it('本地必填校验失败，CLI 中文报错并退出 1，不输出链接', () => {
    const dir = copySource()
    writeFileSync(join(dir, 'DESIGN.md'), '太短')
    let result
    try { execFileSync(process.execPath, [join(ROOT, 'scripts/make-submission-link.mjs'), '--dir', dir], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }) } catch (error) { result = error }
    expect(result.status).toBe(1)
    for (const word of ['文件：', '位置：', '问题：', '改法：', '至少要 200 字']) expect(result.stderr).toContain(word)
    expect(result.stdout).not.toContain('https://github.com/')
  })
  it('本地符号链接拒绝，不读目标；本地超过 2MB 的图片不读也不进投稿包', () => {
    const dir = copySource()
    symlinkSync(join(temp, 'missing'), join(dir, 'linked.md'))
    expect(() => makeSubmissionLink(dir)).toThrow('符号链接')
    rmSync(join(dir, 'linked.md'))
    writeFileSync(join(dir, 'screenshots/large.png'), Buffer.alloc(MAX_IMAGE_BYTES + 1))
    const result = makeSubmissionLink(dir)
    expect(unpack(result.bundle).screenshots).toEqual([])
    expect(result.bundle).not.toContain('large.png')
    expect(result.output).toContain('提示：投稿不收截图')
  })
  it('CLI 的位置参数与 --dir 都生成同一条有效链接', () => {
    const cli = join(ROOT, 'scripts/make-submission-link.mjs')
    for (const args of [[fixture], ['--dir', fixture]]) {
      for (const issue of [false, true]) {
        const output = execFileSync(process.execPath, [cli, ...args, ...(issue ? ['--issue'] : [])], { encoding: 'utf8', timeout: 15_000, stdio: ['ignore', 'pipe', 'pipe'] })
        const url = new URL(output.split('\n')[0])
        const token = issue ? url.searchParams.get('bundle') : url.hash.slice(1)
        expect(unpack(decode(token))).toEqual(source.bundle)
      }
    }
  })
  it('模板 .gitkeep 忽略，不误打进投稿包', () => {
    const dir = copySource()
    writeFileSync(join(dir, 'screenshots/.gitkeep'), '')
    expect(makeSubmissionLink(dir).bundle).not.toContain('.gitkeep')
  })
})

describe('工作流和表单静态约束', () => {
  it('表单固定 id/标题/必填授权，允许空白 Issue', () => {
    const template = YAML.parse(readFileSync(join(ROOT, '.github/ISSUE_TEMPLATE/submit-bot.yml'), 'utf8'))
    expect(template.name).toBe('投稿 Bot')
    expect(template.labels).toEqual(['投稿'])
    for (const field of template.body) expect(field.attributes.label).toBe(FORM_LABELS[field.id])
    // 第 43 条：表单不再有截图栏，说明和授权文字也不提截图。
    expect(template.body.map((field) => field.id)).toEqual(['bundle', 'license'])
    expect(template.body[0]).toMatchObject({ validations: { required: true }, attributes: { render: 'text' } })
    expect(template.body[1].attributes.options).toEqual([{ label: LICENSE_TEXT, required: true }])
    expect(JSON.stringify(template)).not.toContain('截图')
    expect(YAML.parse(readFileSync(join(ROOT, '.github/ISSUE_TEMPLATE/config.yml'), 'utf8')).blank_issues_enabled).toBe(true)
  })
  it('只签出默认分支，所有 Issue 数据走 env，权限及取消策略符合约定', () => {
    const workflow = YAML.parse(readFileSync(join(ROOT, '.github/workflows/submission.yml'), 'utf8'))
    expect(workflow.on).toEqual({ issues: { types: ['opened', 'edited', 'reopened'] } })
    expect(workflow.permissions).toEqual({ contents: 'write', 'pull-requests': 'write', issues: 'write', actions: 'write' })
    expect(workflow.concurrency).toEqual({ group: 'submission-${{ github.event.issue.number }}', 'cancel-in-progress': true })
    const job = workflow.jobs.submission
    expect(job.if).toContain("github.event.issue.state == 'open'")
    expect(job.if).toContain("contains(github.event.issue.labels.*.name, '投稿')")
    expect(job.steps[0]).toMatchObject({ uses: 'actions/checkout@v5', with: { ref: '${{ github.event.repository.default_branch }}', 'fetch-depth': 0 } })
    for (const step of job.steps) expect(step.run || '').not.toContain('github.event.issue.')
    const step = job.steps.find((value) => value.run === 'node scripts/submission/from-issue.mjs')
    expect(step.env).toMatchObject({ ISSUE_BODY: '${{ github.event.issue.body }}', ISSUE_AUTHOR_LOGIN: '${{ github.event.issue.user.login }}', ISSUE_AUTHOR_ID: '${{ github.event.issue.user.id }}', ISSUE_NUMBER: '${{ github.event.issue.number }}' })
    expect(job.steps.some((value) => value.run === 'npm ci --omit=dev')).toBe(true)
  })
})
