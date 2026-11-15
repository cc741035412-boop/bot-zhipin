// 中文叫法（nameZh）：怎么称呼、怎么校验、怎么搜、怎么排。显示规则见 docs/dev/INTERACTION.md §3.4。
import { describe, expect, it } from 'vitest'
import { join, relative, resolve } from 'node:path'
import YAML from 'yaml'
import { displayName, originalName, fullName, hasChinese } from '../../scripts/lib/bot-name.mjs'
import { ROOT, loadAllBots, loadBot } from '../../scripts/lib/load-bots.mjs'
import { buildBotModel } from '../../scripts/lib/bot-model.mjs'
import { validateModels } from '../../scripts/lib/validate/core.mjs'
import { schema } from '../../scripts/lib/validate/generated/bot-schema.mjs'
import { pack } from '../../scripts/submission/bundle-core.mjs'
import { searchBots } from '../../site/.vitepress/theme/search'
import { sortBots } from '../../site/.vitepress/theme/shelf'
import { previewModel } from '../../site/.vitepress/theme/submit/preview.ts'

describe('怎么称呼', () => {
  it('有中文叫法：叫中文叫法，原名跟在后面', () => {
    const bot = { name: 'Idea Stress Test', nameZh: '点子拆解员' }
    expect(displayName(bot)).toBe('点子拆解员')
    expect(originalName(bot)).toBe('Idea Stress Test')
    expect(fullName(bot)).toBe('点子拆解员（Idea Stress Test）')
  })
  it.each([
    ['没写', { name: '记忆管家' }],
    ['是 null', { name: '记忆管家', nameZh: null }],
    ['是空串', { name: '记忆管家', nameZh: '' }],
    ['全是空格', { name: '记忆管家', nameZh: '   ' }],
    ['不是文字', { name: '记忆管家', nameZh: 42 }],
  ])('中文叫法%s：照旧只有原名', (_label, bot) => {
    expect(displayName(bot)).toBe('记忆管家')
    expect(originalName(bot)).toBe(null)
    expect(fullName(bot)).toBe('记忆管家')
  })
  it('中文叫法和原名一样：只写一遍', () => {
    const bot = { name: '记忆管家', nameZh: '记忆管家' }
    expect(displayName(bot)).toBe('记忆管家')
    expect(originalName(bot)).toBe(null)
    expect(fullName(bot)).toBe('记忆管家')
  })
  it('小队成员也带 name 和 nameZh，同一套规则', () => {
    expect(displayName({ bot: 'project-manager', name: 'Project Manager', nameZh: '项目经理', title: '队长' })).toBe('项目经理')
  })
  it('没传东西不报错', () => {
    expect(displayName(undefined)).toBe(undefined)
    expect(originalName(null)).toBe(null)
  })
  it('hasChinese：至少有一个汉字', () => {
    for (const value of ['点子拆解员', 'AI 说法核查员', 'X 简报员', 'Bot 团队顾问']) expect(hasChinese(value), value).toBe(true)
    for (const value of ['Idea Stress Test', 'AI PM OS', '123', '', 'カタカナ', null, undefined, 7]) expect(hasChinese(value), String(value)).toBe(false)
  })
})

describe('校验', () => {
  const fixture = join(ROOT, 'tests/fixtures/bots'), now = '2026-11-14T04:00:00Z'
  const memory = (bot) => buildBotModel(bot.slug, {
    files: bot.files.map((file) => ({ ...file, rel: relative(bot.dir, file.path) })),
    dirs: bot.skills.map((skill) => `skills/${skill.name}`),
    symlinks: bot.symlinks.map((link) => relative(bot.dir, resolve(bot.dir, '../..', link))),
  })
  const template = memory(loadBot('_template', join(ROOT, 'bots')))
  const check = (nameZh) => {
    const bot = memory(loadBot('demo-weekly-digest', fixture))
    delete bot.data.forkedFrom
    if (nameZh !== undefined) bot.data.nameZh = nameZh
    return validateModels([bot], { template, now }).errors.filter((error) => error.where === 'nameZh')
  }
  it('可选：不写能过；schema 里不在必填项里，长度 2 到 20', () => {
    expect(check(undefined)).toEqual([])
    expect(schema.required).not.toContain('nameZh')
    expect(schema.properties.nameZh).toMatchObject({ type: 'string', minLength: 2, maxLength: 20 })
  })
  it.each(['周报整理员', 'AI 周报员', '周报', '字'.repeat(20)])('「%s」通过', (nameZh) => {
    expect(check(nameZh)).toEqual([])
  })
  it.each([
    ['只有 1 个字', '周', '要求 2～20 个字符'],
    ['超过 20 个字', '字'.repeat(21), '要求 2～20 个字符'],
    ['带尖括号', '<b>周报员</b>', '不能使用字符 <、>、"'],
    ['不是文字', 123, '类型不正确'],
    ['里面没有中文', 'Weekly Digest', '里没有中文'],
  ])('%s：只报一条，写清位置和改法', (_label, nameZh, problem) => {
    const errors = check(nameZh)
    expect(errors).toHaveLength(1)
    expect(errors[0].file).toBe('bots/demo-weekly-digest/bot.yaml')
    expect(errors[0].problem).toContain(problem)
    expect(errors[0].fix.length).toBeGreaterThan(4)
  })
  it('没有中文的报错告诉人可以直接删掉这一行', () => {
    expect(check('Weekly Digest')[0].fix).toContain('删掉这一行')
  })
  it('模板里没有启用 nameZh（只在注释里说明），新建的 Bot 不会带一个假的中文叫法', () => {
    expect(template.data.nameZh).toBe(undefined)
    expect(template.raw).toContain('# nameZh:')
  })
  it('货架上现有的中文叫法都含中文，和原名不一样', () => {
    for (const bot of loadAllBots(join(ROOT, 'bots')).filter((item) => item.data?.nameZh !== undefined)) {
      expect(hasChinese(bot.data.nameZh), bot.slug).toBe(true)
      expect(bot.data.nameZh, bot.slug).not.toBe(bot.data.name)
    }
  })
})

describe('搜索：中文叫法和原名都算名字', () => {
  const bot = (slug, fields = {}) => ({ slug, name: '工具', tagline: '协助工作', category: '生活', author: { name: '作者' }, ...fields })
  const slugs = (bots) => bots.map(({ slug }) => slug)
  const shelf = [
    bot('tagline-only', { tagline: '帮你拆解点子' }),
    bot('idea-stress-test', { name: 'Idea Stress Test', nameZh: '点子拆解员' }),
    bot('plain', { name: '记忆管家' }),
  ]
  it.each([
    ['中文叫法', '点子拆解'], ['中文叫法的一部分', '拆解员'], ['原名', 'idea stress'], ['原名的一部分', 'STRESS'],
  ])('搜%s「%s」能找到', (_label, query) => {
    expect(slugs(searchBots(shelf, query))).toContain('idea-stress-test')
  })
  it('命中中文叫法和命中原名一样排在只命中介绍的前面', () => {
    expect(slugs(searchBots(shelf, '点子'))).toEqual(['idea-stress-test', 'tagline-only'])
    expect(slugs(searchBots([bot('t', { tagline: 'stress 测试' }), ...shelf], 'stress'))).toEqual(['idea-stress-test', 't'])
  })
  it('以哪个名字开头都算「名字开头」', () => {
    const bots = [bot('contains', { name: '我的点子本' }), bot('zh-prefix', { name: 'Idea Stress Test', nameZh: '点子拆解员' }), bot('en-prefix', { name: '点子 Lab', nameZh: '实验室助理' })]
    expect(slugs(searchBots(bots, '点子'))).toEqual(['zh-prefix', 'en-prefix', 'contains'])
    expect(slugs(searchBots(bots, 'idea'))).toEqual(['zh-prefix'])
  })
  it('多个词可以一个落在中文叫法、一个落在原名上，都算名字里', () => {
    const bots = [bot('meta', { name: '点子', category: 'stress' }), bot('both', { name: 'Idea Stress Test', nameZh: '点子拆解员' })]
    expect(slugs(searchBots(bots, '点子 stress'))).toEqual(['both', 'meta'])
  })
  it('没有中文叫法的照旧；nameZh 是 null 不会被「null」搜到', () => {
    expect(slugs(searchBots(shelf, '记忆'))).toEqual(['plain'])
    expect(searchBots([bot('x', { nameZh: null })], 'null')).toEqual([])
  })
})

describe('排序：按名字排的地方用显示出来的那个名字', () => {
  const bot = (slug, fields = {}) => ({ slug, name: slug, category: '产品', addedAt: '2026-11-01', pick: null, ...fields })
  const slugs = (bots) => bots.map(({ slug }) => slug)
  it('同一天上架：有中文叫法的按中文叫法排，不按原名', () => {
    // 按原名排是 Alpha、Zebra、波波；按显示的名字排是 阿（Zebra）、波波、猫（Alpha）。
    const shelf = [bot('alpha', { name: 'Alpha', nameZh: '猫咪助理' }), bot('plain', { name: '波波' }), bot('zebra', { name: 'Zebra', nameZh: '阿尔法助理' })]
    expect(slugs(sortBots(shelf, 'new'))).toEqual(['zebra', 'plain', 'alpha'])
    expect(slugs(sortBots(shelf, 'hot'))).toEqual(['zebra', 'plain', 'alpha'])
    expect(slugs(sortBots(shelf, 'rec'))).toEqual(['zebra', 'plain', 'alpha'])
  })
  it('上架日期和热度仍然排在名字前面', () => {
    const shelf = [bot('a', { nameZh: '阿' + '甲' }), bot('b', { nameZh: '波乙', addedAt: '2026-11-09' })]
    expect(slugs(sortBots(shelf, 'new'))).toEqual(['b', 'a'])
    expect(slugs(sortBots(shelf, 'hot', { a: 3 }))).toEqual(['a', 'b'])
  })
})

describe('投稿预览', () => {
  const slug = 'demo-prd-reviewer'
  const fixture = loadBot(slug, 'tests/fixtures/bots')
  const files = Object.fromEntries(fixture.files.filter((file) => file.text !== null).map((file) => [`bots/${slug}/${relative(fixture.dir, file.path)}`, file.text]))
  const yamlPath = `bots/${slug}/bot.yaml`
  const bundle = (change) => pack({ slug, files: { ...files, [yamlPath]: YAML.stringify({ ...YAML.parse(files[yamlPath]), ...change }) }, screenshots: ['output.png'] })
  const now = new Date('2026-11-14T17:00:00Z')
  it('投稿包里写了中文叫法，预览的摘要里就有', () => {
    expect(previewModel(bundle({ name: 'PRD Reviewer', nameZh: 'PRD 评审员' }), { now }).summary).toMatchObject({ name: 'PRD Reviewer', nameZh: 'PRD 评审员' })
  })
  it('中文叫法类型不对时不抛错，当作没写', () => {
    expect(previewModel(bundle({ nameZh: ['不是一句话'] }), { now }).summary.nameZh).toBe(null)
  })
  it('改编自：站上那个 Bot 有中文叫法时一起带上', () => {
    const options = { now, names: new Map([['idea-stress-test', 'Idea Stress Test']]), namesZh: new Map([['idea-stress-test', '点子拆解员']]) }
    expect(previewModel(bundle({ forkedFrom: 'idea-stress-test' }), options).summary).toMatchObject({ forkedFromName: 'Idea Stress Test', forkedFromNameZh: '点子拆解员' })
    expect(previewModel(bundle({ forkedFrom: '不合法 slug' }), options).summary).toMatchObject({ forkedFrom: null, forkedFromName: null, forkedFromNameZh: null })
  })
})
