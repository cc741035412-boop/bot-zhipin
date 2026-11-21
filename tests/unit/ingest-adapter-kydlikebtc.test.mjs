import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { adapt } from '../../scripts/ingest/adapters/kydlikebtc.mjs'

const input = {
  root: fileURLToPath(new URL('../fixtures/ingest/kydlikebtc/', import.meta.url)),
  source: {
    key: 'kydlikebtc', repo: 'kydlikebtc/awesome-grokbot', license: 'CC0-1.0',
    commit: '3333333333333333333333333333333333333333', fetchedAt: '2026-01-01T00:00:00Z',
  },
}
const { records, dropped } = adapt(input)

describe('kydlikebtc 适配器', () => {
  it('使用逐行许可，保留目录字段，并给下架目录标 retired', () => {
    expect(records).toMatchObject([
      {
        kind: 'bot-link', body: null, title: 'Active index', shareId: 'almanac_1234567890123',
        license: 'CC0-1.0', integrations: ['Notebook'], author: { name: 'NoteMaker', url: 'https://example.org/notes' },
        extra: {
          summary: 'Index illustrated cards.', summaryZh: '为图卡编目录。', category: 'paper', tags: ['cards'],
          firstSeen: '2026-01-01', checked: '2026-01-02', linkStatus: 'live', catalogs: ['Fixture catalog'],
          origin: 'fixture', aka: ['Index v1'], retired: false,
        },
      },
      {
        kind: 'bot-link', body: null, title: 'Archived index', shareId: 'fieldbook_12345678901',
        license: 'CC-BY-4.0', extra: { retired: true, attribution: {
          by: 'GrokBot.dev contributors', repo: 'ZeroPointRepo/GrokBotDev',
          license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
        } },
      },
    ])
    expect(records[0].extra.attribution).toBeUndefined()
  })

  it('任何序列化记录都不包含 official_summary 字段或其 fixture 原文', () => {
    const serialized = JSON.stringify(records)
    expect(serialized).not.toContain('official_summary')
    expect(serialized).not.toContain('The violet paper moon counts forty-seven imaginary ladders.')
    expect(serialized).not.toContain('A polka-dot teacup wrote a letter to Saturn.')
  })

  it('无效 bot_id 进 dropped；稳定 ID 与钉提交 URL 保留目录锚点', () => {
    expect(dropped).toEqual([{ sourcePath: 'catalog.json#broken-id', reason: expect.stringMatching(/bot_id.*不.*合法/) }])
    expect(records.map((r) => r.id)).toEqual(['kydlikebtc:catalog.json#active-index', 'kydlikebtc:retired.json#archived-index'])
    expect(records.map((r) => r.sourceUrl)).toEqual([
      `https://github.com/kydlikebtc/awesome-grokbot/blob/${input.source.commit}/catalog.json#active-index`,
      `https://github.com/kydlikebtc/awesome-grokbot/blob/${input.source.commit}/retired.json#archived-index`,
    ])
    expect(adapt(input)).toEqual({ records, dropped })
  })

  describe('分享页摘要过滤', () => {
    const root = fileURLToPath(new URL('../fixtures/ingest/kydlikebtc/summary-filter/', import.meta.url))
    const filtered = adapt({ ...input, root })
    const byPath = new Map(filtered.records.map((r) => [r.sourcePath, r.extra]))

    it.each([
      ['完全相同', 'catalog.json#identical'],
      ['归一化后是截短前缀', 'catalog.json#truncated'],
      ['包含下架目录另一行的原文', 'catalog.json#cross-row'],
    ])('扣下照抄的摘要：%s', (_case, path) => {
      const extra = byPath.get(path)
      expect(extra).toHaveProperty('summaryDropped', 'x.ai 分享页原文')
      expect(extra).not.toHaveProperty('summary')
    })

    it.each([
      ['catalog.json#copied-zh', 'summaryZh'],
      ['catalog.json#truncated-zh', 'summaryZh'],
      // 标点消失后，原文前 30 字对应的文字不再包含归一化前 30 字里的 buttons；摘要也不是原文开头。
      ['catalog.json#raw-only', 'summary'],
      ['catalog.json#raw-only', 'summaryZh'],
    ])('扣下 %s 中照抄的 %s', (path, field) => {
      const extra = byPath.get(path)
      expect(extra).toHaveProperty(`${field}Dropped`, 'x.ai 分享页原文')
      expect(extra).not.toHaveProperty(field)
    })

    it('保留独立改写的摘要和中文摘要，每行只留自己的官方指纹', () => {
      expect(filtered.dropped).toEqual([])
      const independent = byPath.get('retired.json#independent')
      expect(independent).toMatchObject({
        summary: 'Organizes sewing supplies by silhouette.',
        summaryZh: '按轮廓整理针线盒。',
      })
      expect(independent).not.toHaveProperty('summaryDropped')
      expect(independent).not.toHaveProperty('summaryZhDropped')
      expect(byPath.get('catalog.json#identical')).toHaveProperty('summaryZh', '按店内音量给面包房排序。')
      for (const path of ['catalog.json#identical', 'catalog.json#truncated', 'retired.json#independent']) {
        expect(byPath.get(path).officialKey).toMatch(/^sha256:[a-f0-9]{64}$/)
      }
      expect(byPath.get('catalog.json#cross-row')).not.toHaveProperty('officialKey')
    })

    it('序列化记录不包含官方原文', () => {
      const serialized = JSON.stringify(filtered.records)
      expect(serialized).not.toContain('official_summary')
      expect(serialized).not.toContain('A silver compass points toward the quietest bakery.')
      expect(serialized).not.toContain('Maps floating islands for gardeners who travel by balloon.')
      expect(serialized).not.toContain('An origami fox sorts buttons by their shadows.')
      expect(serialized).not.toContain('这只纸鹤每天清点窗台上的玻璃弹珠，并按落下时的声音记录每一颗弹珠的颜色。')
      expect(serialized).not.toContain('Drawer label: ----------------')
    })
  })

  it('目录仅接受 JSON：误存为坏 YAML 的文件进 dropped，不抛错', () => {
    const root = fileURLToPath(new URL('../fixtures/ingest/kydlikebtc/malformed/', import.meta.url))
    expect(adapt({ ...input, root })).toEqual({
      records: [], dropped: [{ sourcePath: 'catalog.json', reason: expect.stringMatching(/无法读取目录：.+/) }],
    })
  })
})
