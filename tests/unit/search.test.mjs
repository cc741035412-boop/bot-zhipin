import { describe, expect, it } from 'vitest'
import { searchBots } from '../../site/.vitepress/theme/search'

const bot = (slug, fields = {}) => ({
  slug, name: '工具', tagline: '协助工作', category: '日常', author: { name: '作者' }, ...fields,
})
const slugs = (bots) => bots.map(({ slug }) => slug)

describe('searchBots', () => {
  it('空查询/纯空白按输入顺序返回前八个；返回新数组、保留 Bot 引用', () => {
    const bots = Array.from({ length: 10 }, (_, i) => bot(`bot-${i}`))
    for (const query of ['', '   ', '\t\n']) {
      const result = searchBots(bots, query)
      expect(result).toEqual(bots.slice(0, 8))
      expect(result).not.toBe(bots)
      expect(result[0]).toBe(bots[0])
    }
  })

  it.each([
    ['name', { name: '小小PRD助手' }],
    ['tagline', { tagline: '帮你检查PRD文档' }],
    ['category', { category: 'PRD评审' }],
    ['author.name', { author: { name: 'PRD老师' } }],
    ['slug', { slug: 'my-prd-bot' }],
  ])('匹配 %s 的子串，去首尾空白且不分大小写', (_, fields) => {
    const match = bot('match', fields)
    expect(searchBots([bot('other'), match], '  pRd  ')).toEqual([match])
  })

  it('AND 匹配：每个词必须命中，可跨字段，连续空白不产生空词', () => {
    const match = bot('weekly', { name: '周报助手', category: '学习', author: { name: 'Jakob' } })
    const partial = bot('partial', { name: '周报助手', category: '学习' })
    expect(searchBots([partial, match], ' 周报   学习\tJAKOB ')).toEqual([match])
    expect(searchBots([match], '周报 缺失')).toEqual([])
  })

  it('名字开头 > 名字包含 > 分类/作者 > 介绍/slug，同档保持原序', () => {
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

  it('多词查询：完整名字前缀/包含优先，再比较分类/作者词命中', () => {
    const bots = [
      bot('description', { tagline: 'PRD bot' }),
      bot('metadata', { category: 'PRD', author: { name: 'Bot 作者' } }),
      bot('contained', { name: '我的 PRD Bot' }),
      bot('prefix', { name: 'PRD Bot helper' }),
    ]
    expect(slugs(searchBots(bots, 'prd bot'))).toEqual(['prefix', 'contained', 'metadata', 'description'])
  })

  it('limit 在排序之后应用；零/负数返回空，不足 limit 不补齐', () => {
    const bots = [bot('low', { tagline: 'prd' }), bot('high', { name: 'PRD' })]
    expect(slugs(searchBots(bots, 'prd', 1))).toEqual(['high'])
    expect(searchBots(bots, 'prd', 0)).toEqual([])
    expect(searchBots(bots, '', -1)).toEqual([])
    expect(searchBots(bots, 'prd', 20)).toHaveLength(2)
    expect(searchBots(bots, '', 1)).toEqual([bots[0]])
  })

  it('查询按文字子串而非正则匹配；没有匹配/没有 Bot 时返回空', () => {
    const bots = [bot('special', { name: '[工具].*' })]
    expect(searchBots(bots, '[工具].*')).toEqual(bots)
    expect(searchBots(bots, '^工具')).toEqual([])
    expect(searchBots([], '')).toEqual([])
    expect(searchBots([], '工具')).toEqual([])
  })

  it('缺少可选字段也能查找；不会把 undefined 当作可搜索文字', () => {
    const bots = [{ slug: 'simple', name: '简单' }, { slug: 'empty-author', name: '作者', author: {} }]
    expect(searchBots(bots, '简单')).toEqual([bots[0]])
    expect(searchBots(bots, 'undefined')).toEqual([])
  })

  it('不修改数组、Bot 或嵌套作者对象', () => {
    const bots = Object.freeze([
      Object.freeze(bot('later', { tagline: 'PRD', author: Object.freeze({ name: '作者' }) })),
      Object.freeze(bot('first', { name: 'PRD', author: Object.freeze({ name: '作者' }) })),
    ])
    expect(searchBots(bots, 'prd')).toEqual([bots[1], bots[0]])
    expect(slugs(bots)).toEqual(['later', 'first'])
  })
})
