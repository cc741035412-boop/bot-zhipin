import { describe, expect, it } from 'vitest'
import { createPokes, POKE_STATES } from '../../site/.vitepress/theme/pitch'
import { POKE_PITCHES, ANGRY_PITCH } from '../../site/.vitepress/meta.mjs'

describe('戳的历史', () => {
  it('每只 Bot 的状态和台词不连续重复，跨实例可按 slug 共享', () => {
    const poke = createPokes(() => 0)
    let previous
    for (let i = 0; i < 30; i++) {
      const next = poke('one', i * 4000)
      expect(POKE_STATES).toContain(next.state)
      expect(POKE_PITCHES).toContain(next.text)
      expect(next.state).not.toBe(previous?.state)
      expect(next.text).not.toBe(previous?.text)
      previous = next
    }
    expect(poke('two', 0)).toEqual({ state: POKE_STATES[0], text: POKE_PITCHES[0] })
  })
  it('滚动三秒内第五下 alert、计数清零，超时点击不计入', () => {
    const poke = createPokes(() => 0)
    for (let i = 0; i < 4; i++) expect(poke('one', i * 500).state).not.toBe('alert')
    expect(poke('one', 2000)).toEqual({ state: 'alert', text: ANGRY_PITCH })
    expect(poke('one', 2100).state).not.toBe('alert')
    for (let i = 0; i < 6; i++) expect(poke('two', i * 3000).state).not.toBe('alert')
  })
})
