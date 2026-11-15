import { describe, expect, it } from 'vitest'
import { flowLayout, lineup, parseImported, rosterLine, squadStorageKey, textWidth, FLOW_MIN_WIDTH } from '../../site/.vitepress/theme/squad'
import { searchSquads } from '../../site/.vitepress/theme/search'

const team = (count, lead = 0) => Array.from({ length: count }, (_, index) => ({ bot: `m${index}`, lead: index === lead }))
const bySlug = (layout) => Object.fromEntries(layout.slots.map((slot) => [slot.bot, slot]))

describe('lineup：合影站位', () => {
  it('带队：队长最大、最靠前、层级最高，其余按数据顺序分站两边', () => {
    const layout = lineup(team(5), '带队', 'stage')
    const slots = bySlug(layout)
    expect(layout.slots.map((slot) => slot.bot)).toEqual(['m1', 'm2', 'm0', 'm3', 'm4'])
    expect(layout.slots.map((slot) => slot.order)).toEqual([0, 1, 2, 3, 4])
    const xs = layout.slots.map((slot) => slot.x)
    expect([...xs].sort((a, b) => a - b)).toEqual(xs)
    for (const slug of ['m1', 'm2', 'm3', 'm4']) {
      expect(slots.m0.size).toBeGreaterThan(slots[slug].size)
      expect(slots.m0.z).toBeGreaterThan(slots[slug].z)
      expect(slots.m0.lift).toBeLessThan(slots[slug].lift)
    }
    // 离队长越远站得越靠后。
    expect(slots.m1.lift).toBeGreaterThan(slots.m2.lift)
    expect(slots.m4.lift).toBeGreaterThan(slots.m3.lift)
  })

  it('小合影里队员 3 个以上站两排：前排队长和左右各一个，其余在后排探出头；从左到右还是数据顺序', () => {
    const layout = lineup(team(5), '带队', 'card')
    const slots = bySlug(layout)
    expect(layout.slots.map((slot) => slot.bot)).toEqual(['m1', 'm2', 'm0', 'm3', 'm4'])
    const xs = layout.slots.map((slot) => slot.x)
    expect([...xs].sort((a, b) => a - b)).toEqual(xs)
    // 前排：两端的两个，站得低、压在后排上面；后排：中间的两个，抬高到能露出眼睛。
    for (const [front, back] of [['m1', 'm2'], ['m4', 'm3']]) {
      expect(slots[front].lift).toBeLessThan(10)
      expect(slots[back].lift).toBeGreaterThan(slots[front].lift + slots[front].size * .7)
      expect(slots[front].z).toBeGreaterThan(slots[back].z)
      expect(slots.m0.z).toBeGreaterThan(slots[front].z)
    }
    // 后排的人站在前排两个人之间的空当里。
    expect(slots.m2.x).toBeGreaterThan(slots.m1.x)
    expect(slots.m2.x).toBeLessThan(slots.m0.x)
    // 都朝队长那边看。
    expect(slots.m1.look.yaw).toBeGreaterThan(0)
    expect(slots.m2.look.yaw).toBeGreaterThan(0)
    expect(slots.m3.look.yaw).toBeLessThan(0)
    expect(slots.m4.look.yaw).toBeLessThan(0)
    // 3 个队员、5 个队员也排得出来；2 个队员还是一排。
    expect(lineup(team(4), '带队', 'card').slots.filter((slot) => slot.lift > 40)).toHaveLength(1)
    expect(lineup(team(6), '带队', 'card').slots.filter((slot) => slot.lift > 40)).toHaveLength(3)
    expect(lineup(team(3), '带队', 'card').slots.filter((slot) => slot.lift > 40)).toHaveLength(0)
  })

  it('队员看向队长，队长看镜头', () => {
    const slots = bySlug(lineup(team(5), '带队', 'stage'))
    expect(slots.m0.look).toBeNull()
    expect(slots.m1.look.yaw).toBeGreaterThan(0)
    expect(slots.m2.look.yaw).toBeGreaterThan(0)
    expect(slots.m3.look.yaw).toBeLessThan(0)
    expect(slots.m4.look.yaw).toBeLessThan(0)
    // 越远转得越多，但不超过活体跟随鼠标时的上限 16°。
    expect(Math.abs(slots.m1.look.yaw)).toBeGreaterThan(Math.abs(slots.m2.look.yaw))
    for (const slot of Object.values(slots)) if (slot.look) expect(Math.abs(slot.look.yaw)).toBeLessThanOrEqual(16)
  })

  it.each([2, 3, 4, 5, 6])('%i 人：整队左右居中，画布装得下所有人', (count) => {
    for (const variant of ['card', 'stage']) {
      for (const [formation, lead] of [['带队', 0], ['带队', count - 1], ['接力', -1], ['搭伙', -1]]) {
        const layout = lineup(team(count, lead), formation, variant)
        expect(layout.slots).toHaveLength(count)
        const left = Math.min(...layout.slots.map((slot) => slot.x - slot.size / 2))
        const right = Math.max(...layout.slots.map((slot) => slot.x + slot.size / 2))
        expect(left + right).toBeCloseTo(0, 6)
        expect(layout.width).toBeGreaterThanOrEqual(right - left)
        expect(layout.height).toBeGreaterThanOrEqual(Math.max(...layout.slots.map((slot) => slot.size + slot.lift)))
        for (const slot of layout.slots) expect(Number.isFinite(slot.x + slot.lift + slot.size + slot.z)).toBe(true)
      }
    }
  })

  it('接力：前一个看着后一个，最后一个看镜头；搭伙：中间的看镜头', () => {
    const relay = lineup(team(3, -1), '接力', 'card').slots
    expect(relay.map((slot) => slot.look?.yaw ?? null)).toEqual([12, 12, null])
    const huddle = lineup(team(3, -1), '搭伙', 'card').slots
    expect(huddle[1].look).toBeNull()
    expect(huddle[0].look.yaw).toBeGreaterThan(0)
    expect(huddle[2].look.yaw).toBeLessThan(0)
  })
})

describe('rosterLine：小队卡上的那行名单', () => {
  it('有队长：岗位名 + 名字 + 专员数', () => {
    expect(rosterLine([{ name: 'Project Manager', title: '队长', lead: true }, { name: 'A' }, { name: 'B' }])).toBe('队长 Project Manager · 专员 2 个')
  })
  it('没有队长：把名字连起来', () => {
    expect(rosterLine([{ name: '甲' }, { name: '乙' }, { name: '丙' }])).toBe('甲 · 乙 · 丙')
  })
  it('有中文叫法的用中文叫法，这一行不带原名', () => {
    expect(rosterLine([{ name: 'Project Manager', nameZh: '项目经理', title: '队长', lead: true }, { name: 'A' }, { name: 'B' }])).toBe('队长 项目经理 · 专员 2 个')
    expect(rosterLine([{ name: 'Clip Bot', nameZh: '短片剪辑师' }, { name: '下载专家', nameZh: null }])).toBe('短片剪辑师 · 下载专家')
  })
})

const squad = (formation, members, flow) => ({ formation, members, flow })
const marketing = squad('带队', [
  { bot: 'pm', lead: true }, { bot: 'mr', lead: false }, { bot: 'pmm', lead: false }, { bot: 'wo', lead: false }, { bot: 'ma', lead: false },
], [
  { from: 'you', to: 'pm', what: '目标和上线日期' },
  { from: 'pm', to: 'mr', what: '调研线的任务简报' },
  { from: 'pm', to: 'pmm', what: '定位线的任务简报' },
  { from: 'pm', to: 'wo', what: '落地页线的任务简报' },
  { from: 'pm', to: 'ma', what: '数据线的任务简报' },
  { from: 'mr', to: 'pmm', what: '竞品发现' },
  { from: 'pmm', to: 'wo', what: '落地页简报' },
  { from: 'pmm', to: 'you', what: '广告简报（队里没人接）' },
  { from: 'wo', to: 'you', what: '落地页 PR，等你合并' },
  { from: 'pm', to: 'you', what: '合并、发布、花钱等你点头' },
])
const nodeOf = (layout, id) => layout.nodes.find((node) => node.id === id)
/** 标签占的矩形（按估算宽度），用来查互相压不压。 */
function labelBox(edge) {
  const width = Math.min(edge.label.max, Math.max(...edge.whats.map(textWidth)) + 18)
  const lines = edge.whats.reduce((sum, what) => sum + Math.max(1, Math.ceil(textWidth(what) / (edge.label.max - 16))), 0)
  const height = lines * 16 + 6
  const left = edge.label.anchor === 'center' ? edge.label.x - width / 2 : edge.label.anchor === 'left' ? edge.label.x : edge.label.x - width
  return { left, right: left + width, top: edge.label.y - height / 2, bottom: edge.label.y + height / 2 }
}
const overlap = (a, b) => !(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top)
function expectSane(layout) {
  for (const node of layout.nodes) {
    expect(node.x).toBeGreaterThanOrEqual(28)
    expect(node.x).toBeLessThanOrEqual(layout.width - 28)
    expect(node.y).toBeGreaterThanOrEqual(28)
    expect(node.y).toBeLessThanOrEqual(layout.height - 28)
  }
  for (const edge of layout.edges) {
    expect(edge.d).toMatch(/^M[\d.-]+ [\d.-]+/)
    expect(edge.d).not.toMatch(/NaN|Infinity|undefined/)
    expect(Number.isFinite(edge.head.x + edge.head.y + edge.head.angle + edge.label.x + edge.label.y + edge.label.max)).toBe(true)
    const box = labelBox(edge)
    expect(box.left).toBeGreaterThanOrEqual(-1)
    expect(box.right).toBeLessThanOrEqual(layout.width + 1)
    expect(box.top).toBeGreaterThanOrEqual(0)
    expect(box.bottom).toBeLessThanOrEqual(layout.height)
  }
}

describe('flowLayout：带队', () => {
  it.each([1140, 936, 760, FLOW_MIN_WIDTH])('宽 %i：四层自上而下，十条交接各有一条线', (width) => {
    const layout = flowLayout(marketing, width)
    expect(layout.kind).toBe('tiers')
    expect(layout.width).toBe(width)
    expect(layout.edges).toHaveLength(10)
    expect(layout.nodes.map((node) => node.id).sort()).toEqual(['ma', 'mr', 'pm', 'pmm', 'wo', 'you:in', 'you:out'])
    const y = (id) => nodeOf(layout, id).y
    expect(y('you:in')).toBeLessThan(y('pm'))
    expect(y('pm')).toBeLessThan(y('mr'))
    expect(new Set(['mr', 'pmm', 'wo', 'ma'].map(y)).size).toBe(1)
    expect(y('mr')).toBeLessThan(y('you:out'))
    // 队长和两个「你」在中线上，专员从左到右按数据顺序排。
    for (const id of ['you:in', 'pm', 'you:out']) expect(nodeOf(layout, id).x).toBeCloseTo(width / 2, 1)
    const xs = ['mr', 'pmm', 'wo', 'ma'].map((id) => nodeOf(layout, id).x)
    expect([...xs].sort((a, b) => a - b)).toEqual(xs)
    expectSane(layout)
  })

  it('队长交回给你的回到上面那个你，专员交回的汇到下面那个你', () => {
    const keys = flowLayout(marketing, 1140).edges.map((edge) => edge.key)
    expect(keys).toContain('you:in>pm')
    expect(keys).toContain('pm>you:in')
    expect(keys).toContain('pmm>you:out')
    expect(keys).toContain('wo>you:out')
  })

  it('标签互不压住，也不压住节点', () => {
    for (const width of [1140, 936, 760, FLOW_MIN_WIDTH]) {
      const layout = flowLayout(marketing, width)
      const boxes = layout.edges.map(labelBox)
      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) expect(overlap(boxes[i], boxes[j]), `${width}: ${layout.edges[i].key} 压住 ${layout.edges[j].key}`).toBe(false)
        for (const node of layout.nodes) {
          const tile = { left: node.x - 28, right: node.x + 28, top: node.y - 28, bottom: node.y + 28 }
          expect(overlap(boxes[i], tile), `${width}: ${layout.edges[i].key} 的标签压住 ${node.id}`).toBe(false)
        }
      }
    }
  })

  it('同一对节点、同一方向的几条合成一条线，标签一行一条', () => {
    const layout = flowLayout(squad('带队', [{ bot: 'a', lead: true }, { bot: 'b', lead: false }], [
      { from: 'a', to: 'b', what: '第一件' }, { from: 'a', to: 'b', what: '第二件' }, { from: 'b', to: 'a', what: '回执' },
    ]), 1140)
    expect(layout.edges.map((edge) => [edge.key, edge.whats])).toEqual([['a>b', ['第一件', '第二件']], ['b>a', ['回执']]])
    // 没有和「你」的交接，就不画「你」。
    expect(layout.nodes.map((node) => node.id)).toEqual(['a', 'b'])
    expectSane(layout)
  })

  it('各种少见的连法都画得出来：你直接交给专员、专员回给队长、隔着人的交接', () => {
    const members = [{ bot: 'a', lead: true }, { bot: 'b', lead: false }, { bot: 'c', lead: false }, { bot: 'd', lead: false }]
    const layout = flowLayout(squad('带队', members, [
      { from: 'you', to: 'c', what: '直接给专员的材料' }, { from: 'b', to: 'a', what: '周报' }, { from: 'a', to: 'b', what: '任务' },
      { from: 'b', to: 'd', what: '隔着一个人的交接' }, { from: 'd', to: 'b', what: '反过来的' }, { from: 'c', to: 'd', what: '相邻的' }, { from: 'd', to: 'c', what: '相邻的回头' },
    ]), 1140)
    expect(layout.edges).toHaveLength(7)
    expectSane(layout)
  })
})

describe('flowLayout：接力、搭伙和边界', () => {
  const trio = [{ bot: 'a', lead: false }, { bot: 'b', lead: false }, { bot: 'c', lead: false }]
  it('接力：从左到右一条线，交出的你在最左，收东西的你在最右', () => {
    const layout = flowLayout(squad('接力', trio, [
      { from: 'you', to: 'a', what: '原始素材' }, { from: 'a', to: 'b', what: '初稿' }, { from: 'b', to: 'c', what: '改好的稿子' },
      { from: 'c', to: 'you', what: '成品' }, { from: 'a', to: 'c', what: '跳过中间直接给' }, { from: 'c', to: 'a', what: '打回重写' },
    ]), 1140)
    expect(layout.kind).toBe('chain')
    expect(layout.nodes.map((node) => node.id)).toEqual(['you:in', 'a', 'b', 'c', 'you:out'])
    const xs = layout.nodes.map((node) => node.x)
    expect([...xs].sort((a, b) => a - b)).toEqual(xs)
    expect(new Set(layout.nodes.map((node) => node.y)).size).toBe(1)
    expect(layout.edges).toHaveLength(6)
    expectSane(layout)
  })

  it('搭伙：成员围成一圈，你在中间', () => {
    const layout = flowLayout(squad('搭伙', trio, [
      { from: 'you', to: 'a', what: '问题' }, { from: 'a', to: 'you', what: '答案' }, { from: 'b', to: 'you', what: '提醒' }, { from: 'b', to: 'c', what: '共享的表' },
    ]), 1140)
    expect(layout.kind).toBe('ring')
    const you = nodeOf(layout, 'you')
    expect(you.x).toBeCloseTo(570, 1)
    for (const id of ['a', 'b', 'c']) expect(Math.hypot(nodeOf(layout, id).x - you.x, nodeOf(layout, id).y - you.y)).toBeGreaterThan(100)
    expect(layout.edges).toHaveLength(4)
    expectSane(layout)
  })

  it('搭伙：一来一回的两条线，标签各在一侧，互不压住，也不压住节点；上半圈的名字写在砖上面', () => {
    const layout = flowLayout(squad('搭伙', trio, [
      { from: 'you', to: 'a', what: '植物照片' }, { from: 'a', to: 'you', what: '浇水提醒' },
      { from: 'you', to: 'b', what: '小票' }, { from: 'b', to: 'you', what: '月度账单' },
      { from: 'c', to: 'you', what: '饮食建议' }, { from: 'b', to: 'c', what: '外卖记录' },
    ]), 1140)
    const boxes = layout.edges.map(labelBox)
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) expect(overlap(boxes[i], boxes[j]), `${layout.edges[i].key} 压住 ${layout.edges[j].key}`).toBe(false)
      for (const node of layout.nodes) {
        const tile = { left: node.x - 28, right: node.x + 28, top: node.y - 28, bottom: node.y + 28 }
        expect(overlap(boxes[i], tile), `${layout.edges[i].key} 的标签压住 ${node.id}`).toBe(false)
      }
    }
    expect(nodeOf(layout, 'a').caption).toBe('above')
    expect(nodeOf(layout, 'b').caption).toBe('below')
    expectSane(layout)
  })

  it('接力：标签都放得下时只排一层', () => {
    const layout = flowLayout(squad('接力', trio, [{ from: 'you', to: 'a', what: '素材' }, { from: 'a', to: 'b', what: '初稿' }, { from: 'b', to: 'c', what: '定稿' }]), 1140)
    expect(new Set(layout.edges.map((edge) => edge.label.y)).size).toBe(1)
  })

  it('带队但数据里没有队长时退回一条线', () => {
    expect(flowLayout(squad('带队', trio, [{ from: 'a', to: 'b', what: '东西' }]), 1140).kind).toBe('chain')
  })

  it('没有可画的线：返回 null', () => {
    expect(flowLayout(squad('带队', trio, []), 1140)).toBeNull()
    expect(flowLayout(squad('带队', trio, [{ from: 'a', to: 'nobody', what: '给不存在的人' }, { from: 'a', to: 'a', what: '给自己' }, { from: 'a', to: 'b', what: null }]), 1140)).toBeNull()
  })

  it('画布不会比最窄宽度更窄；同样的输入算出同样的结果', () => {
    expect(flowLayout(marketing, 300).width).toBe(FLOW_MIN_WIDTH)
    expect(flowLayout(marketing, 1000)).toEqual(flowLayout(marketing, 1000))
  })
})

describe('已导入的成员', () => {
  it('键名带小队 slug', () => {
    expect(squadStorageKey('one-person-marketing')).toBe('bz-squad-one-person-marketing')
  })
  it('只认字符串数组，只留这支队里的成员，顺序跟着成员表', () => {
    const members = ['a', 'b', 'c']
    expect(parseImported('["c","a","x"]', members)).toEqual(['a', 'c'])
    for (const raw of [null, '', 'not json', '{"a":true}', '42', 'null']) expect(parseImported(raw, members)).toEqual([])
  })
})

describe('searchSquads：搜索面板里的小队', () => {
  const squads = [
    { slug: 'one-person-marketing', name: '一个人的市场部', tagline: '一个项目经理带四个专员', formation: '带队', author: { name: 'Josh Kim' }, members: [{ name: 'Project Manager', title: '队长' }, { name: 'Website Ops', title: '官网' }] },
    { slug: 'video-relay', name: '短视频流水线', tagline: '找选题、剪片子、出封面', formation: '接力', author: { name: '示例作者' }, members: [{ name: 'Clip Bot', nameZh: '短片剪辑师', title: '剪辑' }] },
  ]
  const slugs = (list) => list.map((item) => item.slug)
  it('空查询按传入顺序返回，最多 limit 支', () => {
    expect(slugs(searchSquads(squads, ''))).toEqual(['one-person-marketing', 'video-relay'])
    expect(slugs(searchSquads(squads, '', 1))).toEqual(['one-person-marketing'])
  })
  it.each([
    ['市场部', ['one-person-marketing']], ['流水线', ['video-relay']], ['小队', ['one-person-marketing', 'video-relay']],
    ['接力', ['video-relay']], ['josh', ['one-person-marketing']], ['website ops', ['one-person-marketing']], ['剪辑', ['video-relay']],
    ['video', ['video-relay']], ['不存在', []],
    // 成员的原名和中文叫法都能把小队搜出来
    ['clip bot', ['video-relay']], ['短片剪辑', ['video-relay']],
  ])('搜「%s」', (query, expected) => {
    expect(slugs(searchSquads(squads, query))).toEqual(expected)
  })
  it('返回的是原来的对象', () => {
    expect(searchSquads(squads, '市场部')[0]).toBe(squads[0])
  })
})
