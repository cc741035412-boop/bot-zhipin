import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { SITE, SQUAD_COPY } from '../../site/.vitepress/meta.mjs'
import { displayName, originalName } from '../lib/bot-name.mjs'
import { OG_SIZE } from '../lib/share.mjs'
import { bodyLines, cleanText, nameLayout } from './text.mjs'
import { stage } from './stage.mjs'

const host = new URL(SITE.url).host
const dim = '#9c9c9d', grey = '#8b8c8f', bright = '#e4e4e7'
const brandBottom = OG_SIZE.height - 64, brandTop = brandBottom - 34
const div = (style, children) => ({ type: 'div', props: { style: { display: 'flex', ...style }, children } })

// 所有投稿文字仅作为 Satori 的文本子节点。SVG 的其他部分只使用本地引擎的路径和配色。
export function layout(kind, data, metrics) {
  const nodes = [], missing = new Set()
  let emoji = false
  const clean = (text, weight = 500) => {
    const result = cleanText(text, metrics[weight]); emoji ||= result.emoji
    result.missing.forEach(ch => missing.add(ch))
    return result.value
  }
  const row = (text, x, y, height, size, weight, color, extra) => nodes.push(div({ position: 'absolute', left: x, top: y, height, alignItems: 'center', fontSize: size, fontWeight: weight, color, whiteSpace: 'pre', ...extra }, text))
  const center = { width: OG_SIZE.width, justifyContent: 'center' }
  if (kind === 'site') {
    row(clean(SITE.name, 700), 0, 262, 112 * 1.15, 112, 700, '#fff', center)
    const lines = bodyLines(clean(SITE.tagline), metrics[500], 34, 2, 960)
    lines.forEach((line, i) => row(line, 0, 262 + 112 * 1.15 + 28 + 34 * 1.45 * i, 34 * 1.45, 34, 500, dim, center))
    row(clean(host), 0, brandBottom - 27, 27, 22, 500, grey, center)
  } else {
    const squad = kind === 'squad', blocks = []
    const block = (lines, size, weight, color, leading, gap = 0, style) => blocks.push({ lines, size, weight, color, h: size * leading, gap, style })
    if (squad) block([clean(SQUAD_COPY.tag)], 24, 500, bright, 1.7, 0, { backgroundColor: 'rgba(255,255,255,.08)', borderRadius: 100, padding: '6px 16px' })
    const name = nameLayout(clean(squad ? data.name : displayName(data), 700), metrics[700], squad)
    block(name.lines, name.size, 700, '#fff', 1.15, squad ? 22 : 0)
    const original = !squad && clean(originalName(data))
    if (original) block(bodyLines(original, metrics[500], 34, 1), 34, 500, dim, 1.2, 14)
    const size = squad ? 34 : 36
    block(bodyLines(clean(data.tagline), metrics[500], size), size, 500, bright, 1.45, squad ? 28 : 36)
    if (squad) block([clean(SQUAD_COPY.count(data.members.length))], 26, 500, dim, 1.2, 24)
    const height = blocks.reduce((h, b) => h + b.gap + b.lines.length * b.h, 0)
    let y = (64 + brandTop - 40 - height) / 2
    for (const b of blocks) {
      y += b.gap
      for (const line of b.lines) { row(line, 600, y, b.h, b.size, b.weight, b.color, b.style); y += b.h }
    }
    const brand = clean(SITE.name, 700)
    row(brand, 600, brandTop, 34, 28, 700, '#fff')
    row(clean(host), 600 + metrics[700].getAdvanceWidth(brand, 28) + 14, brandBottom - 27, 27, 22, 500, grey)
  }
  return { tree: div({ ...OG_SIZE, fontFamily: 'Noto SC' }, nodes), missing: [...missing].join(''), emoji }
}
export async function renderCard(kind, data, { fonts, metrics }) {
  const { tree, missing, emoji } = layout(kind, data, metrics)
  const text = await satori(tree, { ...OG_SIZE, fonts, embedFont: true })
  const { width, height } = OG_SIZE
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#0b0c0e"/>${stage(kind, data)}${text}</svg>`
  const png = new Resvg(svg, { font: { loadSystemFonts: false } }).render().asPng()
  return { png, missing, emoji }
}
