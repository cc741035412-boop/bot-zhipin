<!-- 首屏「球池」：货架上的真 Bot 从天上掉下来，堆在地板上，也有几个正好坐在站名和搜索框上。
     站名的每个字、搜索框都是场景里的实体（静态碰撞体）。可以抓起来扔；点一下是戳（只做动作）。
     鼠标停在哪只上，它头顶就冒出一张小名片：中文叫法（原名小字）、一句话介绍，整张点进详情页；触屏点一下出，键盘走到就出。
     物理在 theme/ballpit-physics.ts（不旋转的圆角盒刚体）；位置只写 transform，不走 Vue 响应式。
     停表：全部落定后停；首屏滚出视口、标签页隐藏时也停，回来接着走。
     宽屏上舞台收进版心（和导航条同宽 1204），墙在版心两边；视口不比版心宽时墙在屏幕外面一点。
     样式在 styles/hero.css；规格见 docs/dev/INTERACTION.md §2.2。 -->
<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { data as bots } from '../../data/bots.data.mjs'
import { SITE } from '../../meta.mjs'
import { avatarColor } from '../avatar'
import { botFace } from '../face'
import { botPalette } from '../color'
import { activePitch, nextPoke } from '../pitch'
import { announce } from '../announce'
import SearchTrigger from './SearchTrigger.vue'
import DefaultAvatar from './DefaultAvatar.vue'
import BzIcon from './BzIcon.vue'
import { energy, fitRoundBox, makeBody, seeded, separation, step, type Body, type Box, type World } from '../ballpit-physics'

interface ShelfBot { slug: string; name: string; nameZh?: string | null; tagline: string; detailUrl: string; avatar: string | null }
interface Slot { bot: ShelfBot; color: string; size: number; seat: number }
interface Metric { w: number; h: number; round: number; sx: number; sy: number; ss: number; top: number; gw: number; gh: number }

// ---------- 选谁上场：确定性的，颜色轮着来，形状尽量不重样，灰黑的最多各一个 ----------
function hueOf(hex: string) {
  const [r, g, b] = [1, 3, 5].map((at) => parseInt(hex.slice(at, at + 2), 16) / 255)
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min
  if (d < .12) return -1
  const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4
  return (h * 60 + 360) % 360
}
function lineup(list: ShelfBot[], max: number): { bot: ShelfBot; color: string }[] {
  const groups = new Map<string, ShelfBot[]>()
  for (const bot of [...list].filter((item) => !item.avatar).sort((a, b) => a.slug.localeCompare(b.slug))) {
    const color = avatarColor(bot.slug)
    groups.set(color, [...(groups.get(color) ?? []), bot])
  }
  const colors = [...groups.keys()]
  const vivid = colors.filter((color) => hueOf(color) >= 0).sort((a, b) => hueOf(a) - hueOf(b))
  // 色相隔着取，相邻两个不撞色
  const stride = vivid.length > 4 ? Math.floor(vivid.length / 2) : 1
  const order: string[] = []
  for (let i = 0, at = 0; i < vivid.length; i++) {
    while (order.includes(vivid[at % vivid.length])) at++
    order.push(vivid[at % vivid.length]); at += stride
  }
  const neutral = colors.filter((color) => hueOf(color) < 0)
  const used = new Map<string, number>()
  const take = (color: string) => {
    const group = groups.get(color)!
    if (!group.length) return null
    let best = 0
    group.forEach((bot, i) => { if ((used.get(botFace(bot.slug).shape) ?? 0) < (used.get(botFace(group[best].slug).shape) ?? 0)) best = i })
    const [bot] = group.splice(best, 1)
    const shape = botFace(bot.slug).shape
    used.set(shape, (used.get(shape) ?? 0) + 1)
    return { bot, color }
  }
  const out: { bot: ShelfBot; color: string }[] = []
  let spare = [...neutral]
  while (out.length < max) {
    let added = false
    for (const color of order) {
      if (out.length >= max) break
      const pick = take(color)
      if (pick) { out.push(pick); added = true }
      // 每轮彩色之后最多插一个灰或黑
      if (out.length % 10 === 9 && spare.length && out.length < max) { const extra = take(spare.shift()!); if (extra) out.push(extra) }
    }
    if (!added) {
      // 彩色的用完了（货架很小）：剩下的灰黑也上
      spare = neutral.filter((color) => groups.get(color)!.length)
      if (!spare.length) break
      const extra = take(spare[0]); if (extra) out.push(extra)
    }
  }
  return out
}

const DESKTOP = [96, 68, 112, 80, 56, 104, 72, 88, 120, 64, 92, 76]
const PHONE = [64, 48, 80, 56, 44, 72, 52, 60, 84, 46]
const SEATS_DESKTOP = [60, 76, 54], SEATS_PHONE = [42, 52, 40]
// 种子定了落定后的那一帧。视口比版心宽（墙在版心两边）用 42：在 2560×1440、1920×1080、1440×900 下挑的，
// 中间高、两头矮，没有空档；视口不比版心宽（墙在屏幕外面一点）用 7：左中右各有一两摞，没有哪一摞特别高。
const SEED_COLUMN = 42, SEED_BLEED = 7
const STEP = 1 / 120
// 这份文档里球池有没有演过掉落：演过以后再回到首页（比如从详情页后退），直接摆在落定的位置，不重演。
// 记在 window 上，不用模块变量：VitePress 首次进站加载的是页面代码的精简副本，站内跳转回来用的是完整副本，
// 两份各有各的模块变量，标记会丢。
const PLAYED = '__bzBallpitPlayed'
const played = () => (window as unknown as Record<string, unknown>)[PLAYED] === true
const markPlayed = () => { (window as unknown as Record<string, unknown>)[PLAYED] = true }
const WALL_BLEED = 28
// 版心：内容区 1140 加两侧 32，和悬浮导航条同宽
const COLUMN = 1204

const root = ref<HTMLElement>()
const world = ref<HTMLElement>()
const title = ref<HTMLElement>()
const probe = ref<HTMLElement>()
const hazeEl = ref<HTMLElement>()
const slots = shallowRef<Slot[]>([])
const metrics = shallowRef<Metric[]>([])
const hovered = ref<number | null>(null)
const active = ref<number | null>(null)
const roving = ref(0)
const owner = Symbol('球池名片')
// 名片上的名字：有中文叫法（bot.yaml 的 nameZh）的以它为主、原名跟在下面；没有的只有原名。
// 规矩和 scripts/lib/bot-name.mjs 一致（那个模块合进来以后，这三行换成从它引入）。
const displayName = (bot: ShelfBot) => bot.nameZh?.trim() || bot.name
const originalName = (bot: ShelfBot) => bot.nameZh?.trim() && bot.nameZh !== bot.name ? bot.name : null
const fullName = (bot: ShelfBot) => originalName(bot) ? `${displayName(bot)}（${originalName(bot)}）` : displayName(bot)

const bodyEls: HTMLElement[] = [], squashEls: HTMLElement[] = [], botEls: HTMLElement[] = [], hopEls: HTMLElement[] = [], glowEls: HTMLElement[] = []
const avatars: (InstanceType<typeof DefaultAvatar> | null)[] = []
let cardEl: HTMLElement | null = null
let sim: World = { bodies: [], boxes: [], floor: 0, left: 0, right: 0, ceil: -4000, gravity: 2300 }
let delays: number[] = []
let tilt: number[] = [], lastSquash: string[] = [], kicked: number[] = [], lit: boolean[] = []
let raf = 0, last = 0, acc = 0, simT = 0, quiet = 0
// 停表的两个原因：首屏不在视口里、标签页隐藏。settled：落定了、不用再走。
let onScreen = true, settled = false
let watcher: IntersectionObserver | undefined
let reduced = false, alive = false, layoutKey = '', builds = 0
let motion: MediaQueryList | undefined
let observer: ResizeObserver | undefined
let visLeft = 0, visRight = 0, cardW = 0, shift = NaN
let openTimer: ReturnType<typeof setTimeout> | undefined, closeTimer: ReturnType<typeof setTimeout> | undefined
let overCard = false, stickUntil = 0
let held: { index: number; id: number; ox: number; oy: number; sx: number; sy: number; moved: boolean; touch: boolean } | null = null
let swallowClick = false
let pointer = { x: 0, y: 0, t: 0, vx: 0, vy: 0 }
let random = seeded(SEED_BLEED)
let glyphs: Box[] = [], searchBox: Box | null = null
let walled = false
// 上一次量到的场景（墙、地板、各个碰撞体的位置）：没变就不用把落定的球池再叫醒
let sceneSig = ''

// 每个位置的 ref 函数只建一次：父组件重渲染（悬停、打字）时 Vue 不用把几十个引用拆了再装
const refFns = new Map<unknown[], ((el: unknown) => void)[]>()
function setRef(list: unknown[], i: number) {
  let fns = refFns.get(list)
  if (!fns) refFns.set(list, fns = [])
  return fns[i] ??= (el: unknown) => { list[i] = el }
}

// ---------- 量场景：视口、地板、站名每个字的墨迹框、搜索框 ----------
function measureScene() {
  const stage = world.value!, box = stage.getBoundingClientRect()
  const width = document.documentElement.clientWidth
  visLeft = -box.left; visRight = visLeft + width
  // 墙：宽屏上在版心两边（舞台和导航条同宽）；视口不比版心宽时在视口外面一点（两边的 Bot 被屏幕边切掉一截）
  const middle = visLeft + width / 2
  const half = Math.min(width / 2 + WALL_BLEED, COLUMN / 2)
  walled = width > COLUMN
  sim.left = middle - half; sim.right = middle + half
  sim.floor = box.height
  const boxes: Box[] = []
  const h1 = title.value!, node = h1.firstChild
  try {
    const style = getComputedStyle(h1)
    const pen = document.createElement('canvas').getContext('2d')!
    pen.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
    const baseline = probe.value!.getBoundingClientRect().bottom - box.top
    const range = document.createRange()
    let at = 0
    for (const char of node?.nodeType === 3 ? [...(node.textContent ?? '')] : []) {
      const start = at; at += char.length
      if (!char.trim()) continue
      range.setStart(node!, start); range.setEnd(node!, at)
      const rect = range.getBoundingClientRect(), ink = pen.measureText(char)
      if (!rect.width || !Number.isFinite(ink.actualBoundingBoxAscent)) continue
      const x1 = rect.left - box.left - ink.actualBoundingBoxLeft, x2 = rect.left - box.left + ink.actualBoundingBoxRight
      boxes.push({ x1, y1: baseline - ink.actualBoundingBoxAscent, x2: Math.max(x2, x1 + 4), y2: baseline + Math.max(ink.actualBoundingBoxDescent, 0), r: 2 })
    }
  } catch { /* 量不到字形就退回整块标题 */ }
  if (!boxes.length) {
    const rect = h1.getBoundingClientRect()
    boxes.push({ x1: rect.left - box.left, y1: rect.top - box.top + rect.height * .14, x2: rect.right - box.left, y2: rect.bottom - box.top - rect.height * .1, r: 2 })
  }
  glyphs = [...boxes]; searchBox = null
  const search = root.value!.querySelector<HTMLElement>('[data-testid="search-trigger"]')
  if (search) {
    const rect = search.getBoundingClientRect()
    // 站名底下到搜索框之间补一块实心：东西钻不进这道缝
    const x1 = Math.min(...boxes.map((item) => item.x1)), x2 = Math.max(...boxes.map((item) => item.x2)), y1 = Math.min(...boxes.map((item) => item.y2)) - 6
    if (rect.top - box.top > y1) boxes.push({ x1: x1 + 2, y1, x2: x2 - 2, y2: rect.top - box.top + 4, r: 2 })
    searchBox = { x1: rect.left - box.left, y1: rect.top - box.top, x2: rect.right - box.left, y2: rect.bottom - box.top, r: 12 }
    boxes.push(searchBox)
  }
  sim.boxes = boxes
  sceneSig = [width, sim.left, sim.right, sim.floor, ...boxes.flatMap((item) => [item.x1, item.y1, item.x2, item.y2])].map(Math.round).join(',')
  return { width, stage: 2 * half, top: box.top }
}

// ---------- 量每只 Bot 的轮廓，拟合成圆角盒 ----------
const fitCache = new Map<string, { cx: number; cy: number; halfW: number; halfH: number; hx: number; hy: number; r: number }>()
function fitShape(slot: Slot, i: number) {
  const key = botFace(slot.bot.slug).shape
  let fit = fitCache.get(key)
  if (!fit) {
    const path = botEls[i]?.querySelector<SVGPathElement>('[data-part="body"]')
    let box = { x: -100, y: -100, width: 200, height: 200 }
    const points: { x: number; y: number }[] = []
    try {
      if (path) {
        box = path.getBBox()
        const length = path.getTotalLength()
        for (let k = 0; k < 72; k++) { const p = path.getPointAtLength(length * k / 72); points.push({ x: p.x - box.x - box.width / 2, y: p.y - box.y - box.height / 2 }) }
      }
    } catch { /* 量不到就当成圆 */ }
    const halfW = box.width / 2 || 100, halfH = box.height / 2 || 100
    const round = points.length ? fitRoundBox(points, halfW, halfH) : { hx: 0, hy: 0, r: Math.min(halfW, halfH) }
    fit = { cx: box.x + halfW, cy: box.y + halfH, halfW, halfH, hx: round.hx, hy: round.hy, r: round.r }
    if (points.length) fitCache.set(key, fit)
  }
  return fit
}

// 落点在舞台上的位置（0–1）。墙在版心两边时往中间收一点：两头矮、中间高，堆成一个小丘，
// 不会有谁靠着看不见的墙摞起来。
function gather(along: number) {
  const pull = walled ? .3 : 0
  if (!pull) return along
  const t = along * 2 - 1
  return ((1 - pull) * t + pull * t * t * t + 1) / 2
}

// ---------- 开场：定人数和大小 → 渲染 → 量轮廓 → 放到天上，按节奏放下来 ----------
function plan(width: number, stage: number) {
  // 手机看视口；大小和数量看舞台（两面墙之间的宽度）
  const room = stage - 2 * WALL_BLEED
  const phone = width < 680, scale = phone ? 1 : room < 1100 ? .86 : room < 1680 ? 1 : 1.15
  const sizes = (phone ? PHONE : DESKTOP).map((size) => Math.round(size * scale))
  const seats = phone ? SEATS_PHONE : SEATS_DESKTOP.map((size) => Math.round(size * scale))
  const average = sizes.reduce((sum, size) => sum + size, 0) / sizes.length
  const floorCount = Math.max(6, Math.min(phone ? 15 : 30, Math.round((phone ? 2 : 1.5) * stage / average)))
  const picks = lineup(bots as ShelfBot[], floorCount + seats.length)
  const seated = picks.length > seats.length + 3 ? seats.length : 0
  const list: Slot[] = picks.map((pick, i) => i < seated ? { ...pick, size: seats[i], seat: i } : { ...pick, size: sizes[(i - seated) % sizes.length], seat: -1 })
  return { key: `${phone ? 'p' : scale}:${list.length}`, list }
}

async function build() {
  cancelAnimationFrame(raf); raf = 0
  close()
  const scene = measureScene()
  const { key, list } = plan(scene.width, scene.stage)
  layoutKey = key
  const run = ++builds
  slots.value = list
  metrics.value = []
  await nextTick()
  if (!alive || run !== builds) return
  const { top } = measureScene()
  random = seeded(walled ? SEED_COLUMN : SEED_BLEED)
  const bodies: Body[] = [], measured: Metric[] = []
  const floorers = list.map((slot, i) => ({ slot, i })).filter(({ slot }) => slot.seat < 0)
  // 地板上的那些：左右铺开，相邻不撞色
  const order = floorers.map((_, k) => k)
  for (let k = order.length - 1; k > 0; k--) { const j = Math.floor(random() * (k + 1)); [order[k], order[j]] = [order[j], order[k]] }
  for (let k = 1; k < order.length; k++) {
    if (floorers[order[k]].slot.color !== floorers[order[k - 1]].slot.color) continue
    const swap = order.findIndex((item, at) => at > k && floorers[item].slot.color !== floorers[order[k - 1]].slot.color && floorers[item].slot.color !== floorers[order[k + 1] ?? item].slot.color)
    if (swap > 0) [order[k], order[swap]] = [order[swap], order[k]]
  }
  const column = new Map<number, number>()
  order.forEach((item, at) => column.set(floorers[item].i, at))
  // 大的先掉，小的后掉（带一点乱序）：小的落在大的身上或缝里，堆出来才自然
  const rank = floorers.map(({ slot }) => -slot.size + random() * 40)
  const release = floorers.map((_, k) => k).sort((a, b) => rank[a] - rank[b])
  const turn = new Map<number, number>()
  release.forEach((item, at) => turn.set(floorers[item].i, at))
  const search = searchBox, lastGlyph = glyphs[glyphs.length - 1]
  const inkLeft = Math.min(...glyphs.map((item) => item.x1)), inkRight = Math.max(...glyphs.map((item) => item.x2))
  const margin = walled ? 64 : WALL_BLEED, span = sim.right - sim.left - 2 * margin
  delays = []; tilt = []; lastSquash = []; kicked = []; lit = []
  list.forEach((slot, i) => {
    const fit = fitShape(slot, i), s = slot.size / 200
    const body = makeBody(0, 0, fit.hx * s, fit.hy * s, fit.r * s)
    const reach = body.hx + body.r, rise = body.hy + body.r
    // 坐在界面上的三个：站名最后一个字上、搜索框左肩、搜索框右端。肩膀太窄坐不下（很窄的手机）就改成落地。
    const roomLeft = search ? inkLeft - search.x1 : 0, roomRight = search ? search.x2 - inkRight : 0
    const seatX = slot.seat === 0 ? (lastGlyph && lastGlyph.x2 - lastGlyph.x1 > reach ? (lastGlyph.x1 + lastGlyph.x2) / 2 + 2 : NaN)
      : slot.seat === 1 ? (search && roomLeft >= 2 * reach + 12 ? search.x1 + Math.min(Math.max(reach + 8, 46), roomLeft - reach - 6) : NaN)
        : slot.seat === 2 ? (search && roomRight >= 2 * reach + 12 ? search.x2 - reach - 10 : NaN) : NaN
    if (Number.isFinite(seatX)) {
      body.x = seatX
      delays.push(1.15 + [0, .3, .15][slot.seat])
    } else {
      const at = column.get(i)
      const along = at === undefined ? random() : (at + .5) / floorers.length + (random() - .5) / floorers.length * .5
      body.x = sim.left + margin + gather(along) * span
      body.vx = (random() - .5) * 110
      body.ghost = true
      delays.push(at === undefined ? .5 + random() * .4 : .08 + turn.get(i)! / Math.max(floorers.length, 1) * .9)
    }
    body.y = -Math.max(top, 0) - rise - 24
    body.vy = 240 + random() * 140
    bodies.push(body); tilt.push(0); lastSquash.push(''); kicked.push(0); lit.push(true)
    measured.push({
      w: fit.halfW * 2 * s, h: fit.halfH * 2 * s, round: Math.min(fit.halfW, fit.halfH) * s * (fit.r / Math.max(Math.min(fit.hx + fit.r, fit.hy + fit.r), 1)),
      sx: -(fit.cx - fit.halfW + 112) * s, sy: -(fit.cy - fit.halfH + 112) * s, ss: 224 * s, top: rise, gw: reach * 3.6, gh: Math.max(26, Math.min(64, reach * 1.1)),
    })
  })
  for (const el of bodyEls) if (el) { el.style.visibility = ''; el.style.zIndex = '' }
  hazeEl.value?.classList.remove('is-on', 'is-dim')
  sim.bodies = bodies
  sim.cache?.clear()
  metrics.value = measured
  roving.value = floorers.length ? floorers[order[0]].i : 0
  simT = 0; acc = 0; quiet = 0; settled = false
  await nextTick()
  if (!alive || run !== builds) return
  // 减少动效、或者这份文档里已经演过一次（从别的页面回到首页）：不演掉落，直接摆好
  if (reduced || played()) settleNow()
  else { markPlayed(); wake() }
  restless()
}

// 落定以后也不是一张画：隔几秒，有一只身上没压着别人的自己蹦一下
let hopTimer: ReturnType<typeof setTimeout> | undefined
function restless() {
  clearTimeout(hopTimer)
  if (reduced || !alive || paused()) return
  hopTimer = setTimeout(() => { fidget(); restless() }, 5200 + random() * 4800)
}
function fidget() {
  if (raf || held || active.value !== null || hovered.value !== null || document.hidden || !root.value) return
  const box = root.value.getBoundingClientRect()
  if (box.bottom < 120 || box.top > window.innerHeight - 120) return
  const bodies = sim.bodies
  const free = bodies.map((_, i) => i).filter((i) => {
    const body = bodies[i]
    if (!body.active || botEls[i]?.querySelector('svg')?.getAttribute('data-state') !== 'idle') return false
    return !bodies.some((other) => other !== body && other.active && other.y < body.y - (body.hy + body.r) * .3 && separation(body, other) < 4)
  })
  if (!free.length) return
  bodies[free[Math.floor(random() * free.length)]].vy = -(250 + random() * 110)
  wake()
}

// 走一步：到点的放下来。返回是不是还有在天上等着的。
function advance() {
  simT += STEP
  let waiting = false
  for (let i = 0; i < sim.bodies.length; i++) {
    if (sim.bodies[i].active) continue
    if (simT >= delays[i]) sim.bodies[i].active = true
    else waiting = true
  }
  step(sim, STEP)
  return waiting
}
// 减少动效：不演掉落，把同一场模拟快进到落定再显示（和会动时落成的是同一堆）
function settleNow() {
  for (let k = 0, calm = 0; k < 120 * 16 && calm < 60; k++) calm = !advance() && energy(sim) < 6 ? calm + 1 : 0
  rest()
}
function rest() {
  for (const body of sim.bodies) { body.vx = 0; body.vy = 0; body.sq = 0; body.sqv = 0 }
  settled = true
  paint()
  haze()
}
// 身后的光晕：每只 Bot 的颜色漫到背景上，连成一片有颜色的空气。
// 二十多团大渐变每帧跟着动太贵（实测掉帧），所以只在落定后画一次（一个元素、一张背景），淡入；被搅动时先暗下去。
const HAZE_UP = 340, HAZE_DOWN = 76
function haze() {
  const el = hazeEl.value
  if (!el) return
  const layers = { light: [] as string[], dark: [] as string[] }
  sim.bodies.forEach((body, i) => {
    const slot = slots.value[i], up = sim.floor - body.y
    if (!slot || !body.active || up > HAZE_UP - 40) return
    const reach = body.hx + body.r, rise = body.hy + body.r, palette = botPalette(slot.color)
    const at = `ellipse ${(reach * 2.7).toFixed(0)}px ${Math.min(rise * 2.1, up + HAZE_DOWN - 6).toFixed(0)}px at ${body.x.toFixed(0)}px ${(HAZE_UP - up).toFixed(0)}px`
    const strength = 'var(--bz-pit-haze)'
    layers.light.push(`radial-gradient(${at}, color-mix(in srgb, ${palette['--bz-bot-light']} ${strength}, transparent), transparent)`)
    layers.dark.push(`radial-gradient(${at}, color-mix(in srgb, ${palette['--bz-bot-dark']} ${strength}, transparent), transparent)`)
  })
  el.style.setProperty('--bz-pit-haze-light', layers.light.join(',') || 'none')
  el.style.setProperty('--bz-pit-haze-dark', layers.dark.join(',') || 'none')
  el.classList.remove('is-dim')
  el.classList.add('is-on')
}
function stir() { hazeEl.value?.classList.add('is-dim') }

// 不在视口里、或者标签页隐藏：停表（模拟停在原地，回来接着走）
const paused = () => !onScreen || document.hidden
function wake() {
  quiet = 0; settled = false
  if (raf || reduced || !alive || paused()) return
  last = 0
  raf = requestAnimationFrame(frame)
}
function pauseChanged() {
  if (!alive) return
  if (paused()) {
    cancelAnimationFrame(raf); raf = 0
    clearTimeout(hopTimer)
    // 抓着的时候离开：放手
    if (held) { const body = sim.bodies[held.index]; if (body) body.hold = null; botEls[held.index]?.classList.remove('is-held'); held = null }
    return
  }
  if (!reduced && !settled) wake()
  restless()
}
function frame(ms: number) {
  raf = 0
  const dt = last ? Math.min((ms - last) / 1000, .05) : 1 / 60
  last = ms
  acc += dt
  let steps = 0
  while (acc >= STEP && steps < 6) {
    if (advance()) quiet = 0
    acc -= STEP; steps++
  }
  if (steps === 6) acc = 0
  paint()
  quiet = energy(sim) < 6 && sim.bodies.every((body) => body.active) ? quiet + dt : 0
  if (quiet > .45) rest()
  else raf = requestAnimationFrame(frame)
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))
function paint() {
  const bodies = sim.bodies
  for (let i = 0; i < bodies.length; i++) {
    const body = bodies[i], el = bodyEls[i]
    if (!el || !body.active) continue
    el.style.transform = `translate3d(${body.x.toFixed(2)}px,${body.y.toFixed(2)}px,0)`
    if (el.style.visibility !== 'visible') el.style.visibility = 'visible'
    // 歪头跟着横向速度走；被压扁沿撞击法线，接触的那一边不离地
    const lean = clamp(body.vx * (body.hold ? .008 : .011), -9, 9)
    tilt[i] += (lean - tilt[i]) * .2
    const stretch = body.touching || body.hold ? 0 : clamp((Math.abs(body.vy) - 500) / 22000, 0, .05)
    let squash = ''
    if (Math.abs(body.sq) > .003 || Math.abs(tilt[i]) > .08 || stretch > .003) {
      const reach = body.hx * Math.abs(body.nx) + body.hy * Math.abs(body.ny) + body.r
      const turn = Math.abs(body.sq) > .003 ? Math.atan2(body.ny, body.nx) * 180 / Math.PI - 90 : 0
      squash = `translate(${(body.nx * reach * body.sq).toFixed(2)}px,${(body.ny * reach * body.sq).toFixed(2)}px) rotate(${(tilt[i] + turn).toFixed(2)}deg) scale(${(1 + body.sq * .55 - stretch * .6).toFixed(4)},${(1 - body.sq + stretch).toFixed(4)}) rotate(${(-turn).toFixed(2)}deg)`
    }
    if (squash !== lastSquash[i] && squashEls[i]) { squashEls[i].style.transform = squash; lastSquash[i] = squash }
    const glow = glowEls[i], metric = metrics.value[i]
    if (glow && metric) {
      const light = clamp(1 - (sim.floor - (body.y + body.hy + body.r)) / 150, 0, 1)
      if (light > 0 || lit[i]) {
        glow.style.transform = `translate3d(${(body.x - metric.gw / 2).toFixed(2)}px,0,0)`
        glow.style.opacity = light.toFixed(3)
        lit[i] = light > 0
      }
    }
  }
  placeCard()
}

// ---------- 抓、扔、扫 ----------
function local(event: PointerEvent) {
  const box = world.value!.getBoundingClientRect()
  return { x: event.clientX - box.left, y: event.clientY - box.top }
}
function down(event: PointerEvent, i: number) {
  if (event.button !== 0 || reduced || held) return
  const at = local(event), body = sim.bodies[i]
  if (!body?.active) return
  held = { index: i, id: event.pointerId, ox: at.x - body.x, oy: at.y - body.y, sx: event.clientX, sy: event.clientY, moved: false, touch: event.pointerType === 'touch' }
  try { botEls[i].setPointerCapture(event.pointerId) } catch { /* 指针已经没了 */ }
}
function move(event: PointerEvent) {
  if (held && event.pointerId === held.id) {
    const dx = event.clientX - held.sx, dy = event.clientY - held.sy
    // 触摸：横着拖才算抓（竖着划是滚页面）
    if (!held.moved && Math.hypot(dx, dy) > 5 && (!held.touch || Math.abs(dx) > Math.abs(dy))) {
      held.moved = true
      close()
      bodyEls[held.index].style.zIndex = '4'
      botEls[held.index].classList.add('is-held')
    }
    if (held.moved) {
      const at = local(event), body = sim.bodies[held.index]
      body.hold = { x: at.x - held.ox, y: at.y - held.oy }
      stir(); wake()
    }
    return
  }
  if (event.pointerType !== 'mouse' || reduced) return
  // 鼠标快速扫过：给碰到的 Bot 一个冲量
  const t = event.timeStamp, dt = Math.max(t - pointer.t, 1) / 1000
  const at = local(event)
  if (dt < .12) { pointer.vx = (at.x - pointer.x) / dt; pointer.vy = (at.y - pointer.y) / dt } else { pointer.vx = 0; pointer.vy = 0 }
  pointer.x = at.x; pointer.y = at.y; pointer.t = t
  const speed = Math.hypot(pointer.vx, pointer.vy)
  if (speed < 650) return
  for (let i = 0; i < sim.bodies.length; i++) {
    const body = sim.bodies[i]
    if (!body.active || t - kicked[i] < 260) continue
    const dx = Math.max(Math.abs(at.x - body.x) - body.hx, 0), dy = Math.max(Math.abs(at.y - body.y) - body.hy, 0)
    if (Math.hypot(dx, dy) > body.r + 6) continue
    kicked[i] = t
    body.vx += clamp(pointer.vx * .3, -620, 620)
    body.vy += clamp(pointer.vy * .3, -620, 420) - 90
    stir(); wake()
  }
}
function up(event: PointerEvent) {
  if (!held || event.pointerId !== held.id) return
  const { index, moved } = held
  held = null
  try { botEls[index]?.releasePointerCapture(event.pointerId) } catch { /* 已经释放 */ }
  if (!moved) return
  const body = sim.bodies[index]
  body.hold = null
  const speed = Math.hypot(body.vx, body.vy)
  if (speed > 2600) { body.vx *= 2600 / speed; body.vy *= 2600 / speed }
  botEls[index]?.classList.remove('is-held')
  if (bodyEls[index]) bodyEls[index].style.zIndex = ''
  // 松手后浏览器还会补一个 click：这次不算戳
  swallowClick = event.type === 'pointerup'
  if (swallowClick) setTimeout(() => { swallowClick = false }, 0)
  wake()
}

// ---------- 悬停、戳、名片 ----------
// 鼠标：停在 Bot 上一小会儿才出名片（扫过一排不会乱闪）；已经开着一张时换下一张快一点；移开稍等一下再收，
// 留出把鼠标挪到名片上去点的时间。点一下是戳，顺手把名片立刻亮出来。触屏点一下出；键盘走到哪只哪只出。
const DWELL = 240, SWAP = 140, LINGER = 220
function enter(event: PointerEvent, i: number) {
  if (event.pointerType !== 'mouse' || held) return
  hovered.value = i
  avatars[i]?.play({ state: 'wide', hold: Infinity })
  hop(i)
  clearTimeout(closeTimer); clearTimeout(openTimer)
  if (active.value !== i) openTimer = setTimeout(() => { if (hovered.value === i && !held) open(i) }, active.value === null ? DWELL : SWAP)
}
function leave(event: PointerEvent, i: number) {
  if (event.pointerType !== 'mouse') return
  if (hovered.value === i) hovered.value = null
  clearTimeout(openTimer)
  if (active.value === i) linger()
}
function linger() {
  clearTimeout(closeTimer)
  closeTimer = setTimeout(() => {
    if (performance.now() < stickUntil) { linger(); return }
    if (!overCard && hovered.value !== active.value) close()
  }, LINGER)
}
function cardEnter(event: PointerEvent) { if (event.pointerType === 'mouse') { overCard = true; clearTimeout(closeTimer) } }
function cardLeave(event: PointerEvent) { if (event.pointerType === 'mouse') { overCard = false; linger() } }
function hop(i: number) {
  const el = hopEls[i]
  if (!el || reduced) return
  el.classList.remove('is-hop')
  void el.offsetWidth
  el.classList.add('is-hop')
}
function click(event: MouseEvent, i: number) {
  if (swallowClick) { swallowClick = false; return }
  const keyboard = event.detail === 0
  const slot = slots.value[i], body = sim.bodies[i]
  if (!slot || !body) return
  if (keyboard) hop(i)
  else {
    // 戳：只做动作（变个身、蹦一下），不说话
    avatars[i]?.play({ state: nextPoke(slot.bot.slug).state })
    if (!reduced && !body.hold) {
      body.vy = Math.min(body.vy, 0) - 430
      body.vx += (random() - .5) * 140
      stir(); wake()
    }
    // 蹦起来的那一下它会暂时离开鼠标：这段时间名片不收
    stickUntil = performance.now() + 900
  }
  roving.value = i
  open(i, keyboard)
}
function focused(i: number) {
  roving.value = i
  // 键盘走到（不是鼠标点出来的焦点）：直接出名片
  if (botEls[i]?.matches(':focus-visible')) open(i, true)
}
function unfocused(event: FocusEvent, i: number) {
  if (active.value === i && hovered.value !== i && !bodyEls[i]?.contains(event.relatedTarget as Node | null)) close()
}
async function open(i: number, speak = false) {
  clearTimeout(openTimer); clearTimeout(closeTimer)
  const slot = slots.value[i]
  if (!slot) return
  if (speak) announce(`${fullName(slot.bot)}：${slot.bot.tagline}`)
  if (active.value === i) return
  active.value = i
  activePitch.value = owner
  cardEl = null
  await nextTick()
  if (active.value !== i) return
  cardEl = bodyEls[i]?.querySelector<HTMLElement>('.pit-card') ?? null
  if (!cardEl) return
  hug(cardEl)
  cardW = cardEl.offsetWidth; shift = NaN
  placeCard()
}
// 介绍是两行均衡断行的，比名片的最大宽度窄：把名片收到刚好包住最长的一行，右边不留一块空白。
// 量的时候先停掉弹出动画（它带缩放，量出来不准），量完马上恢复，同一帧里看不出来。
function hug(el: HTMLElement) {
  const widest = (node: Element | null) => {
    if (!node) return 0
    const range = document.createRange()
    range.selectNodeContents(node)
    return Math.max(0, ...[...range.getClientRects()].map((rect) => rect.width))
  }
  el.style.animation = 'none'
  el.style.width = ''
  const name = widest(el.querySelector('.pit-card-name > span')) + 8 + 16   // 名字 + 间距 + 箭头
  const inner = Math.max(name, widest(el.querySelector('.pit-card-alias')), widest(el.querySelector('.pit-card-does')))
  if (inner > 0) el.style.width = `${Math.ceil(inner) + 33}px`               // 左右内边距 14×2 + 描边 2×2 + 1px 余量
  void el.offsetWidth
  el.style.animation = ''
}
function close() {
  clearTimeout(openTimer); clearTimeout(closeTimer)
  cardEl = null; overCard = false
  if (active.value === null) return
  active.value = null
  if (activePitch.value === owner) activePitch.value = null
}
watch(activePitch, (value) => { if (value !== owner && active.value !== null) close() })
function placeCard() {
  const i = active.value
  if (i === null || !cardEl || !sim.bodies[i]) return
  const x = sim.bodies[i].x, half = cardW / 2
  const next = Math.round(clamp(x, visLeft + 12 + half, Math.max(visRight - 12 - half, visLeft + 12 + half)) - x)
  if (next === shift) return
  shift = next
  cardEl.style.setProperty('--bz-pit-shift', `${next}px`)
}
function outside(event: Event) {
  const i = active.value
  if (i !== null && !bodyEls[i]?.contains(event.target as Node)) close()
}
function key(event: KeyboardEvent, i: number) {
  if (event.key === 'Escape') { close(); return }
  const dir = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
  if (!dir) return
  event.preventDefault()
  const order = sim.bodies.map((_, k) => k).filter((k) => sim.bodies[k].active).sort((a, b) => sim.bodies[a].x - sim.bodies[b].x)
  const next = order[order.indexOf(i) + dir]
  if (next === undefined) return
  roving.value = next
  botEls[next]?.focus()
}

// ---------- 生命周期 ----------
let resizeTimer: ReturnType<typeof setTimeout> | undefined
function resized() {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    if (!alive || !world.value) return
    const before = sceneSig
    const scene = measureScene()
    if (plan(scene.width, scene.stage).key !== layoutKey) { void build(); return }
    // 什么都没变（比如刚挂上观察器时的那一下回调）：不动
    if (sceneSig === before) return
    if (reduced) settleNow(); else wake()
  }, 120)
}
function motionChanged() {
  reduced = !!motion?.matches
  if (reduced) { cancelAnimationFrame(raf); raf = 0; clearTimeout(hopTimer); for (const body of sim.bodies) body.hold = null; held = null; settleNow() }
  else restless()
}
onMounted(() => {
  alive = true
  motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  reduced = motion.matches
  motion.addEventListener('change', motionChanged)
  document.addEventListener('pointerdown', outside)
  document.addEventListener('visibilitychange', pauseChanged)
  observer = new ResizeObserver(resized)
  watcher = new IntersectionObserver((entries) => {
    const visible = entries[entries.length - 1].isIntersecting
    if (visible === onScreen) return
    onScreen = visible
    pauseChanged()
  })
  void build().then(() => { if (alive && root.value) { observer?.observe(root.value); watcher?.observe(root.value) } })
  window.addEventListener('resize', resized)
})
onBeforeUnmount(() => {
  alive = false
  cancelAnimationFrame(raf); raf = 0
  clearTimeout(resizeTimer); clearTimeout(hopTimer); clearTimeout(openTimer); clearTimeout(closeTimer)
  motion?.removeEventListener('change', motionChanged)
  document.removeEventListener('pointerdown', outside)
  document.removeEventListener('visibilitychange', pauseChanged)
  window.removeEventListener('resize', resized)
  observer?.disconnect()
  watcher?.disconnect()
  if (activePitch.value === owner) activePitch.value = null
})
</script>

<template>
  <header ref="root" class="ballpit" data-testid="ballpit" @pointermove="move" @pointerup="up" @pointercancel="up" @lostpointercapture="up">
    <div class="pit-copy">
      <h1 ref="title" class="pit-title">{{ SITE.name }}<i ref="probe" class="pit-probe" aria-hidden="true" /></h1>
      <SearchTrigger class="pit-search" data-testid="search-trigger" />
    </div>
    <!-- 地板：一条细线，每只 Bot 脚下一团自己颜色的光（静态渐变，只动 transform 和 opacity） -->
    <div class="pit-floor" aria-hidden="true">
      <div ref="hazeEl" class="pit-haze" />
      <i v-for="(slot, i) in slots" :key="slot.bot.slug" :ref="setRef(glowEls, i)" class="pit-glow bz-bot-scope" :style="{ ...botPalette(slot.color), '--bz-pit-gw': `${metrics[i]?.gw ?? 0}px`, '--bz-pit-gh': `${metrics[i]?.gh ?? 0}px` }" />
    </div>
    <div ref="world" class="pit-world">
      <div
        v-for="(slot, i) in slots" :key="slot.bot.slug" :ref="setRef(bodyEls, i)"
        class="pit-body bz-bot-scope" :class="{ 'is-active': active === i, 'is-lit': hovered === i }" :data-slug="slot.bot.slug" @focusout="unfocused($event, i)"
        :style="{ ...botPalette(slot.color), '--bz-pit-w': `${metrics[i]?.w ?? slot.size}px`, '--bz-pit-ht': `${metrics[i]?.h ?? slot.size}px`, '--bz-pit-round': `${metrics[i]?.round ?? slot.size / 2}px`, '--bz-pit-sx': `${metrics[i]?.sx ?? 0}px`, '--bz-pit-sy': `${metrics[i]?.sy ?? 0}px`, '--bz-pit-ss': `${metrics[i]?.ss ?? slot.size * 1.12}px`, '--bz-pit-top': `${metrics[i]?.top ?? slot.size / 2}px` }"
      >
        <span :ref="setRef(squashEls, i)" class="pit-squash">
          <button
            :ref="setRef(botEls, i)" type="button" class="pit-bot" data-testid="pit-bot"
            :aria-label="fullName(slot.bot)" :aria-expanded="active === i" :tabindex="roving === i ? 0 : -1"
            @pointerdown="down($event, i)" @pointerenter="enter($event, i)" @pointerleave="leave($event, i)"
            @click="click($event, i)" @keydown="key($event, i)" @focus="focused(i)"
          >
            <span :ref="setRef(hopEls, i)" class="pit-hop">
              <DefaultAvatar :ref="setRef(avatars, i)" :slug="slot.bot.slug" :rest="hovered === i ? 'wide' : 'idle'" />
            </span>
          </button>
        </span>
        <!-- 名片：中文叫法是主角，原名小字，一句话介绍；整张是进详情页的链接 -->
        <div v-if="active === i" class="pit-card" data-testid="pit-card" @pointerenter="cardEnter" @pointerleave="cardLeave">
          <a class="pit-card-link" :href="slot.bot.detailUrl">
            <span class="pit-card-name"><span>{{ displayName(slot.bot) }}</span><BzIcon class="pit-card-go" name="chevron-right" /></span>
            <span v-if="originalName(slot.bot)" class="pit-card-alias">{{ originalName(slot.bot) }}</span>
            <span class="pit-card-does">{{ slot.bot.tagline }}</span>
          </a>
        </div>
      </div>
    </div>
  </header>
</template>
