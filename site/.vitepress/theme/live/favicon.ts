/**
 * 标签页小图标（favicon）：一只随机的 Bot，隔几秒变成另一只，眼睛跟着鼠标看。
 * 规格见 docs/dev/INTERACTION.md「标签页图标」。
 * 上半部分是纯函数（Node 里可测，生成静态图标也用它）；startFavicon 只在浏览器里跑。
 */
import { BotEngine, type BotFrame, type Look } from '../vendor/bloub/engine'
import { EXPRESSION_BY_ID, type BotExpression } from '../vendor/bloub/expressions'
import { blinkScale, liveliness } from '../vendor/bloub/face'
import { clamp, lerp } from '../vendor/bloub/math'
import { RAYON } from '../vendor/bloub/repere'
import { shapeRadii } from '../face'
import { HERO_MASCOTS } from '../../meta.mjs'

export interface FaviconBot { shape: string; color: string }

export const FAVICON_EYE = '#16161b'
/** 和首页招牌的吉祥物同一套颜色：在浅色、深色标签栏上都看得清。 */
export const FAVICON_COLORS: readonly string[] = HERO_MASCOTS.map((mascot: { color: string }) => mascot.color)
/**
 * 16px 下轮廓认得出、两只眼睛放得下、彼此不撞脸的形状（2026-11-15 逐个目视挑的）。
 * 没进名单的：capsule、square、cylinder、crystal 缩小后和 tablet、squircle、hex 分不清；
 * wedge、sparkle、teardrop 身体太窄，眼睛挤在一起。
 */
export const FAVICON_SHAPES: readonly string[] = [
  'blob', 'pebble', 'bean', 'egg', 'squircle', 'tablet', 'hex', 'gem', 'shield',
  'dome', 'arch', 'cloud', 'leaf', 'clover', 'flower', 'heart', 'house', 'star',
]
/** 没有脚本时的静态图标：招牌正中那只橙色圆团。public/ 下的图标文件由它生成。 */
export const FAVICON_DEFAULT: FaviconBot = { shape: 'blob', color: '#ff6a13' }

/** 小图标上的脸：正对前方，眼睛比页面里的略大，缩到 16px 还看得出是两只眼。 */
const attentive = EXPRESSION_BY_ID.get('attentif')!
export const FAVICON_FACE: BotExpression = {
  ...attentive,
  gaze: { yaw: 0, pitch: 4, roll: 0 },
  split: 18,
  eyes: [{ ...attentive.eyes[0], w: 0.27, h: 0.5 }, { ...attentive.eyes[1], w: 0.27, h: 0.5 }],
}

/** 每次都换一个形状、换一种颜色，保证看得出变了。 */
export function pickFaviconBot(random: () => number, previous?: FaviconBot): FaviconBot {
  const pick = (list: readonly string[], skip?: string) => {
    const pool = list.filter((value) => value !== skip)
    return pool[Math.min(pool.length - 1, Math.floor(random() * pool.length))]
  }
  return { shape: pick(FAVICON_SHAPES, previous?.shape), color: pick(FAVICON_COLORS, previous?.color) }
}

function toHsl(hex: string): [number, number, number] {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min
  if (!d) return [0, 0, l]
  const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4
  return [(h * 60 + 360) % 360, d / (1 - Math.abs(2 * l - 1)), l]
}
function fromHsl(h: number, s: number, l: number): string {
  const a = s * Math.min(l, 1 - l)
  const channel = (n: number) => {
    const k = (n + h / 30) % 12
    return Math.round((l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))) * 255).toString(16).padStart(2, '0')
  }
  return `#${channel(0)}${channel(8)}${channel(4)}`
}
/**
 * 两种颜色之间的过渡色：沿色相环走近的那一边。
 * 直接按 RGB 混，互补色（薄荷绿 → 粉）中间会出现一帧灰，小图标上像脏了一下。
 */
export function mixColor(from: string, to: string, k: number): string {
  if (k <= 0) return from
  if (k >= 1) return to
  const a = toHsl(from), b = toHsl(to)
  const turn = ((b[0] - a[0] + 540) % 360) - 180
  return fromHsl((a[0] + turn * k + 360) % 360, lerp(a[1], b[1], k), lerp(a[2], b[2], k))
}

/** 身体留给四边的空隙（占边长的比例）；太贴边，抗锯齿的那一圈会被裁掉。 */
const PADDING = 0.06

/**
 * 把引擎的一帧画成一张正方形 SVG：镜头贴着身体的外框，身体尽量填满图标。
 * 坐标取整（图标最多显示到 32 个设备像素，小数没有意义），字符串短一半。
 * lid 是额外的眼皮开合度（1 睁开，0 闭上），眨眼时用。
 * 眼睛按身体轮廓裁切：看向边缘时，出了身体的那部分不画（页面里的 Bot 用 mask 做同一件事）。
 */
export function faviconSvg(frame: BotFrame, color: string, lid = 1): string {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, index = 0
  const body = frame.bodyPath.replace(/-?\d+(?:\.\d+)?/g, (text) => {
    const value = Math.round(Number(text)) || 0
    if (index++ % 2 === 0) { minX = Math.min(minX, value); maxX = Math.max(maxX, value) }
    else { minY = Math.min(minY, value); maxY = Math.max(maxY, value) }
    return String(value)
  })
  const side = Math.ceil(Math.max(maxX - minX, maxY - minY) / (1 - PADDING * 2))
  const left = Math.round((minX + maxX - side) / 2), top = Math.round((minY + maxY - side) / 2)
  const eyes = frame.eyes.map((eye) => {
    const opacity = eye.alpha < 0.995 ? ` opacity="${Math.round(eye.alpha * 100) / 100}"` : ''
    return `<path d="${eye.d}" transform="${squash(eye.matrix, lid)}"${opacity}/>`
  }).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${left} ${top} ${side} ${side}">`
    + `<defs><clipPath id="b"><path id="p" d="${body}"/></clipPath></defs>`
    + `<use href="#p" fill="${color}"/><g fill="${FAVICON_EYE}" clip-path="url(#b)">${eyes}</g></svg>`
}

/** 和引擎自己的眨眼同一种压法：只压屏幕上的竖直方向。 */
function squash(matrix: string, lid: number): string {
  if (lid >= 1) return matrix
  const [a, b, c, d, e, f] = matrix.slice(7, -1).split(',').map(Number)
  const k = blinkScale(lid), r = (value: number) => Math.round(value * 100) / 100
  return `matrix(${a},${r(b * k)},${c},${r(d * k)},${e},${f})`
}

export const faviconHref = (svg: string) => `data:image/svg+xml,${encodeURIComponent(svg)}`

/** 变身过渡的时长（秒）和节奏：慢起慢收，帧与帧之间的变化量差不多。 */
export const FAVICON_MORPH = 0.52
const easeInOut = (k: number) => (k < 0.5 ? 4 * k ** 3 : 1 - (-2 * k + 2) ** 3 / 2)
/**
 * 过渡走到 k（0–1）时，形状和颜色该变到几成（progress）、眼皮开合度（lid），以及该取引擎的哪个时刻（at）。
 * 引擎的形状过渡固定是 SHAPE_MORPH 秒的 easeOutQuint，一上来就变掉一大半；
 * 这里反解它的曲线，换成自己的节奏。
 */
export function morphAt(start: number, k: number): { at: number; progress: number; lid: number } {
  const progress = easeInOut(clamp(k))
  return {
    at: start + (1 - (1 - progress) ** 0.2) * BotEngine.SHAPE_MORPH,
    progress,
    // 变到一半时闭一下眼：眨个眼就成了另一只。
    lid: clamp(Math.abs(k - 0.5) / 0.24),
  }
}

/** 视线能转多远（度）：左右各 24，往上 10，往下 16。再大，靠边那只眼睛会被身体边缘裁掉大半。 */
export const FAVICON_GAZE = { yaw: 24, up: 10, down: 16 } as const
/**
 * 鼠标在视口里的位置 → 小图标的视线。
 * 页面不知道标签页图标在屏幕上的位置，所以不算真实夹角：左右以视口中线为界，上下以视口中线为平视。
 * 位置分成 9 × 5 格，同一格里挪动得到同一个视线（图不变就不用换）。
 */
export function faviconLook(x: number, y: number, width: number, height: number): Look {
  const step = (value: number, levels: number) => (Number.isFinite(value) ? Math.round(clamp(value, -1, 1) * levels) / levels : 0)
  const across = step((x / width) * 2 - 1, 4), up = step(1 - (y / height) * 2, 2)
  return {
    yaw: across * FAVICON_GAZE.yaw || 0,
    pitch: up * (up > 0 ? FAVICON_GAZE.up : FAVICON_GAZE.down) || 0,
    mix: 1, spin: 0, wander: 0,
  }
}

/** 引擎自带眨眼日程；停留的那一帧必须是睁着眼的，碰上了就往后挪一点。 */
function eyesOpenAt(t: number): number {
  while (liveliness(t).lid < 1) t += 0.02
  return t
}

/** 某只 Bot 的静止帧。 */
export function faviconStill(bot: FaviconBot): string {
  const engine = new BotEngine(RAYON, 'idle', shapeRadii(bot.shape), FAVICON_FACE)
  return faviconSvg(engine.sample(eyesOpenAt(0)), bot.color)
}

// ---------------------------------------------------------------------------
// 浏览器部分
// ---------------------------------------------------------------------------

/** 两次变身之间停多久（毫秒）：在这个范围里随机，节奏不呆板。 */
export const FAVICON_SWAP_MS: readonly [number, number] = [4000, 7000]
/** 变身动画的帧间隔。标签页图标每换一帧浏览器都要重新解码，不需要更密。 */
const FRAME_MS = 60
/** 鼠标停住多久后视线回正（毫秒），和页面里的 Bot 一致。 */
const GAZE_IDLE_MS = 4000
/** 视线一步到位：引擎的视线过渡压到 1 毫秒，图标上的「动」来自一格一格地换。 */
const LOOK_SNAP = 0.001
/** 眨一次眼：眼皮开合度和每帧停留的毫秒数。 */
const BLINK: ReadonlyArray<readonly [number, number]> = [[0.4, 45], [0, 70], [0.5, 50]]

const MARK = 'data-bz-favicon'
let stopRunning: (() => void) | undefined

/**
 * 接管标签页图标。返回停止函数。
 * - 一进来就换成一只随机 Bot；之后每隔几秒变成另一只，页面看得见时带变形过渡，中间偶尔眨眼。
 * - 鼠标在页面里动，眼睛跟着看；停住 4 秒或移出窗口，视线回正。
 * - 标签页在后台时浏览器不给动画帧，直接切到下一只。
 * - 系统设了「减少动效」：只随机一次，不再变。
 */
export function startFavicon(options: { random?: () => number } = {}): () => void {
  if (typeof document === 'undefined' || typeof window === 'undefined') return () => {}
  stopRunning?.()
  const random = options.random ?? Math.random
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')

  const link = document.head.querySelector<HTMLLinkElement>(`link[${MARK}]`) ?? document.createElement('link')
  link.rel = 'icon'
  link.type = 'image/svg+xml'
  link.setAttribute('sizes', 'any')
  link.setAttribute(MARK, '')
  /** 页面自带的静态图标让位：留着的话，用哪一个由各家浏览器自己定。 */
  const tidy = () => {
    for (const other of document.head.querySelectorAll(`link[rel~="icon"]:not([${MARK}])`)) other.remove()
    if (link.parentNode !== document.head) document.head.append(link)
  }
  const observer = new MutationObserver(tidy)

  let bot = pickFaviconBot(random)
  const engine = new BotEngine(RAYON, 'idle', shapeRadii(bot.shape), FAVICON_FACE)
  /** 引擎时间只在变身时往前走；停留时图标是一张静止的图。 */
  let t = eyesOpenAt(0)
  let frame = engine.sample(t)
  let swapTimer: number | undefined, blinkTimer: number | undefined, landTimer: number | undefined, raf: number | undefined
  let land: (() => void) | undefined

  /** 图没变就不写：每写一次浏览器都要重新解码、重画标签。 */
  let shown = ''
  const show = (f: BotFrame, color: string, lid = 1) => {
    const href = faviconHref(faviconSvg(f, color, lid))
    if (href !== shown) link.href = shown = href
  }
  const label = () => { link.setAttribute('data-shape', bot.shape); link.setAttribute('data-color', bot.color) }
  const rest = () => { show(frame, bot.color) }

  function plan() {
    window.clearTimeout(swapTimer)
    window.clearTimeout(blinkTimer)
    if (motion.matches) return
    const wait = lerp(FAVICON_SWAP_MS[0], FAVICON_SWAP_MS[1], random())
    swapTimer = window.setTimeout(swap, wait)
    blinkTimer = window.setTimeout(() => blink(0), wait * lerp(0.35, 0.65, random()))
  }

  function blink(step: number) {
    if (land) return // 变身已经开始，画面归它管
    if (document.hidden || motion.matches || step >= BLINK.length) return rest()
    show(frame, bot.color, BLINK[step][0])
    blinkTimer = window.setTimeout(() => blink(step + 1), BLINK[step][1])
  }

  function swap() {
    window.clearTimeout(blinkTimer)
    const from = bot.color, start = t
    bot = pickFaviconBot(random, bot)
    engine.setShape(shapeRadii(bot.shape), start)
    label()
    const end = eyesOpenAt(start + BotEngine.SHAPE_MORPH)
    land = () => {
      window.clearTimeout(landTimer)
      if (raf !== undefined) window.cancelAnimationFrame(raf)
      raf = undefined
      land = undefined
      t = end
      frame = engine.sample(t)
      rest()
      plan()
    }
    if (document.hidden || motion.matches) return land()
    let began: number | undefined, last = -Infinity
    const tick = (ms: number) => {
      began ??= ms
      const k = (ms - began) / 1000 / FAVICON_MORPH
      // 按实际时间节流：页面别处在重绘时，rAF 的时间戳并不规整（实测 16–21ms 乱跳）
      const wall = performance.now()
      // 落地那一帧也守帧间隔：离上一帧不到 FRAME_MS 就再等一帧
      if (k >= 1) {
        if (wall - last >= FRAME_MS) return land?.()
        raf = window.requestAnimationFrame(tick)
        return
      }
      if (wall - last >= FRAME_MS) {
        last = wall
        const { at, progress, lid } = morphAt(start, k)
        show(engine.sample(at), mixColor(from, bot.color, progress), lid)
      }
      raf = window.requestAnimationFrame(tick)
    }
    raf = window.requestAnimationFrame(tick)
    // 浏览器不给动画帧又没报「隐藏」时（窗口被完全挡住等），也要落到新 Bot 上，不能卡在半截。
    landTimer = window.setTimeout(() => land?.(), FAVICON_MORPH * 1000 + 400)
  }

  // ---- 视线跟随 ----
  let cell = '', wanted: Look | null = null, aimedAt = -Infinity
  let aimTimer: number | undefined, idleTimer: number | undefined
  function aim() {
    aimTimer = undefined
    aimedAt = performance.now()
    engine.setLook(wanted, t, LOOK_SNAP)
    link.setAttribute('data-follow', wanted ? 'pointer' : 'rest')
    if (land) return // 变身中：后面的过渡帧自然带上新视线
    t = eyesOpenAt(t + LOOK_SNAP * 2)
    frame = engine.sample(t)
    rest()
  }
  /** 换图不比变身动画更密：扫过好几格时只画最后停下的那一格。 */
  function look(next: Look | null) {
    const key = next ? `${next.yaw},${next.pitch}` : ''
    if (key === cell) return
    cell = key
    wanted = next
    if (aimTimer === undefined) aimTimer = window.setTimeout(aim, Math.max(0, aimedAt + FRAME_MS - performance.now()))
  }
  const release = () => { window.clearTimeout(idleTimer); look(null) }
  const pointerMoved = (event: PointerEvent) => {
    if (event.pointerType === 'touch' || motion.matches) return
    window.clearTimeout(idleTimer)
    idleTimer = window.setTimeout(release, GAZE_IDLE_MS)
    look(faviconLook(event.clientX, event.clientY, window.innerWidth, window.innerHeight))
  }
  const pointerLeft = (event: PointerEvent) => { if (event.relatedTarget === null) release() }

  /** 转到后台或切到减少动效：过渡和眨眼立刻收尾，不留半截画面。 */
  const settle = () => {
    if (land) land()
    else if (document.hidden || motion.matches) { window.clearTimeout(blinkTimer); rest() }
  }
  const motionChanged = () => { if (motion.matches) release(); settle(); plan() }

  label()
  link.setAttribute('data-follow', 'rest')
  rest()
  tidy()
  observer.observe(document.head, { childList: true })
  document.addEventListener('visibilitychange', settle)
  document.addEventListener('pointermove', pointerMoved, { passive: true })
  document.addEventListener('pointerout', pointerLeft)
  window.addEventListener('blur', release)
  motion.addEventListener('change', motionChanged)
  plan()

  const stop = () => {
    window.clearTimeout(swapTimer)
    window.clearTimeout(blinkTimer)
    window.clearTimeout(landTimer)
    window.clearTimeout(aimTimer)
    window.clearTimeout(idleTimer)
    if (raf !== undefined) window.cancelAnimationFrame(raf)
    observer.disconnect()
    document.removeEventListener('visibilitychange', settle)
    document.removeEventListener('pointermove', pointerMoved)
    document.removeEventListener('pointerout', pointerLeft)
    window.removeEventListener('blur', release)
    motion.removeEventListener('change', motionChanged)
    if (stopRunning === stop) stopRunning = undefined
  }
  stopRunning = stop
  return stop
}
