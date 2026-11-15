/** 全站共享的动画时间（秒）；离屏、隐藏或减少动效时不空转。 */
export interface ClockClient {
  el: Element
  tick(t: number): void
  /** 切到减少动效时，客户端可恢复自己的 SSR 静态帧。 */
  motionChange?(reduced: boolean): void
}

interface Entry {
  client: ClockClient
  visible: boolean
  running: boolean
}

const clients = new Map<Element, Entry>()
let observer: IntersectionObserver | null = null
let motion: MediaQueryList | null = null
let raf: number | null = null
let last: number | null = null
let time = 0

/** 事件处理也使用最近一帧的共享时间，不另起计时器。 */
export const now = () => time
export const isReducedMotion = () => motion?.matches ?? false

function reconcile() {
  const allowed = !document.hidden && !isReducedMotion()
  let active = false
  for (const entry of clients.values()) {
    const running = allowed && entry.visible
    if (running !== entry.running) {
      entry.running = running
      entry.client.el.setAttribute('data-running', String(running))
    }
    active ||= running
  }
  if (active) {
    if (raf === null) raf = window.requestAnimationFrame(frame)
  } else {
    if (raf !== null) window.cancelAnimationFrame(raf)
    raf = null
    last = null // 恢复时不把整个暂停时段算进动画。
  }
}

function frame(ms: number) {
  raf = null
  if (document.hidden || isReducedMotion()) {
    reconcile()
    return
  }
  if (last !== null) time += Math.max(0, ms - last) / 1000
  last = ms
  for (const { client, running } of clients.values()) {
    if (running) client.tick(time)
  }
  reconcile()
}

function motionChanged() {
  // 先同步停止与 data-running，再让组件恢复静态帧。
  reconcile()
  for (const { client } of clients.values()) client.motionChange?.(isReducedMotion())
}

function start() {
  motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  motion.addEventListener('change', motionChanged)
  document.addEventListener('visibilitychange', reconcile)
  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const client = clients.get(entry.target)
      if (client) client.visible = entry.isIntersecting && entry.intersectionRatio > 0
    }
    reconcile()
  })
}

function stop() {
  if (raf !== null) window.cancelAnimationFrame(raf)
  raf = null
  last = null
  observer?.disconnect()
  observer = null
  motion?.removeEventListener('change', motionChanged)
  motion = null
  document.removeEventListener('visibilitychange', reconcile)
}

/** 只在挂载后注册；SSR 调用也是无副作用的空操作。 */
export function register(client: ClockClient): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return () => {}
  if (!observer) start()
  const entry: Entry = { client, visible: false, running: false }
  clients.set(client.el, entry)
  client.el.setAttribute('data-running', 'false')
  client.motionChange?.(isReducedMotion())
  observer!.observe(client.el)

  return () => {
    if (clients.get(client.el) !== entry) return
    client.el.setAttribute('data-running', 'false')
    observer?.unobserve(client.el)
    clients.delete(client.el)
    if (clients.size) reconcile()
    else stop()
  }
}
