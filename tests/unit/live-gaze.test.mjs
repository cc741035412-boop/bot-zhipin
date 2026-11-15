import { afterEach, describe, expect, it, vi } from 'vitest'
import { createGaze, lookAt } from '../../site/.vitepress/theme/live/gaze'

const disposers = []
afterEach(() => {
  disposers.splice(0).forEach((dispose) => dispose())
  vi.unstubAllGlobals()
})

describe('lookAt：像素偏移 → 绝对视线', () => {
  it('中心略向上，无额外旋转或漂移', () => {
    expect(lookAt(0, 0)).toEqual({ yaw: 0, pitch: 10, mix: 1, spin: 0, wander: 0 })
  })
  it.each([
    [480, 0, 16, 10], [-240, 0, -8, 10], [120, 180, 4, 3.5],
    [0, -360, 0, 23], [0, 360, 0, -3], [-480, -180, -16, 16.5],
    [5000, 5000, 16, -3], [-5000, -5000, -16, 23],
  ])('(%s, %s) 换算并截断', (dx, dy, yaw, pitch) => {
    expect(lookAt(dx, dy)).toEqual({ yaw, pitch, mix: 1, spin: 0, wander: 0 })
  })
  it.each([NaN, Infinity, -Infinity])('非有限输入 %s 独立按零处理', (bad) => {
    expect(lookAt(bad, bad)).toEqual(lookAt(0, 0))
    expect(lookAt(bad, 180)).toEqual(lookAt(0, 180))
    expect(lookAt(240, bad)).toEqual(lookAt(240, 0))
  })
})

function browser() {
  const doc = new EventTarget()
  const win = new EventTarget()
  vi.stubGlobal('document', doc)
  vi.stubGlobal('window', win)
  let ms = 0
  vi.stubGlobal('performance', { now: () => ms })
  const emit = (type, values = {}, target = doc) => {
    target.dispatchEvent(Object.assign(new Event(type), values))
  }
  const bot = () => {
    const attrs = new Map()
    const rect = vi.fn(() => ({ left: 100, top: 200, width: 100, height: 80 }))
    const setLook = vi.fn()
    const gaze = createGaze({ setAttribute: (k, v) => attrs.set(k, v), getBoundingClientRect: rect }, setLook)
    disposers.push(gaze.dispose)
    return { gaze, attrs, rect, setLook }
  }
  return { doc, win, emit, bot, advance: (dt) => { ms += dt } }
}

describe('共享指针采样', () => {
  it('SSR 不访问 DOM', () => {
    const setLook = vi.fn()
    const gaze = createGaze(null, setLook)
    gaze.tick(1)
    gaze.reset(1)
    gaze.dispose()
    expect(setLook).not.toHaveBeenCalled()
  })
  it('多个 Bot 共用一个 passive move 监听，只在新位置上测量，最后卸载时清理', () => {
    const b = browser()
    const add = vi.spyOn(b.doc, 'addEventListener')
    const remove = vi.spyOn(b.doc, 'removeEventListener')
    const a = b.bot(), c = b.bot()
    expect(add.mock.calls.filter(([type]) => type === 'pointermove')).toHaveLength(1)
    expect(add).toHaveBeenCalledWith('pointermove', expect.any(Function), { passive: true })
    b.emit('pointermove', { pointerType: 'mouse', clientX: 390, clientY: 420 })
    a.gaze.tick(1)
    c.gaze.tick(1)
    expect(a.setLook).toHaveBeenLastCalledWith(lookAt(240, 180), 1)
    expect(c.setLook).toHaveBeenLastCalledWith(lookAt(240, 180), 1)
    expect(a.attrs.get('data-follow')).toBe('pointer')
    a.gaze.tick(2)
    expect(a.rect).toHaveBeenCalledTimes(1)
    a.gaze.dispose()
    expect(remove).not.toHaveBeenCalled()
    c.gaze.dispose()
    expect(remove.mock.calls.filter(([type]) => type === 'pointermove')).toHaveLength(1)
  })
  it('触摸不跟随；零尺寸不设置视线', () => {
    const b = browser(), a = b.bot()
    b.emit('pointermove', { pointerType: 'touch', clientX: 390, clientY: 420 })
    a.gaze.tick(1)
    expect(a.setLook).not.toHaveBeenCalled()
    b.emit('pointermove', { pointerType: 'mouse', clientX: 390, clientY: 420 })
    a.rect.mockReturnValue({ left: 0, top: 0, width: 0, height: 80 })
    a.gaze.tick(2)
    expect(a.setLook).not.toHaveBeenCalled()
  })
  it('4 秒无输入只释放一次，以 0.6 秒恢复漂移', () => {
    const b = browser(), a = b.bot()
    b.emit('pointermove', { pointerType: 'pen', clientX: 390, clientY: 420 })
    a.gaze.tick(1)
    b.advance(3999)
    a.gaze.tick(2)
    expect(a.attrs.get('data-follow')).toBe('pointer')
    b.advance(1)
    a.gaze.tick(3)
    expect(a.setLook).toHaveBeenLastCalledWith(null, 3, 0.6)
    expect(a.attrs.get('data-follow')).toBe('rest')
    a.gaze.tick(4)
    expect(a.setLook).toHaveBeenCalledTimes(2)
  })
  it.each(['pointerout', 'pointerleave', 'blur'])('%s 释放视线，文档内移动不释放', (type) => {
    const b = browser(), a = b.bot()
    b.emit('pointermove', { pointerType: 'mouse', clientX: 390, clientY: 420 })
    a.gaze.tick(1)
    b.emit('pointerout', { relatedTarget: {} })
    a.gaze.tick(2)
    expect(a.setLook).toHaveBeenCalledTimes(1)
    b.emit(type, { relatedTarget: null }, type === 'blur' ? b.win : b.doc)
    a.gaze.tick(3)
    expect(a.setLook).toHaveBeenLastCalledWith(null, 3, 0.6)
    expect(a.attrs.get('data-follow')).toBe('rest')
  })
})
