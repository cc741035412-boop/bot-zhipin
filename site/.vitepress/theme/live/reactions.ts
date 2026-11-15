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
function input() {
  clear()
  if (isReducedMotion()) return
  for (const client of clients) {
    if (client.state() === 'sleep') client.play({ state: 'exclaim' })
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

/** 首页父组件挂载后调用；存储不可用时仍只在当前文档播放一次。 */
let entered = false
export function enterHero(portraits: Element[]) {
  if (isReducedMotion() || entered || !portraits.length) return () => {}
  entered = true
  try {
    if (sessionStorage.getItem('bz-hero-entered')) return () => {}
    sessionStorage.setItem('bz-hero-entered', '1')
  } catch { /* 隐私模式禁用存储，使用当前文档标记。 */ }
  const timers = portraits.map((svg, i) => setTimeout(() => {
    if (!isReducedMotion()) svg.dispatchEvent(new CustomEvent('bz-play', { detail: { state: 'swirl' } }))
  }, i * 120))
  return () => timers.forEach(clearTimeout)
}
