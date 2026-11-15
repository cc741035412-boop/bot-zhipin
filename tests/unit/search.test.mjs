import { describe, expect, it } from 'vitest'
import { searchBots } from '../../site/.vitepress/theme/search'

// 默认字段都不含测试用的关键词，每条用例只改它关心的那一个字段。
const bot = (slug, fields = {}) => ({
  slug, name: '工具', tagline: '协助工作', category: '日常', author: { name: '作者' }, ...fields,
})
const slugs = (bots) => bots.map(({ slug }) => slug)

describe('searchBots：空查询', () => {
  it('空字符串和纯空白都按传入顺序返回前 8 个', () => {
    const bots = Array.from({ length: 10 }, (_, i) => bot(`bot-${i}`))
    for (const query of ['', '   ', '\t\n', '　']) {
      expect(searchBots(bots, query)).toEqual(bots.slice(0, 8))
    }
  })

  it('返回新数组，里面还是原来的对象', () => {
    const bots = [bot('a'), bot('b')]
    const result = searchBots(bots, '')
    expect(result).not.toBe(bots)
    expect(result[0]).toBe(bots[0])
  })
})

describe('searchBots：匹配', () => {
  it.each([
    ['name', { name: '小小PRD助手' }],
    ['tagline', { tagline: '帮你检查PRD文档' }],
    ['category', { category: 'PRD评审' }],
    ['author.name', { author: { name: 'PRD老师' } }],
  ])('命中 %s 的子串，去掉首尾空格、不分大小写', (_, fields) => {
    const match = bot('match', fields)
    expect(searchBots([bot('other'), match], '  pRd  ')).toEqual([match])
  })

  it('命中 slug 的子串', () => {
    const match = bot('my-prd-bot')
    expect(searchBots([bot('other'), match], 'PRD')).toEqual([match])
  })

  it('多个词每个都要命中，可以落在不同字段上', () => {
    const match = bot('weekly', { name: '周报助手', category: '学习', author: { name: 'Jakob' } })
    const partial = bot('partial', { name: '周报助手', category: '学习' })
    expect(searchBots([partial, match], ' 周报   学习\tJAKOB ')).toEqual([match])
    expect(searchBots([match], '周报 缺失')).toEqual([])
  })

  it('全角字母、全角空格和半角写法等价', () => {
    const match = bot('match', { name: 'PRD 评审员' })
    expect(searchBots([bot('other'), match], 'ｐｒｄ　评审')).toEqual([match])
    expect(searchBots([bot('fullwidth', { name: 'ＰＲＤ助手' })], 'prd')).toHaveLength(1)
  })

  it('查询当作普通文字，不当正则', () => {
    const bots = [bot('special', { name: '[工具].*' })]
    expect(searchBots(bots, '[工具].*')).toEqual(bots)
    expect(searchBots(bots, '^工具')).toEqual([])
    expect(searchBots(bots, '.')).toEqual(bots)
  })

  it('缺字段的 Bot 不报错，也不会被 "undefined"、"null" 搜到', () => {
    const bots = [
      { slug: 'bare', name: '简单' },
      { slug: 'no-author-name', name: '半成品', author: {} },
      { slug: 'nulls', name: '空值', tagline: null, category: null, author: null },
    ]
    expect(searchBots(bots, '简单')).toEqual([bots[0]])
    expect(searchBots(bots, 'undefined')).toEqual([])
    expect(searchBots(bots, 'null')).toEqual([bots[2]]) // 只因为 slug 里有 null
  })

  it('没有 Bot 或没有命中时返回空数组', () => {
    expect(searchBots([], '')).toEqual([])
    expect(searchBots([], '工具')).toEqual([])
    expect(searchBots([bot('a')], '不存在的词')).toEqual([])
  })
})

describe('searchBots：排序', () => {
  it('名字开头 > 名字包含 > 分类或作者 > 只有介绍或 slug；同档保持传入顺序', () => {
    const bots = [
      bot('tagline', { tagline: 'PRD' }),
      bot('category', { category: 'PRD' }),
      bot('contained', { name: '我的 PRD 工具' }),
      bot('author', { author: { name: 'PRD老师' } }),
      bot('prefix-b', { name: 'PRD Z' }),
      bot('prd-slug'),
      bot('prefix-a', { name: 'PRD A' }),
    ]
    expect(slugs(searchBots(bots, 'prd'))).toEqual([
      'prefix-b', 'prefix-a', 'contained', 'category', 'author', 'tagline', 'prd-slug',
    ])
  })

  it('名字命中时，介绍里也有这个词不会把它拉低', () => {
    const bots = [
      bot('only-tagline', { tagline: '周报' }),
      bot('both', { name: '周报整理员', tagline: '把一周的事整理成周报' }),
    ]
    expect(slugs(searchBots(bots, '周报'))).toEqual(['both', 'only-tagline'])
  })

  it('多个词：整句是名字开头最前，其次是每个词都在名字里（不看先后）', () => {
    const bots = [
      bot('tagline', { tagline: 'PRD bot' }),
      bot('meta', { category: 'PRD', author: { name: 'Bot 作者' } }),
      bot('reversed', { name: 'Bot 版 PRD' }),
      bot('half-name', { name: 'PRD 工具', tagline: '一个 bot' }),
      bot('prefix', { name: 'PRD  Bot helper' }),
    ]
    expect(slugs(searchBots(bots, 'prd bot'))).toEqual(['prefix', 'reversed', 'meta', 'half-name', 'tagline'])
  })
})

describe('searchBots：limit', () => {
  const bots = [bot('low', { tagline: 'prd' }), bot('high', { name: 'PRD' })]

  it('先排序再截断', () => {
    expect(slugs(searchBots(bots, 'prd', 1))).toEqual(['high'])
    expect(searchBots(bots, '', 1)).toEqual([bots[0]])
  })

  it('不足 limit 不补齐；Infinity 表示全部；0、负数、NaN 返回空', () => {
    expect(searchBots(bots, 'prd', 20)).toHaveLength(2)
    expect(searchBots(bots, 'prd', Infinity)).toHaveLength(2)
    expect(searchBots(bots, '', Infinity)).toHaveLength(2)
    expect(searchBots(bots, 'prd', 0)).toEqual([])
    expect(searchBots(bots, '', -1)).toEqual([])
    expect(searchBots(bots, 'prd', NaN)).toEqual([])
  })

  it('小数向下取整', () => {
    expect(searchBots(bots, '', 1.9)).toHaveLength(1)
  })
})

describe('searchBots：不改输入', () => {
  it('冻结的数组、Bot、作者对象都能搜', () => {
    const bots = Object.freeze([
      Object.freeze(bot('later', { tagline: 'PRD', author: Object.freeze({ name: '作者' }) })),
      Object.freeze(bot('first', { name: 'PRD', author: Object.freeze({ name: '作者' }) })),
    ])
    expect(searchBots(bots, 'prd')).toEqual([bots[1], bots[0]])
    expect(slugs(bots)).toEqual(['later', 'first'])
  })
})
