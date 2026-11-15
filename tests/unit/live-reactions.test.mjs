import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

let reduced = false
vi.mock('../../site/.vitepress/theme/live/clock', () => ({ isReducedMotion: () => reduced }))
let reactions, doc, disposers
beforeEach(async () => {
  vi.resetModules()
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'performance'] })
  reduced = false
  doc = new EventTarget()
  disposers = []
  vi.stubGlobal('document', doc)
  vi.stubGlobal('window', { location: { search: '?bz-idle=500' } })
  vi.stubGlobal('sessionStorage', { getItem: vi.fn(), setItem: vi.fn() })
  reactions = await import('../../site/.vitepress/theme/live/reactions')
})
afterEach(() => {
  disposers.forEach((fn) => fn())
  expect(vi.getTimerCount()).toBe(0)
  vi.useRealTimers()
  vi.unstubAllGlobals()
})
function bot(running = true, at = null) {
  let state = 'idle'
  const client = {
    el: { getAttribute: () => String(running), ...(at && { getBoundingClientRect: () => ({ left: at.x - 10, top: at.y - 10, width: 20, height: 20 }) }) },
    state: () => state,
    busy: () => false,
    play: vi.fn((detail) => { state = detail.state }),
  }
  const release = reactions.registerReactions(client)
  disposers.push(release)
  return client
}

describe('发呆与入场（浏览器接口全 mock）', () => {
  it('阈值只允许范围内整数，否则 30_000', () => {
    for (const value of ['199', '600001', '2.5', '-1', 'Infinity', '1e3', '']) expect(reactions.idleDelay(`?bz-idle=${value}`)).toBe(30_000)
    for (const value of [200, 500, 600000]) expect(reactions.idleDelay(`?bz-idle=${value}`)).toBe(value)
  })
  it('只有一组输入监听；可见 Bot 在 0–800ms 错开睡，离屏不睡', () => {
    const add = vi.spyOn(doc, 'addEventListener'), remove = vi.spyOn(doc, 'removeEventListener')
    const a = bot(), b = bot(), offscreen = bot(false)
    expect(add).toHaveBeenCalledTimes(6)
    vi.advanceTimersByTime(499)
    expect(a.play).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(a.state()).toBe('sleep')
    expect(b.state()).toBe('idle')
    vi.advanceTimersByTime(800)
    expect(b.state()).toBe('sleep')
    expect(offscreen.play).not.toHaveBeenCalled()
    for (const release of disposers.splice(0)) release()
    expect(remove).toHaveBeenCalledTimes(6)
  })
  it.each(['pointermove', 'pointerdown', 'keydown', 'wheel', 'scroll', 'touchstart'])('%s 立即惊醒并取消待睡队列', (event) => {
    const a = bot(), b = bot()
    vi.advanceTimersByTime(500)
    doc.dispatchEvent(new Event(event))
    expect(a.state()).toBe('exclaim')
    expect(b.state()).toBe('idle')
    expect(a.play).toHaveBeenLastCalledWith({ state: 'exclaim' })
    vi.advanceTimersByTime(499)
    expect(b.state()).toBe('idle')
  })
  it('全体睡着时被吵醒：只有离指针最近的一只冒感叹号，其余安静睁眼', () => {
    const far = bot(true, { x: 900, y: 100 }), near = bot(true, { x: 120, y: 80 }), mid = bot(true, { x: 500, y: 300 })
    vi.advanceTimersByTime(500 + 800)
    expect([far, near, mid].map((client) => client.state())).toEqual(['sleep', 'sleep', 'sleep'])
    const move = new Event('pointermove')
    Object.assign(move, { clientX: 100, clientY: 100 })
    doc.dispatchEvent(move)
    expect(near.play).toHaveBeenLastCalledWith({ state: 'exclaim' })
    expect(far.play).toHaveBeenLastCalledWith({ state: 'idle', hold: 0 })
    expect(mid.play).toHaveBeenLastCalledWith({ state: 'idle', hold: 0 })
  })
  it('没有坐标的输入（键盘）只吓醒第一只', () => {
    const a = bot(true, { x: 900, y: 100 }), b = bot(true, { x: 120, y: 80 })
    vi.advanceTimersByTime(500 + 800)
    doc.dispatchEvent(new Event('keydown'))
    expect(a.state()).toBe('exclaim')
    expect(b.state()).toBe('idle')
    expect(b.play).toHaveBeenLastCalledWith({ state: 'idle', hold: 0 })
  })
  it('短演示阈值不能打断正在播的临时动作；新输入重置阈值', () => {
    const a = bot()
    a.busy = () => true
    vi.advanceTimersByTime(500)
    expect(a.play).not.toHaveBeenCalled()
    a.busy = () => false
    vi.advanceTimersByTime(999)
    expect(a.play).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(a.state()).toBe('sleep')
    doc.dispatchEvent(new Event('pointermove'))
    vi.advanceTimersByTime(400)
    doc.dispatchEvent(new Event('wheel'))
    vi.advanceTimersByTime(400)
    expect(a.state()).toBe('exclaim')
  })
  it('减少动效不睡；队列最后卸载清理且 URL 只读一次', () => {
    reduced = true
    const a = bot()
    vi.advanceTimersByTime(2000)
    expect(a.play).not.toHaveBeenCalled()
    disposers.splice(0).forEach((release) => release())
    reduced = false
    window.location.search = '?bz-idle=200'
    const b = bot()
    vi.advanceTimersByTime(499)
    expect(b.play).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(b.state()).toBe('sleep')
  })
})
