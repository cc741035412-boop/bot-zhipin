import { describe, expect, test } from 'vitest'
import { contrast, darkSwap, buttonColors, botPalette, CATEGORY_COLORS, categoryStyle } from '../../site/.vitepress/theme/color'
import { loadEnums } from '../../scripts/lib/load-bots.mjs'
import { HERO_MASCOTS } from '../../site/.vitepress/meta.mjs'
import { shapeRadii } from '../../site/.vitepress/theme/face'

describe('LB6 品牌与分类配置', () => {
  test('固定七只、橙色居中、形状有效且至少五种、颜色互异', () => {
    expect(HERO_MASCOTS).toHaveLength(7)
    expect(new Set(HERO_MASCOTS.map((m) => m.key)).size).toBe(7)
    expect(new Set(HERO_MASCOTS.map((m) => m.color)).size).toBe(7)
    expect(new Set(HERO_MASCOTS.map((m) => m.shape)).size).toBeGreaterThanOrEqual(5)
    expect(HERO_MASCOTS[3].color).toBe('#ff6a13')
    for (const mascot of HERO_MASCOTS) {
      expect(Object.keys(mascot).sort()).toEqual(['color', 'key', 'shape'])
      expect(shapeRadii(mascot.shape)).not.toBeNull()
      expect(mascot.color).toMatch(/^#[0-9a-f]{6}$/)
    }
  })
  test('分类映射完整覆盖 schema，无重复颜色，未知分类安全回退', () => {
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
