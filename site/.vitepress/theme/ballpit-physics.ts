// 首屏球池的小物理：不旋转的圆角盒刚体（核心盒 hx×hy 外扩半径 r；圆是 hx=hy=0，药片是其中一个为 0）。
// 固定步长、顺序冲量、分离式位置修正；没有第三方依赖，也不碰 DOM，方便离线跑。
// 单位：像素、秒。y 轴向下。

export interface Body {
  x: number; y: number; vx: number; vy: number
  /** 核心盒半宽、半高，以及外扩半径 */
  hx: number; hy: number; r: number
  /** 质量的倒数；拖着的时候临时变重 */
  im: number
  /** 还没放出来（在天上等着）时不参与模拟 */
  active: boolean
  /** 穿过静态碰撞体（从站名和搜索框后面掉下去的那些）；落到它们下面以后自动取消 */
  ghost: boolean
  /** 被抓着时的目标位置 */
  hold: { x: number; y: number } | null
  /** 挤压量（正 = 沿法线被压扁）、它的速度，以及最近一次撞击的法线（指向接触点） */
  sq: number; sqv: number; nx: number; ny: number
  /** 这一步里有没有接触（用来加滚动阻力） */
  touching: boolean
  /** 这一步里脚下支撑点的左右范围：重心落在范围外就该滑下去（不旋转的刚体靠它装作会翻） */
  sl: number; sr: number
}

export interface Box { x1: number; y1: number; x2: number; y2: number; r: number }

export interface World {
  bodies: Body[]
  boxes: Box[]
  floor: number
  left: number
  right: number
  ceil: number
  gravity: number
  /** 上一步各接触的法向冲量，下一步拿来热启动：一摞叠着的才压得住 */
  cache?: Map<number, number>
}

const RESTITUTION = .24
const BOUNCE_MIN = 140        // 低于这个接近速度不反弹，落定后才安静
const FRICTION = .1           // 不旋转的刚体靠低摩擦模拟「会滚」
const ROLL_DAMP = 2.6         // 接触时的切向阻力（每秒）
const AIR_DAMP = .12
const SLOP = .3
const CORRECTION = .7
const VEL_ITERS = 8
const POS_ITERS = 4
const HOLD_STIFF = 26         // 抓着时追目标的速度系数（每秒）
const HOLD_MAX = 4200
const SQ_K = 620, SQ_C = 21, SQ_GAIN = .00006, SQ_MAX = .18
const TIP = .5                // 重心悬空时往外滑的加速度（重力的倍数）

export function makeBody(x: number, y: number, hx: number, hy: number, r: number): Body {
  const area = 4 * hx * hy + 4 * r * (hx + hy) + Math.PI * r * r
  return { x, y, vx: 0, vy: 0, hx, hy, r, im: 1 / Math.max(area, 1), active: false, ghost: false, hold: null, sq: 0, sqv: 0, nx: 0, ny: 1, touching: false, sl: Infinity, sr: -Infinity }
}

interface Contact { a: Body; b: Body | null; nx: number; ny: number; bias: number; jn: number; jt: number; box: Box | null; wall: number; key: number }

// 两个轴对齐核心盒之间的最近特征：法线从 B 指向 A，dist 是核心之间的距离（重叠时为负）。
let cnx = 0, cny = 0, cdist = 0
function cores(ax: number, ay: number, ahx: number, ahy: number, bx1: number, by1: number, bx2: number, by2: number) {
  const gx = Math.max(bx1 - (ax + ahx), (ax - ahx) - bx2)
  const gy = Math.max(by1 - (ay + ahy), (ay - ahy) - by2)
  if (gx <= 0 && gy <= 0) {
    // 核心相交（或点重合）：沿穿透更浅的轴推开
    if (gx > gy) { cnx = ax >= (bx1 + bx2) / 2 ? 1 : -1; cny = 0; cdist = gx }
    else { cnx = 0; cny = ay > (by1 + by2) / 2 ? 1 : -1; cdist = gy }
    return
  }
  const dx = gx > 0 ? ((ax - ahx) > bx2 ? gx : -gx) : 0
  const dy = gy > 0 ? ((ay - ahy) > by2 ? gy : -gy) : 0
  cdist = Math.hypot(dx, dy)
  cnx = dx / cdist; cny = dy / cdist
}

function penetration(c: Contact): number {
  const a = c.a
  if (c.b) {
    const b = c.b
    cores(a.x, a.y, a.hx, a.hy, b.x - b.hx, b.y - b.hy, b.x + b.hx, b.y + b.hy)
    c.nx = cnx; c.ny = cny
    return a.r + b.r - cdist
  }
  if (c.box) {
    const s = c.box
    cores(a.x, a.y, a.hx, a.hy, s.x1 + s.r, s.y1 + s.r, s.x2 - s.r, s.y2 - s.r)
    c.nx = cnx; c.ny = cny
    return a.r + s.r - cdist
  }
  return 0
}

// upper 压在一段核心 x 范围为 [x1, x2] 的东西上；(nx) 是从下面那个指向 upper 的法线横向分量。
function support(upper: Body, x1: number, x2: number, nx: number) {
  const lo = Math.max(upper.x - upper.hx, x1), hi = Math.min(upper.x + upper.hx, x2)
  if (lo <= hi) { upper.sl = Math.min(upper.sl, lo); upper.sr = Math.max(upper.sr, hi); return }
  const point = (upper.x < x1 ? upper.x + upper.hx : upper.x - upper.hx) - nx * upper.r
  upper.sl = Math.min(upper.sl, point); upper.sr = Math.max(upper.sr, point)
}

function impact(body: Body, speed: number, nx: number, ny: number) {
  // 记下撞击：视觉上的挤压弹一下。法线指向接触点。
  if (speed < 180) return
  body.sqv += Math.min(speed, 2400) * SQ_GAIN * 60
  body.nx = nx; body.ny = ny
}

export function step(world: World, dt: number) {
  const { bodies, boxes } = world
  const contacts: Contact[] = []
  for (const b of bodies) {
    if (!b.active) continue
    b.touching = false
    b.sl = Infinity; b.sr = -Infinity
    if (b.hold) {
      let vx = (b.hold.x - b.x) * HOLD_STIFF, vy = (b.hold.y - b.y) * HOLD_STIFF
      const speed = Math.hypot(vx, vy)
      if (speed > HOLD_MAX) { vx *= HOLD_MAX / speed; vy *= HOLD_MAX / speed }
      b.vx = vx; b.vy = vy
    } else {
      b.vy += world.gravity * dt
      const damp = 1 - AIR_DAMP * dt
      b.vx *= damp; b.vy *= damp
    }
    // 挤压是一根欠阻尼的小弹簧
    b.sqv += (-SQ_K * b.sq - SQ_C * b.sqv) * dt
    b.sq += b.sqv * dt
    if (b.sq > SQ_MAX) { b.sq = SQ_MAX; b.sqv = Math.min(b.sqv, 0) }
    if (b.sq < -SQ_MAX * .6) { b.sq = -SQ_MAX * .6; b.sqv = Math.max(b.sqv, 0) }
  }

  // ---- 收集接触 ----
  for (let i = 0; i < bodies.length; i++) {
    const a = bodies[i]
    if (!a.active) continue
    for (let j = i + 1; j < bodies.length; j++) {
      const b = bodies[j]
      if (!b.active) continue
      const reach = a.hx + a.r + b.hx + b.r
      if (Math.abs(a.x - b.x) > reach + 2 || Math.abs(a.y - b.y) > a.hy + a.r + b.hy + b.r + 2) continue
      const c: Contact = { a, b, nx: 0, ny: 0, bias: 0, jn: 0, jt: 0, box: null, wall: 0, key: i * 4096 + j }
      if (penetration(c) > -1) {
        contacts.push(c)
        if (c.ny < -.5) support(a, b.x - b.hx, b.x + b.hx, c.nx)
        else if (c.ny > .5) support(b, a.x - a.hx, a.x + a.hx, -c.nx)
      }
    }
    if (!a.ghost) {
      for (let n = 0; n < boxes.length; n++) {
        const s = boxes[n]
        if (a.x + a.hx + a.r < s.x1 - 2 || a.x - a.hx - a.r > s.x2 + 2 || a.y + a.hy + a.r < s.y1 - 2 || a.y - a.hy - a.r > s.y2 + 2) continue
        const c: Contact = { a, b: null, nx: 0, ny: 0, bias: 0, jn: 0, jt: 0, box: s, wall: 0, key: i * 4096 + 2048 + n }
        if (penetration(c) > -1) {
          contacts.push(c)
          if (c.ny < -.5) support(a, s.x1 + s.r, s.x2 - s.r, c.nx)
        }
      }
    }
    if (a.y + a.hy + a.r > world.floor - 1) { a.sl = -Infinity; a.sr = Infinity }
    if (a.y + a.hy + a.r > world.floor - 1) contacts.push({ a, b: null, nx: 0, ny: -1, bias: 0, jn: 0, jt: 0, box: null, wall: 1, key: i * 4096 + 4000 + 1 })
    if (a.x - a.hx - a.r < world.left + 1) contacts.push({ a, b: null, nx: 1, ny: 0, bias: 0, jn: 0, jt: 0, box: null, wall: 2, key: i * 4096 + 4000 + 2 })
    if (a.x + a.hx + a.r > world.right - 1) contacts.push({ a, b: null, nx: -1, ny: 0, bias: 0, jn: 0, jt: 0, box: null, wall: 3, key: i * 4096 + 4000 + 3 })
    if (a.y - a.hy - a.r < world.ceil + 1) contacts.push({ a, b: null, nx: 0, ny: 1, bias: 0, jn: 0, jt: 0, box: null, wall: 4, key: i * 4096 + 4000 + 4 })
  }

  // 重心不在支撑范围里：往悬空的那一边滑（碰到邻居自然会被接触约束挡住）
  for (const b of bodies) {
    if (!b.active || b.hold || b.sl > b.sr) continue
    if (b.x < b.sl - 1) b.vx -= TIP * world.gravity * dt
    else if (b.x > b.sr + 1) b.vx += TIP * world.gravity * dt
  }

  // ---- 反弹目标速度、撞击记录 ----
  for (const c of contacts) {
    const { a, b } = c
    const vn = (a.vx - (b ? b.vx : 0)) * c.nx + (a.vy - (b ? b.vy : 0)) * c.ny
    c.bias = vn < -BOUNCE_MIN ? -RESTITUTION * vn : 0
    a.touching = true
    if (b) b.touching = true
    if (vn < 0) {
      impact(a, -vn, -c.nx, -c.ny)
      if (b) impact(b, -vn * .7, c.nx, c.ny)
    }
  }
  // 热启动：先把上一步的法向冲量加回去
  const cache = world.cache ??= new Map<number, number>()
  for (const c of contacts) {
    const warm = (cache.get(c.key) ?? 0) * .92
    if (!warm) continue
    const { a, b } = c
    const ima = a.hold ? a.im * .12 : a.im, imb = b ? (b.hold ? b.im * .12 : b.im) : 0
    c.jn = warm
    a.vx += warm * ima * c.nx; a.vy += warm * ima * c.ny
    if (b) { b.vx -= warm * imb * c.nx; b.vy -= warm * imb * c.ny }
  }

  // ---- 速度约束 ----
  for (let it = 0; it < VEL_ITERS; it++) {
    for (const c of contacts) {
      const { a, b } = c
      const ima = a.hold ? a.im * .12 : a.im, imb = b ? (b.hold ? b.im * .12 : b.im) : 0
      const k = ima + imb
      let rvx = a.vx - (b ? b.vx : 0), rvy = a.vy - (b ? b.vy : 0)
      const vn = rvx * c.nx + rvy * c.ny
      let lambda = (c.bias - vn) / k
      const before = c.jn
      c.jn = Math.max(before + lambda, 0)
      lambda = c.jn - before
      a.vx += lambda * ima * c.nx; a.vy += lambda * ima * c.ny
      if (b) { b.vx -= lambda * imb * c.nx; b.vy -= lambda * imb * c.ny }
      // 摩擦
      rvx = a.vx - (b ? b.vx : 0); rvy = a.vy - (b ? b.vy : 0)
      const tx = -c.ny, ty = c.nx
      const vt = rvx * tx + rvy * ty
      let lt = -vt / k
      const limit = FRICTION * c.jn, beforeT = c.jt
      c.jt = Math.max(-limit, Math.min(limit, beforeT + lt))
      lt = c.jt - beforeT
      a.vx += lt * ima * tx; a.vy += lt * ima * ty
      if (b) { b.vx -= lt * imb * tx; b.vy -= lt * imb * ty }
    }
  }

  cache.clear()
  for (const c of contacts) if (c.jn > 0) cache.set(c.key, c.jn)

  // ---- 积分、滚动阻力 ----
  for (const b of bodies) {
    if (!b.active) continue
    if (b.touching && !b.hold) {
      const damp = Math.max(0, 1 - ROLL_DAMP * dt)
      b.vx *= damp
      if (Math.abs(b.vy) < 60) b.vy *= damp
    }
    b.x += b.vx * dt; b.y += b.vy * dt
  }

  // ---- 位置修正（不往速度里灌能量） ----
  for (let it = 0; it < POS_ITERS; it++) {
    for (const c of contacts) {
      const { a, b } = c
      let pen: number
      if (c.wall === 1) pen = a.y + a.hy + a.r - world.floor
      else if (c.wall === 2) pen = world.left - (a.x - a.hx - a.r)
      else if (c.wall === 3) pen = a.x + a.hx + a.r - world.right
      else if (c.wall === 4) pen = world.ceil - (a.y - a.hy - a.r)
      else pen = penetration(c)
      if (pen <= SLOP) continue
      const ima = a.hold ? a.im * .12 : a.im, imb = b ? (b.hold ? b.im * .12 : b.im) : 0
      const move = CORRECTION * (pen - SLOP) / (ima + imb)
      a.x += move * ima * c.nx; a.y += move * ima * c.ny
      if (b) { b.x -= move * imb * c.nx; b.y -= move * imb * c.ny }
    }
  }

  // 从站名和搜索框后面掉下去的：整个落到所有静态碰撞体下面，就恢复成普通刚体
  for (const b of bodies) {
    if (!b.active || !b.ghost) continue
    let clear = true
    for (const s of boxes) {
      if (b.y - b.hy - b.r < s.y2 + 1 && b.x + b.hx + b.r > s.x1 && b.x - b.hx - b.r < s.x2) { clear = false; break }
    }
    if (clear) b.ghost = false
  }
}

/** 两个刚体表面之间的距离（负数是嵌进去了）。 */
export function separation(a: Body, b: Body): number {
  cores(a.x, a.y, a.hx, a.hy, b.x - b.hx, b.y - b.hy, b.x + b.hx, b.y + b.hy)
  return cdist - a.r - b.r
}

/** 全场最快的速度（像素/秒）和最大的挤压量：都很小就可以停表了。 */
export function energy(world: World): number {
  let max = 0
  for (const b of world.bodies) {
    if (!b.active) continue
    if (b.hold) return Infinity
    max = Math.max(max, Math.hypot(b.vx, b.vy), Math.abs(b.sq) * 900, Math.abs(b.sqv) * 60)
  }
  return max
}

/** 轮廓点（已经以外接框中心为原点）拟合成圆角盒：返回核心半宽、半高和外扩半径。 */
export function fitRoundBox(points: { x: number; y: number }[], halfW: number, halfH: number) {
  let best = { hx: 0, hy: 0, r: Math.min(halfW, halfH), error: Infinity }
  for (let k = 1; k >= .78; k -= .02) {
    const bw = halfW * k, bh = halfH * k, short = Math.min(bw, bh)
    for (let rho = 1; rho >= .25; rho -= .05) {
      const r = short * rho
      let sum = 0
      for (const p of points) {
        const qx = Math.abs(p.x) - (bw - r), qy = Math.abs(p.y) - (bh - r)
        const sd = Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r
        // 轮廓露在碰撞体外面（会和邻居叠在一起）比缩在里面（留缝）更难看一点
        sum += sd > 0 ? sd * 1.25 : -sd
      }
      const error = sum / points.length
      if (error < best.error - 1e-6) best = { hx: bw - r, hy: bh - r, r, error }
    }
  }
  return best
}

/** 带种子的小伪随机（mulberry32），只在挂载后用。 */
export function seeded(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
