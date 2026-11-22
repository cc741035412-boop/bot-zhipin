import { describe, expect, it } from 'vitest'
import { matchWord, queryWords, searchBots, searchLibrary } from '../../site/.vitepress/theme/search'

// 默认字段都不含测试用的关键词，每条用例只改它关心的那一个字段。
const bot = (slug, fields = {}) => ({
  slug, name: '工具', tagline: '协助工作', category: '生活', author: { name: '作者' }, ...fields,
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

// 收录条目（Prompt、Skill）：默认字段同样不含测试用的关键词。
const entry = (slug, fields = {}) => ({
  slug, title: '条目', purpose: '帮你干活', category: '效率', author: { name: '作者' }, scenarios: [], tags: [], ...fields,
})

describe('searchLibrary：空查询', () => {
  it('空字符串和纯空白返回空数组（面板没输入时不列收录条目）', () => {
    const items = [entry('a'), entry('b')]
    for (const query of ['', '   ', '\t\n', '　']) {
      expect(searchLibrary(items, query)).toEqual([])
      expect(searchLibrary(items, query, Infinity)).toEqual([])
    }
  })
})

describe('searchLibrary：匹配', () => {
  it.each([
    ['title', { title: '周报生成器' }],
    ['titleOriginal（Prompt 原标题）', { titleOriginal: 'Weekly 周报 Writer' }],
    ['name（Skill 原名）', { name: 'weekly-周报' }],
    ['purpose', { purpose: '把零散记录整理成周报' }],
    ['category', { category: '周报' }],
    ['author.name', { author: { name: '周报老师' } }],
    ['scenarios', { scenarios: ['别的场景', '周五下午写周报'] }],
    ['tags', { tags: ['总结', '周报'] }],
    ['agents（Skill 能用在）', { agents: ['周报 Agent'] }],
  ])('命中 %s 的子串', (_, fields) => {
    const match = entry('match', fields)
    expect(searchLibrary([entry('other'), match], '周报')).toEqual([match])
  })

  it('不搜正文：body、bodyZh、copyText、summary 里的词搜不到', () => {
    const item = entry('body', { body: '周报', bodyZh: '周报', copyText: '周报', summary: '周报' })
    expect(searchLibrary([item], '周报')).toEqual([])
  })

  it('多个词可以落在不同字段上，每个词都要命中', () => {
    const match = entry('match', { title: '会议纪要', scenarios: ['整理周会录音'] })
    const half = entry('half', { title: '会议纪要' })
    expect(searchLibrary([half, match], '纪要 周会')).toEqual([match])
    expect(searchLibrary([match], '纪要 周会 不存在')).toEqual([])
  })

  it('全角、大小写不影响', () => {
    const match = entry('match', { name: 'frontend-design' })
    expect(searchLibrary([entry('other'), match], 'ＦＲＯＮＴＥＮＤ')).toEqual([match])
  })
})

describe('searchLibrary：排序', () => {
  it('只有显示的标题算名字档；原名和分类、作者同档；用途、标签在后；适用场景最后', () => {
    const items = [
      entry('scenario', { scenarios: ['写周报'] }),
      entry('purpose', { purpose: '整理周报' }),
      entry('category', { category: '周报' }),
      entry('contained', { title: '我的周报' }),
      entry('original', { titleOriginal: 'Weekly 周报' }),
      entry('tag', { tags: ['周报'] }),
      entry('author', { author: { name: '周报老师' } }),
      entry('prefix', { title: '周报生成器' }),
    ]
    expect(searchLibrary(items, '周报', Infinity).map(({ slug }) => slug)).toEqual([
      'prefix', 'contained', 'category', 'original', 'author', 'purpose', 'tag', 'scenario',
    ])
  })

  it('标题开头排最前；Skill 原名只在第 2 档', () => {
    const items = [entry('alias', { name: 'pdf' }), entry('tag', { tags: ['pdf'] }), entry('title', { title: 'PDF 工具箱', name: 'pdf' })]
    expect(searchLibrary(items, 'pdf').map(({ slug }) => slug)).toEqual(['title', 'alias', 'tag'])
  })

  it('适用场景单独最低一档：只在场景里顺带提到的，挤不掉打了标签的', () => {
    const mentioned = Array.from({ length: 4 }, (_, i) => entry(`mention-${i}`, { scenarios: ['把会议记录整理成 PPT'] }))
    const tagged = entry('tagged', { tags: ['PPT'] })
    const used = entry('used', { purpose: '照模板做 PPT' })
    expect(searchLibrary([...mentioned, tagged, used], 'ppt').map(({ slug }) => slug)).toEqual(['tagged', 'used', 'mention-0', 'mention-1'])
  })
})

describe('searchLibrary：不显示的原名和 slug', () => {
  const draft = entry('draft-email', { title: '起草邮件', titleOriginal: 'create_formal_email' })

  it('原名里只是子串的英文词不命中：「ai」不命中 create_formal_email、draft-email', () => {
    expect(searchLibrary([draft], 'ai')).toEqual([])
    expect(searchLibrary([entry('x', { name: 'explainUI' })], 'ai')).toEqual([])
  })

  it('英文词从原名里某个词的开头命中：下划线、连字符、驼峰都算分词', () => {
    for (const query of ['email', 'formal', 'formal em', 'create', 'CREATE_FORMAL', 'draft']) {
      expect(searchLibrary([draft], query)).toEqual([draft])
    }
    const camel = entry('camel', { name: 'createFormalEmail' })
    expect(searchLibrary([camel], 'email')).toEqual([camel])
    expect(searchLibrary([camel], 'mail')).toEqual([])
    const acronym = entry('acronym', { titleOriginal: 'PDFToolkit' })
    expect(searchLibrary([acronym], 'toolkit')).toEqual([acronym])
  })

  it('中文词在原名里照旧按子串找', () => {
    const item = entry('zh', { titleOriginal: '原版·周报模板' })
    expect(searchLibrary([item], '周报')).toEqual([item])
  })

  it('显示的标题、用途照旧按子串找：标题里的 email 包含 ai 也算', () => {
    const shown = entry('shown', { title: 'Email 助手' })
    expect(searchLibrary([shown], 'ai')).toEqual([shown])
  })
})

describe('中英文不打空格也能搜', () => {
  it('queryWords 在汉字和英文字母、数字的交界处断开', () => {
    expect(queryWords('做PPT')).toEqual(['做', 'ppt'])
    expect(queryWords('写SQL查询')).toEqual(['写', 'sql', '查询'])
    expect(queryWords('AI腔')).toEqual(['ai', '腔'])
    expect(queryWords('ＧＰＴ４写作 web3')).toEqual(['gpt4', '写作', 'web3'])
    expect(queryWords('  ')).toEqual([])
  })

  it('「做PPT」「写SQL」「AI腔」和带空格的写法命中同样的条目，名字开头的仍排第 0 档', () => {
    const items = [
      entry('later', { purpose: '先做一份 PPT' }),
      entry('ppt', { title: '做 PPT 并检查排版' }),
      entry('sql', { title: '帮你写 SQL' }),
      entry('ai', { title: '去掉 AI 腔' }),
    ]
    expect(searchLibrary(items, '做PPT').map(({ slug }) => slug)).toEqual(['ppt', 'later'])
    expect(searchLibrary(items, '写SQL').map(({ slug }) => slug)).toEqual(['sql'])
    expect(searchLibrary(items, 'AI腔').map(({ slug }) => slug)).toEqual(['ai'])
  })

  it('Bot 搜索同样受益：「PRD评审」排在名字开头档', () => {
    const bots = [bot('other', { tagline: 'PRD 评审前的准备' }), bot('reviewer', { name: 'PRD 评审员' })]
    expect(slugs(searchBots(bots, 'PRD评审'))).toEqual(['reviewer', 'other'])
  })
})

describe('searchLibrary：limit', () => {
  const items = Array.from({ length: 6 }, (_, i) => entry(`item-${i}`, { scenarios: ['周报'] }))

  it('默认最多 4 条，先排序再截断', () => {
    expect(searchLibrary(items, '周报')).toEqual(items.slice(0, 4))
    const best = entry('best', { title: '周报' })
    expect(searchLibrary([...items, best], '周报', 1)).toEqual([best])
  })

  it('Infinity 表示全部；0 返回空', () => {
    expect(searchLibrary(items, '周报', Infinity)).toHaveLength(6)
    expect(searchLibrary(items, '周报', 0)).toEqual([])
  })

  it('返回的是原来的条目对象，不改输入', () => {
    const frozen = Object.freeze([Object.freeze(entry('a', { title: '周报', scenarios: Object.freeze(['x']) }))])
    expect(searchLibrary(frozen, '周报')[0]).toBe(frozen[0])
  })
})

describe('单个字母不拆开', () => {
  it('queryWords：只在两个字符以上的英文、数字段处断开，+ 和 # 算在里面', () => {
    expect(queryWords('B站')).toEqual(['b站'])
    expect(queryWords('K线')).toEqual(['k线'])
    expect(queryWords('X简报')).toEqual(['x简报'])
    expect(queryWords('3D打印')).toEqual(['3d', '打印'])
    expect(queryWords('H5页面')).toEqual(['h5', '页面'])
    expect(queryWords('写C#代码')).toEqual(['写', 'c#', '代码'])
    expect(queryWords('gpt-4o')).toEqual(['gpt-4o'])
  })

  it('matchWord：中英混写的词再拿去掉空白的文字比一次；纯英文、纯中文不这样比', () => {
    expect(matchWord('把视频发到 b 站', 'b站')).toBe(true)
    expect(matchWord('website 运营', 'b站')).toBe(false)
    expect(matchWord('paid media', 'dm')).toBe(false)
    expect(matchWord('周 报', '周报')).toBe(false)
  })

  it('「B站」只命中写了「B 站」的，不命中 Website', () => {
    const items = [entry('website-ops', { title: 'Website 运营', purpose: '每周看网站数据' }), entry('downloader', { title: '把 B 站视频存下来' })]
    expect(searchLibrary(items, 'B站').map(({ slug }) => slug)).toEqual(['downloader'])
  })

  it('「K线」不命中 Lead Pipeline Desk；「X简报」仍命中「X 简报员」', () => {
    const bots = [bot('lead-pipeline-desk', { name: 'Lead Pipeline Desk', tagline: '跟进销售线索' }), bot('x-brief', { name: 'X Brief', nameZh: 'X 简报员' })]
    expect(searchBots(bots, 'K线')).toEqual([])
    expect(slugs(searchBots(bots, 'X简报'))).toEqual(['x-brief'])
  })

  it('gpt-4o、web3、3D、H5 照常能搜到', () => {
    const items = [
      entry('gpt', { title: 'GPT-4o 提示词' }), entry('web3', { title: 'Web3 白皮书' }),
      entry('3d', { title: '3D 打印模型' }), entry('h5', { title: 'H5 活动页' }),
    ]
    expect(searchLibrary(items, 'gpt-4o').map(({ slug }) => slug)).toEqual(['gpt'])
    expect(searchLibrary(items, 'web3').map(({ slug }) => slug)).toEqual(['web3'])
    expect(searchLibrary(items, '3D').map(({ slug }) => slug)).toEqual(['3d'])
    expect(searchLibrary(items, '3D打印').map(({ slug }) => slug)).toEqual(['3d'])
    expect(searchLibrary(items, 'H5').map(({ slug }) => slug)).toEqual(['h5'])
  })
})

describe('别名两套切法：整词和驼峰切开的都能搜到', () => {
  it.each([
    ['PDFs', 'Extract tables from PDFs', ['pdf', 'pdfs']],
    ['3D', 'Classic 3D Scene', ['3d']],
    ['B2B', 'B2B Sales Email', ['b2b']],
    ['ChatGPT', 'ChatGPT Prompt Pack', ['chatgpt', 'gpt', 'chat']],
    ['GitHub', 'GitHub Issue Writer', ['github', 'hub']],
    ['iOS', 'iOS App Review', ['ios']],
  ])('%s', (_, original, queries) => {
    const item = entry('x', { title: '某条目', titleOriginal: original })
    for (const query of queries) expect(searchLibrary([item], query), query).toEqual([item])
  })

  it('子串照样不算：email 里的 ai、explainUI 里的 ai 不命中', () => {
    expect(searchLibrary([entry('a', { titleOriginal: 'create_formal_email' })], 'ai')).toEqual([])
    expect(searchLibrary([entry('b', { name: 'explainUI' })], 'ai')).toEqual([])
  })
})

describe('别名里 + 和 # 算词里的字', () => {
  const cpp = entry('cpp', { titleOriginal: 'Modern C++ Guide' })
  const csharp = entry('csharp', { titleOriginal: 'C# Tips' })
  const review = entry('review', { titleOriginal: 'Code Review' })
  const chat = entry('chat-summary', { title: '聊天总结' })

  it('c++ 只命中原名里有 C++ 的，不命中 Code Review、chat-summary', () => {
    expect(searchLibrary([review, chat, cpp, csharp], 'c++')).toEqual([cpp])
  })

  it('c# 只命中 C#', () => {
    expect(searchLibrary([review, chat, cpp, csharp], 'C#')).toEqual([csharp])
  })
})

describe('同一档里按「只在场景里找到的词」的个数排', () => {
  it('「做PPT」：打了 PPT 标签的排在只在场景里提到 PPT 的前面', () => {
    const mentioned = entry('mentioned', { title: '做周报', scenarios: ['顺便做 PPT'] })
    const tagged = entry('tagged', { title: '做演示稿', tags: ['PPT'] })
    expect(searchLibrary([mentioned, tagged], '做PPT').map(({ slug }) => slug)).toEqual(['tagged', 'mentioned'])
  })

  it('不跨档：标题命中的仍排在只命中用途的前面', () => {
    const titled = entry('titled', { title: '做周报', scenarios: ['顺便做 PPT'] })
    const purpose = entry('purpose', { purpose: '帮你做 PPT' })
    expect(searchLibrary([purpose, titled], '做PPT').map(({ slug }) => slug)).toEqual(['titled', 'purpose'])
  })
})
