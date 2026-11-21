import { botFace, faceColors, shapeRadii } from '../../site/.vitepress/theme/face.ts'
import { BotEngine } from '../../site/.vitepress/theme/vendor/bloub/engine.ts'
import { EXPRESSION_BY_ID } from '../../site/.vitepress/theme/vendor/bloub/expressions.ts'
import { RAYON } from '../../site/.vitepress/theme/vendor/bloub/repere.ts'
import { HERO_MASCOTS } from '../../site/.vitepress/meta.mjs'

function face({ color, radii }, { x, y, size }) {
  const frame = new BotEngine(RAYON, 'idle', radii, EXPRESSION_BY_ID.get('attentif')).sample(0)
  const eyes = frame.eyes.map(e => `<path fill="#16161b" d="${e.d}" transform="${e.matrix}" opacity="${e.alpha}"/>`).join('')
  return `<g transform="translate(${x} ${y}) scale(${size / 224})"><path fill="${faceColors(color).dark}" d="${frame.bodyPath}"/>${eyes}</g>`
}
function glow(id, x, y, rx, ry, color, opacity) {
  return `<defs><radialGradient id="${id}"><stop stop-color="${color}" stop-opacity="${opacity}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient></defs><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#${id})"/>`
}
export function squadPositions(n) {
  if (n <= 3) return Array.from({ length: n }, (_, i) => ({ size: 200, x: 330 + (i - (n - 1) / 2) * 170, y: 315 }))
  const top = Math.ceil(n / 2)
  // 以左侧格点为起点，下行总是错半格；再把整组的包围盒对准舞台中央。
  const width = Math.max((top - 1) * 150, (n - top - 1) * 150 + 75)
  return Array.from({ length: n }, (_, i) => ({ size: 170, x: 330 - width / 2 + (i < top ? i * 150 : (i - top) * 150 + 75), y: i < top ? 245 : 385 }))
}
export function stage(kind, data) {
  if (kind === 'bot') {
    const f = botFace(data.slug)
    return glow('halo', 330, 315, 340, 340, faceColors(f.color).dark, .45) + face(f, { x: 330, y: 315, size: 340 })
  }
  if (kind === 'squad') {
    const faces = data.members.map(m => botFace(m.bot)), positions = squadPositions(faces.length)
    return faces.slice(0, 2).map((f, i) => glow(`halo${i}`, 240 + 180 * i, 315, 300, 300, faceColors(f.color).dark, .4)).join('') + faces.map((f, i) => face(f, positions[i])).join('')
  }
  return glow('halo', 600, 190, 300, 145, '#fff', .06) + HERO_MASCOTS.map(({ shape, color }, i) => face({ radii: shapeRadii(shape), color }, { x: 600 + (i - (HERO_MASCOTS.length - 1) / 2) * 112, y: 190, size: 88 })).join('')
}
