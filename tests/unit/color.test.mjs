import { describe, expect, test } from 'vitest'
import { contrast, darkSwap, buttonColors, botPalette, CATEGORY_COLORS, CATEGORY_MASCOTS, categoryStyle } from '../../site/.vitepress/theme/color'
import { loadEnums } from '../../scripts/lib/load-bots.mjs'
import { HERO_MASCOTS, CATEGORY_COPY } from '../../site/.vitepress/meta.mjs'
import { shapeRadii } from '../../site/.vitepress/theme/face'

describe('LB6 品牌与岗位配置', () => {
  test('固定九只（上排五只、下排四只）、橙色在上排正中、形状有效且至少五种、颜色互异', () => {
    expect(HERO_MASCOTS).toHaveLength(9)
    expect(new Set(HERO_MASCOTS.map((m) => m.key)).size).toBe(9)
    expect(new Set(HERO_MASCOTS.map((m) => m.color)).size).toBe(9)
    expect(new Set(HERO_MASCOTS.map((m) => m.shape)).size).toBeGreaterThanOrEqual(5)
    expect(HERO_MASCOTS[2].color).toBe('#ff6a13')
    expect(HERO_MASCOTS.map((m) => m.color)).toEqual(expect.arrayContaining(['#3b82f6', '#f43f5e']))
    for (const mascot of HERO_MASCOTS) {
      expect(Object.keys(mascot).sort()).toEqual(['color', 'key', 'shape'])
      expect(shapeRadii(mascot.shape)).not.toBeNull()
      expect(mascot.color).toMatch(/^#[0-9a-f]{6}$/)
    }
  })
  test('砖墙上相邻的砖（左右和斜向）不同色系', () => {
    // 色相分四个家族：暖橙（含琥珀、棕）、粉红、蓝紫、绿。
    const family = (hex) => {
      const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      const max = Math.max(r, g, b), min = Math.min(r, g, b)
      const h = ((max === r ? ((g - b) / (max - min)) % 6 : max === g ? (b - r) / (max - min) + 2 : (r - g) / (max - min) + 4) * 60 + 360) % 360
      return h < 60 ? '暖橙' : h < 200 ? '绿' : h < 290 ? '蓝紫' : '粉红'
    }
    const top = HERO_MASCOTS.slice(0, 5).map((m) => family(m.color)), bottom = HERO_MASCOTS.slice(5).map((m) => family(m.color))
    for (let i = 1; i < top.length; i++) expect(top[i], `上排第 ${i + 1} 只`).not.toBe(top[i - 1])
    for (let i = 1; i < bottom.length; i++) expect(bottom[i], `下排第 ${i + 1} 只`).not.toBe(bottom[i - 1])
    // 下排错开半格：第 i 只夹在上排第 i、i+1 只中间。
    bottom.forEach((value, i) => { expect(value).not.toBe(top[i]); expect(value).not.toBe(top[i + 1]) })
  })
  test('岗位枚举是固定顺序的 7 个', () => {
    expect(loadEnums().categories).toEqual(['产品', '市场', '销售', '内容', '运营', '管家', '个人'])
  })
  test('每个岗位一只吉祥物：完整覆盖 schema，和招牌里对应那只同色同形，颜色形状都不重复', () => {
    const categories = loadEnums().categories
    expect(Object.keys(CATEGORY_MASCOTS).sort()).toEqual([...categories].sort())
    for (const category of categories) {
      const mascot = CATEGORY_MASCOTS[category]
      expect(Object.keys(mascot).sort()).toEqual(['color', 'shape'])
      expect(HERO_MASCOTS.filter((hero) => hero.shape === mascot.shape && hero.color === mascot.color), category).toHaveLength(1)
      expect(CATEGORY_COLORS[category]).toBe(mascot.color)
    }
    expect(new Set(Object.values(CATEGORY_MASCOTS).map((m) => m.color)).size).toBe(categories.length)
    expect(new Set(Object.values(CATEGORY_MASCOTS).map((m) => m.shape)).size).toBe(categories.length)
    expect(CATEGORY_MASCOTS['产品']).toEqual({ shape: 'blob', color: '#ff6a13' })
    expect(CATEGORY_MASCOTS['个人']).toEqual({ shape: 'teardrop', color: '#34d399' })
  })
  test('每个岗位一句说明：完整覆盖 schema，都是非空文字', () => {
    expect(Object.keys(CATEGORY_COPY).sort()).toEqual([...loadEnums().categories].sort())
    for (const copy of Object.values(CATEGORY_COPY)) expect(copy).toMatch(/\S{4,}/)
    expect(CATEGORY_COPY['管家']).toBe('管你的 Bot：省额度、备份、接飞书、派活')
  })
  test('岗位色完整覆盖 schema，无重复颜色，未知岗位安全回退', () => {
    expect(Object.keys(CATEGORY_COLORS).sort()).toEqual([...loadEnums().categories].sort())
    expect(new Set(Object.values(CATEGORY_COLORS)).size).toBe(loadEnums().categories.length)
    for (const [name, color] of Object.entries(CATEGORY_COLORS)) {
      expect(categoryStyle(name)).toEqual({ '--bz-category-color': color })
    }
    expect(categoryStyle('__proto__')).toEqual({ '--bz-category-color': '#8a8a93' })
  })
})

describe('Bot sRGB 配色', () => {
  test('WCAG 端点、对称性与已知中间值', () => {
    expect(contrast('#000000', '#ffffff')).toBe(21)
    expect(contrast('#123456', '#123456')).toBe(1)
    expect(contrast('#ffffff', '#777777')).toBeCloseTo(4.478, 3)
    expect(contrast('#abcdef', '#141418')).toBe(contrast('#141418', '#abcdef'))
    expect(contrast('#fff', '#000')).toBe(21)
  })
  test('仅相对亮度低于 .04 的色在深色模式替换', () => {
    expect(darkSwap('#000000')).toBe('#f1efe9')
    expect(darkSwap('#383838')).toBe('#f1efe9')
    expect(darkSwap('#393939')).toBe('#393939')
    expect(darkSwap('#ABCDEF')).toBe('#abcdef')
  })
  test('选高对比文字；必要时每步混合 4%，而非任意改色', () => {
    expect(buttonColors('#000000')).toEqual({ bg: '#000000', fg: '#ffffff' })
    expect(buttonColors('#FFFFFF')).toEqual({ bg: '#ffffff', fg: '#141418' })
    expect(buttonColors('#777777')).toEqual({ bg: '#727272', fg: '#ffffff' })
    expect(buttonColors('#7b7b7b')).toEqual({ bg: '#808080', fg: '#141418' })
    expect(buttonColors('#f97316').bg).toBe('#f97316')
  })
  test('遍历 RGB 色域采样，两主题按钮都满足 4.5 且无副作用', () => {
    for (let r = 0; r <= 255; r += 17) for (let g = 0; g <= 255; g += 17) for (let b = 0; b <= 255; b += 17) {
      const hex = `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`
      const palette = botPalette(hex)
      for (const mode of ['light', 'dark']) {
        expect(contrast(palette[`--bz-btn-bg-${mode}`], palette[`--bz-btn-fg-${mode}`])).toBeGreaterThanOrEqual(4.5)
      }
      expect(Object.values(palette).every((v) => /^#[0-9a-f]{6}$/.test(v))).toBe(true)
    }
  })
  test('作用域同时提供浅深两组变量，输入不变且重复调用一致', () => {
    const palette = botPalette('#141418')
    expect(palette).toEqual({
      '--bz-bot-light': '#141418', '--bz-bot-dark': '#f1efe9',
      '--bz-btn-bg-light': '#141418', '--bz-btn-fg-light': '#ffffff',
      '--bz-btn-bg-dark': '#f1efe9', '--bz-btn-fg-dark': '#141418',
    })
    expect(botPalette('#141418')).toEqual(palette)
    expect(() => buttonColors('red')).toThrow(TypeError)
  })
})
