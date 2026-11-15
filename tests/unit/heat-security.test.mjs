import { afterEach, beforeEach, expect, it, vi } from 'vitest'

let heat
beforeEach(async () => {
  vi.resetModules()
  heat = await import('../../site/.vitepress/theme/heat.ts')
})
afterEach(() => vi.unstubAllGlobals())

it('热度初始/失败状态没有原型属性，constructor 不会显示函数', async () => {
  expect(Object.getPrototypeOf(heat.heatState.values)).toBe(null)
  for (const slug of ['constructor', 'toString', '__proto__']) {
    expect(heat.heatState.values[slug]).toBeUndefined()
    // 初始（还没拿到数据）显示加载中「…」；失败后才显示「—」（INTERACTION.md §3）
    expect(heat.heatLabel(slug)).toBe('热度 …')
  }
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('离线')))
  expect(await heat.loadHeat()).toBe(false)
  expect(Object.getPrototypeOf(heat.heatState.values)).toBe(null)
  expect(heat.heatLabel('constructor')).toBe('热度 —')
})

it('加载热度后仍为无原型对象，只接受自身有效数值，缺失 constructor 为 0', async () => {
  const values = Object.assign(Object.create({ inherited: 99 }), { valid: 3, bad: -1, string: '4' })
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => ({ ok: true, heat: values }) })))
  expect(await heat.loadHeat()).toBe(true)
  expect(Object.getPrototypeOf(heat.heatState.values)).toBe(null)
  expect(Object.keys(heat.heatState.values)).toEqual(['valid'])
  expect(heat.heatLabel('constructor')).toBe('热度 0')
  expect(heat.heatState.values.inherited).toBeUndefined()
})

it('合法 slug constructor 的 stats 和 click 数字正常更新，不污染原型', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => Response.json({ ok: true, heat: { constructor: 4 } })))
  expect(await heat.loadHeat()).toBe(true)
  expect(heat.heatLabel('constructor')).toBe('热度 4')
  fetch.mockResolvedValueOnce(Response.json({ ok: true, heat: 5 }))
  heat.reportClick('constructor', 'import')
  await vi.waitFor(() => expect(heat.heatLabel('constructor')).toBe('热度 5'))
  expect(Object.getPrototypeOf(heat.heatState.values)).toBe(null)
})
