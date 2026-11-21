import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'
import { adapt } from '../../scripts/ingest/adapters/majiayu.mjs'

const root = fileURLToPath(new URL('../fixtures/ingest/majiayu/', import.meta.url))
const source = JSON.parse(readFileSync(new URL('../../scripts/ingest/sources.json', import.meta.url), 'utf8')).sources.find((s) => s.key === 'majiayu')
const input = { root, source }

test('收逐行许可的链接并给重复 slug 加后缀；队伍与配方保留全文', () => {
  const { records } = adapt(input)
  const paths = ['catalog.json#seed-log', 'catalog.json#seed-log~2', 'catalog.json#seed-log~3', 'docs/first-ten-bots.md', 'packs/garden.md']
  expect(records.map((r) => r.id)).toEqual(paths.map((p) => `majiayu:${p}`))
  expect(records.map((r) => r.kind)).toEqual(['bot-link', 'bot-link', 'bot-link', 'recipe', 'team'])
  for (const [i, record] of records.entries()) {
    expect(record).toMatchObject({
      sourcePath: paths[i], sourceUrl: `https://github.com/${source.repo}/blob/${source.commit}/${paths[i]}`, fetchedAt: source.fetchedAt,
    })
  }
  expect(records[0]).toMatchObject({
    title: 'Seed Log', body: null, shareId: '123456789012345678901', license: 'MIT',
    author: { name: 'Juniper', url: 'https://example.org/juniper' }, integrations: [],
  })
  expect(records[0].extra).toEqual({
    summary: 'Logs seed counts', summaryZh: '记录种子数量', category: 'garden', tags: ['seeds'], shelf: 'notebooks',
    verified: true, updated: '2026-05-12', sourcePost: 'https://example.org/seed-log', related: ['tray-map'],
    firstSafeTask: 'Count seeds on paper', approvalBoundary: 'Ask before sharing', connectors: ['Notebook'], mcpCustom: false,
  })
  expect(records[1]).toMatchObject({ title: 'Another Seed Log', body: null, shareId: 'aaaaaaaaaaaaaaaaaaaaa', license: 'CC0-1.0', author: { name: 'Rowan' } })
  expect(records[2]).toMatchObject({ title: 'Third Seed Log', body: null, shareId: 'bbbbbbbbbbbbbbbbbbbbb', license: 'CC0-1.0', author: null })
  for (const record of records.slice(3)) {
    expect(record).toMatchObject({
      body: readFileSync(join(root, record.sourcePath), 'utf8').trim(), integrations: [],
      author: { name: 'majiayu000', url: 'https://github.com/majiayu000' }, license: 'CC0-1.0',
    })
  }
  expect(records.slice(3).map((r) => r.title)).toEqual(['First planting notes', 'Garden Notebook'])
})

test('分组跳过副本、模板和 README，并丢弃链接或许可错误的行', () => {
  const result = adapt(input)
  expect(result.dropped).toEqual([
    { sourcePath: 'catalog.json#site', reason: expect.stringContaining('有效的 Bot 分享 ID') },
    { sourcePath: 'catalog.json#unknown-license', reason: expect.stringContaining('逐行许可') },
    { sourcePath: 'catalog/', reason: expect.stringContaining('分语言目录副本'), count: 1 },
    { sourcePath: 'templates/', reason: expect.stringContaining('不收模板目录'), count: 1 },
    { sourcePath: '.', reason: expect.stringContaining('说明文档'), count: 1 },
  ])
  expect(adapt(input)).toStrictEqual(result)
})
