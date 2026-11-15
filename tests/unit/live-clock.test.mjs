import { afterEach, describe, expect, it, vi } from 'vitest'
import { isReducedMotion, now, register } from '../../site/.vitepress/theme/live/clock'

const disposers = []
afterEach(() => {
  disposers.splice(0).forEach((dispose) => dispose())
  vi.unstubAllGlobals()
})

function browser(reduced = false) {
  const doc = Object.assign(new EventTarget(), { hidden: false })
  const motion = Object.assign(new EventTarget(), { matches: reduced })
  const callbacks = new Map()
  let id = 0, ms = 0
  const win = {
    matchMedia: vi.fn(() => motion),
    requestAnimationFrame: vi.fn((fn) => { callbacks.set(++id, fn); return id }),
    cancelAnimationFrame: vi.fn((key) => callbacks.delete(key)),
  }
  const instances = []
  class IO {
    constructor(callback) { this.callback = callback; instances.push(this) }
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
  }
  vi.stubGlobal('document', doc)
  vi.stubGlobal('window', win)
  vi.stubGlobal('IntersectionObserver', IO)
  const client = () => {
    const attrs = new Map()
    const el = { setAttribute: (k, v) => attrs.set(k, v) }
    const tick = vi.fn(), motionChange = vi.fn()
    const dispose = register({ el, tick, motionChange })
    disposers.push(dispose)
    return { el, attrs, tick, motionChange, dispose }
  }
  return {
    doc, motion, win, callbacks, instances, client,
    visible(c, value) { instances[0].callback([{ target: c.el, isIntersecting: value, intersectionRatio: value ? 1 : 0 }]) },
    step(dt = 16) {
      ms += dt
      const pending = [...callbacks.values()]
      callbacks.clear()
      pending.forEach((fn) => fn(ms))
    },
    hidden(value) { doc.hidden = value; doc.dispatchEvent(new Event('visibilitychange')) },
    reduce(value) { motion.matches = value; motion.dispatchEvent(new Event('change')) },
  }
}

describe('单一动画时钟', () => {
  it('SSR 注册不访问 DOM 或运行 tick', () => {
    const tick = vi.fn()
    register({ el: null, tick })()
    expect(tick).not.toHaveBeenCalled()
  })
  it('单个 IO 和 rAF 供所有可见客户共用，时间单位为秒', () => {
    const b = browser(), a = b.client(), c = b.client(), offscreen = b.client()
    expect(b.instances).toHaveLength(1)
    expect(b.callbacks.size).toBe(0)
    b.visible(a, true)
    b.visible(c, true)
    expect(b.callbacks.size).toBe(1)
    expect(b.win.requestAnimationFrame).toHaveBeenCalledTimes(1)
    b.step()
    const t = a.tick.mock.lastCall[0]
    b.step(1000)
    expect(a.tick.mock.lastCall[0]).toBeCloseTo(t + 1)
    expect(c.tick.mock.lastCall[0]).toBe(a.tick.mock.lastCall[0])
    expect(now()).toBe(a.tick.mock.lastCall[0])
    expect(offscreen.tick).not.toHaveBeenCalled()
    expect(a.attrs.get('data-running')).toBe('true')
    expect(b.callbacks.size).toBe(1)
  })
  it('离屏只停对应客户，全部离屏则取消调度；隐藏立即停止，恢复不跳过暂停时间', () => {
    const b = browser(), a = b.client(), c = b.client()
    b.visible(a, true)
    b.visible(c, true)
    b.step()
    b.visible(a, false)
    b.step()
    expect(a.tick).toHaveBeenCalledTimes(1)
    expect(a.attrs.get('data-running')).toBe('false')
    expect(c.tick).toHaveBeenCalledTimes(2)
    b.visible(c, false)
    expect(b.callbacks.size).toBe(0)
    b.visible(a, true)
    b.step()
    const t = now()
    b.hidden(true)
    expect(a.attrs.get('data-running')).toBe('false')
    expect(b.callbacks.size).toBe(0)
    b.step(9000)
    b.hidden(false)
    expect(a.attrs.get('data-running')).toBe('true')
    b.step()
    expect(now()).toBe(t)
  })
  it('减少动效初始不调度，切换时通知客户端并取消 rAF', () => {
    const b = browser(true), a = b.client()
    b.visible(a, true)
    expect(isReducedMotion()).toBe(true)
    expect(a.motionChange).toHaveBeenLastCalledWith(true)
    expect(a.attrs.get('data-running')).toBe('false')
    expect(b.callbacks.size).toBe(0)
    b.reduce(false)
    b.step()
    expect(a.tick).toHaveBeenCalledTimes(1)
    b.reduce(true)
    expect(a.motionChange).toHaveBeenLastCalledWith(true)
    expect(a.attrs.get('data-running')).toBe('false')
    expect(b.callbacks.size).toBe(0)
  })
  it('最后卸载释放观察器、监听器和 rAF，可重新挂载', () => {
    const b = browser()
    const removeVisibility = vi.spyOn(b.doc, 'removeEventListener')
    const removeMotion = vi.spyOn(b.motion, 'removeEventListener')
    const a = b.client(), c = b.client()
    b.visible(a, true)
    a.dispose()
    a.dispose()
    expect(b.instances[0].unobserve).toHaveBeenCalledTimes(1)
    c.dispose()
    expect(b.callbacks.size).toBe(0)
    expect(b.instances[0].disconnect).toHaveBeenCalledOnce()
    expect(removeVisibility).toHaveBeenCalledWith('visibilitychange', expect.any(Function))
    expect(removeMotion).toHaveBeenCalledWith('change', expect.any(Function))
    b.client()
    expect(b.instances).toHaveLength(2)
  })
})
