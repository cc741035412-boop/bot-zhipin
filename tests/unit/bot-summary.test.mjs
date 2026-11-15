import { expect, it } from 'vitest'
import { buildBotModel } from '../../scripts/lib/bot-model.mjs'
import { summarizeBot, permissionCopy, quotaCopy } from '../../scripts/lib/bot-summary.mjs'
import { botSummaries, explanations, readBots } from '../../site/.vitepress/data/bots.mjs'
import { loadAllBots, loadEnums } from '../../scripts/lib/load-bots.mjs'
import { SITE } from '../../site/.vitepress/meta.mjs'

const model = (extra = {}) => ({
  ...buildBotModel('demo', { files: [] }),
  data: { name: '示例', tagline: '一句真实介绍', author: { name: '作者', github: 'demo' }, templateUrl: 'https://x.ai/bot/demo', ...extra },
})
it('摘要完整字段和默认值稳定', () => {
  expect(summarizeBot(model())).toEqual({
    slug: 'demo', name: '示例', tagline: '一句真实介绍', category: undefined,
    author: { name: '作者', github: 'demo', url: null, link: 'https://github.com/demo' },
    templateUrl: 'https://x.ai/bot/demo', addedAt: undefined, prerequisites: ['无'], quotaCost: undefined,
    permissions: [], pitch: null, forkedFrom: null, forkedFromName: null, external: false, official: false,
    avatar: null, screenshots: [], skills: [], hasRoutines: false, routinesUrl: null, detailUrl: '/bots/demo',
  })
})
it.each([
  ['官方市场外部收录', true, 'https://x.ai/bot/marketplace/bots/demo', true],
  ['其他域名', true, 'https://example.com/bot/marketplace/bots/demo', false],
  ['无作者网址', true, undefined, false],
  ['非外部收录', false, 'https://x.ai/bot/marketplace/bots/demo', false],
  ['未标记外部收录', undefined, 'https://x.ai/bot/marketplace/bots/demo', false],
  ['普通模板链接', true, 'https://x.ai/bot/demo', false],
])('official 判定：%s', (_label, external, url, expected) => {
  expect(summarizeBot(model({ external, author: { name: '作者', url } })).official).toBe(expected)
})
it('所有现有 Bot 和 fixtures 的 wrapper 与共享摘要逐字相同', () => {
  for (const bots of [readBots(), loadAllBots('tests/fixtures/bots')]) {
    const names = new Map(bots.map((bot) => [bot.slug, bot.data.name]))
    expect(JSON.stringify(botSummaries(bots))).toBe(JSON.stringify(bots.map((bot) => summarizeBot(bot, { names }))))
  }
})
it('作者主页优先于模板，GitHub 优先于主页', () => {
  expect(summarizeBot(model({ author: { name: '作者', url: 'https://example.com' } })).author.link).toBe('https://example.com')
  expect(summarizeBot(model({ author: { name: '作者' } })).author.link).toBe('https://x.ai/bot/demo')
  expect(summarizeBot(model({ author: { github: 'demo', url: 'https://example.com' } })).author.link).toBe('https://github.com/demo')
})
it('自定义资源映射、技能、定时任务和名字映射', () => {
  const bot = model({ forkedFrom: 'original', prerequisites: ['账号'], external: true, pitch: '可以帮你' })
  bot.avatar = {}
  bot.screenshots = [{ file: '截图.png', isImage: true }, { file: 'x.txt', isImage: false }]
  bot.skills = [{ name: 'absent', exists: false }, { name: '技能', exists: true }]
  bot.routines = ''
  const summary = summarizeBot(bot, { asset: (file) => `blob:${file}`, names: new Map([['original', '原作']]) })
  expect(summary.avatar).toBe('blob:avatar.png')
  expect(summary.screenshots).toEqual(['blob:截图.png'])
  expect(summary.skills).toEqual([{ name: '技能', description: '', sourceUrl: `${SITE.repo}/blob/${SITE.branch}/bots/demo/skills/%E6%8A%80%E8%83%BD/SKILL.md` }])
  expect(summary.forkedFromName).toBe('原作')
  expect(summary.hasRoutines).toBe(true)
  expect(summary.routinesUrl).toMatch(/\/routines.md$/)
  expect(summary.external).toBe(true)
  expect(summary.prerequisites).toEqual(['账号'])
})
it('默认资产名编码、改编名称兜底、不修改模型', () => {
  const bot = model({ forkedFrom: 'original', prerequisites: '一个账号' })
  bot.screenshots = [{ file: 'a b.png', isImage: true }]
  const before = JSON.stringify(bot)
  const summary = summarizeBot(bot)
  expect(summary.screenshots).toEqual(['/bot-assets/demo/a%20b.png'])
  expect(summary.forkedFromName).toBe('original')
  expect(summary.prerequisites).toEqual(['一个账号'])
  expect(JSON.stringify(bot)).toBe(before)
})
it('缺失 YAML 的预览摘要仍可创建', () => {
  expect(summarizeBot(buildBotModel('demo', { files: [] })).templateUrl).toBeUndefined()
})
it('文案导出与 schema 枚举和 explanations 完全一致', () => {
  const enums = loadEnums()
  expect(explanations()).toEqual({ permissions: permissionCopy, quota: quotaCopy })
  expect(Object.keys(permissionCopy)).toEqual(enums.permissions)
  expect(Object.keys(quotaCopy)).toEqual(enums.quotaCosts)
})
