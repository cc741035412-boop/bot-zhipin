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

it.each([['import', 9], ['prompt', 9], ['starter', 4], ['kickoff', 4]])(
  '%s 照常上报，只有 import/prompt 的响应可更新热度', async (kind, expected) => {
    heat.heatState.values.constructor = 4
    const result = { ok: true, counted: true, heat: kind === 'kickoff' ? 0 : 9 }
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => result })))
    heat.reportClick('constructor', kind)
    expect(fetch).toHaveBeenCalledWith('/api/click', expect.objectContaining({
      method: 'POST', keepalive: true, body: JSON.stringify({ slug: 'constructor', kind }),
    }))
    // reportClick 本身不返回请求；等本轮 fetch 和 json 的微任务都走完再看状态。
    await new Promise((resolve) => setImmediate(resolve))
    expect(heat.heatState.values.constructor).toBe(expected)
  },
)
