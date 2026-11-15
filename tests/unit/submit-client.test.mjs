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
import { screenshotNames } from '../../site/.vitepress/theme/submit/model.ts'
import { createStore } from '../../site/.vitepress/theme/submit/store.ts'
import { me, logout, startLogin, submit, status, uploadScreenshot } from '../../site/.vitepress/theme/submit/api.ts'
import { planCompression, compressImage, makeThumb } from '../../site/.vitepress/theme/submit/compress.ts'
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
it('校验用占位作者、北京时间日期、截图占位，不改原文', () => {
  const input = bundle({ author: { name: '作者' } })
  expect(checkBundle(input, { context, now })).toMatchObject({ errors: [], slug, update: false })
  const result = previewModel(input, { now })
  expect(result.model.data.author.github).toBe('submitter')
  expect(result.summary.addedAt).toBe('2026-11-15')
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
it('槽位声明优先；缺声明按设计说明推导去重，完全没有则一个槽', () => {
  expect(screenshotNames(unpack(plaintext))).toEqual(['output.png'])
  const input = unpack(bundle({}, []))
  input.files[`bots/${slug}/DESIGN.md`] = '![甲](screenshots/a.jpg) ![乙](./screenshots/b.png) ![甲](screenshots/a.jpg)'
  expect(screenshotNames(input)).toEqual(['a.jpg', 'b.png'])
  expect(checkBundle(pack(input), { context, now }).errors.filter((error) => error.where === '文件头')).toEqual([])
  input.files[`bots/${slug}/DESIGN.md`] = ''
  expect(screenshotNames(input)).toEqual(['screenshot-1.png'])
})
it('预览按槽位改扩展名和引用，用 blob/缩略图，不用外部图地址', () => {
  const input = unpack(plaintext)
  input.files[`bots/${slug}/DESIGN.md`] += '\n![结果](screenshots/output.png)'
  const result = previewModel(pack(input), { images: [{ format: 'jpeg', size: 100, url: 'blob:trusted' }], login: 'my-user' })
  expect(result.summary.author.link).toBe('https://github.com/my-user')
  expect(result.designHtml).toContain('src="blob:trusted"')
  expect(result.model.screenshots[0].file).toBe('output.jpg')
  expect(result.summary.screenshots).toEqual(['blob:trusted'])
  expect(previewModel(plaintext, { images: [{ thumb: 'data:image/jpeg;base64,YQ==' }] }).summary.screenshots).toEqual(['data:image/jpeg;base64,YQ=='])
  expect(previewModel(plaintext, { images: [{ url: 'https://tracker.example/a.png' }] }).summary.screenshots).toEqual([null])
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
it('草稿和提交结果同一 session 键；清理不影响回执', () => {
  const session = storage(), local = storage(), store = createStore({ session, local })
  expect(store.loadDraft()).toBeNull()
  store.saveDraft({ plaintext, license: true })
  store.saveResult({ pr: { number: 1 }, slug, update: false })
  expect(store.loadDraft()).toMatchObject({ plaintext, license: true, result: { pr: { number: 1 } } })
  store.clearDraft()
  expect(store.loadDraft()).toBeNull()
  session.setItem('bz-submit', '[]')
  expect(store.loadDraft()).toBeNull()
})
it('回执按 uid/slug 隔离，到期剔除但不移动槽位', () => {
  const local = storage(), store = createStore({ session: storage(), local })
  store.saveShot(1, slug, 0, { receipt: 'old', exp: 100 })
  store.saveShot(1, slug, 2, { receipt: 'valid', exp: 200 })
  expect(store.loadShots(1, slug, 100)).toEqual([null, null, { receipt: 'valid', exp: 200 }])
  expect(store.loadShots(2, slug, 100)).toEqual([])
  expect(store.loadShots(1, 'other', 100)).toEqual([])
  expect(JSON.parse(local.getItem(`bz-submit-shots:1:${slug}`))[0]).toBeNull()
  store.clearShots(1, slug)
  expect(store.loadShots(1, slug)).toEqual([])
})
it('换账号清所有旧账号，不误删 1/10 的共同前缀或其他业务数据', () => {
  const local = storage(), store = createStore({ local, session: storage() })
  local.setItem('unrelated', 'keep')
  for (const uid of [1, 10, 2]) for (const name of [slug, 'another']) store.saveShot(uid, name, 0, { receipt: 'r', exp: 999 })
  store.clearShotsExcept(1)
  expect(local.length).toBe(3)
  expect(store.loadShots(1, slug, 1)).toHaveLength(1)
  expect(store.loadShots(10, slug, 1)).toEqual([])
  expect(local.getItem('unrelated')).toBe('keep')
})
it('损坏 JSON、坏结构和非法 slot 安全兜底', () => {
  const session = storage(), local = storage(), store = createStore({ session, local })
  session.setItem('bz-submit', '{bad')
  local.setItem(`bz-submit-shots:1:${slug}`, '{}')
  expect(store.loadDraft()).toBeNull()
  expect(store.loadShots(1, slug)).toEqual([])
  store.saveShot(1, slug, -1, {})
  store.saveShot(1, slug, 1.5, {})
  store.saveShot(1, slug, 30, {})
  expect(store.loadShots(1, slug)).toEqual([])
})
it('所有存储方法抛错也不崩，默认 window 存储 getter 抛错也安全', () => {
  const throwing = new Proxy({}, { get() { throw new Error('blocked') } })
  vi.stubGlobal('window', throwing)
  for (const store of [createStore(), createStore({ local: throwing, session: throwing }), createStore({ local: null, session: null })]) {
    expect(store.loadDraft()).toBeNull()
    expect(store.loadShots(1, slug)).toEqual([])
    expect(() => {
      store.saveDraft({ plaintext }); store.saveResult({}); store.clearDraft()
      store.saveShot(1, slug, 0, { receipt: 'r', exp: 1 }); store.clearShots(1, slug); store.clearShotsExcept(1)
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
it('submit 发送明文，未传 dryRun 时正文无该键；显式 false/true 保留', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => new Response('{"ok":true}')))
  for (const dryRun of [undefined, false, true]) {
    await submit({ plaintext, receipts: ['receipt'], license: true, dryRun })
    const [url, init] = fetch.mock.calls.at(-1)
    expect(url).toBe('/api/submit')
    expect(init.method).toBe('POST')
    expect(init.headers).toEqual({ 'Content-Type': 'application/json' })
    const body = JSON.parse(init.body)
    expect(body).toMatchObject({ bundle: plaintext, screenshots: ['receipt'], license: true })
    expect(Object.hasOwn(body, 'dryRun')).toBe(dryRun !== undefined)
  }
})
it('API 非 2xx 保留错误、slots、requestId，Retry-After 头兜底', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ error: 'receipt_invalid', message: '需要重传', slots: [1], requestId: '12345678' }), { status: 400, headers: { 'Retry-After': '90' } })))
  await expect(me()).rejects.toMatchObject({ status: 400, error: 'receipt_invalid', slots: [1], retryAfter: 90, requestId: '12345678' })
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

class FakeXHR {
  static last
  constructor() { FakeXHR.last = this; this.upload = {}; this.headers = {}; this.status = 200; this.responseText = '{"ok":true,"receipt":"r","exp":999}' }
  open(...args) { this.opened = args }
  setRequestHeader(name, value) { this.headers[name] = value }
  getResponseHeader() { return '60' }
  send(body) { this.body = body }
  abort() { this.onabort() }
}
it('上传只发原始字节和 Content-Type，进度 0–100，成功返回 JSON', async () => {
  vi.stubGlobal('XMLHttpRequest', FakeXHR)
  const file = new Blob(['png'], { type: 'image/png' }), onProgress = vi.fn()
  const result = uploadScreenshot(file, { onProgress }), xhr = FakeXHR.last
  expect(xhr.opened).toEqual(['POST', '/api/submit/screenshot'])
  expect(xhr.headers).toEqual({ 'Content-Type': 'image/png' })
  expect(xhr.body).toBe(file)
  xhr.upload.onprogress({ lengthComputable: true, loaded: 2, total: 4 })
  xhr.upload.onprogress({ lengthComputable: true, loaded: 6, total: 4 })
  xhr.onload()
  expect(await result).toMatchObject({ receipt: 'r', exp: 999 })
  expect(onProgress.mock.calls.flat()).toEqual([0, 50, 100, 100])
})
it('上传非 2xx 返回完整结构化错误', async () => {
  vi.stubGlobal('XMLHttpRequest', FakeXHR)
  const result = uploadScreenshot(new Blob()), xhr = FakeXHR.last
  xhr.status = 429; xhr.responseText = '{"error":"rate_limited","message":"慢一点","slots":[0],"retryAfter":120}'
  xhr.onload()
  await expect(result).rejects.toMatchObject({ status: 429, error: 'rate_limited', message: '慢一点', slots: [0], retryAfter: 120 })
})
it.each([['onerror', 'network_error'], ['ontimeout', 'timeout'], ['onabort', 'aborted']])('上传 %s 会 reject 且移除 signal listener', async (event, error) => {
  vi.stubGlobal('XMLHttpRequest', FakeXHR)
  const controller = new AbortController(), spy = vi.spyOn(controller.signal, 'removeEventListener')
  const result = uploadScreenshot(new Blob(), { signal: controller.signal })
  FakeXHR.last[event]()
  await expect(result).rejects.toMatchObject({ error })
  expect(spy).toHaveBeenCalled()
})
it('上传支持预先取消与上传中取消', async () => {
  vi.stubGlobal('XMLHttpRequest', FakeXHR)
  const controller = new AbortController()
  const pending = uploadScreenshot(new Blob(), { signal: controller.signal })
  controller.abort()
  await expect(pending).rejects.toMatchObject({ error: 'aborted' })
  await expect(uploadScreenshot(new Blob(), { signal: controller.signal })).rejects.toMatchObject({ error: 'aborted' })
})
it('上传非 JSON 错误页与坏成功响应都可处理', async () => {
  vi.stubGlobal('XMLHttpRequest', FakeXHR)
  const a = uploadScreenshot(new Blob())
  FakeXHR.last.status = 503; FakeXHR.last.responseText = 'bad'; FakeXHR.last.onload()
  await expect(a).rejects.toMatchObject({ status: 503, retryAfter: 60 })
  const b = uploadScreenshot(new Blob())
  FakeXHR.last.responseText = 'bad'; FakeXHR.last.onload()
  await expect(b).rejects.toMatchObject({ error: 'bad_response' })
})
it('压缩计划严格大于 2MB，GIF 不自动压缩', () => {
  expect(planCompression(2_097_152, 'image/png')).toBe('none')
  expect(planCompression(2_097_152, 'image/gif')).toBe('none')
  expect(planCompression(2_097_153, 'image/png')).toBe('compress')
  expect(planCompression(2_097_153, 'image/gif')).toBe('gif-too-large')
})
function mockCanvas({ sizes = [100], thumbSizes = [100], badImage = false, nullBlob = false, nullContext = false } = {}) {
  const qualities = [], thumbQualities = []
  const canvas = { width: 0, height: 0,
    getContext: () => nullContext ? null : { fillRect() {}, drawImage() {} },
    toBlob(callback, type, quality) { qualities.push(quality); callback(nullBlob ? null : new Blob([new Uint8Array(sizes[Math.min(qualities.length - 1, sizes.length - 1)])], { type })) },
    toDataURL(_type, quality) { thumbQualities.push(quality); return 'data:image/jpeg;base64,' + 'a'.repeat(thumbSizes[Math.min(thumbQualities.length - 1, thumbSizes.length - 1)]) },
  }
  vi.stubGlobal('document', { createElement: () => canvas })
  vi.stubGlobal('Image', class {
    naturalWidth = 4000; naturalHeight = 2000
    set src(_value) { queueMicrotask(() => badImage ? this.onerror() : this.onload()) }
  })
  vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test')
  const revoke = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
  return { canvas, qualities, thumbQualities, revoke }
}
const largeFile = (type = 'image/png') => new File([new Uint8Array(2_097_153)], 'output.png', { type })
it('小图返回原文件，大 GIF reject 不启动 canvas', async () => {
  const file = new File(['small'], 'output.png', { type: 'image/png' })
  expect(await compressImage(file)).toBe(file)
  await expect(compressImage(largeFile('image/gif'))).rejects.toMatchObject({ error: 'gif-too-large' })
})
it('压缩长边 ≤2560，按质量逐级尝试，达到边界立即停', async () => {
  const { canvas, qualities, revoke } = mockCanvas({ sizes: [2_097_153, 2_097_153, 2_097_152] })
  const file = await compressImage(largeFile())
  expect(file.type).toBe('image/jpeg')
  expect(file.name).toBe('output.jpg')
  expect(file.size).toBe(2_097_152)
  expect([canvas.width, canvas.height]).toEqual([2560, 1280])
  expect(qualities).toEqual([0.9, 0.8, 0.7])
  expect(revoke).toHaveBeenCalledWith('blob:test')
})
it('四档都太大 reject too-large 并回收 blob URL', async () => {
  const { qualities, revoke } = mockCanvas({ sizes: [2_097_153] })
  await expect(compressImage(largeFile())).rejects.toEqual({ error: 'too-large' })
  expect(qualities).toEqual([0.9, 0.8, 0.7, 0.6])
  expect(revoke).toHaveBeenCalledOnce()
})
it.each([{ badImage: true }, { nullBlob: true }, { nullContext: true }])('解码/canvas 失败也回收资源（%#）', async (options) => {
  const { revoke } = mockCanvas(options)
  await expect(compressImage(largeFile())).rejects.toMatchObject({ error: 'unsupported_type' })
  expect(revoke).toHaveBeenCalledOnce()
})
it('缩略图宽 320，JPEG dataURL 总量 ≤30KB，超限降低质量', async () => {
  const { canvas, thumbQualities, revoke } = mockCanvas({ thumbSizes: [31_000, 500] })
  const data = await makeThumb(new Blob())
  expect(canvas.width).toBe(320)
  expect(canvas.height).toBe(160)
  expect(data.length).toBeLessThanOrEqual(30 * 1024)
  expect(thumbQualities).toEqual([0.9, 0.8])
  expect(revoke).toHaveBeenCalledOnce()
})
it('任何质量都过大的缩略图不返回超限内容', async () => {
  mockCanvas({ thumbSizes: [31_000] })
  await expect(makeThumb(new Blob())).rejects.toEqual({ error: 'thumb-too-large' })
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
  for (const code of ['bad_request', 'unauthenticated', 'session_expired', 'forbidden_origin', 'license_required', 'not_found', 'slug_taken', 'pr_limit', 'too_large', 'unsupported_type', 'invalid', 'rate_limited', 'github_error', 'submit_disabled', 'receipt_invalid']) {
    expect(errorCopy[code].message).toBeTruthy()
    expect(explainError(code, { message: '不该显示' }).next).toBeTruthy()
    expect(explainError(code, { message: '不该显示' }).message).not.toBe('不该显示')
  }
  expect(explainError('unknown', { message: '兼容新码' }).message).toBe('兼容新码')
})
it('动态错误插值、上传/提交差异、倒计时及网络备用入口', () => {
  expect(explainError('slug_taken', { slug }).aiText).toContain(`slug「${slug}」`)
  expect(explainError('pr_limit', { pulls: [1, 2, 3] }).message).toContain('3 个投稿')
  expect(explainError('receipt_invalid', { slots: [0, 2] }).message).toContain('2 张截图')
  expect(explainError('rate_limited', { stage: 'login', retryAfter: 90 }).message).toBe('登录太频繁了，约 2 分钟后再试。')
  expect(explainError('rate_limited', { stage: 'upload', retryAfter: 30 }).message).toBe('传得太快了，30 秒后再试。')
  expect(explainError('rate_limited', { retryAfter: 3600 }).message).toContain('约 1 小时')
  expect(explainError('too_large', { stage: 'upload', gif: true }).message).toContain('动图超过')
  expect(explainError('too_large', { stage: 'upload' }).message).toContain('压缩后还是')
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
