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

describe('接触表静态帧的眼睛包含关系（idle，t=0）', () => {
  for (const id of XAI_SHAPE_IDS) {
    it(`${id}：两只眼睛的边界都在身体内`, () => {
      const frame = new BotEngine(100, 'idle', shapeRadii(id)).sample(0)
      const body = contour(frame.bodyPath)
      for (const eye of frame.eyes) {
        const outside = eyeBoundary(eye).filter((point) => !inside(point, body))
        expect(outside, `${id} 的眼睛越过身体边界`).toEqual([])
      }
    })
  }
})
