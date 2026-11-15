import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ROOT } from '../../scripts/lib/load-bots.mjs'
import config from '../../site/.vitepress/config.mts'
import { HERO_MASCOTS } from '../../site/.vitepress/meta.mjs'
import { XAI_SHAPE_IDS, shapeRadii } from '../../site/.vitepress/theme/face'
import { contrast } from '../../site/.vitepress/theme/color'
import { BotEngine } from '../../site/.vitepress/theme/vendor/bloub/engine'
import { RAYON } from '../../site/.vitepress/theme/vendor/bloub/repere'
import {
  FAVICON_COLORS, FAVICON_DEFAULT, FAVICON_EYE, FAVICON_FACE, FAVICON_GAZE, FAVICON_MORPH, FAVICON_SHAPES, FAVICON_SWAP_MS,
  faviconHref, faviconLook, faviconStill, faviconSvg, mixColor, morphAt, pickFaviconBot, startFavicon,
} from '../../site/.vitepress/theme/live/favicon'

/** 把一张图标 SVG 拆开：镜头、身体外框、眼睛的变换矩阵。 */
function parse(svg) {
  const [, viewBox] = svg.match(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="([^"]+)">/)
  const [left, top, width, height] = viewBox.split(' ').map(Number)
  const [, d] = svg.match(/<defs><clipPath id="b"><path id="p" d="([^"]+)"\/><\/clipPath><\/defs>/)
  const [, fill] = svg.match(/<use href="#p" fill="([^"]+)"\/>/)
  const numbers = d.match(/-?\d+(?:\.\d+)?/g).map(Number)
  const xs = numbers.filter((_, i) => i % 2 === 0), ys = numbers.filter((_, i) => i % 2 === 1)
  const [, eyeFill, eyeMarkup] = svg.match(/<g fill="([^"]+)" clip-path="url\(#b\)">(.*)<\/g><\/svg>$/)
  const eyes = [...eyeMarkup.matchAll(/<path d="[^"]+" transform="matrix\(([^)]+)\)"( opacity="[^"]+")?\/>/g)]
    .map((match) => ({ matrix: match[1].split(',').map(Number), faded: Boolean(match[2]) }))
  return {
    left, top, width, height, fill, d, numbers, eyeFill, eyes,
    box: { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) },
  }
}
const sequence = (...values) => { let i = 0; return () => values[i++ % values.length] }

describe('名单：颜色和形状', () => {
  it('颜色就是招牌吉祥物那一套；在浅色、深色标签栏上都分得出，黑眼睛压得住', () => {
    expect(FAVICON_COLORS).toEqual(HERO_MASCOTS.map((mascot) => mascot.color))
    expect(new Set(FAVICON_COLORS).size).toBe(FAVICON_COLORS.length)
    for (const color of FAVICON_COLORS) {
      expect(color).toMatch(/^#[0-9a-f]{6}$/)
      expect(contrast(color, '#ffffff'), `${color} 对浅色标签栏`).toBeGreaterThan(1.8)
      expect(contrast(color, '#202124'), `${color} 对深色标签栏`).toBeGreaterThan(1.8)
      expect(contrast(color, FAVICON_EYE), `${color} 对眼睛`).toBeGreaterThan(3)
    }
  })
  it('形状都是官方形状名、都有轮廓数据、互不重复，轮廓也互不相同', () => {
    expect(FAVICON_SHAPES.length).toBeGreaterThanOrEqual(12)
    expect(new Set(FAVICON_SHAPES).size).toBe(FAVICON_SHAPES.length)
    const outlines = FAVICON_SHAPES.map((shape) => {
      expect(XAI_SHAPE_IDS).toContain(shape)
      expect(shapeRadii(shape), shape).not.toBeNull()
      return shapeRadii(shape)
    })
    expect(new Set(outlines).size).toBe(outlines.length)
  })
  it('静态图标那只在名单里', () => {
    expect(FAVICON_SHAPES).toContain(FAVICON_DEFAULT.shape)
    expect(FAVICON_COLORS).toContain(FAVICON_DEFAULT.color)
  })
  it('两次变身的间隔在几秒这个量级，且下限小于上限', () => {
    expect(FAVICON_SWAP_MS[0]).toBeGreaterThanOrEqual(3000)
    expect(FAVICON_SWAP_MS[1]).toBeGreaterThan(FAVICON_SWAP_MS[0])
    expect(FAVICON_SWAP_MS[1]).toBeLessThanOrEqual(15000)
  })
})

describe('随机挑一只', () => {
  it('形状、颜色都和上一只不同；随机数取到两端也不越界', () => {
    for (const value of [0, 0.5, 0.999999, 1]) {
      for (const shape of FAVICON_SHAPES) {
        for (const color of FAVICON_COLORS) {
          const next = pickFaviconBot(() => value, { shape, color })
          expect(FAVICON_SHAPES).toContain(next.shape)
          expect(FAVICON_COLORS).toContain(next.color)
          expect(next.shape).not.toBe(shape)
          expect(next.color).not.toBe(color)
        }
      }
    }
  })
  it('没有上一只时全部名单都抽得到', () => {
    const shapes = new Set(), colors = new Set()
    for (let i = 0; i < 200; i++) {
      const bot = pickFaviconBot(sequence(i / 200, ((i * 7) % 200) / 200))
      shapes.add(bot.shape)
      colors.add(bot.color)
    }
    expect(shapes.size).toBe(FAVICON_SHAPES.length)
    expect(colors.size).toBe(FAVICON_COLORS.length)
  })
})

describe('画一帧', () => {
  it.each(FAVICON_SHAPES)('%s：正方形镜头贴着身体留边，两只睁开的深色眼睛都在身体外框里', (shape) => {
    const svg = faviconStill({ shape, color: '#8b5cf6' })
    const { left, top, width, height, fill, d, box, eyeFill, eyes } = parse(svg)
    expect(width).toBe(height)
    expect(fill).toBe('#8b5cf6')
    expect(eyeFill).toBe(FAVICON_EYE)
    expect(d).not.toMatch(/\.\d/) // 身体坐标取整
    // 身体四边都在镜头里，较长的一边占镜头的 85%–90%。
    expect(box.minX).toBeGreaterThan(left)
    expect(box.maxX).toBeLessThan(left + width)
    expect(box.minY).toBeGreaterThan(top)
    expect(box.maxY).toBeLessThan(top + height)
    const fillRatio = Math.max(box.maxX - box.minX, box.maxY - box.minY) / width
    expect(fillRatio).toBeGreaterThan(0.85)
    expect(fillRatio).toBeLessThanOrEqual(0.9)
    // 外框居中，偏差不超过 1 个单位（取整带来的）。
    expect(Math.abs((box.minX + box.maxX) / 2 - (left + width / 2))).toBeLessThanOrEqual(1)
    expect(Math.abs((box.minY + box.maxY) / 2 - (top + height / 2))).toBeLessThanOrEqual(1)
    expect(eyes).toHaveLength(2)
    for (const eye of eyes) {
      expect(eye.faded).toBe(false)
      const [, , , , x, y] = eye.matrix
      expect(x).toBeGreaterThan(box.minX)
      expect(x).toBeLessThan(box.maxX)
      expect(y).toBeGreaterThan(box.minY)
      expect(y).toBeLessThan(box.maxY)
    }
    // 左右眼分开，且基本水平。
    expect(Math.abs(eyes[0].matrix[4] - eyes[1].matrix[4])).toBeGreaterThan(width * 0.15)
    expect(Math.abs(eyes[0].matrix[5] - eyes[1].matrix[5])).toBeLessThan(width * 0.05)
  })
  it('小图标的眼睛比页面里的大，正对前方', () => {
    expect(FAVICON_FACE.eyes[0].w).toBeGreaterThan(0.21)
    expect(FAVICON_FACE.eyes[0].h).toBeGreaterThan(0.44)
    expect(FAVICON_FACE.eyes).toHaveLength(2)
    expect(FAVICON_FACE.eyes[0].w).toBe(FAVICON_FACE.eyes[1].w)
    expect(FAVICON_FACE.gaze.yaw).toBe(0)
  })
  it('眨眼只压竖直方向，位置和横向不动；睁开时原样输出', () => {
    const engine = new BotEngine(RAYON, 'idle', shapeRadii('blob'), FAVICON_FACE)
    const frame = engine.sample(0)
    const open = parse(faviconSvg(frame, '#ff6a13')), shut = parse(faviconSvg(frame, '#ff6a13', 0))
    expect(parse(faviconSvg(frame, '#ff6a13', 1)).eyes).toEqual(open.eyes)
    expect(shut.d).toBe(open.d)
    for (let i = 0; i < 2; i++) {
      const [a, b, c, d, e, f] = open.eyes[i].matrix, [a2, b2, c2, d2, e2, f2] = shut.eyes[i].matrix
      expect([a2, c2, e2, f2]).toEqual([a, c, e, f])
      expect(Math.abs(d2)).toBeLessThan(Math.abs(d) * 0.1)
      expect(Math.abs(b2)).toBeLessThanOrEqual(Math.abs(b))
    }
  })
  it('data 地址能原样解回 SVG', () => {
    const svg = faviconStill(FAVICON_DEFAULT)
    const href = faviconHref(svg)
    expect(href.startsWith('data:image/svg+xml,')).toBe(true)
    expect(decodeURIComponent(href.slice('data:image/svg+xml,'.length))).toBe(svg)
    expect(href).not.toMatch(/[#<>" ]/)
  })
})

describe('视线跟随', () => {
  const W = 1280, H = 800
  it('视口正中平视；左右、上下到边时转到各自的上限', () => {
    expect(faviconLook(W / 2, H / 2, W, H)).toEqual({ yaw: 0, pitch: 0, mix: 1, spin: 0, wander: 0 })
    expect(faviconLook(0, H / 2, W, H).yaw).toBe(-FAVICON_GAZE.yaw)
    expect(faviconLook(W, H / 2, W, H).yaw).toBe(FAVICON_GAZE.yaw)
    expect(faviconLook(W / 2, 0, W, H).pitch).toBe(FAVICON_GAZE.up)
    expect(faviconLook(W / 2, H, W, H).pitch).toBe(-FAVICON_GAZE.down)
  })
  it('分成 9 × 5 格：同一格里挪动视线不变，越界的位置按边缘算，尺寸为 0 时平视', () => {
    const yaws = new Set(), pitches = new Set()
    for (let x = 0; x <= W; x += 8) yaws.add(faviconLook(x, H / 2, W, H).yaw)
    for (let y = 0; y <= H; y += 8) pitches.add(faviconLook(W / 2, y, W, H).pitch)
    expect(yaws.size).toBe(9)
    expect(pitches.size).toBe(5)
    expect(faviconLook(W * 0.51, H * 0.52, W, H)).toEqual(faviconLook(W / 2, H / 2, W, H))
    expect(faviconLook(-500, -500, W, H)).toEqual(faviconLook(0, 0, W, H))
    expect(faviconLook(9999, 9999, W, H)).toEqual(faviconLook(W, H, W, H))
    for (const look of [faviconLook(10, 10, 0, 0), faviconLook(NaN, NaN, W, H)]) {
      expect(look).toEqual({ yaw: 0, pitch: 0, mix: 1, spin: 0, wander: 0 })
    }
  })
  it.each(FAVICON_SHAPES)('%s：往右看眼睛在右、往左看在左、往下看更低，转到上限两只眼睛的中心仍在身体外框里', (shape) => {
    const eyesAt = (x, y) => {
      const engine = new BotEngine(RAYON, 'idle', shapeRadii(shape), FAVICON_FACE)
      engine.setLook(faviconLook(x, y, W, H), 0, 0.001)
      const { eyes, box } = parse(faviconSvg(engine.sample(0.01), '#14b8a6'))
      expect(eyes).toHaveLength(2)
      for (const eye of eyes) {
        expect(eye.matrix[4]).toBeGreaterThan(box.minX)
        expect(eye.matrix[4]).toBeLessThan(box.maxX)
        expect(eye.matrix[5]).toBeGreaterThan(box.minY)
        expect(eye.matrix[5]).toBeLessThan(box.maxY)
      }
      return { x: (eyes[0].matrix[4] + eyes[1].matrix[4]) / 2, y: (eyes[0].matrix[5] + eyes[1].matrix[5]) / 2 }
    }
    const left = eyesAt(0, H / 2), right = eyesAt(W, H / 2), top = eyesAt(W / 2, 0), bottom = eyesAt(W / 2, H)
    expect(right.x - left.x).toBeGreaterThan(30) // 228 单位宽的图标上至少挪 30，16px 下约 2px
    expect(bottom.y - top.y).toBeGreaterThan(20)
    for (const corner of [[0, 0], [W, 0], [0, H], [W, H]]) eyesAt(...corner)
  })
})

describe('变身过渡', () => {
  it('颜色两端精确；互补色的中间色仍然鲜艳，不发灰', () => {
    expect(mixColor('#34d399', '#ff2e93', 0)).toBe('#34d399')
    expect(mixColor('#34d399', '#ff2e93', 1)).toBe('#ff2e93')
    for (const [from, to] of [['#34d399', '#ff2e93'], ['#ff6a13', '#14b8a6'], ['#8b5cf6', '#f5a623']]) {
      for (const k of [0.25, 0.5, 0.75]) {
        const mid = mixColor(from, to, k)
        expect(mid).toMatch(/^#[0-9a-f]{6}$/)
        const [r, g, b] = [1, 3, 5].map((i) => parseInt(mid.slice(i, i + 2), 16))
        expect(Math.max(r, g, b) - Math.min(r, g, b), `${from}→${to} @${k} = ${mid}`).toBeGreaterThan(110)
      }
    }
  })
  it('节奏：从头到尾单调推进，正中间闭眼，头尾睁眼，结束时刻正好是引擎形状过渡的终点', () => {
    expect(morphAt(3, 0)).toEqual({ at: 3, progress: 0, lid: 1 })
    expect(morphAt(3, 1)).toEqual({ at: 3 + BotEngine.SHAPE_MORPH, progress: 1, lid: 1 })
    expect(morphAt(3, 0.5).lid).toBe(0)
    expect(morphAt(3, 0.5).progress).toBeCloseTo(0.5)
    let previous = morphAt(0, 0)
    for (let k = 0.05; k <= 1.0001; k += 0.05) {
      const now = morphAt(0, k)
      expect(now.at).toBeGreaterThan(previous.at)
      expect(now.progress).toBeGreaterThan(previous.progress)
      previous = now
    }
    expect(FAVICON_MORPH).toBeGreaterThan(0.3)
    expect(FAVICON_MORPH).toBeLessThan(1)
  })
  it('按 60ms 一帧取样时，相邻两帧的形状变化量没有哪一帧独占一半以上', () => {
    const steps = []
    for (let ms = 0; ms <= FAVICON_MORPH * 1000; ms += 60) steps.push(morphAt(0, ms / 1000 / FAVICON_MORPH).progress)
    steps.push(1)
    for (let i = 1; i < steps.length; i++) expect(steps[i] - steps[i - 1]).toBeLessThan(0.5)
    expect(steps.length).toBeGreaterThanOrEqual(8)
  })
})

describe('静态图标和页面 head', () => {
  const publicFile = (name) => readFileSync(join(ROOT, 'site/public', name))
  it('favicon.svg 跟上了代码（没跟上就运行 npm run gen:favicon）', () => {
    expect(publicFile('favicon.svg').toString('utf8')).toBe(`${faviconStill(FAVICON_DEFAULT)}\n`)
  })
  it('favicon.ico 是装着一张 32×32 PNG 的图标文件', () => {
    const ico = publicFile('favicon.ico')
    expect([ico.readUInt16LE(0), ico.readUInt16LE(2), ico.readUInt16LE(4)]).toEqual([0, 1, 1])
    expect([ico.readUInt8(6), ico.readUInt8(7)]).toEqual([32, 32])
    const offset = ico.readUInt32LE(18)
    expect(ico.readUInt32LE(14)).toBe(ico.length - offset)
    expect(ico.subarray(offset, offset + 8).toString('hex')).toBe('89504e470d0a1a0a')
    expect([ico.readUInt32BE(offset + 16), ico.readUInt32BE(offset + 20)]).toEqual([32, 32])
  })
  it('apple-touch-icon.png 是 180×180 的不透明 PNG', () => {
    const png = publicFile('apple-touch-icon.png')
    expect(png.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a')
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([180, 180])
    expect(png.readUInt8(25)).toBe(2) // 颜色类型 2 = RGB，没有透明通道
  })
  it('站点 head 声明了三个静态图标，.ico 带 sizes', () => {
    const links = config.head.filter(([tag]) => tag === 'link').map(([, attrs]) => attrs)
    expect(links).toContainEqual({ rel: 'icon', href: '/favicon.ico', sizes: '32x32' })
    expect(links).toContainEqual({ rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' })
    expect(links).toContainEqual({ rel: 'apple-touch-icon', href: '/apple-touch-icon.png' })
  })
  it('服务端渲染时 startFavicon 是空操作', () => {
    expect(typeof document).toBe('undefined')
    const stop = startFavicon()
    expect(typeof stop).toBe('function')
    expect(() => stop()).not.toThrow()
  })
})
