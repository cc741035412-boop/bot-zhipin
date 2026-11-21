import { beforeAll, expect, it } from 'vitest'
import { join } from 'node:path'
import { loadAllBots, ROOT } from '../../scripts/lib/load-bots.mjs'
import { shelfData } from '../../site/.vitepress/data/bots.mjs'
import { loadFonts } from '../../scripts/og/index.mjs'
import { bodyLines, cleanText, nameLayout } from '../../scripts/og/text.mjs'
import { squadPositions } from '../../scripts/og/stage.mjs'
import { renderCard } from '../../scripts/og/card.mjs'

let fonts, bot
beforeAll(async () => {
  fonts = await loadFonts()
  ;[bot] = shelfData(loadAllBots(join(ROOT, 'tests/fixtures/bots')), { squads: [], curation: {} }).bots
})
it('用粗体实际字宽选择字号，最长名字不截断', () => {
  const bold = fonts.metrics[700]
  expect(nameLayout('去 AI 味编辑', bold)).toEqual({ size: 76, lines: ['去 AI 味编辑'] })
  const text = '编'.repeat(20), result = nameLayout(text, bold)
  expect(result.size).toBe(48)
  expect(result.lines).toHaveLength(2)
  expect(result.lines.join('')).toBe(text)
  expect(result.lines.every(s => bold.getAdvanceWidth(s, result.size) <= 528)).toBe(true)
})
it('超宽片段逐字回退（闭标点仍粘在前一个字上），超过行数上限时贪心截断并为省略号留宽', () => {
  const lines = bodyLines('甲乙，丙丁戊己庚辛', fonts.metrics[500], 36, 3, 72)
  expect(lines).toEqual(['甲', '乙，', '丙…'])
})
it('多排一行能避开词中间断行时才多排一行', () => {
  expect(bodyLines('一个项目经理带四个专员，盯竞品、写定位、改官网、看投放数据', fonts.metrics[500], 34, 3, 528))
    .toEqual(['一个项目经理带四个专员，', '盯竞品、写定位、改官网、', '看投放数据'])
  // 行数上限已经用满时不多排
  expect(bodyLines('一个项目经理带四个专员，盯竞品、写定位、改官网、看投放数据', fonts.metrics[500], 34, 2, 528))
    .toEqual(['一个项目经理带四个专员，盯竞', '品、写定位、改官网、看投放数据'])
})
it('标点粘到相邻片段，行边空白不占宽', () => {
  expect(bodyLines('  甲， （乙）  ', fonts.metrics[500], 36, 2, 108)).toEqual(['甲，', '（乙）'])
})
it.each([
  ['把稿子改得像人写的，保留你的口吻，每处改动都说明', ['把稿子改得像人写的，', '保留你的口吻，每处改动都说明']],
  ['给出海产品做增长：盯投放、出素材、追热点、写开发信', ['给出海产品做增长：盯投放、', '出素材、追热点、写开发信']],
  ['把方案拉回问题本身，按 18 条标准审需求，再记下决策', ['把方案拉回问题本身，', '按 18 条标准审需求，再记下决策']],
  ['贴 AI 发布帖或跑分图，逐条核查真假并附出处', ['贴 AI 发布帖或跑分图，', '逐条核查真假并附出处']],
])('Bot 介绍按标点和实际行宽选断点：%s', (text, expected) => {
  expect(bodyLines(text, fonts.metrics[500], 36, 3, 528)).toEqual(expected)
})
it('全站介绍优先在逗号后换行', () => {
  expect(bodyLines('Grok Bot 模板货架：挑一个顺手的直接导入，也欢迎把你做的 Bot 挂上来。', fonts.metrics[500], 34, 2, 960))
    .toEqual(['Grok Bot 模板货架：挑一个顺手的直接导入，', '也欢迎把你做的 Bot 挂上来。'])
})
it('按字形索引报告缺字，并移除整个 emoji（含组合序列）', () => {
  expect(cleanText('字👩🏽‍💻☀️🧪\u{10ffff}字\u{10ffff}', fonts.metrics[500])).toEqual({ value: '字\u{10ffff}字\u{10ffff}', missing: ['\u{10ffff}'], emoji: true })
})
it('同一 fixture Bot 两次实际出图：尺寸正确、字节相同', async () => {
  const a = await renderCard('bot', bot, fonts), b = await renderCard('bot', bot, fonts)
  expect(a.png.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a')
  expect([a.png.readUInt32BE(16), a.png.readUInt32BE(20)]).toEqual([1200, 630])
  expect(a.png.equals(b.png)).toBe(true)
  expect(a.missing).toBe('')
})
it('缺字和 emoji 不妨碍出图', async () => {
  const result = await renderCard('bot', { ...bot, tagline: '测试🦊\u{10ffff}' }, fonts)
  expect(result.missing).toBe('\u{10ffff}')
  expect(result.emoji).toBe(true)
  expect(result.png.length).toBeGreaterThan(15000)
})
it.each([2, 4, 6])('%i 人小队每张脸都留在画布内', n => {
  const positions = squadPositions(n)
  expect(positions).toHaveLength(n)
  for (const { x, y, size } of positions) {
    expect(x - size / 2).toBeGreaterThanOrEqual(0)
    expect(x + size / 2).toBeLessThanOrEqual(1200)
    expect(y - size / 2).toBeGreaterThanOrEqual(0)
    expect(y + size / 2).toBeLessThanOrEqual(630)
  }
})
