import { describe, expect, it } from 'vitest'
import { SITE } from '../../site/.vitepress/meta.mjs'
import {
  OG_SIZE, absoluteUrl, botDescription, botOgInput, botPageTitle, firstSentence, joinSentences,
  ogImageFile, ogImageUrl, ogVersion, pagePath, squadOgInput,
} from '../../scripts/lib/share.mjs'

describe('站内地址', () => {
  it('绝对地址落在正式域名下', () => {
    expect(absoluteUrl('/bots/copy-humanizer')).toBe(`${SITE.url}/bots/copy-humanizer`)
    expect(absoluteUrl('/')).toBe(`${SITE.url}/`)
    expect(() => absoluteUrl('bots/x')).toThrow(/要以 \/ 开头/)
  })
  it('relativePath 换成 cleanUrls 的路径', () => {
    expect(pagePath('index.md')).toBe('/')
    expect(pagePath('bots/copy-humanizer.md')).toBe('/bots/copy-humanizer')
    expect(pagePath('squads/startup-kit.md')).toBe('/squads/startup-kit')
    expect(pagePath('submit.md')).toBe('/submit')
    expect(pagePath('guide/index.md')).toBe('/guide/')
  })
})

describe('分享图地址', () => {
  it('三种图各有固定位置', () => {
    expect(ogImageFile('bot', 'a-b')).toBe('og/bots/a-b.png')
    expect(ogImageFile('squad', 'a-b')).toBe('og/squads/a-b.png')
    expect(ogImageFile('site')).toBe('og/site.png')
    expect(() => ogImageFile('page', 'x')).toThrow()
  })
  it('输入变了版本号才变', () => {
    const input = { name: 'A', tagline: 'B' }
    expect(ogVersion(input)).toBe(ogVersion({ name: 'A', tagline: 'B' }))
    expect(ogVersion(input)).not.toBe(ogVersion({ name: 'A', tagline: 'C' }))
    expect(ogVersion(input)).toMatch(/^[0-9a-f]{10}$/)
    expect(ogImageUrl('bot', 'a-b', input)).toBe(`${SITE.url}/og/bots/a-b.png?v=${ogVersion(input)}`)
    expect(OG_SIZE).toEqual({ width: 1200, height: 630 })
  })
  it('Bot 和小队的输入带上脸', () => {
    const faces = { 'a-b': { color: '#ff0000', shape: 'blob', fetchedAt: '2026-01-01' } }
    expect(botOgInput({ slug: 'a-b', name: 'A', nameZh: '甲', tagline: '介绍' }, faces))
      .toEqual({ name: 'A', nameZh: '甲', tagline: '介绍', face: { color: '#ff0000', shape: 'blob' } })
    expect(botOgInput({ slug: 'c-d', name: 'C', tagline: '介绍' }, faces).face).toBeNull()
    const squad = { name: '队', tagline: '一句', members: [{ bot: 'a-b', name: 'A', nameZh: '甲' }, { bot: 'c-d', name: 'C' }] }
    expect(squadOgInput(squad, faces).members).toEqual([
      { bot: 'a-b', name: 'A', nameZh: '甲', face: { color: '#ff0000', shape: 'blob' } },
      { bot: 'c-d', name: 'C', nameZh: null, face: null },
    ])
  })
})

describe('Bot 详情页标题和描述', () => {
  it('第一句：到中文句号、问号、叹号为止，英文句点不算', () => {
    expect(firstSentence('防编造很硬：没公开的价格照写，每条都带链接。两个定时都开要重抓几十页。')).toBe('防编造很硬：没公开的价格照写，每条都带链接。')
    expect(firstSentence('支持 x.ai 和 v1.2 版本；没有句号')).toBe('支持 x.ai 和 v1.2 版本；没有句号')
    expect(firstSentence('真的吗？是的。')).toBe('真的吗？')
    expect(firstSentence(null)).toBe('')
  })
  it('两句接起来时补句号，已有句末标点不重复', () => {
    expect(joinSentences('一句话介绍', '点评。')).toBe('一句话介绍。点评。')
    expect(joinSentences('一句话介绍！', '点评。')).toBe('一句话介绍！点评。')
    expect(joinSentences('一句话介绍', '')).toBe('一句话介绍')
  })
  it('标题：中文叫法（原名）怎么用、值不值得装', () => {
    expect(botPageTitle({ name: 'Copy Humanizer', nameZh: '去 AI 味编辑' })).toBe('去 AI 味编辑（Copy Humanizer）怎么用、值不值得装')
    expect(botPageTitle({ name: '飞书应用管家', nameZh: null })).toBe('飞书应用管家怎么用、值不值得装')
    expect(botPageTitle({ name: 'Writing Bot' })).toBe('Writing Bot 怎么用、值不值得装')
  })
  it('描述：一句话介绍 + 编辑点评第一句', () => {
    expect(botDescription({
      tagline: '盯住竞品官网、定价和更新日志，有实质变化才发简报',
      editorNote: '防编造很硬：没公开的价格照写需联系销售，每条都带链接。两个定时都开要重抓几十页，费额度。',
    })).toBe('盯住竞品官网、定价和更新日志，有实质变化才发简报。防编造很硬：没公开的价格照写需联系销售，每条都带链接。')
    expect(botDescription({ tagline: '只有介绍', editorNote: null })).toBe('只有介绍')
  })
})
