// 小队的排版计算：合影里谁站哪、流程图里节点和连线怎么摆。
// 全是纯函数，不碰 DOM：服务端渲染、浏览器、单测算出来的结果一样。
import { displayName } from '../../../scripts/lib/bot-name.mjs'

export const YOU = 'you'

/* ------------------------------------------------------------------ 合影 */

export interface LineupMember { bot: string; lead?: boolean }
export interface LineupSlot {
  bot: string
  lead: boolean
  /** 身体中心相对合影中线的横向偏移 */
  x: number
  /** 脚离地面线的高度：站得越靠后越高 */
  lift: number
  size: number
  /** 叠放层级，越大越靠前 */
  z: number
  /** 从左到右第几个（悬停时依次跳用） */
  order: number
  /** 没有鼠标可跟时看向哪里；null 是正脸看镜头 */
  look: { yaw: number; pitch: number } | null
}
export interface Lineup { width: number; height: number; slots: LineupSlot[] }

// size 是身体的大小（活体画布四周有一圈放动效的余量，样式里把画布放大到 112%，身体正好是这个数）。
// card：首页小队卡里的小合影，互相压住一点。stage：小队页的大合影，每只脚下有一块写着队内岗位的小名牌，挨着站。
const LINEUP = {
  card: { lead: 80, size: 60, near: 62, step: 50, lifts: [4, 10], pad: 6 },
  stage: { lead: 120, size: 96, near: 116, step: 104, lifts: [14, 26], pad: 12 },
} as const
// 小合影里人多的时候（队长 + 3 个以上）站成两排，像真的合影：前排是队长和左右两个，后排从肩膀后面探出头来。
const TWO_ROWS = { front: 60, frontX: 60, frontLift: 4, back: 56, backX: 30, backStep: 62, backLift: 54 } as const
export type LineupVariant = keyof typeof LINEUP

/**
 * 合影站位。
 * 有队长：队长最大、站正中最前面，其余按数据顺序分站两边，离队长越远站得越靠后，都看向队长。
 *   小合影（card）里队员有 3 个以上时站两排：前排队长和左右各一个，其余在后排露出上半张脸；从左到右仍是数据顺序。
 * 接力：一字排开，前一个看着后一个，最后一个看镜头。
 * 搭伙（或没有队长）：一字排开，前后错落，都看镜头，两端的微微朝里。
 */
export function lineup(members: readonly LineupMember[], formation: string, variant: LineupVariant = 'card'): Lineup {
  const spec = LINEUP[variant]
  const leadIndex = members.findIndex((member) => member.lead)
  const slots: LineupSlot[] = []
  const crew = leadIndex >= 0 ? members.filter((_, index) => index !== leadIndex) : []
  if (leadIndex >= 0 && variant === 'card' && crew.length >= 3) {
    const rows = TWO_ROWS
    // 座位：前排两个；后排先占队长左右肩后的两个空当，再往外。按横坐标排好，队员按数据顺序入座。
    const seats = [
      { x: -rows.frontX, back: false }, { x: rows.frontX, back: false },
      ...Array.from({ length: crew.length - 2 }, (_, index) => ({ x: (index % 2 === 0 ? -1 : 1) * (rows.backX + Math.floor(index / 2) * rows.backStep), back: true })),
    ].sort((a, b) => a.x - b.x)
    crew.forEach((member, index) => {
      const seat = seats[index], side = Math.sign(seat.x)
      slots.push(seat.back
        ? { bot: member.bot, lead: false, x: seat.x, lift: rows.backLift, size: rows.back, z: 5, order: 0, look: { yaw: -side * 6, pitch: 0 } }
        : { bot: member.bot, lead: false, x: seat.x, lift: rows.frontLift, size: rows.front, z: 10, order: 0, look: { yaw: -side * 10, pitch: 8 } })
    })
    slots.splice(seats.filter((seat) => seat.x < 0).length, 0, { bot: members[leadIndex].bot, lead: true, x: 0, lift: 0, size: spec.lead, z: 20, order: 0, look: null })
  } else if (leadIndex >= 0) {
    const others = crew
    const left = Math.ceil(others.length / 2)
    others.forEach((member, index) => {
      const side = index < left ? -1 : 1
      const rank = side < 0 ? left - 1 - index : index - left
      const lift = spec.lifts[0] + (spec.lifts[1] - spec.lifts[0]) * rank
      slots.push({
        bot: member.bot, lead: false, x: side * (spec.near + rank * spec.step), lift, size: spec.size,
        z: 10 - rank, order: 0, look: { yaw: -side * Math.min(16, 10 + rank * 6), pitch: 8 },
      })
    })
    slots.splice(left, 0, { bot: members[leadIndex].bot, lead: true, x: 0, lift: 0, size: spec.lead, z: 20, order: 0, look: null })
  } else {
    const relay = formation === '接力'
    const sink = relay ? spec.lifts[0] : spec.lifts[1]
    members.forEach((member, index) => {
      const x = (index - (members.length - 1) / 2) * spec.step * (variant === 'stage' ? 1 : 1.04)
      const back = index % 2 === 1
      const last = index === members.length - 1
      const edge = members.length > 2 && (index === 0 || last)
      slots.push({
        bot: member.bot, lead: false, x, lift: back ? sink : 0, size: spec.size, z: back ? 5 : 10, order: 0,
        look: relay ? (last ? null : { yaw: 12, pitch: 8 }) : edge ? { yaw: index === 0 ? 7 : -7, pitch: 10 } : null,
      })
    })
  }
  // 两边人数不一样时把整队挪回正中。
  const min = Math.min(...slots.map((slot) => slot.x - slot.size / 2))
  const max = Math.max(...slots.map((slot) => slot.x + slot.size / 2))
  const shift = -(min + max) / 2
  slots.forEach((slot, index) => { slot.x += shift; slot.order = index })
  return {
    width: max - min + spec.pad * 2,
    height: Math.max(...slots.map((slot) => slot.size + slot.lift)) + spec.pad,
    slots,
  }
}

/**
 * 小队卡上的那行名单：有队长写「队长 名字 · 专员 N 个」（「队长」取它在队里的岗位名），没有就把名字连起来。
 * 名字是界面上叫它的那个：有中文叫法用中文叫法。这一行是一句纯文字，不带原名。
 */
export function rosterLine(members: readonly { name: string; nameZh?: string | null; title?: string | null; lead?: boolean }[]): string {
  const lead = members.find((member) => member.lead)
  // 没有队长：每人都写了队内岗位就列岗位（短，一行放得下，也比名字更说明分工），否则列名字
  if (!lead) return members.every((member) => member.title) ? members.map((member) => member.title).join(' · ') : members.map((member) => displayName(member)).join(' · ')
  const rest = members.length - 1
  return `${lead.title || '队长'} ${displayName(lead)}${rest > 0 ? ` · 专员 ${rest} 个` : ''}`
}

/* ---------------------------------------------------------------- 流程图 */

export interface FlowStep { from: string; to: string; what: string | null }
export interface FlowNode {
  /** 成员的 slug；「你」拆成 you:in（交出东西的你）和 you:out（收东西的你） */
  id: string
  kind: 'member' | 'you'
  x: number
  y: number
  /** 名字放哪：成员在砖下面；队长在砖右边（下面要出线）；围成一圈时上半圈的在砖上面（下面要出线） */
  caption: 'below' | 'right' | 'above' | 'none'
}
export interface FlowEdge {
  key: string
  from: string
  to: string
  /** 同一对节点、同一方向的几条合成一条线，标签一行一条 */
  whats: string[]
  d: string
  head: { x: number; y: number; angle: number }
  label: { x: number; y: number; max: number; anchor: 'center' | 'left' | 'right' }
}
export interface FlowLayout { kind: 'tiers' | 'chain' | 'ring'; width: number; height: number; nodes: FlowNode[]; edges: FlowEdge[] }

const TILE = 56
const HALF = TILE / 2
const GAP = 6
const LINE = 16
const CHIP_PAD = 16
// 名字 + 队内岗位两行，砖下面留的高度。
const CAPTION = 46
const r1 = (value: number) => Math.round(value * 10) / 10

/** 估一下 12px 标签的宽度：中文和全角 12，英文数字约 7。只用来决定折几行、留多高，不要求精确。 */
export function textWidth(text: string): number {
  let width = 0
  for (const char of text) {
    const code = char.codePointAt(0)!
    width += code > 0x2e7f ? 12 : char === ' ' ? 3.5 : /[A-Z]/.test(char) ? 8.2 : /[a-z0-9]/.test(char) ? 6.8 : 4.5
  }
  return width
}
function chip(whats: readonly string[], max: number) {
  const inner = Math.max(24, max - CHIP_PAD)
  const lines = whats.reduce((sum, what) => sum + Math.max(1, Math.ceil(textWidth(what) / inner)), 0)
  const width = Math.min(max, Math.max(...whats.map(textWidth)) + CHIP_PAD + 2)
  return { width, height: lines * LINE + 6 }
}

interface Link { from: string; to: string; whats: string[] }
/** 同一对节点、同一方向的几条合成一条；from、to 已经换成图上的节点 id。 */
function mergeLinks(steps: readonly FlowStep[], rename: (step: FlowStep) => { from: string; to: string }): Link[] {
  const links = new Map<string, Link>()
  for (const step of steps) {
    if (!step.what) continue
    const { from, to } = rename(step)
    const key = `${from}>${to}`
    const link = links.get(key) ?? { from, to, whats: [] }
    link.whats.push(step.what)
    links.set(key, link)
  }
  return [...links.values()]
}
const angleOf = (dx: number, dy: number) => r1(Math.atan2(dy, dx) * 180 / Math.PI)
/**
 * 圆角折线：从 (x0, y0) 竖着走到 busY，横着走到 x1，再竖着走到 y1。像组织架构图的连线：
 * 同一层的线共用一条横线，看起来是一棵树，不是一把乱麻。两端在同一列时就是一条竖线。
 */
function elbow(x0: number, y0: number, x1: number, y1: number, busY: number, radius = 14): string {
  if (Math.abs(x1 - x0) < 1) return `M${r1(x0)} ${r1(y0)}V${r1(y1)}`
  const dir = Math.sign(x1 - x0), a = Math.sign(busY - y0) || 1, b = Math.sign(y1 - busY) || 1
  const r = Math.max(0, Math.min(radius, Math.abs(x1 - x0) / 2, Math.abs(busY - y0), Math.abs(y1 - busY)))
  return `M${r1(x0)} ${r1(y0)}V${r1(busY - a * r)}Q${r1(x0)} ${r1(busY)} ${r1(x0 + dir * r)} ${r1(busY)}`
    + `H${r1(x1 - dir * r)}Q${r1(x1)} ${r1(busY)} ${r1(x1)} ${r1(busY + b * r)}V${r1(y1)}`
}
const edgeOf = (link: Link, d: string, head: FlowEdge['head'], label: FlowEdge['label']): FlowEdge =>
  ({ key: `${link.from}>${link.to}`, from: link.from, to: link.to, whats: link.whats, d, head, label: { ...label, x: r1(label.x), y: r1(label.y), max: Math.floor(label.max) } })

/**
 * 带队：自上而下四层。你 → 队长 → 专员一排 → 你。
 * 你交给队长的在最上面；队长和专员之间是圆角折线（像组织架构图），标签叠在每个专员头顶那一列；
 * 专员之间相邻的走横线，隔着人的从名字下面绕；专员交回给你的汇到最下面那个「你」。
 */
function tiers(members: readonly LineupMember[], steps: readonly FlowStep[], width: number): FlowLayout {
  const lead = members.find((member) => member.lead)!.bot
  const row = members.filter((member) => member.bot !== lead).map((member) => member.bot)
  const at = new Map(row.map((bot, index) => [bot, index]))
  const links = mergeLinks(steps, (step) => ({
    from: step.from === YOU ? 'you:in' : step.from,
    // 队长交回给你的回到上面那个你；专员交回的汇到下面那个你。
    to: step.to === YOU ? (step.from === lead ? 'you:in' : 'you:out') : step.to,
  }))
  const hasIn = links.some((link) => link.from === 'you:in' || link.to === 'you:in')
  const hasOut = links.some((link) => link.to === 'you:out')
  const cx = width / 2
  // 一排人均分画布，但每格最宽 264：人少的时候不摊得太开，整排居中。
  const space = Math.min(264, width / Math.max(1, row.length))
  const colX = (bot: string) => cx + (at.get(bot)! - (row.length - 1) / 2) * space
  const colMax = Math.min(240, space - 20)

  // 上面一层：你和队长之间。
  const trunk = links.filter((link) => (link.from === 'you:in' && link.to === lead) || (link.from === lead && link.to === 'you:in'))
  const sideMax = Math.min(260, cx - 44)
  const trunkHeight = Math.max(64, ...trunk.map((link) => chip(link.whats, sideMax).height + 28))
  let y = 8
  const nodes: FlowNode[] = []
  const youInY = y + HALF
  if (hasIn) { nodes.push({ id: 'you:in', kind: 'you', x: cx, y: youInY, caption: 'none' }); y += TILE + trunkHeight }
  const leadY = y + HALF
  nodes.push({ id: lead, kind: 'member', x: cx, y: leadY, caption: 'right' })
  y += TILE

  // 中间一层：每个专员头顶一列标签，一条线一格。
  const upper = (bot: string) => links.filter((link) => (link.to === bot && (link.from === lead || link.from === 'you:in')) || (link.from === bot && link.to === lead))
  const stacks = new Map(row.map((bot) => [bot, upper(bot).map((link) => ({ link, ...chip(link.whats, colMax) }))]))
  const stackHeight = Math.max(0, ...[...stacks.values()].map((stack) => stack.reduce((sum, item) => sum + item.height + GAP, 0)))
  const fanTop = y
  const rowTop = row.length ? fanTop + 58 + stackHeight + 14 : fanTop
  const rowY = rowTop + HALF
  row.forEach((bot) => nodes.push({ id: bot, kind: 'member', x: colX(bot), y: rowY, caption: 'below' }))
  const captionBottom = row.length ? rowTop + TILE + CAPTION : y

  // 专员之间：相邻的走横线，隔着人的在名字下面各占一条道。
  const between = links.filter((link) => at.has(link.from) && at.has(link.to))
  const far = between.filter((link) => Math.abs(at.get(link.from)! - at.get(link.to)!) > 1)
  const laneOf = new Map(far.map((link, index) => [link, index]))
  const lanesBottom = captionBottom + (far.length ? 12 + far.length * 34 : 0)

  // 最下面一层：专员交回给你的。
  const sinks = links.filter((link) => link.to === 'you:out')
  const sinkChips = new Map(sinks.map((link) => [link, chip(link.whats, colMax)]))
  const sinkHeight = Math.max(0, ...[...sinkChips.values()].map((item) => item.height))
  const youOutY = lanesBottom + 12 + sinkHeight + 64 + HALF
  if (hasOut) nodes.push({ id: 'you:out', kind: 'you', x: cx, y: youOutY, caption: 'none' })
  const height = (hasOut ? youOutY + HALF : lanesBottom) + 8

  const edges: FlowEdge[] = []
  // 你 ↔ 队长：竖线。两个方向都有时并排两条，往下的在左、标签在左；往上的在右、标签在右。
  for (const link of trunk) {
    const down = link.from === 'you:in'
    const x = cx + (trunk.length > 1 ? (down ? -10 : 10) : 0)
    const top = youInY + HALF + GAP, bottom = leadY - HALF - GAP
    const label = trunk.length > 1
      ? { x: x + (down ? -12 : 12), y: (top + bottom) / 2, max: sideMax, anchor: down ? 'right' as const : 'left' as const }
      : { x, y: (top + bottom) / 2, max: sideMax, anchor: 'center' as const }
    edges.push(edgeOf(link, down ? `M${r1(x)} ${r1(top)}V${r1(bottom)}` : `M${r1(x)} ${r1(bottom)}V${r1(top)}`,
      { x: r1(x), y: r1(down ? bottom : top), angle: down ? 90 : -90 }, label))
  }
  // 队长 ↔ 专员：圆角折线。往下的从队长脚下正中出发，共用一条横线，再沿每个专员头顶那一列落下；标签叠在这一列上。
  const busY = fanTop + 30
  for (const bot of row) {
    const stack = stacks.get(bot)!
    const x0 = colX(bot)
    let slotTop = rowTop - 14 - stack.reduce((sum, item) => sum + item.height + GAP, 0)
    stack.forEach((item, index) => {
      const { link } = item
      const x = x0 + (stack.length > 1 ? (index - (stack.length - 1) / 2) * 16 : 0)
      const end = rowTop - GAP
      const label = { x, y: slotTop + item.height / 2, max: colMax, anchor: 'center' as const }
      if (link.from === 'you:in') {
        // 你直接交给专员：从「你」的侧面出发，绕过队长落到这一列。
        const side = x0 < cx - 1 ? -1 : 1
        const lane = Math.abs(x0 - cx) < TILE + 30 ? cx + side * (TILE + 30) : x
        const startX = cx + side * (HALF + GAP)
        const d = `M${r1(startX)} ${r1(youInY)}C${r1(lane)} ${r1(youInY)} ${r1(lane)} ${r1(youInY + 30)} ${r1(lane)} ${r1(fanTop - 10)}`
          + `C${r1(lane)} ${r1(fanTop + 30)} ${r1(x)} ${r1(slotTop - 34)} ${r1(x)} ${r1(slotTop - 4)}V${r1(end)}`
        edges.push(edgeOf(link, d, { x: r1(x), y: r1(end), angle: 90 }, label))
      } else if (link.to === lead) {
        // 往上回来的线走低一点的那条横线，箭头落在队长脚下偏向这个专员的一侧，不和出发点叠在一起。
        const tipX = cx + Math.sign(x0 - cx || 1) * 12, tipY = fanTop + GAP
        edges.push(edgeOf(link, elbow(x, end, tipX, tipY, busY + 10), { x: r1(tipX), y: r1(tipY), angle: -90 }, label))
      } else {
        edges.push(edgeOf(link, elbow(cx, fanTop + GAP, x, end, busY), { x: r1(x), y: r1(end), angle: 90 }, label))
      }
      slotTop += item.height + GAP
    })
  }
  // 专员 → 专员。
  for (const link of between) {
    const a = at.get(link.from)!, b = at.get(link.to)!
    const dir = Math.sign(b - a)
    const xa = colX(link.from), xb = colX(link.to)
    if (Math.abs(b - a) === 1) {
      const both = between.some((other) => other.from === link.to && other.to === link.from)
      const yLine = rowY + (both ? (dir > 0 ? -8 : 8) : 0)
      const x1 = xa + dir * (HALF + GAP), x2 = xb - dir * (HALF + GAP)
      edges.push(edgeOf(link, `M${r1(x1)} ${r1(yLine)}H${r1(x2)}`, { x: r1(x2), y: r1(yLine), angle: dir > 0 ? 0 : 180 },
        { x: (x1 + x2) / 2, y: yLine, max: Math.max(48, Math.abs(x2 - x1) - 40), anchor: 'center' }))
    } else {
      const laneY = captionBottom + 12 + laneOf.get(link)! * 34 + 14
      const x1 = xa + dir * 14, x2 = xb - dir * 14
      const top = captionBottom + 2
      const d = `M${r1(x1)} ${r1(top)}C${r1(x1)} ${r1(laneY)} ${r1(x1)} ${r1(laneY)} ${r1(x1 + dir * 24)} ${r1(laneY)}`
        + `H${r1(x2 - dir * 24)}C${r1(x2)} ${r1(laneY)} ${r1(x2)} ${r1(laneY)} ${r1(x2)} ${r1(top)}`
      edges.push(edgeOf(link, d, { x: r1(x2), y: r1(top), angle: -90 },
        { x: (x1 + x2) / 2, y: laneY, max: Math.max(48, Math.abs(x2 - x1) - 96), anchor: 'center' }))
    }
  }
  // 专员 → 下面的你：先垂直穿过标签，再沿一条横线汇到「你」的头顶。
  for (const link of sinks) {
    const x = colX(link.from)
    const item = sinkChips.get(link)!
    const top = captionBottom + 2
    const endY = youOutY - HALF - GAP
    edges.push(edgeOf(link, elbow(x, top, cx, endY, lanesBottom + 12 + sinkHeight + 30), { x: r1(cx), y: r1(endY), angle: 90 },
      { x, y: lanesBottom + 12 + item.height / 2, max: colMax, anchor: 'center' }))
  }
  return { kind: 'tiers', width, height: r1(height), nodes: nodes.map(roundNode), edges }
}
const roundNode = (node: FlowNode): FlowNode => ({ ...node, x: r1(node.x), y: r1(node.y) })

/**
 * 接力（以及没有队长的其他情况）：从左到右一条线。交出东西的「你」在最左，收东西的「你」在最右。
 * 相邻的走直线，标签在线的上方，高低错开；隔着人的往前的从上面绕、往回的从名字下面绕。
 */
function chain(members: readonly LineupMember[], steps: readonly FlowStep[], width: number): FlowLayout {
  const links = mergeLinks(steps, (step) => ({ from: step.from === YOU ? 'you:in' : step.from, to: step.to === YOU ? 'you:out' : step.to }))
  const ids = [
    ...(links.some((link) => link.from === 'you:in') ? ['you:in'] : []),
    ...members.map((member) => member.bot),
    ...(links.some((link) => link.to === 'you:out') ? ['you:out'] : []),
  ]
  const at = new Map(ids.map((id, index) => [id, index]))
  const space = width / ids.length
  const xOf = (id: string) => space * (at.get(id)! + .5)
  const span = (link: Link) => at.get(link.to)! - at.get(link.from)!
  const near = links.filter((link) => Math.abs(span(link)) === 1)
  const over = links.filter((link) => span(link) > 1).sort((a, b) => span(a) - span(b))
  const under = links.filter((link) => span(link) < -1).sort((a, b) => span(b) - span(a))
  // 相邻的标签在线上方分两层，宽度可以伸到隔壁那一格。
  const nearMax = Math.min(220, space * 1.7 - 16)
  const nearChips = new Map(near.map((link) => [link, chip(link.whats, nearMax)]))
  // 每个标签都不比一格宽时只排一层，紧贴着线；有放不下的才高低两层错开。
  const stagger = [...nearChips.values()].some((item) => item.width > space - 16)
  const level = (link: Link) => stagger ? Math.min(at.get(link.from)!, at.get(link.to)!) % 2 : 0
  const levelHeight = [0, 1].map((n) => Math.max(0, ...near.filter((link) => level(link) === n).map((link) => nearChips.get(link)!.height)))
  const labelsHeight = levelHeight[0] + (levelHeight[1] ? levelHeight[1] + (levelHeight[0] ? GAP : 0) : 0)
  const overTop = 8
  const labelsTop = overTop + over.length * 34 + (over.length ? 10 : 0)
  const rowTop = labelsTop + labelsHeight + (labelsHeight ? 12 : 0)
  const rowY = rowTop + HALF
  const captionBottom = rowTop + TILE + CAPTION
  const height = captionBottom + (under.length ? 12 + under.length * 34 : 0) + 8
  const nodes: FlowNode[] = ids.map((id) => ({ id, kind: id.startsWith('you:') ? 'you' : 'member', x: r1(xOf(id)), y: r1(rowY), caption: id.startsWith('you:') ? 'none' : 'below' }))
  const edges: FlowEdge[] = []
  for (const link of near) {
    const dir = Math.sign(span(link))
    const both = near.some((other) => other.from === link.to && other.to === link.from)
    const yLine = rowY + (both ? (dir > 0 ? -8 : 8) : 0)
    const x1 = xOf(link.from) + dir * (HALF + GAP), x2 = xOf(link.to) - dir * (HALF + GAP)
    // 下面那层贴着这一排，上面那层再高一格。
    const item = nearChips.get(link)!
    const bottom = rowTop - 12 - (level(link) === 1 && levelHeight[0] ? levelHeight[0] + GAP : 0)
    edges.push(edgeOf(link, `M${r1(x1)} ${r1(yLine)}H${r1(x2)}`, { x: r1(x2), y: r1(yLine), angle: dir > 0 ? 0 : 180 },
      { x: (x1 + x2) / 2, y: bottom - item.height / 2, max: nearMax, anchor: 'center' }))
  }
  const arc = (link: Link, laneY: number, anchorY: number, dirY: number) => {
    const dir = Math.sign(span(link))
    const x1 = xOf(link.from) + dir * 12, x2 = xOf(link.to) - dir * 12
    const d = `M${r1(x1)} ${r1(anchorY)}C${r1(x1)} ${r1(laneY)} ${r1(x1)} ${r1(laneY)} ${r1(x1 + dir * 24)} ${r1(laneY)}`
      + `H${r1(x2 - dir * 24)}C${r1(x2)} ${r1(laneY)} ${r1(x2)} ${r1(laneY)} ${r1(x2)} ${r1(anchorY)}`
    edges.push(edgeOf(link, d, { x: r1(x2), y: r1(anchorY), angle: dirY > 0 ? 90 : -90 },
      { x: (x1 + x2) / 2, y: laneY, max: Math.max(48, Math.abs(x2 - x1) - 96), anchor: 'center' }))
  }
  // 跨得越远的道越靠外。
  over.forEach((link, index) => arc(link, overTop + (over.length - 1 - index) * 34 + 14, rowTop - GAP, 1))
  under.forEach((link, index) => arc(link, captionBottom + 12 + index * 34 + 14, captionBottom + 2, -1))
  return { kind: 'chain', width, height: r1(height), nodes, edges }
}

/** 搭伙：成员围成一圈，「你」在中间。你和成员之间是直线，成员之间的线往外鼓。 */
function ring(members: readonly LineupMember[], steps: readonly FlowStep[], width: number): FlowLayout {
  const links = mergeLinks(steps, (step) => ({ from: step.from === YOU ? 'you' : step.from, to: step.to === YOU ? 'you' : step.to }))
  const count = members.length
  const rx = Math.min(width / 2 - 96, 360), ry = count <= 2 ? 0 : 172
  // 上半圈的名字写在砖上面，所以顶上也要留出名字的高度。
  const cx = width / 2, cy = 8 + (count <= 2 ? 0 : CAPTION) + HALF + ry
  const start = count <= 2 ? Math.PI : count === 4 ? -Math.PI * .75 : -Math.PI / 2
  const spot = new Map<string, { x: number; y: number }>([['you', { x: cx, y: cy }]])
  members.forEach((member, index) => {
    const angle = start + index * Math.PI * 2 / count
    spot.set(member.bot, { x: cx + Math.cos(angle) * rx, y: cy + Math.sin(angle) * ry })
  })
  const nodes: FlowNode[] = [
    { id: 'you', kind: 'you', x: r1(cx), y: r1(cy), caption: 'none' },
    ...members.map((member) => {
      const point = spot.get(member.bot)!
      return { id: member.bot, kind: 'member' as const, ...roundSpot(point), caption: point.y < cy - 1 ? 'above' as const : 'below' as const }
    }),
  ]
  const edges = links.map((link) => {
    const a = spot.get(link.from)!, b = spot.get(link.to)!
    const length = Math.hypot(b.x - a.x, b.y - a.y) || 1
    const ux = (b.x - a.x) / length, uy = (b.y - a.y) / length
    const both = links.some((other) => other.from === link.to && other.to === link.from)
    // 两个方向都有时各往自己的右手边让 8px。
    const nx = -uy, ny = ux
    const ox = both ? nx * 8 : 0, oy = both ? ny * 8 : 0
    const inset = HALF + GAP + 2
    const p1 = { x: a.x + ux * inset + ox, y: a.y + uy * inset + oy }, p2 = { x: b.x - ux * inset + ox, y: b.y - uy * inset + oy }
    const spoke = link.from === 'you' || link.to === 'you'
    if (spoke) {
      // 压在线上的标签不能比线长；一来一回时标签在线的旁边，可以宽一些。
      const max = both ? 150 : Math.min(180, Math.max(64, length - 2 * inset - 36))
      const size = chip(link.whats, max)
      // 一来一回的两条线：标签各放在自己那条线的外侧，整个让到两条线的中线以外，互不压住。
      const away = both ? size.width / 2 * Math.abs(nx) + size.height / 2 * Math.abs(ny) + 3 : 0
      const mid = { x: (a.x + b.x) / 2 + (both ? nx * away : 0), y: (a.y + b.y) / 2 + (both ? ny * away : 0) }
      return edgeOf(link, `M${r1(p1.x)} ${r1(p1.y)}L${r1(p2.x)} ${r1(p2.y)}`, { x: r1(p2.x), y: r1(p2.y), angle: angleOf(ux, uy) },
        { x: mid.x, y: mid.y, max, anchor: 'center' })
    }
    // 成员之间：控制点往圆外推，绕开中间的「你」。
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2
    const out = Math.hypot(mx - cx, my - cy) || 1
    const push = Math.min(90, length * .28) * (both ? 1 + .35 * Math.sign(nx * (mx - cx) + ny * (my - cy) || 1) : 1)
    const qx = mx + (mx - cx) / out * push, qy = my + (my - cy) / out * push
    return edgeOf(link, `M${r1(p1.x)} ${r1(p1.y)}Q${r1(qx)} ${r1(qy)} ${r1(p2.x)} ${r1(p2.y)}`,
      { x: r1(p2.x), y: r1(p2.y), angle: angleOf(p2.x - qx, p2.y - qy) },
      { x: (p1.x + 2 * qx + p2.x) / 4, y: (p1.y + 2 * qy + p2.y) / 4, max: 160, anchor: 'center' })
  })
  return { kind: 'ring', width, height: r1(cy + ry + HALF + CAPTION + 8), nodes, edges }
}
const roundSpot = (point: { x: number; y: number }) => ({ x: r1(point.x), y: r1(point.y) })

/** 流程图能画的最窄宽度；再窄就只显示文字版。 */
export const FLOW_MIN_WIDTH = 616

/**
 * 小队流程图的排版。width 是画布宽度（像素，1:1 画，不缩放）。
 * 没有可画的线时返回 null：调用方整块不渲染。
 */
export function flowLayout(squad: { formation: string; members: readonly LineupMember[]; flow: readonly FlowStep[] }, width = 1140): FlowLayout | null {
  const known = new Set([YOU, ...squad.members.map((member) => member.bot)])
  const steps = squad.flow.filter((step) => step.what && step.from !== step.to && known.has(step.from) && known.has(step.to))
  if (!steps.length || squad.members.length < 2) return null
  const canvas = Math.max(FLOW_MIN_WIDTH, Math.round(width))
  if (squad.formation === '搭伙') return ring(squad.members, steps, canvas)
  if (squad.formation === '带队' && squad.members.some((member) => member.lead)) return tiers(squad.members, steps, canvas)
  return chain(squad.members, steps, canvas)
}

/* ------------------------------------------------------- 已导入的成员（本机记住） */

export const squadStorageKey = (slug: string) => `bz-squad-${slug}`
/** 读出来的东西只认「字符串数组」，并且只留这支队里真有的成员。 */
export function parseImported(raw: string | null, members: readonly string[]): string[] {
  if (!raw) return []
  try {
    const value: unknown = JSON.parse(raw)
    if (!Array.isArray(value)) return []
    return members.filter((slug) => value.includes(slug))
  } catch { return [] }
}
