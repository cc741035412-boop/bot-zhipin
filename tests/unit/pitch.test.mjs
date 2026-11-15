import { describe, expect, it } from 'vitest'
import { createPokes, nextPitch, POKE_STATES } from '../../site/.vitepress/theme/pitch'
import { POKE_PITCHES, ANGRY_PITCH, DEFAULT_PITCHES } from '../../site/.vitepress/meta.mjs'

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

describe('自荐台词', () => {
  it('专属台词是数组时按顺序轮换：第一次说第一句，不连说同一句，说完一轮从头来', () => {
    const lines = ['第一句', '第二句', '第三句']
    const said = Array.from({ length: 7 }, () => nextPitch('rotate-three', lines))
    expect(said).toEqual(['第一句', '第二句', '第三句', '第一句', '第二句', '第三句', '第一句'])
    for (let i = 1; i < said.length; i++) expect(said[i]).not.toBe(said[i - 1])
    expect(Array.from({ length: 4 }, () => nextPitch('rotate-two', ['甲', '乙']))).toEqual(['甲', '乙', '甲', '乙'])
  })
  it('只有一句（字符串或单元素数组）时每次都说它，永远不掺通用台词', () => {
    for (let i = 0; i < 5; i++) {
      expect(nextPitch('single-string', '就这一句')).toBe('就这一句')
      expect(nextPitch('single-array', ['就这一句'])).toBe('就这一句')
    }
  })
  it('每只 Bot 各记各的进度，互不影响', () => {
    const lines = ['甲', '乙', '丙']
    expect(nextPitch('own-a', lines)).toBe('甲')
    expect(nextPitch('own-b', lines)).toBe('甲')
    expect(nextPitch('own-a', lines)).toBe('乙')
    expect(nextPitch('own-b', lines)).toBe('乙')
  })
  it('没有专属台词（null、空字符串、空数组、数组里没有文字）才用通用池，且不连续重复', () => {
    for (const [slug, pitch] of [['none-null', null], ['none-undefined', undefined], ['none-empty', ''], ['none-list', []], ['none-junk', ['', null, 3]]]) {
      let previous
      for (let i = 0; i < 30; i++) {
        const text = nextPitch(slug, pitch)
        expect(DEFAULT_PITCHES).toContain(text)
        expect(text).not.toBe(previous)
        previous = text
      }
    }
  })
  it('通用池可注入随机数，方便离线复现', () => {
    expect(nextPitch('seeded', null, () => 0)).toBe(DEFAULT_PITCHES[0])
    expect(nextPitch('seeded', null, () => 0)).toBe(DEFAULT_PITCHES[1])
    expect(nextPitch('seeded', null, () => 0)).toBe(DEFAULT_PITCHES[0])
  })
  it('通用池里没有「设计说明」那一句（外部收录的页面上没有设计说明），其余 7 句不动', () => {
    expect(DEFAULT_PITCHES.some((text) => text.includes('设计说明'))).toBe(false)
    expect(DEFAULT_PITCHES).toEqual([
      '挑我吧，上岗不用培训。',
      '重复的活交给我，你去想更重要的事。',
      '不画大饼，只交能用的结果。',
      '导入一次，天天替你跑腿。',
      '简历就在详情页，欢迎来面试。',
      '额度花在刀刃上，这事我在行。',
      '别急着走，点开看看我会什么。',
    ])
  })
})
