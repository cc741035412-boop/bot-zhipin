// 首屏球池的小物理（theme/ballpit-physics.ts）：不碰 DOM，直接离线跑。
import { describe, expect, it } from 'vitest'
import { energy, fitRoundBox, makeBody, seeded, separation, step } from '../../site/.vitepress/theme/ballpit-physics'

const STEP = 1 / 120
const world = (bodies, boxes = []) => ({ bodies, boxes, floor: 600, left: 0, right: 900, ceil: -4000, gravity: 2300 })
function drop(count, seed, boxes = []) {
  const random = seeded(seed)
  const bodies = Array.from({ length: count }, (_, i) => {
    // 圆、药片、方块轮着来
    const size = 24 + random() * 30, kind = i % 3
    const body = kind === 0 ? makeBody(0, 0, 0, 0, size) : kind === 1 ? makeBody(0, 0, size * .7, 0, size * .55) : makeBody(0, 0, size * .6, size * .6, size * .3)
    body.x = 80 + random() * 740
    body.y = -100 - i * 90
    body.active = true
    return body
  })
  const scene = world(bodies, boxes)
  let calm = 0, steps = 0
  while (steps < 120 * 20 && calm < 60) { step(scene, STEP); calm = energy(scene) < 6 ? calm + 1 : 0; steps++ }
  return { scene, steps }
}

describe('球池物理', () => {
  it('seeded：同一个种子给出同一串数，都在 [0, 1) 里', () => {
    const a = seeded(42), b = seeded(42), c = seeded(7)
    const first = Array.from({ length: 20 }, () => a())
    expect(Array.from({ length: 20 }, () => b())).toEqual(first)
    expect(Array.from({ length: 20 }, () => c())).not.toEqual(first)
    for (const value of first) { expect(value).toBeGreaterThanOrEqual(0); expect(value).toBeLessThan(1) }
  })

  it('掉下来会落定：都在地板以上、两面墙之间，互相不重叠', () => {
    const { scene, steps } = drop(18, 7)
    expect(steps).toBeLessThan(120 * 20)
    for (const body of scene.bodies) {
      expect(body.y + body.hy + body.r).toBeLessThanOrEqual(scene.floor + 1.5)
      expect(body.x - body.hx - body.r).toBeGreaterThanOrEqual(scene.left - 1.5)
      expect(body.x + body.hx + body.r).toBeLessThanOrEqual(scene.right + 1.5)
    }
    for (let i = 0; i < scene.bodies.length; i++) {
      for (let j = i + 1; j < scene.bodies.length; j++) expect(separation(scene.bodies[i], scene.bodies[j])).toBeGreaterThan(-2)
    }
  })

  it('同一场模拟重跑，落成同一堆（减少动效的快进和会动时是同一个结果）', () => {
    const a = drop(12, 42).scene.bodies.map((body) => [body.x, body.y])
    const b = drop(12, 42).scene.bodies.map((body) => [body.x, body.y])
    expect(b).toEqual(a)
  })

  it('静态碰撞体挡得住：落在盒子上的停在它上面；ghost 的从后面穿过去落到地板', () => {
    const shelf = { x1: 300, y1: 300, x2: 600, y2: 350, r: 12 }
    // 实心的：落在盒子正中，停在它顶上，绝不进到盒子里面
    const solid = makeBody(450, 0, 0, 0, 30)
    solid.active = true
    const above = world([solid], [shelf])
    for (let k = 0; k < 120 * 8; k++) step(above, STEP)
    expect(solid.y + solid.r).toBeLessThanOrEqual(shelf.y1 + 1.5)
    expect(solid.y + solid.r).toBeGreaterThan(shelf.y1 - 3)
    expect(Math.abs(solid.x - 450)).toBeLessThan(40)
    // ghost 的：从盒子后面穿过去，落到地板上；过了盒子以后恢复碰撞
    const ghost = makeBody(450, 0, 0, 0, 30)
    ghost.active = ghost.ghost = true
    const through = world([ghost], [shelf])
    for (let k = 0; k < 120 * 8; k++) step(through, STEP)
    expect(ghost.y).toBeGreaterThan(shelf.y2)
    expect(ghost.y + ghost.r).toBeLessThanOrEqual(through.floor + 1.5)
    expect(ghost.y + ghost.r).toBeGreaterThan(through.floor - 3)
    expect(ghost.ghost).toBe(false)
  })

  it('被抓着的跟着目标走；还没放出来的不参与模拟', () => {
    const held = makeBody(200, 500, 0, 0, 30), waiting = makeBody(700, -50, 0, 0, 30)
    held.active = true
    held.hold = { x: 420, y: 200 }
    const scene = world([held, waiting])
    for (let k = 0; k < 120; k++) step(scene, STEP)
    expect(Math.abs(held.x - 420)).toBeLessThan(6)
    expect(Math.abs(held.y - 200)).toBeLessThan(6)
    expect([waiting.x, waiting.y]).toEqual([700, -50])
  })

  it('fitRoundBox：圆拟合成圆，方块留出圆角，结果不超出外框', () => {
    const circle = Array.from({ length: 72 }, (_, k) => ({ x: 100 * Math.cos(k / 72 * 2 * Math.PI), y: 100 * Math.sin(k / 72 * 2 * Math.PI) }))
    const round = fitRoundBox(circle, 100, 100)
    expect(round.hx + round.r).toBeLessThanOrEqual(100.01)
    expect(round.hy + round.r).toBeLessThanOrEqual(100.01)
    expect(round.r).toBeGreaterThan(60)
    const pill = Array.from({ length: 72 }, (_, k) => { const t = k / 72 * 2 * Math.PI; return { x: 100 * Math.sign(Math.cos(t)) * Math.min(1, Math.abs(Math.cos(t)) * 1.6), y: 50 * Math.sin(t) } })
    const flat = fitRoundBox(pill, 100, 50)
    expect(flat.hx).toBeGreaterThan(flat.hy)
    expect(flat.hx + flat.r).toBeLessThanOrEqual(100.01)
    expect(flat.hy + flat.r).toBeLessThanOrEqual(50.01)
  })
})
