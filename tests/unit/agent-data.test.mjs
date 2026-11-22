import { describe, expect, it } from 'vitest'
import { join } from 'node:path'
import { buildCatalog } from '../../scripts/lib/catalog.mjs'
import { buildAgentData, creditLine, dataPath } from '../../scripts/lib/agent-data.mjs'
import { renderLlms } from '../../scripts/lib/llms.mjs'
import { ROOT } from '../../scripts/lib/load-bots.mjs'
import { promptData, readPrompts, readSkills, skillData } from '../../site/.vitepress/data/prompts-skills.mjs'
import { SITE } from '../../site/.vitepress/meta.mjs'

const prompts = promptData(readPrompts(join(ROOT, 'tests/fixtures/prompts')))
const skills = skillData(readSkills(join(ROOT, 'tests/fixtures/skills')))
const bot = {
  slug: 'ab', detailUrl: '/bots/ab', name: 'Zoo', nameZh: null, tagline: '一句话介绍', category: '产品',
  permissions: ['联网'], quotaCost: '低', about: { starters: ['你好'] }, editorNote: null,
  templateUrl: 'https://x.ai/bot/123', author: { name: '作者' }, external: false, addedAt: '2026-01-01',
}
const { bots } = buildCatalog({ bots: [bot] })
const { index, files } = buildAgentData({ prompts, skills, bots })
const file = (kind, slug) => files.find((f) => f.path === dataPath(kind, slug))?.data

describe('data/index.json', () => {
  it('先 Prompt、再 Skill、再 Bot，各自保持网站顺序，计数对得上', () => {
    expect(index.counts).toEqual({ prompt: prompts.length, skill: skills.length, bot: 1 })
    expect(index.items.map((i) => `${i.kind}/${i.slug}`)).toEqual([
      ...prompts.map((p) => `prompt/${p.slug}`), ...skills.map((s) => `skill/${s.slug}`), 'bot/ab',
    ])
    expect(index.skill).toBe(`${SITE.url}/skill/bot-zhipin/SKILL.md`)
  })

  it('索引不带正文，地址都是绝对地址，dataUrl 指向对应文件', () => {
    for (const item of index.items) {
      expect(item).not.toHaveProperty('body')
      expect(item).not.toHaveProperty('text')
      expect(item.detailUrl.startsWith(`${SITE.url}/`)).toBe(true)
      expect(item.dataUrl).toBe(`${SITE.url}${dataPath(item.kind, item.slug)}`)
      expect(file(item.kind, item.slug)).toBeTruthy()
      for (const key of ['title', 'category', 'purpose', 'author']) expect(typeof item[key]).toBe('string')
      expect(Array.isArray(item.scenarios) && Array.isArray(item.tags)).toBe(true)
    }
    expect(new Set(files.map((f) => f.path)).size).toBe(files.length)
  })

  it('Bot 用中文叫法做标题，没有就用原名；一句话介绍算用途，开场白单独给', () => {
    expect(index.items.at(-1)).toMatchObject({ kind: 'bot', title: 'Zoo', name: 'Zoo', nameZh: null, purpose: '一句话介绍', scenarios: [], starters: ['你好'] })
  })
})

describe('每条的完整数据', () => {
  it('Prompt 的 text 优先给中文译文，原文留在 body', () => {
    const tutor = file('prompt', 'demo-socratic-tutor')
    expect(tutor.lang).toBe('en')
    expect(tutor.bodyZh).toBeTruthy()
    expect(tutor.text).toBe(tutor.bodyZh)
    expect(tutor.body).not.toBe(tutor.bodyZh)
    const zh = file('prompt', 'demo-code-review-checklist')
    expect(zh.text).toBe(zh.body)
  })

  it('没有正文的 Prompt：text 为 null，索引里 hasBody 为 false', () => {
    expect(file('prompt', 'demo-summary-only').text).toBeNull()
    expect(index.items.find((i) => i.slug === 'demo-summary-only').hasBody).toBe(false)
    expect(index.items.find((i) => i.slug === 'demo-code-review-checklist').hasBody).toBe(true)
  })

  it('Skill 带分助手的安装命令和署名', () => {
    const skill = file('skill', skills[0].slug)
    expect(skill.install.length).toBeGreaterThan(0)
    for (const step of skill.install) expect(typeof step.command).toBe('string')
    expect(skill.credit).toContain(`经 ${SITE.name}收录：${SITE.url}/skills/${skill.slug}`)
  })

  it('Bot 的完整数据就是 catalog 里那一条，外加 kind、title、credit', () => {
    expect(file('bot', 'ab')).toEqual({ kind: 'bot', title: 'Zoo', ...bots[0], credit: `作者：作者 · 来源：https://x.ai/bot/123 · 经 ${SITE.name}收录：${SITE.url}/bots/ab` })
  })
})

it('署名行：缺的段落省掉', () => {
  expect(creditLine({ author: '宝玉', sourceUrl: 'https://baoyu.io', license: 'MIT', detailUrl: 'https://x/p' }))
    .toBe(`作者：宝玉 · 来源：https://baoyu.io · 许可：MIT · 经 ${SITE.name}收录：https://x/p`)
  expect(creditLine({ author: '', sourceUrl: null, license: null, detailUrl: 'https://x/p' })).toBe(`经 ${SITE.name}收录：https://x/p`)
})

it('llms.txt 带上 Prompt、Skills 两节，按分类枚举顺序分组', () => {
  const text = renderLlms({ bots: [], squads: [] }, [], { prompts, skills })
  expect(text).toContain(`另收 ${prompts.length} 条 Prompt`)
  expect(text).toContain(`${SITE.url}/data/index.json`)
  expect(text).toContain(`${SITE.url}/skill/bot-zhipin/SKILL.md`)
  const promptPart = text.slice(text.indexOf('## Prompt\n'), text.indexOf('## Skills\n'))
  expect(promptPart).toContain(`- [${prompts[0].title}](${SITE.url}/prompts/${prompts[0].slug})：${prompts[0].purpose}`)
  const headings = [...promptPart.matchAll(/^### (.+)$/gm)].map((m) => m[1])
  expect(headings).toEqual(['写作', '编程', '学习', '营销', '效率'].filter((c) => prompts.some((p) => p.category === c)))
  expect(text.slice(text.indexOf('## Skills\n'))).toContain(`${SITE.url}/skills/${skills[0].slug}`)
  expect(text.endsWith('\n') && !text.endsWith('\n\n')).toBe(true)
})
