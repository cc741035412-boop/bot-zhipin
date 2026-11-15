import { describe, it, expect } from 'vitest'
import { XAI_SHAPE_IDS, shapeRadii } from '../../site/.vitepress/theme/face'
import { BotEngine } from '../../site/.vitepress/theme/vendor/bloub/engine'

const numbers = (text) => (text.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? []).map(Number)

// Flatten the engine's M/C/Z body path, rather than assuming that the interpolated
// contour equals its 64 control samples. This catches the contact-sheet eye leaks.
function contour(path) {
  const points = []
  let last
  for (const [, command, args] of path.matchAll(/([MC])([^MCZ]+)/g)) {
    const v = numbers(args)
    if (command === 'M') {
      last = v
      points.push(v)
      continue
    }
    for (let i = 1; i <= 32; i++) {
      const t = i / 32, u = 1 - t
      points.push([0, 1].map((axis) => u ** 3 * last[axis] + 3 * u ** 2 * t * v[axis] +
        3 * u * t ** 2 * v[axis + 2] + t ** 3 * v[axis + 4]))
    }
    last = v.slice(4)
  }
  return points
}

function inside([x, y], polygon) {
  let found = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [ax, ay] = polygon[i], [bx, by] = polygon[j]
    if ((ay > y) !== (by > y) && x < (bx - ax) * (y - ay) / (by - ay) + ax) found = !found
  }
  return found
}

function clearance(point, polygon) {
  const [x, y] = point
  let minimum = Infinity
  for (let i = 0; i < polygon.length; i++) {
    const [ax, ay] = polygon[i], [bx, by] = polygon[(i + 1) % polygon.length]
    const dx = bx - ax, dy = by - ay
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy || 1)))
    minimum = Math.min(minimum, Math.hypot(x - ax - t * dx, y - ay - t * dy))
  }
  return minimum
}

function eyeBoundary(eye) {
  // idle(0) uses vertical capsules: infer dimensions from the emitted path,
  // never duplicate or alter vendor eye-position parameters.
  const [left, topArc] = numbers(eye.d.match(/^M([^A]+)/)[1])
  const [radius] = numbers(eye.d.match(/A([^L]+)/)[1])
  expect(-left).toBeCloseTo(radius, 2)
  const halfSegment = -topArc
  const points = Array.from({ length: 128 }, (_, i) => {
    const a = (i + 0.5) * Math.PI * 2 / 128
    return [radius * Math.cos(a), Math.sign(Math.sin(a)) * halfSegment + radius * Math.sin(a)]
  })
  for (let i = 0; i <= 32; i++) {
    const y = -halfSegment + 2 * halfSegment * i / 32
    points.push([radius, y], [-radius, y])
  }
  const [a, b, c, d, e, f] = numbers(eye.matrix)
  return points.map(([x, y]) => [a * x + c * y + e, b * x + d * y + f])
}

const at = (r, i) => r[(i + r.length) % r.length]
function centroidOffset(r) {
  // Polar area integration: area ∝ r², first moment ∝ 2r³/3.
  const area = r.reduce((sum, v) => sum + v * v, 0)
  const moment = (fn) => r.reduce((sum, v, i) => sum + 2 / 3 * v ** 3 * fn(i * 2 * Math.PI / r.length), 0)
  return Math.hypot(moment(Math.cos), moment(Math.sin)) / area
}

describe('圆角、重心与朝向', () => {
  for (const id of XAI_SHAPE_IDS) {
    it(`${id}：二阶差分 ≤ 0.21，重心偏移 ≤ 0.13`, () => {
      const r = shapeRadii(id)
      expect(Math.max(...r.map((v, i) => Math.abs(at(r, i - 1) - 2 * v + at(r, i + 1))))).toBeLessThanOrEqual(0.21)
      expect(centroidOffset(r)).toBeLessThanOrEqual(0.13)
    })
  }
  for (const id of ['star', 'heart', 'house', 'shield', 'gem', 'crystal', 'dome', 'arch', 'cylinder', 'sparkle', 'clover', 'flower']) {
    it(`${id}：左右镜像差 ≤ 0.02`, () => {
      const r = shapeRadii(id)
      expect(Math.max(...r.map((v, i) => Math.abs(v - at(r, 32 - i))))).toBeLessThanOrEqual(0.02)
    })
  }
  it('星形顶角正立，心形上凹下尖，叶形保持斜轴对称', () => {
    const star = shapeRadii('star'), heart = shapeRadii('heart'), leaf = shapeRadii('leaf')
    expect([47, 48, 49]).toContain(star.indexOf(Math.max(...star)))
    expect(heart[48]).toBeLessThan(Math.min(heart[44], heart[52]) - 0.05)
    expect(heart[16]).toBeGreaterThanOrEqual(0.85 * Math.max(...heart))
    const gap = (axis) => Math.max(...leaf.map((v, i) => Math.abs(v - at(leaf, axis - i))))
    expect(Math.min(gap(48), gap(16))).toBeLessThanOrEqual(0.03)
  })
})

describe('接触表静态帧的眼睛包含关系（idle，t=0）', () => {
  for (const id of XAI_SHAPE_IDS) {
    it(`${id}：两只眼睛的边界都在身体内`, () => {
      const frame = new BotEngine(100, 'idle', shapeRadii(id)).sample(0)
      const body = contour(frame.bodyPath)
      for (const eye of frame.eyes) {
        const outside = eyeBoundary(eye).filter((point) => !inside(point, body))
        expect(outside, `${id} 的眼睛越过身体边界`).toEqual([])
        // At radius 100, keep a visible gap rather than merely avoiding overlap.
        const gap = Math.min(...eyeBoundary(eye).map((point) => clearance(point, body)))
        expect(gap, `${id} 的眼睛贴边`).toBeGreaterThanOrEqual(2)
      }
    })
  }
})
