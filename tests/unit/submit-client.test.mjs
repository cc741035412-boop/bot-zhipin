import { afterEach, expect, it, vi } from 'vitest'
import { relative } from 'node:path'
import { randomBytes } from 'node:crypto'
import YAML from 'yaml'
import { loadBot } from '../../scripts/lib/load-bots.mjs'
import { pack, unpack, URL_LIMITS } from '../../scripts/submission/bundle-core.mjs'
import { encodeToken, decodeToken } from '../../scripts/lib/bundle-web.mjs'
import { readBundleInput, readLocationBundle } from '../../site/.vitepress/theme/submit/bundle.ts'
import { previewModel } from '../../site/.vitepress/theme/submit/preview.ts'
import { checkBundle } from '../../site/.vitepress/theme/submit/validate.ts'
import { createStore } from '../../site/.vitepress/theme/submit/store.ts'
import { me, logout, startLogin, submit, status } from '../../site/.vitepress/theme/submit/api.ts'
import { issueFallbackUrl } from '../../site/.vitepress/theme/submit/issue-fallback.ts'
import { errorCopy, explainError, copyForAi } from '../../site/.vitepress/theme/submit/errors.ts'

const slug = 'demo-prd-reviewer'
const fixture = loadBot(slug, 'tests/fixtures/bots')
const template = loadBot('_template')
const filesOf = (bot) => Object.fromEntries(bot.files.filter((file) => file.text !== null).map((file) => [relative(bot.dir, file.path), file.text]))
const context = { index: [], template: { files: filesOf(template) } }
const originalFiles = Object.fromEntries(Object.entries(filesOf(fixture)).map(([rel, text]) => [`bots/${slug}/${rel}`, text]))
const yamlPath = `bots/${slug}/bot.yaml`
const bundle = (change = {}, screenshots = ['output.png']) => {
  const data = { ...YAML.parse(originalFiles[yamlPath]), ...change }
  return pack({ slug, files: { ...originalFiles, [yamlPath]: YAML.stringify(data) }, screenshots })
}
const now = new Date('2026-11-14T17:00:00Z')
const plaintext = bundle()
function storage() {
  const data = new Map()
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
    removeItem: (key) => data.delete(key),
    key: (index) => [...data.keys()][index] ?? null,
    get length() { return data.size },
  }
}
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.useRealTimers() })

it('明文、围栏、令牌、完整链接均可读取且文件原文不变', async () => {
  const token = await encodeToken(plaintext)
  for (const input of [plaintext, `\n\`\`\`text\n${plaintext}\`\`\`\n`, ` ${token}\n`, `https://example.com/submit#${token}`]) {
    const result = await readBundleInput(input)
    expect(result.bundle).toEqual(unpack(plaintext))
    expect(unpack(result.plaintext)).toEqual(unpack(plaintext))
    if (input === plaintext || input.includes(token)) expect(result.plaintext).toBe(plaintext)
  }
})
it.each(['BZB1:broken', '不是投稿包', 'https://example.com/submit', 'x'.repeat(512 * 1024 + 1)])('解包失败保留 L1 中文四项（%#）', async (input) => {
  await expect(readBundleInput(input)).rejects.toMatchObject({ errors: [{ file: expect.any(String), where: expect.any(String), problem: expect.any(String), fix: expect.any(String) }] })
})
it('读取 location 先保存草稿，再清片段，保留 query/history.state', async () => {
  const token = await encodeToken(plaintext), session = storage()
  vi.stubGlobal('window', { sessionStorage: session, localStorage: storage() })
  vi.stubGlobal('location', { hash: `#${token}`, pathname: '/submit', search: '?login=ok' })
  const replaceState = vi.fn(() => expect(JSON.parse(session.getItem('bz-submit')).plaintext).toBe(plaintext))
  vi.stubGlobal('history', { state: { retained: true }, replaceState })
  expect((await readLocationBundle()).bundle.slug).toBe(slug)
  expect(replaceState).toHaveBeenCalledWith({ retained: true }, '', '/submit?login=ok')
})
it('没有片段或 SSR 返回 null，坏片段抛诊断并移除', async () => {
  expect(await readLocationBundle()).toBeNull()
  vi.stubGlobal('location', { hash: '', pathname: '/submit', search: '' })
  expect(await readLocationBundle()).toBeNull()
  location.hash = '#BZB1:broken'
  vi.stubGlobal('history', { state: null, replaceState: vi.fn() })
  await expect(readLocationBundle()).rejects.toHaveProperty('errors')
  expect(history.replaceState).toHaveBeenCalledWith(null, '', '/submit')
})
it('context 合并并发请求、缓存成功结果', async () => {
  vi.resetModules()
  const fetch = vi.fn(async () => new Response(JSON.stringify(context)))
  vi.stubGlobal('fetch', fetch)
  const { loadContext } = await import('../../site/.vitepress/theme/submit/context.ts')
  const [a, b] = await Promise.all([loadContext(), loadContext()])
  expect(a).toBe(b)
  expect(await loadContext()).toBe(a)
  expect(fetch).toHaveBeenCalledTimes(1)
  expect(fetch.mock.calls[0][0]).toBe('/api-data/submit-context.json')
})
it.each([() => new Response('', { status: 503 }), () => new Response('{}'), () => { throw new Error('offline') }])('context 失败不缓存，可以重试（%#）', async (bad) => {
  vi.resetModules()
  vi.stubGlobal('fetch', vi.fn().mockImplementationOnce(bad).mockResolvedValue(new Response(JSON.stringify(context))))
  const { loadContext } = await import('../../site/.vitepress/theme/submit/context.ts')
  await expect(loadContext()).rejects.toThrow()
  expect((await loadContext()).index).toEqual([])
})
it('校验用占位作者、北京时间日期，不放截图占位（第 43 条），不改原文', () => {
  const input = bundle({ author: { name: '作者' } })
  expect(checkBundle(input, { context, now })).toMatchObject({ errors: [], slug, update: false })
  const result = previewModel(input, { now })
  expect(result.model.data.author.github).toBe('submitter')
  expect(result.summary.addedAt).toBe('2026-11-15')
  expect(result.model.screenshots).toEqual([])
  expect(result.summary.screenshots).toEqual([])
  expect(YAML.parse(unpack(input).files[yamlPath]).author.github).toBeUndefined()
})
it('同 slug 同账号忽略大小写判更新，保留旧日期，别人的不是更新', () => {
  const ctx = { ...context, index: [{ slug, authorGithub: 'Example-User', addedAt: '2026-11-01', templateUrl: fixture.data.templateUrl }] }
  expect(checkBundle(plaintext, { context: ctx, login: 'example-user', now })).toMatchObject({ errors: [], update: true })
  expect(checkBundle(plaintext, { context: ctx, login: 'other-user', now }).update).toBe(false)
  expect(checkBundle(plaintext, { context: ctx, now }).update).toBe(false)
  expect(previewModel(plaintext, { addedAt: ctx.index[0].addedAt, now }).summary.addedAt).toBe('2026-11-01')
})
it('跨 Bot 重复模板、模板残留、external 都由内核诊断', () => {
  const ctx = { ...context, index: [{ slug: 'another', templateUrl: fixture.data.templateUrl }] }
  expect(checkBundle(plaintext, { context: ctx, now }).errors.some((error) => error.where === 'templateUrl')).toBe(true)
  expect(checkBundle(bundle({ external: true, tagline: template.data.tagline }), { context, now }).errors.map((error) => error.where)).toEqual(expect.arrayContaining(['external', 'tagline']))
})
it('缺失 context 仍可校验；缺失必填字段和损坏 YAML/author 不崩溃', () => {
  expect(checkBundle(plaintext, { now }).errors).toEqual([])
  expect(checkBundle(bundle({ quotaCost: null }), { context, now }).errors.length).toBeGreaterThan(0)
  for (const yaml of ['name: [', 'author: 42', '']) {
    const input = pack({ ...unpack(plaintext), files: { ...originalFiles, [yamlPath]: yaml } })
    expect(checkBundle(input, { context, now }).errors.length).toBeGreaterThan(0)
    expect(previewModel(input).summary.templateUrl).toBeNull()
  }
})
it('缺 bot.yaml 交给内核诊断；坏包直接抛中文四项', () => {
  const files = { ...originalFiles }
  delete files[yamlPath]
  const input = pack({ slug, files, screenshots: [] })
  expect(checkBundle(input, { context, now }).errors.some((error) => error.file.endsWith('/bot.yaml'))).toBe(true)
  expect(() => checkBundle('bad', { context })).toThrow()
})
it('投稿包里残留的截图文件名被忽略：不报错、不出截图槽，也没有「截图数量」检查', () => {
  const many = bundle({}, Array.from({ length: 20 }, (_, i) => `shot-${i}.png`))
  expect(checkBundle(many, { context, now }).errors).toEqual([])
  expect(checkBundle(plaintext, { context, now }).errors.some((error) => /截图/.test(error.where))).toBe(false)
  expect(previewModel(many).model.screenshots).toEqual([])
})
it('设计说明引用本地截图：校验报「图片引用」去重，注释里的不算', () => {
  const input = unpack(bundle({}, []))
  const design = input.files[`bots/${slug}/DESIGN.md`]
  input.files[`bots/${slug}/DESIGN.md`] = design + '\n![甲](screenshots/a.jpg) ![乙](./screenshots/b.png) ![甲](screenshots/a.jpg)'
  const errors = checkBundle(pack(input), { context, now }).errors.filter((error) => error.where === '图片引用')
  expect(errors).toEqual([expect.objectContaining({ file: `bots/${slug}/DESIGN.md`, problem: '引用了 screenshots/a.jpg，但没有这张图；引用了 screenshots/b.png，但没有这张图' })])
  input.files[`bots/${slug}/DESIGN.md`] = design + '\n<!-- ![示例](screenshots/screenshot-1.png) -->'
  expect(checkBundle(pack(input), { context, now }).errors).toEqual([])
})
it('预览不显示截图：本地截图引用只留说明文字，不出 img；外链图仍是新标签页链接', () => {
  const input = unpack(plaintext)
  input.files[`bots/${slug}/DESIGN.md`] += '\n![结果](screenshots/output.png)\n![外链](https://tracker.example/a.png)'
  const result = previewModel(pack(input), { login: 'my-user' })
  expect(result.summary.author.link).toBe('https://github.com/my-user')
  expect(result.summary.screenshots).toEqual([])
  expect(result.designHtml).toContain('结果'); expect(result.designHtml).not.toContain('待放入'); expect(result.designHtml).not.toContain('screenshot-error')
  expect(result.designHtml).not.toContain('<img')
  expect(result.designHtml).not.toContain('src="https://tracker.example/a.png"')
})
it.each(['javascript:alert(1)', 'data:text/html,a', 'https://x.ai/bot/a?b=c', { url: 'https://x.ai/bot/a' }])('非法模板链接不会进入 summary（%#）', (value) => {
  expect(previewModel(bundle({ templateUrl: value })).summary.templateUrl).toBeNull()
})
it.each(['javascript:alert(1)', 'data:text/html,x', 42, ['https://example.com']])('非法作者链接不会进入 summary（%#）', (url) => {
  const result = previewModel(bundle({ author: { name: '作者', url } }))
  expect(result.summary.author.url).toBeNull()
  expect(result.summary.author.link).toBeNull()
})
it('合法链接保留，非法登录名和改编 slug 不进入链接', () => {
  const result = previewModel(bundle({ author: { name: '作者', url: 'https://example.com' } }))
  expect(result.summary.templateUrl).toBe(fixture.data.templateUrl)
  expect(result.summary.author.url).toBe('https://example.com')
  expect(previewModel(plaintext, { login: '../../escape' }).summary.author.link).toBeNull()
  expect(previewModel(bundle({ forkedFrom: 'javascript:evil' })).summary.forkedFrom).toBeNull()
})
it('草稿和提交结果同一 session 键', () => {
  const session = storage(), store = createStore({ session })
  expect(store.loadDraft()).toBeNull()
  store.saveDraft({ plaintext, license: true })
  store.saveResult({ pr: { number: 1 }, slug, update: false })
  expect(store.loadDraft()).toMatchObject({ plaintext, license: true, result: { pr: { number: 1 } } })
  store.clearDraft()
  expect(store.loadDraft()).toBeNull()
  session.setItem('bz-submit', '[]')
  expect(store.loadDraft()).toBeNull()
})
it('损坏 JSON 安全兜底', () => {
  const session = storage(), store = createStore({ session })
  session.setItem('bz-submit', '{bad')
  expect(store.loadDraft()).toBeNull()
})
it('只用 sessionStorage：草稿、结果、应用内提示都不碰 localStorage（截图回执存储已删除）', () => {
  const session = storage(), local = storage()
  vi.stubGlobal('window', { sessionStorage: session, localStorage: local })
  const store = createStore()
  store.saveDraft({ plaintext }); store.saveResult({ pr: { number: 1 } }); store.dismissInapp()
  expect(store.inappDismissed()).toBe(true)
  expect(store.loadDraft()).toMatchObject({ plaintext, result: { pr: { number: 1 } } })
  store.clearDraft()
  expect(local.length).toBe(0)
  expect(Object.keys(store).sort()).toEqual(['clearDraft', 'dismissInapp', 'inappDismissed', 'loadDraft', 'saveDraft', 'saveResult'])
})
it('所有存储方法抛错也不崩，默认 window 存储 getter 抛错也安全', () => {
  const throwing = new Proxy({}, { get() { throw new Error('blocked') } })
  vi.stubGlobal('window', throwing)
  for (const store of [createStore(), createStore({ session: throwing }), createStore({ session: null })]) {
    expect(store.loadDraft()).toBeNull()
    expect(store.inappDismissed()).toBe(false)
    expect(() => {
      store.saveDraft({ plaintext }); store.saveResult({}); store.clearDraft(); store.dismissInapp()
    }).not.toThrow()
  }
})
it('循环对象写入失败静默忽略', () => {
  const store = createStore({ session: storage() }), circular = {}
  circular.self = circular
  expect(() => store.saveDraft(circular)).not.toThrow()
  expect(store.loadDraft()).toBeNull()
})
it('登录整页跳转；me/logout/status 的路径、同源 cookie 和 204', async () => {
  vi.stubGlobal('location', { assign: vi.fn() })
  startLogin()
  expect(location.assign).toHaveBeenCalledWith('/api/auth/start')
  vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(new Response('{"ok":true,"id":1,"login":"demo"}'))
    .mockResolvedValueOnce(new Response(null, { status: 204 })).mockResolvedValueOnce(new Response('{"state":"live"}')))
  expect((await me()).login).toBe('demo')
  expect(await logout()).toBeNull()
  expect((await status('1&x=y')).state).toBe('live')
  expect(fetch.mock.calls.map(([url]) => url)).toEqual(['/api/auth/me', '/api/auth/logout', '/api/submit/status?pr=1%26x%3Dy'])
  for (const [, init] of fetch.mock.calls) expect(init.credentials).toBe('same-origin')
})
it('submit 只发明文和授权（不再带 screenshots），未传 dryRun 时正文无该键；显式 false/true 保留', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => new Response('{"ok":true}')))
  for (const dryRun of [undefined, false, true]) {
    await submit({ plaintext, license: true, dryRun })
    const [url, init] = fetch.mock.calls.at(-1)
    expect(url).toBe('/api/submit')
    expect(init.method).toBe('POST')
    expect(init.headers).toEqual({ 'Content-Type': 'application/json' })
    const body = JSON.parse(init.body)
    expect(body).toEqual({ bundle: plaintext, license: true, ...(dryRun === undefined ? {} : { dryRun }) })
    expect(Object.hasOwn(body, 'screenshots')).toBe(false)
  }
})
it('API 非 2xx 保留错误码、附加字段和 requestId，Retry-After 头兜底', async () => {
  const pulls = [{ number: 1, url: 'https://github.test/pull/1', slug }]
  vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ error: 'pr_limit', message: '太多', pulls, requestId: '12345678' }), { status: 429, headers: { 'Retry-After': '90' } })))
  await expect(me()).rejects.toMatchObject({ status: 429, error: 'pr_limit', pulls, retryAfter: 90, requestId: '12345678' })
})
it('API 网络/非 JSON/坏成功响应都 reject 结构化对象', async () => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValueOnce(new Error('offline'))
    .mockResolvedValueOnce(new Response('bad', { status: 502 })).mockResolvedValueOnce(new Response('bad')))
  await expect(me()).rejects.toMatchObject({ status: 0, error: 'network_error' })
  await expect(me()).rejects.toMatchObject({ status: 502, error: 'github_error' })
  await expect(me()).rejects.toMatchObject({ status: 200, error: 'bad_response' })
})
it('API 超时中断请求', async () => {
  vi.useFakeTimers()
  vi.stubGlobal('fetch', vi.fn((_url, { signal }) => new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new Error('abort'))))))
  const result = expect(me()).rejects.toMatchObject({ error: 'timeout' })
  await vi.advanceTimersByTimeAsync(30_000)
  await result
})

it('Issue 备用链接令牌可解回明文，标题正确编码', async () => {
  const result = await issueFallbackUrl(plaintext, { name: '测试 & 名字' })
  const url = new URL(result.url)
  expect(result.needsPaste).toBe(false)
  expect(url.searchParams.get('title')).toBe('投稿：测试 & 名字')
  expect(await decodeToken(url.searchParams.get('bundle'))).toBe(plaintext)
})
it('Issue 链接超限只保留表单和标题；坏包拒绝', async () => {
  const input = unpack(plaintext)
  input.files[`bots/${slug}/random.txt`] = randomBytes(10_000).toString('hex')
  const result = await issueFallbackUrl(pack(input), { name: '测试' })
  expect(result.needsPaste).toBe(true)
  expect(result.url.length).toBeLessThan(URL_LIMITS.issueUrl)
  expect(new URL(result.url).searchParams.has('bundle')).toBe(false)
  await expect(issueFallbackUrl('bad', { name: '测试' })).rejects.toHaveProperty('errors')
})
it('所有 §11 服务端码都有文案和下一步，不直接显示服务端 message', () => {
  // unsupported_type、receipt_invalid 只来自截图上传，新投稿页不会再收到（第 43 条），走通用兜底。
  for (const code of ['bad_request', 'unauthenticated', 'session_expired', 'forbidden_origin', 'license_required', 'not_found', 'slug_taken', 'pr_limit', 'too_large', 'invalid', 'rate_limited', 'github_error', 'submit_disabled']) {
    expect(errorCopy[code].message).toBeTruthy()
    expect(explainError(code, { message: '不该显示' }).next).toBeTruthy()
    expect(explainError(code, { message: '不该显示' }).message).not.toBe('不该显示')
  }
  expect(explainError('unknown', { message: '兼容新码' }).message).toBe('兼容新码')
  for (const code of ['unsupported_type', 'receipt_invalid', 'gif-too-large', 'too-large']) expect(errorCopy[code]).toBeUndefined()
  for (const copy of Object.values(errorCopy)) expect(`${copy.message}${copy.aiText || ''}`).not.toContain('截图')
})
it('动态错误插值、登录/提交差异、倒计时及网络备用入口', () => {
  expect(explainError('slug_taken', { slug }).aiText).toContain(`slug「${slug}」`)
  expect(explainError('pr_limit', { pulls: [1, 2, 3] }).message).toContain('3 个投稿')
  expect(explainError('rate_limited', { stage: 'login', retryAfter: 90 }).message).toBe('登录太频繁了，约 2 分钟后再试。')
  expect(explainError('rate_limited', { stage: 'submit', retryAfter: 30 }).message).toBe('提交太频繁了，30 秒后再试。')
  expect(explainError('rate_limited', { retryAfter: 3600 }).message).toContain('约 1 小时')
  expect(explainError('too_large').message).toContain('投稿包太大')
  expect(explainError('session_expired').message).toBe('登录过期了，请重新登录。')
  expect(explainError('network_error', { failures: 1 }).fallback).toBe(false)
  expect(explainError('timeout', { failures: 2 }).fallback).toBe(true)
})
it('复制给 AI 与 CLI 四项格式一致，支持空错误和动态错误摘要', () => {
  const errors = [{ file: 'bots/demo/bot.yaml', where: 'quotaCost', problem: '缺失', fix: '补充' }]
  expect(copyForAi(errors)).toBe('投稿页检查没通过，请按「改法」逐条修改，改完重新生成投稿链接给我：\n✗ bots/demo/bot.yaml\n  位置：quotaCost\n  问题：缺失\n  改法：补充')
  expect(explainError('invalid', { errors })).toMatchObject({ message: '还有 1 处要改', aiText: copyForAi(errors) })
  expect(copyForAi([])).toContain('投稿页检查没通过')
})

// ---- V5：投稿预览遇到 about、多句台词、新分组都不报错，摘要形状和货架上的一致 ----
it('预览：fixture 自带的 about 和一句台词照常进摘要，装饰字段是默认值', () => {
  const { summary } = previewModel(plaintext, { now, login: 'example-user' })
  expect(summary).toMatchObject({ category: '产品', pitch: '评审会上被问住之前，先让我问你一遍。', pitches: ['评审会上被问住之前，先让我问你一遍。'], editorNote: null, pick: null, squads: [], needsAccount: true, selfRunning: false })
  expect(summary.about).toMatchObject({ cnFit: '好', skills: [], routines: [] })
  expect(summary.about.does).toHaveLength(3)
  expect(checkBundle(plaintext, { context, login: 'example-user', now }).errors).toEqual([])
})
it('预览：多句台词通过校验，摘要里是数组', () => {
  const input = bundle({ pitch: ['先让我问你一遍。', '验收标准我一条条圈出来。'] })
  expect(checkBundle(input, { context, login: 'example-user', now }).errors).toEqual([])
  expect(previewModel(input, { now }).summary).toMatchObject({ pitch: '先让我问你一遍。', pitches: ['先让我问你一遍。', '验收标准我一条条圈出来。'] })
})
it.each([
  ['about 写成一句话', { about: '一句话' }, 'about'],
  ['about 里的列表写成一句话', { about: { does: '不是列表', skills: '也不是', routines: [null, 5] } }, 'about.does'],
  ['台词写成数字', { pitch: 123 }, 'pitch'],
  ['台词列表里混了别的类型', { pitch: ['正常的一句', null, { a: 1 }] }, 'pitch.1'],
  ['台词写了四句', { pitch: ['第一句话', '第二句话', '第三句话', '第四句话'] }, 'pitch'],
  ['分组写的是旧分类', { category: '评审' }, 'category'],
])('预览：%s 时不抛错，照样出预览，错误由校验用中文指出位置', (_label, change, where) => {
  const input = bundle(change)
  let result
  expect(() => { result = previewModel(input, { now }) }).not.toThrow()
  expect(result.summary.name).toBe('示例·PRD 评审员')
  expect(Array.isArray(result.summary.pitches)).toBe(true)
  expect(result.summary.about === null || typeof result.summary.about === 'object').toBe(true)
  expect(result.summary).toMatchObject({ editorNote: null, pick: null, squads: [] })
  const errors = checkBundle(input, { context, login: 'example-user', now }).errors
  expect(errors.map((error) => error.where)).toContain(where)
  for (const error of errors) expect(error.file).toBe(`bots/${slug}/bot.yaml`)
})
