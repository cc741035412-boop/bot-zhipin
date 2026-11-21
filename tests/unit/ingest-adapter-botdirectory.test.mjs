import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { adapt } from '../../scripts/ingest/adapters/botdirectory.mjs'

const input = {
  root: fileURLToPath(new URL('../fixtures/ingest/botdirectory/', import.meta.url)),
  source: {
    key: 'botdirectory', repo: 'elie222/botdirectory.ai', license: 'MIT',
    commit: '2222222222222222222222222222222222222222', fetchedAt: '2026-01-01T00:00:00Z',
  },
}
const { records, dropped } = adapt(input)
const bySlug = Object.fromEntries(records.map((r) => [r.extra.slug, r]))

describe('botdirectory 适配器', () => {
  it.each([
    ['creator', 'author', 'Arrange samples by color.'],
    ['site-creator', 'author', 'Count sheets of paper.'],
    ['external-source', 'source-link', 'Sort paper notes.'],
    ['added-external', 'source-link', 'Copy the list headings.'],
  ])('%s 按 %s 收录正文', (slug, basis, body) => {
    expect(bySlug[slug]).toMatchObject({ kind: 'prompt', body, extra: { bodyPolicy: { keep: true, basis } } })
    expect(bySlug[slug].extra.linkOnly).toBeUndefined()
  })

  it.each(['site-scout', 'site-post', 'share-only', 'product-only'])('%s 只收链接，不收正文', (slug) => {
    expect(bySlug[slug]).toMatchObject({
      kind: 'bot-link', body: null,
      extra: { linkOnly: { reason: '投稿人不是原作者，也没有来源链接' } },
    })
    expect(bySlug[slug].extra.bodyPolicy).toBeUndefined()
  })

  it('原本没有正文的记录不标 linkOnly', () => {
    expect(bySlug.empty).toMatchObject({ kind: 'bot-link', body: null })
    expect(bySlug.empty.extra.linkOnly).toBeUndefined()
    expect(bySlug.empty.extra.bodyPolicy).toBeUndefined()
  })

  it('保留作者、发现者和两种链接所需字段', () => {
    expect(bySlug.creator.author).toEqual({ name: 'InkMaker', url: 'https://example.org/ink' })
    expect(bySlug.creator.integrations).toEqual(['Notebook'])
    expect(bySlug['site-scout'].author).toEqual({ name: 'BotDirectoryAI', url: 'https://github.com/BotDirectoryAI' })
    expect(bySlug['site-scout'].extra.scoutedBy).toBe('Archivist')
    expect(bySlug['external-source'].author).toBeNull()
    expect(bySlug['share-only'].shareId).toBe('almanac_1234567890123')
    expect(bySlug['product-only'].shareId).toBeNull()
    expect(bySlug['product-only'].extra).toMatchObject({
      productUrl: 'https://example.org/product', pageUrl: 'https://botdirectory.ai/bots/product-only',
    })
  })

  it('坏 YAML 进 dropped；记录有稳定且按序的 ID，来源 URL 钉住提交', () => {
    expect(dropped).toEqual([{ sourcePath: 'bots/broken.md', reason: expect.stringMatching(/不是合法 YAML/) }])
    const ids = records.map((r) => r.id)
    expect(ids).toEqual([...ids].sort())
    for (const r of records) {
      expect(r.id).toBe(`botdirectory:bots/${r.extra.slug}.md`)
      expect(r.sourceUrl).toBe(`https://github.com/elie222/botdirectory.ai/blob/${input.source.commit}/bots/${r.extra.slug}.md`)
    }
    expect(adapt(input)).toEqual({ records, dropped })
  })
})
