import { describe, expect, it } from 'vitest'
import {
  ALL_ROLES, GROUP_PREVIEW, GROUP_PREVIEW_NARROW, SHELF_SORTS,
  collectionBots, groupBots, readShelfQuery, sortBots, writeShelfQuery,
} from '../../site/.vitepress/theme/shelf'
import { SHELF_COPY } from '../../site/.vitepress/meta.mjs'
import { loadEnums } from '../../scripts/lib/load-bots.mjs'
import { shelfData } from '../../site/.vitepress/data/bots.mjs'

const bot = (slug, fields = {}) => ({ slug, name: slug, category: '产品', addedAt: '2026-11-01', pick: null, ...fields })
const slugs = (bots) => bots.map(({ slug }) => slug)

describe('sortBots：三种排序', () => {
  const shelf = [
    bot('old', { addedAt: '2026-10-01' }),
    bot('new', { addedAt: '2026-11-10' }),
    bot('mid-b', { name: '乙', addedAt: '2026-11-01' }),
    bot('mid-a', { name: '甲', addedAt: '2026-11-01' }),
  ]

  it('最新：上架日期新的在前，同一天按名字', () => {
    expect(slugs(sortBots(shelf, 'new'))).toEqual(['new', 'mid-a', 'mid-b', 'old'])
  })

  it('最热：热度高的在前，热度一样（包括都没有热度）按最新', () => {
    expect(slugs(sortBots(shelf, 'hot', { old: 9, 'mid-b': 3 }))).toEqual(['old', 'mid-b', 'new', 'mid-a'])
    expect(slugs(sortBots(shelf, 'hot'))).toEqual(slugs(sortBots(shelf, 'new')))
  })

  it('推荐：编辑置顶的按置顶顺序排在最前，其余按最热', () => {
    const picked = [bot('a', { pick: 2 }), bot('b', { addedAt: '2026-11-09' }), bot('c', { pick: 0 }), bot('d', { addedAt: '2026-10-09' })]
    expect(slugs(sortBots(picked, 'rec'))).toEqual(['c', 'a', 'b', 'd'])
    // 热度只影响没置顶的那些；置顶的顺序不被热度打乱。
    expect(slugs(sortBots(picked, 'rec', { d: 5, a: 99 }))).toEqual(['c', 'a', 'd', 'b'])
  })

  it('pick 是 0 也算置顶；没写、写成 null 都不算', () => {
    expect(slugs(sortBots([bot('x'), bot('y', { pick: undefined }), bot('z', { pick: 0 })], 'rec'))).toEqual(['z', 'x', 'y'])
  })

  it('返回新数组，不改传入的数据', () => {
    const before = slugs(shelf)
    const result = sortBots(shelf, 'new')
    expect(result).not.toBe(shelf)
    expect(slugs(shelf)).toEqual(before)
  })

  it('排序的取值就是推荐、最新、最热三种', () => {
    expect(SHELF_SORTS).toEqual(['rec', 'new', 'hot'])
  })
})

describe('groupBots：按分组分段', () => {
  const shelf = [bot('a', { category: '内容' }), bot('b', { category: '产品' }), bot('c', { category: '内容' }), bot('d', { category: '生活' })]

  it('分组顺序跟枚举走，组内保持传入顺序，没有 Bot 的分组不出现', () => {
    const groups = groupBots(shelf, ['产品', '市场', '内容', '生活'])
    expect(groups.map((group) => [group.category, slugs(group.bots)])).toEqual([['产品', ['b']], ['内容', ['a', 'c']], ['生活', ['d']]])
  })

  it('只给一个分组就只出这一组；这一组没有 Bot 就是空数组', () => {
    expect(groupBots(shelf, ['内容']).map((group) => slugs(group.bots))).toEqual([['a', 'c']])
    expect(groupBots(shelf, ['求职'])).toEqual([])
  })

  it('每组先露两行：两列 4 张，单列 2 张', () => {
    expect([GROUP_PREVIEW, GROUP_PREVIEW_NARROW]).toEqual([4, 2])
  })
})

describe('collectionBots：专题里的 Bot', () => {
  const ordered = [bot('c'), bot('a'), bot('d'), bot('b')]
  const collection = { slug: 'kit', title: '工具箱', bots: ['a', 'ghost', 'b', 'c'] }

  it('推荐 = 编辑在专题里排的顺序；货架上没有的跳过', () => {
    expect(slugs(collectionBots(collection, ordered, 'rec'))).toEqual(['a', 'b', 'c'])
  })

  it('最新、最热沿用货架当前的先后', () => {
    for (const sort of ['new', 'hot']) expect(slugs(collectionBots(collection, ordered, sort))).toEqual(['c', 'a', 'b'])
  })
})

describe('地址栏里的筛选', () => {
  const known = { categories: ['产品', '销售'], collections: ['zero-setup', 'pm-kit'] }

  it('读：?role= 是分组，?c= 是专题；什么都没写就是全部', () => {
    expect(readShelfQuery('', known)).toEqual({ role: ALL_ROLES, collection: null })
    expect(readShelfQuery('?role=销售', known)).toEqual({ role: '销售', collection: null })
    expect(readShelfQuery('?role=%E9%94%80%E5%94%AE', known)).toEqual({ role: '销售', collection: null })
    expect(readShelfQuery('?c=pm-kit', known)).toEqual({ role: ALL_ROLES, collection: 'pm-kit' })
  })

  it('读：专题优先；不认识的值当没写', () => {
    expect(readShelfQuery('?role=销售&c=zero-setup', known)).toEqual({ role: ALL_ROLES, collection: 'zero-setup' })
    expect(readShelfQuery('?role=不存在', known)).toEqual({ role: ALL_ROLES, collection: null })
    expect(readShelfQuery('?c=nope&role=产品', known)).toEqual({ role: '产品', collection: null })
    expect(readShelfQuery('?role=all', known)).toEqual({ role: ALL_ROLES, collection: null })
  })

  it('写：筛选写进去，没有筛选就清掉；别的参数原样留着', () => {
    expect(writeShelfQuery('', { role: '销售', collection: null })).toBe(`?role=${encodeURIComponent('销售')}`)
    expect(writeShelfQuery('?role=产品', { role: ALL_ROLES, collection: 'pm-kit' })).toBe('?c=pm-kit')
    expect(writeShelfQuery('?c=pm-kit', { role: ALL_ROLES, collection: null })).toBe('')
    expect(writeShelfQuery('?bz-idle=500&c=pm-kit', { role: '产品', collection: null })).toBe(`?bz-idle=500&role=${encodeURIComponent('产品')}`)
    expect(writeShelfQuery('?x=1', { role: ALL_ROLES, collection: null })).toBe('?x=1')
  })

  it('写了再读，得到同一个筛选', () => {
    for (const filter of [{ role: '销售', collection: null }, { role: ALL_ROLES, collection: 'zero-setup' }, { role: ALL_ROLES, collection: null }]) {
      expect(readShelfQuery(writeShelfQuery('', filter), known)).toEqual(filter)
    }
  })
})

describe('首页固定文案', () => {
  it('计数和展开的写法', () => {
    expect(SHELF_COPY.total(82)).toBe('共 82 个')
    expect(SHELF_COPY.groupCount(16)).toBe('16 个')
    expect(SHELF_COPY.collectionCount(8)).toBe('8 个 Bot')
    expect(SHELF_COPY.expand(12)).toBe('展开 12 个')
    expect(`${SHELF_COPY.collectionKind}零门槛上手${SHELF_COPY.filterCount(8)}`).toBe('专题：零门槛上手 · 8 个')
  })
})

describe('真实货架', () => {
  const { bots, curation } = shelfData()
  const categories = loadEnums().categories

  it('每个 Bot 都落在某个分组里，分组顺序跟枚举一致', () => {
    const groups = groupBots(bots, categories)
    expect(groups.map((group) => group.category)).toEqual(categories.filter((category) => bots.some((item) => item.category === category)))
    expect(groups.reduce((sum, group) => sum + group.bots.length, 0)).toBe(bots.length)
  })

  it('推荐排序的前几位就是策展文件里置顶的那几个，顺序一致', () => {
    expect(slugs(sortBots(bots, 'rec')).slice(0, curation.picks.length)).toEqual(curation.picks)
  })

  it('每个专题里的 Bot 都能在货架上找到，推荐顺序和策展文件一致', () => {
    for (const collection of curation.collections) {
      expect(slugs(collectionBots(collection, bots, 'rec')), collection.slug).toEqual(collection.bots)
    }
  })
})
