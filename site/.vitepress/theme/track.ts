import type { Router } from 'vitepress'
import { EVENTS, EVENT_LIMITS } from '../../../functions/_lib/events'
import type { Device, EventName, EventProps, PageType } from '../../../functions/_lib/events'

const ENDPOINT = '/api/events'
const FLUSH_AT = 10
const FLUSH_DELAY = 2000
const MAX_BYTES = 16_000
const repoPath = '/jakob52123/bot-zhipin'
const details = { bots: 'bot', squads: 'squad', prompts: 'prompt', skills: 'skill', authors: 'author' } as const

type PageContext = { page: PageType; path: string; slug: string | null }
type QueuedEvent = Omit<PageContext, 'slug'> & {
  name: EventName
  slug?: string
  props: Record<string, unknown>
  queuedAt: number
}
type Outbound = Required<EventProps<'outbound'>>

let current: PageContext | undefined
let sid: string | undefined
let landed = false
let debug = false
let installed = false
let sending = false
let timer: ReturnType<typeof setTimeout> | undefined
let queue: QueuedEvent[] = []

function enabled() {
  return typeof window !== 'undefined' && location.hostname !== 'bot-zhipin.pages.dev'
}

function storage<T>(action: (store: Storage) => T): T | undefined {
  try { return action(sessionStorage) } catch { /* 使用本页内存 */ }
}

function pathOnly(path: string) {
  return path.split(/[?#]/, 1)[0]
}

function cleanPath(path: string) {
  return pathOnly(path).replace(/\.html$/, '')
}

function detailOf(path: string) {
  return /^\/(bots|squads|prompts|skills|authors)\/([^/]+)$/.exec(path)
}

export function pageTypeOf(path: string, isNotFound?: boolean): PageType {
  if (isNotFound) return '404'
  if (typeof path !== 'string') return 'other'
  const clean = cleanPath(path)
  switch (clean) {
    case '/': return 'home'
    case '/prompts': case '/prompts/': return 'prompts'
    case '/skills': case '/skills/': return 'skills'
    case '/submit': return 'submit'
  }
  const detail = detailOf(clean)
  return detail ? details[detail[1] as keyof typeof details] : 'other'
}

export function slugOf(path: string): string | null {
  if (typeof path !== 'string') return null
  const slug = detailOf(cleanPath(path))?.[2]
  // 与 functions/_lib/clicks.ts 的 isValidSlug 一致。
  return slug && slug.length >= 2 && slug.length <= 40 && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) ? slug : null
}

function pageContext(path: string, isNotFound?: boolean): PageContext {
  const page = pageTypeOf(path, isNotFound)
  return { page, path, slug: page === '404' ? null : slugOf(path) }
}

function sessionId() {
  if (sid !== undefined) return sid
  const saved = storage(store => store.getItem('bz-sid'))
  if (saved && /^[A-Za-z0-9_-]{16,32}$/.test(saved)) return sid = saved
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  const generated = btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  sid = generated
  storage(store => store.setItem('bz-sid', generated))
  return generated
}

function recordDebug(event: QueuedEvent) {
  try {
    const browser = window as Window & { __bzTrack?: QueuedEvent[] }
    const history = browser.__bzTrack ??= []
    history.push(event)
    if (history.length > 200) history.splice(0, history.length - 200)
    const mode = new URLSearchParams(location.search).get('track')
    if (mode === 'debug') {
      debug = true
      storage(store => store.setItem('bz-track-debug', '1'))
    } else if (mode === 'off') {
      debug = false
      storage(store => store.removeItem('bz-track-debug'))
    } else {
      debug = storage(store => store.getItem('bz-track-debug') === '1') ?? debug
    }
    if (debug) console.debug('[埋点]', event)
  } catch { /* 调试不能影响发送 */ }
}

export function track<N extends EventName>(name: N, props?: EventProps<N>, opts?: { slug?: string | null }): void {
  try {
    if (!enabled() || !Object.hasOwn(EVENTS, name)) return
    const cleanProps: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(props ?? {})) {
      if (value !== undefined && Object.hasOwn(EVENTS[name], key)) cleanProps[key] = value
    }
    const context = current ?? pageContext(location.pathname)
    const slug = opts?.slug === undefined ? context.slug : opts.slug
    const event: QueuedEvent = {
      name, page: context.page, path: context.path, ...(slug !== null ? { slug } : {}),
      props: cleanProps, queuedAt: Date.now(),
    }
    if (queue.length === 0) timer = setTimeout(() => flush(), FLUSH_DELAY)
    queue.push(event)
    recordDebug(event)
    if (queue.length >= FLUSH_AT) flush()
  } catch { /* 埋点不能影响页面功能 */ }
}

export function trackPageView(path: string, isNotFound?: boolean): void {
  try {
    if (!enabled()) return
    path = pathOnly(path)
    if (current?.path === path) return
    const prev = current?.page
    current = pageContext(path, isNotFound)
    const landing = !landed && storage(store => store.getItem('bz-landed')) == null
    const props: EventProps<'page_view'> = { landing }
    landed = true
    if (landing) {
      storage(store => store.setItem('bz-landed', '1'))
      try {
        const ref = new URL(document.referrer).host
        if (ref && ref !== location.host) props.ref = ref
      } catch { /* 空来源或无效地址 */ }
      const params = new URLSearchParams(location.search)
      for (const key of ['utm_source', 'utm_medium', 'utm_campaign'] as const) {
        const value = params.get(key)?.trim().slice(0, 40)
        if (value) props[key] = value
      }
    } else {
      props.prev = prev
    }
    track('page_view', props)
  } catch { /* 埋点不能影响页面功能 */ }
}

function deviceOf(): Device {
  try {
    if (typeof matchMedia === 'function' &&
      (matchMedia('(max-width: 767px)').matches || matchMedia('(pointer: coarse)').matches)) return 'mobile'
  } catch { /* 默认记为桌面 */ }
  return 'desktop'
}

function post(body: string, beacon: boolean) {
  if (beacon) {
    try {
      if (typeof navigator.sendBeacon === 'function' &&
        navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }))) return
    } catch { /* beacon 不可用，退回 fetch */ }
  }
  try {
    fetch(ENDPOINT, { method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' }, body })
      .catch(() => {})
  } catch { /* 失败就丢，不重试 */ }
}

function sendBatch(batch: QueuedEvent[], id: string, now: number, beacon: boolean) {
  try {
    const body = JSON.stringify({
      v: 1, sid: id, device: deviceOf(),
      events: batch.map(({ queuedAt, ...event }) => ({
        ...event, ago: Math.min(EVENT_LIMITS.agoMaxMs, Math.max(0, Math.trunc(now - queuedAt))),
      })),
    })
    if (new TextEncoder().encode(body).byteLength <= MAX_BYTES) {
      post(body, beacon)
      return
    }
  } catch { /* 隔离无法序列化的事件 */ }
  if (batch.length > 1) {
    const middle = Math.floor(batch.length / 2)
    sendBatch(batch.slice(0, middle), id, now, beacon)
    sendBatch(batch.slice(middle), id, now, beacon)
  }
}

export function flush(beacon = false): void {
  try {
    if (!enabled() || sending || !queue.length) return
    clearTimeout(timer)
    timer = undefined
    const pending = queue
    queue = []
    sending = true
    try {
      const id = sessionId()
      const now = Date.now()
      for (let i = 0; i < pending.length; i += EVENT_LIMITS.perBatch) {
        sendBatch(pending.slice(i, i + EVENT_LIMITS.perBatch), id, now, beacon)
      }
    } finally {
      sending = false
    }
  } catch { /* 失败就丢，不重试 */ }
}

export function classifyOutbound(href: string, kindAttr: string | null | undefined, here: { host: string }): Outbound | null {
  try {
    const { protocol, host, pathname, hash } = new URL(href)
    if ((protocol !== 'http:' && protocol !== 'https:') || host === here.host) return null
    let kind = EVENTS.outbound.kind.values.find(value => value === kindAttr)
    if (kind === undefined) {
      const path = pathname.toLowerCase()
      if (host === 'x.ai' && hash === '#download') kind = 'download'
      else if (host === 'github.com' && path.startsWith(repoPath + '/pull/')) kind = 'pr'
      else if (host === 'github.com' && path.startsWith(repoPath)) kind = 'repo'
    }
    return { host, to: (host + pathname).slice(0, 160), kind: kind ?? 'other' }
  } catch { return null }
}

export function outboundFromClick(event: MouseEvent): void {
  try {
    if (!enabled()) return
    const target = event.target as Element | null
    const element = target?.closest ? target : target?.parentElement
    const anchor = element?.closest<HTMLAnchorElement>('a[href]')
    if (!anchor || anchor.hasAttribute('data-track-own')) return
    const props = classifyOutbound(anchor.href, anchor.dataset.trackKind, location)
    if (props) track('outbound', props)
  } catch { /* 埋点不能影响点击 */ }
}

export function installTracking(router: Router): void {
  try {
    if (!enabled() || installed) return
    installed = true
    const pageView = () => trackPageView(location.pathname, router.route.data?.isNotFound)
    pageView()
    const previous = router.onAfterRouteChange ?? router.onAfterRouteChanged
    const afterRouteChange = async (to: string) => {
      try { await previous?.call(router, to) } catch { /* 保留执行顺序，不影响埋点 */ }
      try { pageView() } catch { /* 路由或页面可能不可用 */ }
    }
    if (router.onAfterRouteChange == null && router.onAfterRouteChanged != null) {
      router.onAfterRouteChanged = afterRouteChange
    } else {
      router.onAfterRouteChange = afterRouteChange
    }
    document.addEventListener('click', event => { if (event.button === 0) outboundFromClick(event) }, true)
    document.addEventListener('auxclick', event => { if (event.button === 1) outboundFromClick(event) }, true)
    window.addEventListener('pagehide', () => flush(true))
    document.addEventListener('visibilitychange', () => {
      try { if (document.visibilityState === 'hidden') flush(true) } catch { /* 页面不可用 */ }
    })
  } catch { /* 埋点不能影响页面初始化 */ }
}
