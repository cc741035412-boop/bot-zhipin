// 岗位的颜色和吉祥物只在这里映射；展示的岗位名仍来自 Bot 数据，合法枚举由 schema 校验。
// 每个岗位配一只吉祥物，和 meta.mjs 的 HERO_MASCOTS 里对应那只同色同形（单测保证）。
export const CATEGORY_MASCOTS: Readonly<Record<string, Readonly<{ shape: string; color: string }>>> = Object.freeze({
  '产品': { shape: 'blob', color: '#ff6a13' },
  '市场': { shape: 'sparkle', color: '#ff2e93' },
  '销售': { shape: 'star', color: '#14b8a6' },
  '内容': { shape: 'tablet', color: '#8b5cf6' },
  '运营': { shape: 'hex', color: '#f5a623' },
  '管家': { shape: 'cloud', color: '#3b82f6' },
  '个人': { shape: 'teardrop', color: '#34d399' },
})
// 岗位色就是吉祥物的颜色，不另写一份。
export const CATEGORY_COLORS: Readonly<Record<string, string>> = Object.freeze(
  Object.fromEntries(Object.entries(CATEGORY_MASCOTS).map(([category, mascot]) => [category, mascot.color])),
)
export function categoryStyle(category: string): Record<string, string> {
  return { '--bz-category-color': Object.hasOwn(CATEGORY_COLORS, category) ? CATEGORY_COLORS[category] : '#8a8a93' }
}

// 纯 sRGB 配色函数；服务端与客户端使用同一结果，主题切换只交给 CSS。
function channels(hex: string): number[] {
  const value = hex.toLowerCase()
  const full = /^#[0-9a-f]{3}$/.test(value)
    ? `#${[...value.slice(1)].map((c) => c + c).join('')}` : value
  if (!/^#[0-9a-f]{6}$/.test(full)) throw new TypeError(`Invalid hex color: ${hex}`)
  return [1, 3, 5].map((i) => parseInt(full.slice(i, i + 2), 16))
}
function toHex(rgb: number[]): string {
  return `#${rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`
}
function luminance(hex: string): number {
  const [r, g, b] = channels(hex).map((v) => {
    const s = v / 255
    return s <= .04045 ? s / 12.92 : ((s + .055) / 1.055) ** 2.4
  })
  return .2126 * r + .7152 * g + .0722 * b
}
export function contrast(a: string, b: string): number {
  const x = luminance(a), y = luminance(b)
  return (Math.max(x, y) + .05) / (Math.min(x, y) + .05)
}
export function darkSwap(hex: string): string {
  return luminance(hex) < .04 ? '#f1efe9' : hex.toLowerCase()
}
export function buttonColors(hex: string): { bg: string; fg: string } {
  let bg = toHex(channels(hex))
  const fg = contrast(bg, '#ffffff') >= contrast(bg, '#141418') ? '#ffffff' : '#141418'
  const target = fg === '#ffffff' ? 0 : 255
  while (contrast(bg, fg) < 4.5) {
    bg = toHex(channels(bg).map((v) => v * .96 + target * .04))
  }
  return { bg, fg }
}
export function botPalette(hex: string): Record<string, string> {
  const light = toHex(channels(hex)), dark = darkSwap(light)
  const lightButton = buttonColors(light), darkButton = buttonColors(dark)
  return {
    '--bz-bot-light': light,
    '--bz-bot-dark': dark,
    '--bz-btn-bg-light': lightButton.bg,
    '--bz-btn-fg-light': lightButton.fg,
    '--bz-btn-bg-dark': darkButton.bg,
    '--bz-btn-fg-dark': darkButton.fg,
  }
}
