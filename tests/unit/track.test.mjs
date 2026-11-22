import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { Blob as NodeBlob } from 'node:buffer'
import { setImmediate } from 'node:timers/promises'

let tracker, store, browser, doc, loc, fetch, beacon, random
const savedSid = 'saved_session-id_123456'

beforeEach(async () => {
  vi.resetModules()
  vi.useFakeTimers()
  vi.setSystemTime(1000)
  store = new Map()
  browser = { addEventListener: vi.fn() }
  doc = { addEventListener: vi.fn(), referrer: '', visibilityState: 'visible' }
  loc = { pathname: '/', search: '', host: 'bot.jiachengbo.com', hostname: 'bot.jiachengbo.com' }
  fetch = vi.fn().mockResolvedValue({ status: 204 })
  beacon = vi.fn().mockReturnValue(true)
  random = vi.fn(bytes => bytes.fill(255))
  for (const [key, value] of Object.entries({
    window: browser, document: doc, location: loc, fetch, navigator: { sendBeacon: beacon },
    matchMedia: undefined, Blob: vi.fn(function (parts, options) { return new NodeBlob(parts, options) }),
    crypto: { getRandomValues: random },
    sessionStorage: {
      getItem: key => store.get(key) ?? null,
      setItem: (key, val) => store.set(key, val),
      removeItem: key => store.delete(key),
    },
  })) vi.stubGlobal(key, value)
  tracker = await import('../../site/.vitepress/theme/track.ts')
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

function seedSession() {
  store.set('bz-sid', savedSid)
  store.set('bz-session-day', '1970-01-01')
  store.set('bz-last-active', '1000')
}

const batches = () => fetch.mock.calls.map(([, request]) => JSON.parse(request.body))
const sent = () => batches().flatMap(batch => batch.events)
const history = () => browser.__bzTrack
const add = (n) => { for (let i = 0; i < n; i++) tracker.track('bot_copy_starter', { index: i }) }
const routerAt = (isNotFound) => ({ route: { data: { isNotFound } } })
const listener = (target, name) => target.addEventListener.mock.calls.find(([type]) => type === name)[1]
const clickAt = ({ own = false, href = 'https://example.com/link', kind, button = 0 } = {}) => ({
  button,
  target: { closest: vi.fn().mockReturnValue({ href, hasAttribute: attr => own && attr === 'data-track-own', dataset: { trackKind: kind } }) },
})

it.each([
  ['/', 'home', null], ['/bots/my-bot', 'bot', 'my-bot'], ['/squads/my-team.html', 'squad', 'my-team'],
  ['/prompts', 'prompts', null], ['/prompts/', 'prompts', null], ['/prompts.html', 'prompts', null],
  ['/prompts/my-prompt.html?query=1#hash', 'prompt', 'my-prompt'],
  ['/skills', 'skills', null], ['/skills/', 'skills', null], ['/skills/my-skill', 'skill', 'my-skill'],
  ['/authors/jakob52123.html', 'author', 'jakob52123'], ['/submit.html', 'submit', null],
  ['/elsewhere', 'other', null], ['/bots/my-bot/extra', 'other', null],
])('识别 %s 为 %s 并提取 slug', (path, page, slug) => {
  expect(tracker.pageTypeOf(path)).toBe(page)
  expect(tracker.slugOf(path)).toBe(slug)
})

it('404 标记覆盖路径映射，404 页面不附详情 slug', () => {
  expect(tracker.pageTypeOf('/bots/valid', true)).toBe('404')
  tracker.trackPageView('/bots/valid', true)
  tracker.flush()
  expect(sent()[0]).toMatchObject({ page: '404', path: '/bots/valid' })
  expect(sent()[0]).not.toHaveProperty('slug')
})

it.each(['a', 'x'.repeat(41), 'Upper', 'bad--slug', 'bad_slug', 'bad%20slug'])('拒绝坏 slug %s', slug => {
  expect(tracker.slugOf(`/bots/${slug}`)).toBeNull()
})

it('track 使用入队时页面，支持覆盖或清除 slug，只保留声明过的非 undefined 字段', () => {
  tracker.trackPageView('/bots/my-bot.html')
  tracker.track('bot_import', { from: 'detail', direct: false, trial: undefined, unexpected: 'ignored', constructor: true })
  tracker.track('bot_import', {}, { slug: 'another-bot' })
  tracker.track('bot_import', undefined, { slug: null })
  tracker.trackPageView('/skills/')
  tracker.flush()
  expect(sent()[1]).toEqual({ name: 'bot_import', page: 'bot', path: '/bots/my-bot.html', slug: 'my-bot', ago: 0, props: { from: 'detail', direct: false } })
  expect(sent()[2].slug).toBe('another-bot')
  expect(sent()[3]).not.toHaveProperty('slug')
})

it('landing 写入标记，第一次记录站外 ref 和非空 UTM，之后只带 prev', () => {
  doc.referrer = 'https://news.example:8443/private?q=discard#discard'
  loc.search = '?utm_source=%20news%20&utm_medium=%20%20&utm_campaign=' + 'a'.repeat(50)
  tracker.trackPageView('/prompts/')
  tracker.trackPageView('/skills/')
  tracker.flush()
  expect(store.get('bz-landed')).toBe('1')
  expect(sent().map(e => e.props)).toEqual([
    { landing: true, ref: 'news.example:8443', utm_source: 'news', utm_campaign: 'a'.repeat(40) },
    { landing: false, prev: 'prompts' },
  ])
})

it.each(['', 'https://bot.jiachengbo.com/internal', 'not a URL'])('不记录 ref %j', ref => {
  doc.referrer = ref
  tracker.trackPageView('/')
  tracker.flush()
  expect(sent()[0].props).toEqual({ landing: true })
})

it.each(['https://example.com/', '', 'not a URL'])('本会话重载时来源 %j 不补上一页，也不重复记录来源', referrer => {
  seedSession()
  store.set('bz-landed', '1')
  doc.referrer = referrer
  loc.search = '?utm_medium=radio'
  tracker.trackPageView('/')
  tracker.flush()
  expect(sent()[0].props).toEqual({ landing: false })
})

it('本会话重载时从同站来源补上一页类型，之后优先使用内存里的上一页', () => {
  seedSession()
  store.set('bz-landed', '1')
  doc.referrer = `https://${loc.host}/prompts/`
  tracker.trackPageView('/')
  tracker.trackPageView('/skills/')
  tracker.flush()
  expect(sent().map(e => e.props)).toEqual([
    { landing: false, prev: 'prompts' },
    { landing: false, prev: 'home' },
  ])
})

it('重复路径以及只改查询串或锚点不再记 page_view', () => {
  for (const path of ['/submit', '/submit', '/submit?one=2', '/submit#section']) tracker.trackPageView(path)
  tracker.flush()
  expect(sent()).toHaveLength(1)
  expect(sent()[0].path).toBe('/submit')
})

it('9 条等首条入队两秒后一起发送，fetch 使用 keepalive JSON', () => {
  add(1)
  vi.advanceTimersByTime(1500)
  add(8)
  vi.advanceTimersByTime(499)
  expect(fetch).not.toHaveBeenCalled()
  vi.advanceTimersByTime(1)
  expect(fetch).toHaveBeenCalledExactlyOnceWith('/api/events', {
    method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: expect.any(String),
  })
  expect(batches()[0]).toMatchObject({ v: 1, device: 'desktop' })
  expect(sent()).toHaveLength(9)
})

it('第 10 条立刻发送并取消旧定时器，新队列重新开始计时', () => {
  add(9)
  vi.advanceTimersByTime(1000)
  expect(fetch).not.toHaveBeenCalled()
  add(1)
  expect(sent()).toHaveLength(10)
  add(1)
  vi.advanceTimersByTime(1999)
  expect(fetch).toHaveBeenCalledTimes(1)
  vi.advanceTimersByTime(1)
  expect(batches().map(b => b.events.length)).toEqual([10, 1])
})

it('发送期间同步重入积压的 65 条一次 flush 拆成 30、30、5，保序', () => {
  fetch.mockImplementationOnce(() => { add(65); return Promise.resolve() })
  add(10)
  expect(batches().map(b => b.events.length)).toEqual([10])
  tracker.flush()
  expect(batches().slice(1).map(b => b.events.length)).toEqual([30, 30, 5])
  expect(sent().slice(10).map(e => e.props.index)).toEqual(Array.from({ length: 65 }, (_, i) => i))
})

it('按 UTF-8 字节对半拆包，单条超限丢弃，其他条保留', () => {
  for (let i = 0; i < 4; i++) tracker.track('search', { q: '汉'.repeat(1600), results: i })
  tracker.flush()
  expect(batches().map(b => b.events.map(e => e.props.results))).toEqual([[0, 1], [2, 3]])
  expect(fetch.mock.calls.every(([, r]) => new TextEncoder().encode(r.body).length <= 16000)).toBe(true)
  tracker.track('search', { q: '汉'.repeat(6000) })
  tracker.track('search', { q: 'valid' })
  tracker.flush()
  expect(batches().at(-1).events.map(e => e.props.q)).toEqual(['valid'])
})

it('ago 按各自入队时间计算，不向服务端暴露入队时间', () => {
  add(1)
  vi.advanceTimersByTime(125)
  add(1)
  vi.advanceTimersByTime(25)
  tracker.flush()
  expect(sent().map(e => e.ago)).toEqual([150, 25])
  expect(sent()[0]).not.toHaveProperty('queuedAt')
})

it('ago 在时钟回拨和长期挂起时夹在上下界内', () => {
  add(1)
  vi.setSystemTime(800_000)
  add(1)
  vi.setSystemTime(799_000)
  tracker.flush()
  expect(sent().map(e => e.ago)).toEqual([600_000, 0])
})

it.each(['(max-width: 767px)', '(pointer: coarse)'])('媒体条件 %s 命中则为 mobile，设备在发送时重新采样', selector => {
  let matches = false
  vi.stubGlobal('matchMedia', vi.fn(query => ({ matches: matches && query === selector })))
  add(1)
  matches = true
  tracker.flush()
  add(1)
  matches = false
  tracker.flush()
  expect(batches().map(b => b.device)).toEqual(['mobile', 'desktop'])
})

it.each([['x.bot-zhipin.pages.dev', 0], ['example.com', 0], ['localhost', 1], ['127.0.0.1', 1]])('%s 按白名单发送', (hostname, expected) => {
  loc.hostname = hostname
  add(1); tracker.flush()
  expect(fetch).toHaveBeenCalledTimes(expected)
})
it.each([[29, false], [30, false], [31, true]])('闲置 %i 分钟后处理队列和 landing', (minutes, expired) => {
  seedSession()
  doc.referrer = 'https://news.example/path'
  loc.search = '?utm_source=paper'
  tracker.trackPageView('/')
  vi.setSystemTime(1000 + minutes * 60000)
  add(1)
  tracker.trackPageView('/skills/')
  tracker.flush()
  expect(batches()[0].sid).toBe(savedSid)
  expect(batches().at(-1).sid !== savedSid).toBe(expired)
  expect(sent()[0].props).toEqual({ landing: true, ref: 'news.example', utm_source: 'paper' })
  expect(sent().at(-1).props).toEqual(expired ? { landing: true } : { landing: false, prev: 'home' })
})
it('跨北京午夜，同一路径也重新落地', () => {
  vi.setSystemTime(Date.parse('1970-01-01T15:59:59Z'))
  seedSession()
  store.set('bz-last-active', String(Date.now()))
  tracker.trackPageView('/')
  vi.setSystemTime(Date.now() + 1000)
  tracker.trackPageView('/')
  tracker.flush()
  expect(batches()).toHaveLength(2)
  expect(batches()[1].sid).not.toBe(batches()[0].sid)
  expect(sent()[1].props).toEqual({ landing: true })
})
it('有效存量 sid 直接复用', () => {
  seedSession()
  add(10)
  expect(batches()[0].sid).toBe(savedSid)
  expect(random).not.toHaveBeenCalled()
})

it('无效 sid 替换为 16 字节的无填充 base64url，并写回', () => {
  store.set('bz-sid', 'invalid=')
  add(10)
  expect(random.mock.calls[0][0]).toBeInstanceOf(Uint8Array)
  expect(random.mock.calls[0][0]).toHaveLength(16)
  expect(batches()[0].sid).toBe(Buffer.alloc(16, 255).toString('base64url'))
  expect(store.get('bz-sid')).toMatch(/^[A-Za-z0-9_-]{22}$/)
})

it.each(['getItem', 'setItem'])('sessionStorage %s 抛错时 landing 和 sid 使用内存', method => {
  globalThis.sessionStorage[method] = () => { throw new Error('unavailable') }
  tracker.trackPageView('/')
  tracker.flush()
  tracker.trackPageView('/submit')
  tracker.flush()
  expect(batches().map(b => b.sid)).toEqual([expect.stringMatching(/^[A-Za-z0-9_-]{22}$/), batches()[0].sid])
  expect(random).toHaveBeenCalledTimes(1)
  expect(sent().map(e => e.props)).toEqual([{ landing: true }, { landing: false, prev: 'home' }])
})

it('pagehide 发送 JSON Blob beacon，不再 fetch', async () => {
  const router = routerAt(false)
  tracker.installTracking(router)
  await router.onAfterRouteChange('/')
  listener(browser, 'pagehide')()
  expect(beacon).toHaveBeenCalledExactlyOnceWith('/api/events', expect.any(NodeBlob))
  const blob = beacon.mock.calls[0][1]
  expect(blob.type).toBe('application/json')
  expect(JSON.parse(await blob.text()).events[0].name).toBe('page_view')
  expect(fetch).not.toHaveBeenCalled()
})

it('visibilitychange 只在 hidden 时发送 beacon', async () => {
  const router = routerAt(false)
  tracker.installTracking(router)
  await router.onAfterRouteChange('/')
  listener(doc, 'visibilitychange')()
  expect(beacon).not.toHaveBeenCalled()
  doc.visibilityState = 'hidden'
  listener(doc, 'visibilitychange')()
  expect(beacon).toHaveBeenCalledTimes(1)
})

it.each(['false', 'absent', 'throws'])('beacon %s 时退回 fetch', mode => {
  if (mode === 'false') beacon.mockReturnValue(false)
  if (mode === 'absent') vi.stubGlobal('navigator', {})
  if (mode === 'throws') beacon.mockImplementation(() => { throw new Error('blocked') })
  add(1)
  tracker.flush(true)
  expect(sent()).toHaveLength(1)
})

it('fetch 拒绝不会造成未处理的 rejection，也不重试', async () => {
  fetch.mockRejectedValue(new Error('offline'))
  add(1)
  tracker.flush()
  await setImmediate()
  vi.advanceTimersByTime(5000)
  expect(fetch).toHaveBeenCalledTimes(1)
})

it('fetch 同步抛错也不向外传播或重试', () => {
  fetch.mockImplementation(() => { throw new Error('offline') })
  add(1)
  expect(() => tracker.flush()).not.toThrow()
  tracker.flush()
  expect(fetch).toHaveBeenCalledTimes(1)
})

it('序列化出错的事件不抛出，不阻断相邻事件', () => {
  tracker.track('search', { q: 1n })
  tracker.track('search', { q: 'good' })
  expect(() => tracker.flush()).not.toThrow()
  expect(sent().map(e => e.props.q)).toEqual(['good'])
})

it.each([
  ['https://x.ai/bot?q=secret#download', undefined, 'download', 'x.ai/bot'],
  ['https://x.ai/bot#download', 'author', 'author', 'x.ai/bot'],
  ['https://example.com/', 'source', 'source', 'example.com/'],
  ['https://example.com/license', 'license', 'license', 'example.com/license'],
  ['https://github.com/Jakob52123/Bot-Zhipin/PULL/4', 'bogus', 'pr', 'github.com/Jakob52123/Bot-Zhipin/PULL/4'],
  ['https://github.com/Jakob52123/Bot-Zhipin/issues', undefined, 'repo', 'github.com/Jakob52123/Bot-Zhipin/issues'],
  ['http://example.com:8080/path?private=1#secret', 'bogus', 'other', 'example.com:8080/path'],
])('站外链接 %s，属性 %s，分类为 %s', (href, attr, kind, to) => {
  const result = tracker.classifyOutbound(href, attr, loc)
  expect(result).toEqual({ host: new URL(href).host, to, kind })
})

it.each(['https://bot.jiachengbo.com/authors/jakob', 'mailto:some@example.com', 'javascript:void(0)', 'not a URL'])(
  '忽略链接 %s', href => expect(tracker.classifyOutbound(href, 'author', loc)).toBeNull(),
)

it('出站目标截到 160 字', () => {
  expect(tracker.classifyOutbound('https://example.com/' + 'a'.repeat(200), undefined, loc).to).toHaveLength(160)
})

it('点击从最近的 a[href] 查找，跳过 data-track-own', () => {
  const owned = clickAt({ own: true })
  tracker.outboundFromClick(owned)
  expect(owned.target.closest).toHaveBeenCalledWith('a[href]')
  expect(history()).toBeUndefined()
  tracker.outboundFromClick(clickAt({ kind: 'source' }))
  expect(history()[0]).toMatchObject({ name: 'outbound', props: { kind: 'source' } })
})

it('安装在捕获阶段只接收左键 click 和中键 auxclick', () => {
  tracker.installTracking(routerAt(false))
  for (const [type, expected] of [['click', 0], ['auxclick', 1]]) {
    const fn = listener(doc, type)
    expect(doc.addEventListener).toHaveBeenCalledWith(type, fn, true)
    for (const button of [0, 1, 2]) fn(clickAt({ button, href: `https://example.com/${type}/${button}` }))
    expect(history().at(-1).props.to).toBe(`example.com/${type}/${expected}`)
  }
  expect(history().map(e => e.name)).toEqual(['outbound', 'outbound'])
})

it.each(['onAfterRouteChange', 'onAfterRouteChanged'])('先执行并等待原路由钩子 %s，再记页面', async key => {
  const router = routerAt(false)
  router[key] = vi.fn(async function () {
    await Promise.resolve()
    expect(this).toBe(router)
    loc.pathname = '/authors/jakob52123.html'
  })
  const previous = router[key]
  tracker.installTracking(router)
  tracker.trackPageView('/')
  await router[key]('/authors/jakob52123.html?ignored=1')
  expect(previous).toHaveBeenCalledExactlyOnceWith('/authors/jakob52123.html?ignored=1')
  expect(history().at(-1)).toMatchObject({ page: 'author', slug: 'jakob52123', props: { prev: 'home' } })
})

it('原路由钩子的异常继续抛出，仍记录当前页', async () => {
  const router = routerAt(false)
  const error = new Error('route failed')
  router.onAfterRouteChange = async () => { throw error }
  tracker.installTracking(router)
  await expect(router.onAfterRouteChange('/')).rejects.toBe(error)
  expect(history().at(-1)).toMatchObject({ name: 'page_view' })
})

it.each([[false, 'bot'], [true, '404']])('只安装一次，首屏钩子按 isNotFound=%s 记为 %s', async (isNotFound, page) => {
  loc.pathname = '/bots/first-bot'
  const router = routerAt(true)
  tracker.installTracking(router)
  const hook = router.onAfterRouteChange
  tracker.installTracking(router)
  expect(router.onAfterRouteChange).toBe(hook)
  expect(history() ?? []).toHaveLength(0)
  expect(doc.addEventListener).toHaveBeenCalledTimes(3)
  expect(browser.addEventListener).toHaveBeenCalledTimes(1)

  router.route.data.isNotFound = isNotFound
  await hook(loc.pathname)
  expect(history()).toHaveLength(1)
  expect(history()[0]).toMatchObject({ name: 'page_view', page, path: '/bots/first-bot', props: { landing: true } })
})

it('VitePress 首次加载替换默认 404 路由数据后，只记录一条正常的首屏浏览', async () => {
  loc.pathname = '/prompts/'
  const router = routerAt(true)
  tracker.installTracking(router)
  router.route.data = { isNotFound: false }
  await router.onAfterRouteChange(loc.pathname)
  tracker.flush()
  expect(sent()).toHaveLength(1)
  expect(sent()[0]).toMatchObject({ name: 'page_view', page: 'prompts', path: '/prompts/' })
})

it('调试历史最多保留最新 200 条', () => {
  add(205)
  expect(history()).toHaveLength(200)
  expect(history()[0].props.index).toBe(5)
  expect(history().at(-1).props.index).toBe(204)
})

it('track=debug 开日志并持久化，track=off 清标记但不停止埋点', () => {
  const log = vi.spyOn(console, 'debug').mockImplementation(() => {})
  loc.search = '?track=debug'
  add(1)
  expect(store.get('bz-track-debug')).toBe('1')
  loc.search = ''
  add(1)
  loc.search = '?track=off'
  add(1)
  expect(store.has('bz-track-debug')).toBe(false)
  expect(log.mock.calls).toEqual([['[埋点]', history()[0]], ['[埋点]', history()[1]]])
  tracker.flush()
  expect(sent()).toHaveLength(3)
})

it.each(['SSR', '旧域名'])('%s 不安装、不入队、不发、不报错', mode => {
  if (mode === 'SSR') {
    vi.stubGlobal('window', undefined)
    vi.stubGlobal('location', undefined)
  } else {
    loc.hostname = 'bot-zhipin.pages.dev'
  }
  const router = routerAt(false)
  expect(() => {
    tracker.installTracking(router)
    tracker.trackPageView('/')
    add(10)
    tracker.outboundFromClick(clickAt())
    tracker.flush(true)
  }).not.toThrow()
  expect(router.onAfterRouteChange).toBeUndefined()
  expect(doc.addEventListener).not.toHaveBeenCalled()
  expect(history()).toBeUndefined()
  expect(store.size).toBe(0)
  expect(fetch).not.toHaveBeenCalled()
  expect(beacon).not.toHaveBeenCalled()
})
