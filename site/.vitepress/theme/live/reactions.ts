import { isReducedMotion } from './clock'
import type { Play } from './playback'

interface Reactor {
  el: Element
  state(): string
  busy(): boolean
  play(detail: Play): void
}
const clients = new Set<Reactor>()
const inputs = ['pointermove', 'pointerdown', 'keydown', 'wheel', 'scroll', 'touchstart'] as const
const DEFAULT_IDLE = 30_000
let idleMs: number | undefined
let timer: ReturnType<typeof setTimeout> | undefined
let wave: { client: Reactor; at: number }[] = []

export function idleDelay(search: string): number {
  const value = new URLSearchParams(search).get('bz-idle')
  if (!value || !/^\d+$/.test(value)) return DEFAULT_IDLE
  const ms = Number(value)
  return Number.isSafeInteger(ms) && ms >= 200 && ms <= 600000 ? ms : DEFAULT_IDLE
}
function clear() {
  clearTimeout(timer)
  timer = undefined
  wave = []
}
function running(client: Reactor) { return client.el.getAttribute('data-running') === 'true' }
function nextSleep() {
  if (isReducedMotion()) { clear(); return }
  const time = performance.now()
  while (wave.length && wave[0].at <= time) {
    const { client } = wave.shift()!
    if (clients.has(client) && running(client) && !client.busy()) client.play({ state: 'sleep', hold: Infinity })
  }
  if (wave.length) timer = setTimeout(nextSleep, Math.max(0, wave[0].at - time))
}
function beginSleep() {
  if (isReducedMotion()) return
  const visible = [...clients].filter(running)
  // 演示阈值可能短于惊醒/戳的时长：让动作完整播完，再开始睡眠波次。
  if (visible.some((client) => client.busy())) {
    timer = setTimeout(beginSleep, 1000)
    return
  }
  const start = performance.now()
  wave = visible.map((client, i) => ({ client, at: start + (visible.length <= 1 ? 0 : i * 800 / (visible.length - 1)) }))
  nextSleep()
}
// 输入落在哪：指针和滚轮有坐标，触摸取第一根手指；键盘、滚动没有。
function pointOf(event: Event): { x: number; y: number } | null {
  const touch = (event as TouchEvent).touches?.[0]
  if (touch) return { x: touch.clientX, y: touch.clientY }
  const { clientX, clientY } = event as MouseEvent
  return typeof clientX === 'number' && typeof clientY === 'number' ? { x: clientX, y: clientY } : null
}
function distance(client: Reactor, point: { x: number; y: number } | null) {
  const rect = point && typeof client.el.getBoundingClientRect === 'function' ? client.el.getBoundingClientRect() : null
  return rect && point ? Math.hypot(rect.left + rect.width / 2 - point.x, rect.top + rect.height / 2 - point.y) : Infinity
}
function input(event: Event) {
  clear()
  if (isReducedMotion()) return
  // 睡着以后被吵醒：只有离输入点最近的那一只吓一跳（感叹号），其余的安静睁眼。
  // 以前是全体一起冒感叹号，满屏感叹号太瘆人（用户 2026-11-15）。没有坐标的输入（键盘、滚动）吓醒第一只。
  const sleepers = [...clients].filter((client) => client.state() === 'sleep')
  if (sleepers.length) {
    const point = pointOf(event)
    const startled = sleepers.reduce((best, client) => distance(client, point) < distance(best, point) ? client : best)
    for (const client of sleepers) client.play(client === startled ? { state: 'exclaim' } : { state: 'idle', hold: 0 })
  }
  timer = setTimeout(beginSleep, idleMs)
}

/** LiveBot 挂载后注册；全站一组输入监听、一个超时器，最后卸载时全部释放。 */
export function registerReactions(client: Reactor) {
  if (!clients.size) {
    idleMs ??= idleDelay(window.location.search) // 每个客户端文档只读 URL 一次。
    for (const event of inputs) document.addEventListener(event, input, { passive: true, capture: true })
    timer = setTimeout(beginSleep, idleMs)
  }
  clients.add(client)
  return () => {
    clients.delete(client)
    wave = wave.filter((entry) => entry.client !== client)
    if (clients.size) return
    clear()
    for (const event of inputs) document.removeEventListener(event, input, true)
  }
}
