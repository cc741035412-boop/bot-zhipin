// 视线参数参考 jeremy-prt/bloub src/ui/gaze.ts（MIT，提交 b4bb3c1）：
// YAW_MAX=16、PITCH_MAX=13、PITCH=10；不使用设置面板的 -TURN 和 spin。
import type { Look } from '../vendor/bloub/engine'

const normalized = (value: number, range: number) =>
  Math.max(-1, Math.min(1, (Number.isFinite(value) ? value : 0) / range))

export function lookAt(dx: number, dy: number): Look {
  return {
    yaw: normalized(dx, 480) * 16,
    pitch: 10 - normalized(dy, 360) * 13,
    mix: 1,
    spin: 0,
    wander: 0,
  }
}

let users = 0
let version = 0
let pointer: { x: number; y: number; at: number; version: number } | null = null

function moved(event: PointerEvent) {
  if (event.pointerType === 'touch') { clear(); return }
  pointer = { x: event.clientX, y: event.clientY, at: performance.now(), version: ++version }
}
function clear() { pointer = null }
function pressed(event: PointerEvent) { if (event.pointerType === 'touch') clear() }
function left(event: PointerEvent) {
  if (event.relatedTarget === null) clear()
}

function retainPointer() {
  if (users++ === 0) {
    document.addEventListener('pointermove', moved, { passive: true })
    document.addEventListener('pointerdown', pressed, { passive: true })
    document.addEventListener('pointerleave', left)
    document.addEventListener('pointerout', left)
    window.addEventListener('blur', clear)
  }
  return () => {
    if (--users !== 0) return
    document.removeEventListener('pointermove', moved)
    document.removeEventListener('pointerdown', pressed)
    document.removeEventListener('pointerleave', left)
    document.removeEventListener('pointerout', left)
    window.removeEventListener('blur', clear)
    clear()
  }
}

/** 每个 Bot 只在共享时钟 tick 时消费位置；没有独立监听器或超时器。 */
export function createGaze(
  el: Element,
  setLook: (look: Look | null, t: number, morph?: number) => void,
) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return { tick: (_t: number) => {}, reset: (_t: number) => {}, dispose: () => {} }
  }
  const releasePointer = retainPointer()
  let seen = 0
  let aiming = false
  let disposed = false

  function reset(t: number) {
    if (aiming) setLook(null, t, 0.6)
    aiming = false
    seen = version
    el.setAttribute('data-follow', 'rest')
  }

  return {
    tick(t: number) {
      if (disposed) return
      // 用真实经过时间判定鼠标闲置，暂停动画不会延长旧指针的寿命。
      if (!pointer || performance.now() - pointer.at >= 4000) {
        if (aiming) reset(t)
        return
      }
      if (seen === pointer.version) return
      seen = pointer.version
      const box = el.getBoundingClientRect()
      if (box.width === 0 || box.height === 0) return
      setLook(lookAt(pointer.x - box.left - box.width / 2, pointer.y - box.top - box.height / 2), t)
      aiming = true
      el.setAttribute('data-follow', 'pointer')
    },
    reset,
    dispose() {
      if (disposed) return
      disposed = true
      releasePointer()
    },
  }
}
