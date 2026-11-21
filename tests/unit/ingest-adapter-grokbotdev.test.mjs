import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { adapt } from '../../scripts/ingest/adapters/grokbotdev.mjs'

const input = {
  root: fileURLToPath(new URL('../fixtures/ingest/grokbotdev/', import.meta.url)),
  source: {
    key: 'grokbotdev', repo: 'ZeroPointRepo/GrokBotDev', license: 'CC-BY-4.0',
    commit: '1111111111111111111111111111111111111111', fetchedAt: '2026-01-01T00:00:00Z',
  },
}
const { records, dropped } = adapt(input)

describe('grokbotdev 适配器', () => {
  it('只截取 Prompt 节第一个围栏代码块，保留独立的设置小节', () => {
    const prompt = records.find((r) => r.sourcePath.endsWith('/almanac.md'))
    expect(prompt).toMatchObject({
      kind: 'prompt', title: 'Pocket almanac', shareId: 'almanac_1234567890123',
      author: { name: 'AlmanacMaker', url: 'https://example.org/maker' },
      integrations: ['Notebook'],
      extra: {
        promptBlock: true, provenance: 'author', setupMinutes: 4, awesomeScore: 7,
        setup: 'Keep a paper calendar.\n\n### Optional\n\nAdd a bookmark.',
      },
    })
    expect(prompt.body).toBe('Arrange the seasons into a table.\n```\n  Keep this indentation.')
  })

  it('原作者公开的提示词仍署原作者，不另记灵感来源', () => {
    const prompt = records.find((r) => r.sourcePath.endsWith('/almanac.md'))
    expect(prompt.extra.provenance).toBe('author')
    expect(prompt.author).toEqual({ name: 'AlmanacMaker', url: 'https://example.org/maker' })
    expect(prompt.extra).not.toHaveProperty('inspiredBy')
  })

  it('策展重写的提示词署策展人，原型作者另记为灵感来源', () => {
    const prompt = records.find((r) => r.sourcePath.endsWith('/curator.md'))
    expect(prompt.kind).toBe('prompt')
    expect(prompt.extra.provenance).toBe('curator')
    expect(prompt.author).toEqual({
      name: 'GrokBot.dev contributors', url: 'https://github.com/ZeroPointRepo/GrokBotDev', role: 'curator',
    })
    expect(prompt.extra.inspiredBy).toEqual({ name: 'SeedCataloger', url: 'https://example.org/cataloger' })
  })

  it('缺少 prompt_provenance 时仍署 frontmatter 作者，不另记灵感来源', () => {
    const prompt = records.find((r) => r.sourcePath.endsWith('/fallback.md'))
    expect(prompt.extra.provenance).toBeUndefined()
    expect(prompt.author).toEqual({ name: 'WindowboxKeeper', url: 'https://example.org/keeper' })
    expect(prompt.extra).not.toHaveProperty('inspiredBy')
  })

  it('Prompt 节没有代码块时保留去掉 frontmatter 的全文', () => {
    const fallback = records.find((r) => r.sourcePath.endsWith('/fallback.md'))
    expect(fallback.title).toBe('Windowbox notes')
    expect(fallback.extra.promptBlock).toBe(false)
    expect(fallback.body).toBe('## Prompt\n\nNo fenced snippet here.\n\n## Other\n\n```\nA fenced block in a different section.\n```')
  })

  it('模板只留链接，并合并、去重、排序集合名', () => {
    expect(records.find((r) => r.kind === 'bot-link')).toMatchObject({
      body: null, shareId: 'fieldbook_12345678901',
      author: { name: 'BookSharer', url: 'https://example.org/sharer', role: 'sharer' },
      extra: {
        slug: 'field-book', summary: 'A paper index', category: 'notes', sourcePost: 'https://example.org/post',
        relatedUseCases: ['almanac'], collections: ['Amber cabinet', 'Zebra cabinet'],
      },
    })
    expect(dropped).toContainEqual({ sourcePath: 'content/collections/a.md', reason: expect.stringMatching(/找不到/), count: 2 })
  })

  it('不收 news、plugins、根目录文档或无合法分享 ID 的模板；坏 YAML 不影响其他文件', () => {
    expect(records.map((r) => r.sourcePath)).toEqual([
      'content/templates/book.md', 'content/use-cases/almanac.md',
      'content/use-cases/curator.md', 'content/use-cases/fallback.md',
    ])
    expect(dropped).toEqual(expect.arrayContaining([
      expect.objectContaining({ sourcePath: '.', count: 3 }),
      expect.objectContaining({ sourcePath: 'content/templates/bad-id.md', reason: expect.stringMatching(/分享 ID/) }),
      expect.objectContaining({ sourcePath: 'content/use-cases/bad-yaml.md', reason: expect.stringMatching(/不是合法 YAML/) }),
    ]))
  })

  it('每条记录保留署名、稳定 ID 与钉在提交上的来源 URL', () => {
    for (const record of records) {
      expect(record.id).toBe(`grokbotdev:${record.sourcePath}`)
      expect(record.sourceUrl).toBe(`https://github.com/ZeroPointRepo/GrokBotDev/blob/${input.source.commit}/${record.sourcePath}`)
      expect(record.license).toBe('CC-BY-4.0')
      expect(record.extra.attribution).toEqual({
        by: 'GrokBot.dev contributors', repo: 'ZeroPointRepo/GrokBotDev',
        license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
      })
    }
    expect(adapt(input)).toEqual({ records, dropped })
  })
})
