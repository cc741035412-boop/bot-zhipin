import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { loadAllBots } from '../../scripts/lib/load-bots.mjs'
import { loadAllSquads } from '../../scripts/lib/load-squads.mjs'
import { loadCuration } from '../../scripts/lib/load-curation.mjs'
import { shelfData } from '../../site/.vitepress/data/bots.mjs'
import { RELATED_LIMIT, byRecommended, relatedBots, squadLineups } from '../../site/.vitepress/data/detail.mjs'

const fixtures = resolve(import.meta.dirname, '../fixtures')
const bot = (slug, extra = {}) => ({
  slug, name: slug, tagline: `${slug} 的介绍`, category: '产品', addedAt: '2026-11-01', pick: null, avatar: null,
  detailUrl: `/bots/${slug}`, squads: [], about: { intro: '很长的介绍' }, ...extra,
})

describe('详情页的「同组的 Bot」', () => {
  const shelf = [
    bot('self'),
    bot('old', { addedAt: '2026-10-01' }),
    bot('new', { addedAt: '2026-11-10', name: '甲' }),
    bot('picked-second', { pick: 5, addedAt: '2026-09-01' }),
    bot('picked-first', { pick: 2, addedAt: '2026-08-01', avatar: '/bot-assets/picked-first/avatar.png' }),
    bot('other-group', { category: '市场', pick: 0 }),
    bot('same-day-b', { addedAt: '2026-11-10', name: '乙' }),
  ]
  it('只取同一个分组、不含自己，最多三个', () => {
    const related = relatedBots(shelf, shelf[0])
    expect(related).toHaveLength(RELATED_LIMIT)
    expect(related.map((item) => item.slug)).not.toContain('self')
    expect(related.map((item) => item.slug)).not.toContain('other-group')
  })
  it('按推荐顺序：编辑置顶的在前（按置顶序号），其余上架新的在前，再按名字', () => {
    expect(relatedBots(shelf, shelf[0], 10).map((item) => item.slug)).toEqual(['picked-first', 'picked-second', 'new', 'same-day-b', 'old'])
    expect([...shelf].sort(byRecommended)[0].slug).toBe('other-group')
  })
  it('只带卡片要用的字段，不把 about 全文带进别人的页面', () => {
    expect(relatedBots(shelf, shelf[0])[0]).toEqual({
      slug: 'picked-first', name: 'picked-first', nameZh: null, avatar: '/bot-assets/picked-first/avatar.png', tagline: 'picked-first 的介绍', detailUrl: '/bots/picked-first',
    })
  })
  it('有中文叫法的带上中文叫法；同一天上架的按显示出来的名字排（有中文叫法按中文叫法）', () => {
    const mixed = [
      bot('self'),
      // 原名 Zebra 排在后面，中文叫法「阿」排在前面：按显示的名字排，它应该在「波」前面。
      bot('zebra', { name: 'Zebra', nameZh: '阿尔法助理' }),
      bot('plain', { name: '波波' }),
    ]
    const related = relatedBots(mixed, mixed[0])
    expect(related.map((item) => item.slug)).toEqual(['zebra', 'plain'])
    expect(related[0]).toMatchObject({ name: 'Zebra', nameZh: '阿尔法助理' })
    expect(related[1]).toMatchObject({ name: '波波', nameZh: null })
  })
  it('分组里只有自己时是空的', () => {
    expect(relatedBots(shelf, shelf[5])).toEqual([])
  })
  it('不改动传进来的货架顺序', () => {
    const before = shelf.map((item) => item.slug)
    relatedBots(shelf, shelf[0])
    expect(shelf.map((item) => item.slug)).toEqual(before)
  })
})

describe('详情页「所在小队」的成员小头像', () => {
  const squads = [
    { slug: 'alpha', members: [{ bot: 'b', name: '乙', avatar: null, lead: false }, { bot: 'a', name: '甲', avatar: '/a.png', lead: true }, { bot: 'c', name: '丙', avatar: null, lead: false }] },
    { slug: 'beta', members: [{ bot: 'x', name: '壬', avatar: null, lead: false }, { bot: 'b', name: '乙', avatar: null, lead: false }] },
    { slug: 'gamma', members: [{ bot: 'x', name: '壬', avatar: null, lead: false }, { bot: 'y', name: '癸', avatar: null, lead: false }] },
  ]
  it('只给这个 Bot 所在的小队；队长排最前，其余按编制表的顺序', () => {
    const lineups = squadLineups(squads, { squads: [{ slug: 'alpha' }, { slug: 'beta' }] })
    expect(Object.keys(lineups)).toEqual(['alpha', 'beta'])
    expect(lineups.alpha).toEqual([{ slug: 'a', name: '甲', nameZh: null, avatar: '/a.png' }, { slug: 'b', name: '乙', nameZh: null, avatar: null }, { slug: 'c', name: '丙', nameZh: null, avatar: null }])
    // 成员有中文叫法时一起带上（自定义头像的替代文字用）
    expect(squadLineups([{ slug: 'alpha', members: [{ bot: 'a', name: 'Alpha', nameZh: '阿尔法', avatar: null, lead: true }] }], { squads: [{ slug: 'alpha' }] }).alpha)
      .toEqual([{ slug: 'a', name: 'Alpha', nameZh: '阿尔法', avatar: null }])
    expect(lineups.beta.map((member) => member.slug)).toEqual(['x', 'b'])
  })
  it('不在任何小队里时是空对象', () => {
    expect(squadLineups(squads, { squads: [] })).toEqual({})
    expect(squadLineups(squads, {})).toEqual({})
  })
  it('fixtures：三个示例 Bot 都在示例小队里，队长是 PRD 评审员；各在一个分组，没有同组的 Bot', () => {
    const data = shelfData(loadAllBots(join(fixtures, 'bots')), {
      squads: loadAllSquads(join(fixtures, 'squads')),
      curation: loadCuration(join(fixtures, 'curation/shelf.yaml')).data,
    })
    for (const item of data.bots) {
      expect(relatedBots(data.bots, item)).toEqual([])
      const lineups = squadLineups(data.squads, item)
      expect(Object.keys(lineups)).toEqual(['demo-squad'])
      expect(lineups['demo-squad'].map((member) => member.slug)).toEqual(['demo-prd-reviewer', 'demo-weekly-digest', 'demo-external'])
      expect(lineups['demo-squad'][0].avatar).toBe('/bot-assets/demo-prd-reviewer/avatar.png')
    }
  })
})
