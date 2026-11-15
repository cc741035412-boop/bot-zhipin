import { describe, expect, it, vi } from 'vitest'
import { createPlayback } from '../../site/.vitepress/theme/live/playback'
import { STATE_BY_ID } from '../../site/.vitepress/theme/vendor/bloub/states'

describe('LiveBot 共享时钟播放控制', () => {
  it('hold Infinity 一直保持；释放悬停回基础状态', () => {
    const change = vi.fn(), player = createPlayback('idle', change)
    player.setRest('wide', 1)
    player.play({ state: 'wide', hold: Infinity }, 1)
    player.tick(10000)
    expect(player.state).toBe('wide')
    player.setRest('idle', 10001)
    expect(player.state).toBe('idle')
  })
  it.each(['idle', 'wide', 'sleep', 'thinking'])('临时动作播完回 %s；基础状态本身不受 duration 限制', (rest) => {
    const player = createPlayback(rest, vi.fn())
    for (const state of ['wink', 'comet', 'exclaim', 'swirl', 'alert', 'burst', 'orbit', 'play', 'egg', 'hexagon', 'thinking']) {
      player.play({ state }, 1)
      player.tick(1 + STATE_BY_ID.get(state).duration - .01)
      expect(player.state).toBe(state)
      player.tick(1 + STATE_BY_ID.get(state).duration)
      expect(player.state).toBe(rest)
      expect(player.busy).toBe(false)
      player.tick(100)
      expect(player.state).toBe(rest)
    }
  })
  it('离开卡片只改 rest，不打断戳；新动作可以打断旧动作', () => {
    const player = createPlayback('wide', vi.fn())
    player.play({ state: 'orbit' }, 0)
    player.setRest('idle', .1)
    expect(player.state).toBe('orbit')
    player.play({ state: 'wink' }, .2)
    player.tick(1.81)
    expect(player.state).toBe('idle')
  })
  it('无效状态忽略，NaN/-Infinity 回退 duration，负值归零，sleep 无限直到惊醒', () => {
    const player = createPlayback('thinking', vi.fn())
    player.play({ state: 'bad-state' }, 0)
    player.play(undefined, 0)
    expect(player.state).toBe('thinking')
    for (const hold of [NaN, -Infinity]) {
      player.play({ state: 'wink', hold }, 0)
      player.tick(1)
      expect(player.state).toBe('wink')
      player.tick(1.6)
      expect(player.state).toBe('thinking')
    }
    player.play({ state: 'wink', hold: -1 }, 2)
    player.tick(2)
    expect(player.state).toBe('thinking')
    player.play({ state: 'sleep', hold: Infinity }, 2)
    player.setRest('idle', 3)
    player.tick(100)
    expect(player.state).toBe('sleep')
    player.play({ state: 'exclaim' }, 101)
    player.tick(103)
    expect(player.state).toBe('idle')
  })
  it('reduce 取消动作，恢复后回 rest，不复活旧动作', () => {
    const player = createPlayback('sleep', vi.fn())
    player.play({ state: 'wink' }, 0)
    player.reset(1, true)
    expect(player.state).toBe('idle')
    player.reset(2)
    expect(player.state).toBe('sleep')
    player.tick(20)
    expect(player.state).toBe('sleep')
  })
})
