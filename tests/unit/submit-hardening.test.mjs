import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { copyFile, mkdtemp, readFile, rm } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPlatformProxy } from 'wrangler'
import YAML from 'yaml'
import * as start from '../../functions/api/auth/start.ts'
import * as callback from '../../functions/api/auth/callback.ts'
import * as me from '../../functions/api/auth/me.ts'
import * as logout from '../../functions/api/auth/logout.ts'
import * as submit from '../../functions/api/submit/index.ts'
import * as shot from '../../functions/api/submit/screenshot.ts'
import * as status from '../../functions/api/submit/status.ts'
import { submitBot, validateSubmission } from '../../functions/_lib/submit.ts'
import { sessionSetCookie, sign } from '../../functions/_lib/session.ts'
import { buildBotModel, modelFromBundle, parseFrontmatter } from '../../scripts/lib/bot-model.mjs'
import { applyServerFields } from '../../scripts/lib/submit-fields.mjs'
import { validateModels } from '../../scripts/lib/validate/core.mjs'
import { pack, unpack } from '../../scripts/submission/bundle-core.mjs'
import { decodeToken, encodeToken } from '../../scripts/lib/bundle-web.mjs'
import { SCHEMA_SHA256 } from '../../scripts/lib/validate/generated/bot-schema.mjs'

const gh = vi.hoisted(() => ({}))
vi.mock('../../functions/_lib/github.ts', async (original) => ({ ...await original(), createGitHub: () => gh }))
const root = fileURLToPath(new URL('../../', import.meta.url))
const origin = 'https://site.test', now = 1_800_000_000_000, user = { id: 123, login: 'Alice' }, slug = 'hardening-demo'
const rels = ['bot.yaml', 'ROLE.md', 'DESIGN.md', 'routines.md', 'skills/checklist-review/SKILL.md', 'skills/issue-ranking/SKILL.md']
const fixture = (rel) => readFileSync(join(root, 'tests/fixtures/bots/demo-prd-reviewer', rel), 'utf8')
const templateFiles = Object.fromEntries(['bot.yaml', 'ROLE.md', 'DESIGN.md', 'routines.md', 'skills/example-skill/SKILL.md'].map((rel) => [rel, readFileSync(join(root, 'bots/_template', rel), 'utf8')]))
const templateModel = buildBotModel('_template', { files: Object.entries(templateFiles).map(([rel, text]) => ({ rel, text })) })
const context = { templateModel, index: [] }
const contextData = { v: 1, commit: 'local', schemaSha256: SCHEMA_SHA256, index: [], template: { files: templateFiles }, copy: { permissions: {}, quota: {} }, limits: { files: 30, fileBytes: 102400, totalBytes: 409600, imageBytes: 2097152 } }
function bundle(edit = () => {}) {
  const files = Object.fromEntries(rels.map((rel) => [rel, fixture(rel).replaceAll('demo-prd-reviewer', slug)]))
  edit(files)
  return pack({ slug, files: Object.fromEntries(Object.entries(files).map(([rel, text]) => [`bots/${slug}/${rel}`, text])), screenshots: ['review-result.png'] })
}
const images = [{ name: 'review-result.png', size: 80, format: 'png', sha: 'b'.repeat(40) }]
const model = (edit) => modelFromBundle(unpack(bundle(edit)), images)
const validate = (bot) => validateModels([bot], { template: templateModel, now: new Date(now) })
let directory, proxy, db, env, input, deps, cookie, events
const ctx = (request, bindings = env) => ({ request, env: bindings, waitUntil() {} })
const getStatus = (pr = 7) => status.onRequestGet(ctx(new Request(`${origin}/api/submit/status?pr=${pr}`)))
const post = (body) => submit.onRequestPost(ctx(new Request(`${origin}/api/submit`, { method: 'POST', headers: { Cookie: cookie, 'Content-Type': 'application/json' }, body: JSON.stringify(body) })))
const noWrites = () => { for (const key of ['createTree', 'createCommit', 'upsertRef', 'createPr', 'updatePr', 'enableAutoMerge']) expect(gh[key]).not.toHaveBeenCalled() }
const counts = async () => Object.fromEntries((await db.prepare('SELECT bucket, n FROM rate_limits ORDER BY bucket').all()).results.map(({ bucket, n }) => [bucket, n]))
const binding = () => ({ prepare: vi.fn((sql) => { events.push(sql); return db.prepare(sql) }) })
const seedRate = (bucket, n, windowMs = 3_600_000) => db.prepare('INSERT INTO rate_limits (bucket, key, window, n) VALUES (?1, ?2, ?3, ?4)').bind(bucket, '*', Math.floor(now / windowMs) * windowMs, n).run()
const seedOwner = (id) => db.prepare('INSERT INTO bot_owners VALUES (?1, ?2, ?3)').bind(slug, id, now - 1000).run()
const owner = () => db.prepare('SELECT user_id, updated_at FROM bot_owners WHERE slug = ?1').bind(slug).first()
const mainBot = (login = 'Alice') => gh.getContent.mockResolvedValue({ text: fixture('bot.yaml').replace('example-user', login) })

beforeAll(async () => {
  directory = await mkdtemp(join(tmpdir(), 'bz-hardening-'))
  await copyFile(join(root, 'wrangler.toml'), join(directory, 'wrangler.toml'))
  proxy = await getPlatformProxy({ configPath: join(directory, 'wrangler.toml'), envFiles: [], persist: false, remoteBindings: false })
  db = proxy.env.DB
  for (const name of ['0001_init.sql', '0002_submit.sql', '0003_submit_hardening.sql']) {
    for (const sql of (await readFile(join(root, 'migrations', name), 'utf8')).split(';').filter((s) => s.trim())) await db.prepare(sql).run()
  }
}, 30_000)
afterAll(async () => { await proxy?.dispose(); if (directory) await rm(directory, { recursive: true, force: true }) })
beforeEach(async () => {
  for (const table of ['rate_limits', 'web_submissions', 'pr_status', 'bot_owners']) await db.prepare(`DELETE FROM ${table}`).run()
  events = []
  vi.spyOn(Math, 'random').mockReturnValue(0.5)
  vi.spyOn(Date, 'now').mockReturnValue(now)
  vi.stubGlobal('fetch', vi.fn(() => { throw new Error('Unexpected network access') }))
  env = { DB: binding(), ASSETS: { fetch: vi.fn(async () => Response.json(contextData)) },
    SESSION_SECRET: 's'.repeat(40), IP_SALT: 'local', SUBMIT_REPO: 'owner/repo', GITHUB_APP_ID: '1', GITHUB_APP_INSTALLATION_ID: '1',
    GITHUB_APP_BOT_LOGIN: 'local[bot]', GITHUB_APP_PRIVATE_KEY: 'mock-only', OAUTH_CLIENT_ID: 'mock', OAUTH_CLIENT_SECRET: 'mock',
    ALLOW_TEST_ENDPOINTS: '1', GITHUB_API_BASE: 'http://api.gh.test', GITHUB_OAUTH_BASE: 'http://oauth.gh.test', SUBMIT_DRY_RUN_USER_IDS: '123' }
  const pr = { number: 7, node_id: 'PR_7', html_url: 'https://gh.test/pull/7', state: 'open', merged: false, head: { ref: `submission/web-123-${slug}`, sha: 'a'.repeat(40) } }
  for (const [key, value] of Object.entries({ installationToken: '', getRef: { object: { sha: '1'.repeat(40) } }, getCommit: { tree: { sha: '2'.repeat(40) } },
    getContent: null, getPr: pr, getChecks: { check_runs: [] }, getReviews: [], createTree: '3'.repeat(40), createCommit: '4'.repeat(40),
    upsertRef: {}, findOpenPr: null, createPr: pr, updatePr: pr, enableAutoMerge: true })) gh[key] = vi.fn(async () => { events.push(key); return value })
  deps = { github: gh, db: env.DB, context: async () => context, now, secrets: env, origin, dryRunUserIds: '123' }
  input = { bundle: bundle(), screenshots: [await sign(env.SESSION_SECRET, { t: 'r', v: 1, uid: user.id, ...images[0], exp: now + 86_400_000 })], license: true }
  cookie = (await sessionSetCookie(env, user, now)).split(';')[0]
})
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals() })

describe('H1 两层缓存与全站 GitHub 刷新预算', () => {
  it('checking 内存命中 30 秒内完全不访问 GitHub 或 D1 缓存表，不扣刷新预算', async () => {
    const first = await (await getStatus()).json()
    const reads = env.DB.prepare.mock.calls.filter(([sql]) => sql.includes('FROM pr_status')).length
    Date.now.mockReturnValue(now + 29_999)
    expect(await (await getStatus()).json()).toEqual(first)
    expect(gh.getPr).toHaveBeenCalledOnce()
    expect(gh.getChecks).toHaveBeenCalledOnce()
    expect(env.DB.prepare.mock.calls.filter(([sql]) => sql.includes('FROM pr_status'))).toHaveLength(reads)
    expect(await counts()).toEqual({ status: 2, 'status-gh': 1 })
  })
  it('checking 恰好 30 秒刷新，结果入 D1', async () => {
    await getStatus(); Date.now.mockReturnValue(now + 30_000); await getStatus()
    expect(gh.getPr).toHaveBeenCalledTimes(2)
    expect(await db.prepare('SELECT fetched_at FROM pr_status WHERE pr = 7').first()).toEqual({ fetched_at: now + 30_000 })
  })
  it.each(['failed', 'waiting_review', 'approved', 'merged', 'live', 'closed'])('D1 的 %s 结果缓存 120 秒，跨 isolate 命中', async (state) => {
    const body = { ok: true, state, checks: 'success', slug, url: 'https://gh.test/pull/7', liveUrl: null }
    await db.prepare('INSERT INTO pr_status VALUES (7, ?1, ?2)').bind(JSON.stringify(body), now).run()
    Date.now.mockReturnValue(now + 119_999)
    expect((await (await getStatus()).json()).state).toBe(state)
    expect(gh.getPr).not.toHaveBeenCalled()
    expect(await counts()).toEqual({ status: 1 })
    env.DB = binding() // A new isolate has no memory entries, but shares the same D1.
    expect((await getStatus()).status).toBe(200)
    expect(gh.getPr).not.toHaveBeenCalled()
    Date.now.mockReturnValue(now + 120_000)
    expect((await (await getStatus()).json()).state).toBe('checking')
    expect(gh.getPr).toHaveBeenCalledOnce()
  })
  it('PR 号是缓存键，不同 PR 独立刷新；同 isolate 并发合并', async () => {
    await Promise.all(Array.from({ length: 6 }, () => getStatus()))
    expect(gh.getPr).toHaveBeenCalledOnce()
    await getStatus(8)
    expect(gh.getPr).toHaveBeenCalledTimes(2)
    expect(await counts()).toEqual({ status: 7, 'status-gh': 2 })
  })
  it('第 600 次刷新通过，第 601 次无缓存返回中文 503，不请求 GitHub', async () => {
    await seedRate('status-gh', 599)
    expect((await getStatus()).status).toBe(200)
    const result = await getStatus(8)
    expect(result.status).toBe(503)
    expect(await result.json()).toEqual({ ok: false, error: 'github_error', message: '状态暂时刷新不了，过一会儿再看' })
    expect(gh.getPr).toHaveBeenCalledOnce()
    expect((await counts())['status-gh']).toBe(601)
  })
  it.each(['memory', 'd1'])('预算满时仍回过期 %s 缓存，绝不请求 GitHub', async (layer) => {
    const first = await (await getStatus()).json()
    await db.prepare("UPDATE rate_limits SET n = 600 WHERE bucket = 'status-gh'").run()
    if (layer === 'd1') env.DB = binding()
    Date.now.mockReturnValue(now + 120_000)
    expect(await (await getStatus()).json()).toEqual(first)
    expect(gh.getPr).toHaveBeenCalledOnce()
  })
  it('缓存不绕过每 IP 限流；失败不缓存', async () => {
    gh.getPr.mockRejectedValueOnce(new Error('mock failure'))
    expect((await getStatus()).status).toBe(500)
    expect(await db.prepare('SELECT COUNT(*) AS n FROM pr_status').first('n')).toBe(0)
    await getStatus()
    await db.prepare("UPDATE rate_limits SET n = 30 WHERE bucket = 'status'").run()
    expect((await getStatus()).status).toBe(429)
    expect(gh.getPr).toHaveBeenCalledTimes(2)
  })
})

describe('M1 明文唯一入口与严格 base64url', () => {
  it.each(['plain', 'whitespace', 'fence'])('服务端接受 %s 明文', async (kind) => {
    if (kind === 'whitespace') input.bundle = '\n  ' + input.bundle + '  \n'
    if (kind === 'fence') input.bundle = '```text\n' + input.bundle + '```'
    const decompress = vi.fn(() => { throw new Error('Server must not decompress') })
    vi.stubGlobal('DecompressionStream', decompress)
    expect((await post({ ...input, dryRun: true })).status).toBe(200)
    expect(decompress).not.toHaveBeenCalled()
  })
  it.each(['raw', 'fence'])('服务端拒绝 %s BZB1，不解压、不访问 GitHub', async (kind) => {
    const token = await encodeToken(input.bundle)
    input.bundle = kind === 'raw' ? token : '```\n' + token + '\n```'
    const decompress = vi.fn(() => { throw new Error('Server must not decompress') })
    vi.stubGlobal('DecompressionStream', decompress)
    const result = await post(input)
    expect(result.status).toBe(400); expect((await result.json()).error).toBe('bad_request')
    expect(decompress).not.toHaveBeenCalled(); expect(gh.installationToken).not.toHaveBeenCalled()
  })
  it('浏览器使用原生 strict base64url，不重新编码检查', async () => {
    const token = await encodeToken(input.bundle)
    const native = vi.spyOn(Uint8Array, 'fromBase64')
    const encode = vi.spyOn(globalThis, 'btoa')
    expect(await decodeToken(token)).toBe(input.bundle)
    expect(native).toHaveBeenCalledWith(expect.any(String), { alphabet: 'base64url', lastChunkHandling: 'strict' })
    expect(encode).not.toHaveBeenCalled()
    await expect(decodeToken('BZB1:AB')).rejects.toThrow('损坏')
  })
  it('没有原生 API 时仍能解包，并拒绝非零填充位及残缺块', async () => {
    const token = await encodeToken(input.bundle)
    vi.stubGlobal('Uint8Array', class extends Uint8Array { static fromBase64 = undefined })
    expect(await decodeToken(token)).toBe(input.bundle)
    for (const bad of ['BZB1:AB', 'BZB1:AAB', 'BZB1:A']) await expect(decodeToken(bad)).rejects.toThrow('损坏')
  })
})

describe('M2 校验内核有界且保留正常输出', () => {
  it.each([8192, 8193])('bot.yaml ASCII 字节边界 %i，超限完全不解析', (size) => {
    const yaml = 'name: ok\n#' + 'x'.repeat(size - 10)
    const parse = vi.spyOn(YAML, 'parseDocument')
    const bot = buildBotModel('size-demo', { files: [{ rel: 'bot.yaml', text: yaml, size }] })
    expect(bot.yamlTooLarge).toBe(size > 8192)
    expect(parse).toHaveBeenCalledTimes(size > 8192 ? 0 : 1)
    if (size > 8192) expect(validate(bot).errors[0]).toEqual({ file: 'bots/size-demo/bot.yaml', where: '文件大小', problem: 'bot.yaml 超过 8KB', fix: 'bot.yaml 只放卡片信息，长内容写进 ROLE.md 或 DESIGN.md' })
  })
  it('字节而非字符：中文超 8KB；文本适配器未读取大文件也报告大小', () => {
    expect(buildBotModel(slug, { files: [{ rel: 'bot.yaml', text: '#' + '中'.repeat(2800) }] }).yamlTooLarge).toBe(true)
    const bot = buildBotModel(slug, { files: [{ rel: 'bot.yaml', text: null, size: 102401 }] })
    expect(validate(bot).errors[0]).toMatchObject({ where: '文件大小', problem: 'bot.yaml 超过 8KB；非图片文件超过 100KB：实际 102401 字节' })
  })
  it('服务端字段改写也不能提前解析超限 YAML', () => {
    const parse = vi.spyOn(YAML, 'parseDocument')
    expect(() => applyServerFields('x'.repeat(8193), { login: user.login, addedAt: '2026-11-15' })).toThrow('bot.yaml 超过 8KB')
    expect(parse).not.toHaveBeenCalled()
  })
  it.each([4096, 4097])('技能 frontmatter %i 字节边界，超限完全不解析', (size) => {
    const text = 'name: x\n#' + 'x'.repeat(size - 9)
    const parse = vi.spyOn(YAML, 'parseDocument')
    const fm = parseFrontmatter(`---\n${text}\n---\n${'正文'.repeat(10000)}`)
    expect(fm.tooLarge === true).toBe(size > 4096)
    expect(parse).toHaveBeenCalledTimes(size > 4096 ? 0 : 1)
  })
  it('超限技能只报大小问题，正常技能与长正文仍通过', () => {
    expect(validate(model()).errors).toEqual([])
    const bad = model((f) => { f['skills/checklist-review/SKILL.md'] = `---\n#${'中'.repeat(1400)}\n---\n正文` })
    expect(validate(bad).errors).toEqual([expect.objectContaining({ where: 'frontmatter', problem: 'SKILL.md 的 frontmatter 超过 4KB' })])
  })
  it('每 Bot 50 条加准确汇总，重复位置不计入 N，其他 Bot 不受影响', () => {
    const bot = model(); bot.symlinks = Array.from({ length: 60 }, (_, i) => `links/${i}`)
    bot.symlinks.push(...bot.symlinks)
    const second = { ...model(), slug: 'other-demo', data: { ...bot.data, slug: 'other-demo', templateUrl: 'https://x.ai/bot/other-demo' }, symlinks: ['one'] }
    const result = validateModels([bot, second], { template: templateModel, now: new Date(now) })
    expect(result.errors).toHaveLength(52)
    expect(result.errors[50]).toMatchObject({ problem: '还有 10 处问题没列出，先改完上面这些再校验' })
    expect(result.errors[51].file).toBe('bots/other-demo/one')
  })
  it.each([64, 65])('未知键长度 %i 的编辑距离建议边界', (size) => {
    const result = validate(model((f) => { f['bot.yaml'] += '\n' + 'x'.repeat(size) + ': true\n' }))
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].problem.includes('是不是想写')).toBe(size <= 64)
  })
})

describe('M4 额度后扣和 dryRun', () => {
  it.each(['schema', 'secret', 'yaml-size', 'skill-size'])('无效 %s 只扣尝试/slug，不扣发布额度且无 GitHub 写入', async (kind) => {
    input.bundle = bundle((f) => {
      if (kind === 'schema') f['bot.yaml'] = f['bot.yaml'].replace(/^quotaCost:.*\n/m, '')
      if (kind === 'secret') f['ROLE.md'] += '\nghp_' + 'a'.repeat(36)
      if (kind === 'yaml-size') f['bot.yaml'] += '\n#' + 'x'.repeat(8192)
      if (kind === 'skill-size') f['skills/checklist-review/SKILL.md'] = '---\n#' + 'x'.repeat(4096) + '\n---\n正文'
    })
    expect((await post(input)).status).toBe(422)
    expect(await counts()).toEqual({ 'submit-slug': 1, 'submit-try': 1 }); noWrites()
    expect(await owner()).toBeNull()
  })
  it('有效提交在校验之后、第一次 tree 之前扣两个发布桶', async () => {
    await submitBot(input, user, { ...deps, context: async () => { events.push('validation-context'); return context } })
    const lastRate = events.findLastIndex((e) => e.includes('INSERT INTO rate_limits'))
    expect(lastRate).toBeGreaterThan(events.indexOf('validation-context'))
    expect(lastRate).toBeLessThan(events.indexOf('createTree'))
    expect(await counts()).toEqual({ submit: 1, 'submit-all': 1, 'submit-slug': 1, 'submit-try': 1 })
  })
  it('dryRun 可连续检查，只扣 submit-try，不写归属和仓库', async () => {
    for (let i = 0; i < 2; i++) expect((await submitBot({ ...input, dryRun: true }, user, deps)).dryRun).toBe(true)
    expect(await counts()).toEqual({ 'submit-try': 2 }); noWrites()
    expect(await owner()).toBeNull()
  })
  it('每人第 41 次尝试限流，不需要解出 slug，也不访问 GitHub', async () => {
    for (let i = 0; i < 40; i++) await expect(submitBot({ ...input, bundle: 'wrong' }, user, deps)).rejects.toMatchObject({ status: 400 })
    await expect(submitBot({ ...input, bundle: 'wrong' }, user, deps)).rejects.toMatchObject({ status: 429 })
    expect(await counts()).toEqual({ 'submit-try': 41 }); expect(gh.installationToken).not.toHaveBeenCalled()
  })
  it('发布总额度耗尽仍先返回内容错误；有效内容才返回 429', async () => {
    await seedRate('submit-all', 20)
    await expect(submitBot({ ...input, bundle: bundle((f) => { f['ROLE.md'] = '' }) }, user, deps)).rejects.toMatchObject({ status: 422 })
    expect((await counts())['submit-all']).toBe(20)
    await db.prepare("DELETE FROM rate_limits WHERE bucket = 'submit-slug'").run()
    await expect(submitBot(input, user, deps)).rejects.toMatchObject({ status: 429 })
    expect((await counts())['submit-all']).toBe(21); noWrites()
  })
  it('截图全站第 1000 次通过，第 1001 次拒绝', async () => {
    await seedRate('shot-all', 999, 86_400_000)
    gh.createBlob = vi.fn(async () => 'b'.repeat(40))
    const bytes = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])
    const request = () => new Request(`${origin}/api/submit/screenshot`, { method: 'POST', headers: { Cookie: cookie, 'Content-Type': 'image/png', 'Content-Length': String(bytes.length) }, body: bytes })
    expect((await shot.onRequestPost(ctx(request()))).status).toBe(200)
    expect((await shot.onRequestPost(ctx(request()))).status).toBe(429)
    expect(gh.createBlob).toHaveBeenCalledOnce()
  })
})

describe('M3 数字 id 归属', () => {
  it('main 404 忽略旧绑定，PR 成功后覆盖', async () => {
    await seedOwner(999)
    gh.createPr.mockImplementationOnce(async () => { expect((await owner()).user_id).toBe(999); return { number: 7, node_id: 'PR_7', html_url: 'https://gh.test/pull/7' } })
    expect((await submitBot(input, user, deps)).update).toBe(false)
    expect(await owner()).toEqual({ user_id: 123, updated_at: now })
    expect(events.some((e) => e.includes('SELECT user_id FROM bot_owners'))).toBe(false)
  })
  it('main 已有且 id 相同，login 改名仍可更新，日期不变', async () => {
    mainBot('Old-Name'); await seedOwner(123)
    expect((await submitBot(input, user, deps)).update).toBe(true)
    const yaml = YAML.parse(gh.createTree.mock.calls[0][0].entries.find((e) => e.path === 'bot.yaml').content)
    expect(yaml.author.github).toBe('Alice'); expect(yaml.addedAt).toBe(YAML.parse(fixture('bot.yaml')).addedAt)
    expect(gh.createPr.mock.calls[0][0].title).not.toContain('⚠')
  })
  it('相同 login 但不同 id 拒绝，防用户名复用；不改绑定', async () => {
    mainBot(); await seedOwner(999)
    await expect(submitBot(input, user, deps)).rejects.toMatchObject({ status: 409, code: 'slug_taken' })
    expect((await owner()).user_id).toBe(999); noWrites()
  })
  it('老 Bot 忽略 login 大小写，PR 醒目警告并补绑定', async () => {
    mainBot('aLiCe')
    await submitBot(input, user, deps)
    expect(gh.createPr.mock.calls[0][0]).toMatchObject({ title: expect.stringMatching(/^⚠ 更新已上架 Bot：/), body: expect.stringMatching(/^> ⚠ \*\*这个 Bot 之前没有绑定作者数字 ID，只按 GitHub 用户名核对，请人工确认是原作者/) })
    expect((await owner()).user_id).toBe(123)
  })
  it('老 Bot 不同 login 拒绝，不补绑定', async () => {
    mainBot('Mallory')
    await expect(submitBot(input, user, deps)).rejects.toMatchObject({ code: 'slug_taken' })
    expect(await owner()).toBeNull(); noWrites()
  })
  it('建 PR 失败不绑定；成功更新已有 PR 才绑定', async () => {
    gh.createPr.mockRejectedValueOnce(new Error('mock PR failure'))
    await expect(submitBot(input, user, deps)).rejects.toThrow('mock PR failure')
    expect(await owner()).toBeNull()
    await db.prepare("DELETE FROM rate_limits WHERE bucket = 'submit-slug'").run()
    mainBot(); gh.findOpenPr.mockResolvedValue({ number: 7 })
    await submitBot(input, user, deps)
    expect(gh.updatePr).toHaveBeenCalledWith(7, expect.objectContaining({ title: expect.stringMatching(/^⚠/) }))
    expect((await owner()).user_id).toBe(123)
  })
  it('老 Bot dryRun 不补绑定；main 404 dryRun 不覆盖旧绑定', async () => {
    mainBot(); await submitBot({ ...input, dryRun: true }, user, deps)
    expect(await owner()).toBeNull()
    await seedOwner(999); gh.getContent.mockResolvedValue(null)
    await submitBot({ ...input, dryRun: true }, user, deps)
    expect((await owner()).user_id).toBe(999); noWrites()
  })
})

describe('L3 测试开关失效关闭', () => {
  const routes = [[start, '/api/auth/start', 'GET'], [callback, '/api/auth/callback', 'GET'], [me, '/api/auth/me', 'GET'], [logout, '/api/auth/logout', 'POST'], [submit, '/api/submit', 'POST'], [shot, '/api/submit/screenshot', 'POST'], [status, '/api/submit/status?pr=7', 'GET']]
  it.each(routes)('公网主机所有正常及不支持的方法均 503：%s', async (module, path, method) => {
    for (const [handler, verb] of [[module[`onRequest${method === 'GET' ? 'Get' : 'Post'}`], method], [module.onRequest, 'OPTIONS']]) {
      const result = await handler(ctx(new Request(`https://bot-zhipin.pages.dev${path}`, { method: verb })))
      expect(result.status).toBe(503); expect((await result.json()).error).toBe('submit_disabled')
      expect(result.headers.has('Set-Cookie')).toBe(false)
    }
    expect(await counts()).toEqual({}); expect(fetch).not.toHaveBeenCalled()
  })
  it.each(['127.0.0.1', 'localhost', '[::1]', 'site.test'])('请求及两个上游允许测试主机 %s', async (host) => {
    const base = `http://${host}:9876`
    const result = await start.onRequestGet(ctx(new Request(`${base}/api/auth/start`), { ...env, GITHUB_API_BASE: base, GITHUB_OAUTH_BASE: base }))
    expect(result.status).toBe(302)
  })
  it.each(['GITHUB_API_BASE', 'GITHUB_OAUTH_BASE'])('%s 公网、伪测试后缀或缺省都 503', async (key) => {
    for (const value of ['https://api.github.com', 'http://evil.test.example.com', 'http://localhost.example.com', undefined]) {
      const result = await start.onRequestGet(ctx(new Request(`${origin}/api/auth/start`), { ...env, [key]: value }))
      expect(result.status).toBe(503)
    }
    expect(await counts()).toEqual({}); expect(fetch).not.toHaveBeenCalled()
  })
  it('线上开关未开仍用真实 OAuth origin（不发网络请求），不读测试 base', async () => {
    const result = await start.onRequestGet(ctx(new Request('https://bot-zhipin.pages.dev/api/auth/start'), { ...env, ALLOW_TEST_ENDPOINTS: undefined, GITHUB_API_BASE: 'invalid', GITHUB_OAUTH_BASE: 'invalid' }))
    expect(result.status).toBe(302)
    expect(new URL(result.headers.get('Location')).origin).toBe('https://github.com')
    expect(fetch).not.toHaveBeenCalled()
  })
})

describe('L2 登录只计导航', () => {
  it.each(['no-cors', 'cors', 'same-origin', ''])('mode=%s 直接 400，不计数、不设 cookie', async (mode) => {
    const result = await start.onRequestGet(ctx(new Request(`${origin}/api/auth/start`, { headers: { 'Sec-Fetch-Mode': mode } })))
    expect(result.status).toBe(400); expect(result.headers.has('Set-Cookie')).toBe(false)
    expect(await counts()).toEqual({})
  })
  it.each([undefined, 'navigate'])('mode=%s 允许并计数', async (mode) => {
    const result = await start.onRequestGet(ctx(new Request(`${origin}/api/auth/start`, { headers: mode ? { 'Sec-Fetch-Mode': mode } : {} })))
    expect(result.status).toBe(302); expect(result.headers.has('Set-Cookie')).toBe(true)
    expect(await counts()).toEqual({ login: 1 })
  })
  it('同 IP 第 120 次允许，第 121 次跳限流提示', async () => {
    const request = () => new Request(`${origin}/api/auth/start`)
    await start.onRequestGet(ctx(request()))
    await db.prepare("UPDATE rate_limits SET n = 119 WHERE bucket = 'login'").run()
    expect((await start.onRequestGet(ctx(request()))).headers.get('Location')).toContain('/login/oauth/authorize')
    const limited = await start.onRequestGet(ctx(request()))
    expect(limited.headers.get('Location')).toBe('/submit?login=failed&retry=3600')
    expect(limited.headers.has('Set-Cookie')).toBe(false)
  })
})

describe('L6/L7 断言及迁移', () => {
  it.each(['author', 'addedAt'])('特殊显式 YAML 键 %s 改写后不满足断言：422，不扣发布额度', async (field) => {
    input.bundle = bundle((f) => { f['bot.yaml'] = f['bot.yaml'].replace(new RegExp(`^${field}:`, 'm'), `? ${field}\n:`) })
    const result = await post(input)
    expect(result.status).toBe(422)
    expect((await result.json()).errors).toEqual([expect.objectContaining({ problem: 'bot.yaml 的作者或日期字段写法特殊，无法自动填写', fix: '用普通的 `author:` 和 `addedAt:` 写法' })])
    noWrites(); expect((await counts()).submit).toBeUndefined()
  })
  it('普通字段改写满足严格大小写和预期日期断言', () => {
    const { model: bot } = validateSubmission(unpack(input.bundle), images, user, '2026-01-01', context, now)
    expect(bot.data.author.github).toBe(user.login); expect(bot.data.addedAt).toBe('2026-01-01')
  })
  it.each(['\ud800', '\udc00'])('unpack 拒绝孤立代理码元 %#，HTTP 为 400', async (value) => {
    const text = input.bundle.replace('=== end ===', `${value}\n=== end ===`)
    expect(() => unpack(text)).toThrow('UTF-16')
    expect((await post({ ...input, bundle: text })).status).toBe(400)
    expect(gh.installationToken).not.toHaveBeenCalled()
  })
  it('合法 Unicode（含代理对 emoji）仍往返不变', () => {
    const text = bundle((f) => { f['ROLE.md'] += '\n中文😀\n' })
    expect(unpack(text).files[`bots/${slug}/ROLE.md`]).toContain('中文😀')
  })
  it('0003 两表可重复迁移，不破坏原绑定/缓存数据', async () => {
    await seedOwner(123); await getStatus()
    const sql = await readFile(join(root, 'migrations/0003_submit_hardening.sql'), 'utf8')
    expect(sql.match(/CREATE TABLE IF NOT EXISTS/g)).toHaveLength(2)
    for (const statement of sql.split(';').filter((s) => s.trim())) await db.prepare(statement).run()
    expect((await owner()).user_id).toBe(123)
    expect(await db.prepare('SELECT COUNT(*) AS n FROM pr_status').first('n')).toBe(1)
  })
})
