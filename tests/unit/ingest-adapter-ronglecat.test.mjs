import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'
import { adapt } from '../../scripts/ingest/adapters/ronglecat.mjs'

const root = fileURLToPath(new URL('../fixtures/ingest/ronglecat/', import.meta.url))
const source = JSON.parse(readFileSync(new URL('../../scripts/ingest/sources.json', import.meta.url), 'utf8')).sources.find((s) => s.key === 'ronglecat')
const input = { root, source }

test('只收合法分享以及中文版各节第一个代码块，保留目录原始序号', () => {
  const { records } = adapt(input)
  const paths = ['data/catalog.json#garden/1', 'data/catalog.json#notes/1', 'prompts/playbook-prompts.zh.md#10', 'prompts/playbook-prompts.zh.md#2']
  expect(records.map((r) => r.id)).toEqual(paths.map((p) => `ronglecat:${p}`))
  expect(records.map((r) => r.kind)).toEqual(['bot-link', 'bot-link', 'prompt', 'prompt'])
  for (const [i, record] of records.entries()) {
    expect(record).toMatchObject({
      sourcePath: paths[i], sourceUrl: `https://github.com/${source.repo}/blob/${source.commit}/${paths[i]}`,
      fetchedAt: source.fetchedAt, license: 'CC0-1.0', author: { name: 'RongleCat', url: 'https://github.com/RongleCat' },
    })
  }
  const [link, notes, planning, ledger] = records
  expect(link).toMatchObject({ title: 'Tray counter', body: null, shareId: '123456789012345678901', extra: { summary: 'Counts trays', summaryZh: '清点育苗盘', section: 'garden' } })
  expect(notes).toMatchObject({ title: 'Seed notes', body: null, shareId: 'aaaaaaaaaaaaaaaaaaaaa', extra: { section: 'notes' } })
  expect(planning).toMatchObject({ title: '规划空地', body: '用三句话描述下午的光照。', extra: {} })
  expect(ledger).toMatchObject({
    title: '核对借用记录', body: '把台账分成借出和归还两栏。\n## 99. 这一行在代码块内\n```\n保留这一行。', extra: { summary: '归还前查一遍。' },
  })
})

test('英文版、缺代码块、资源导航链接和 README 分别说明原因', () => {
  const result = adapt(input)
  expect(result.dropped).toEqual([
    { sourcePath: 'prompts/playbook-prompts.zh.md#3', reason: expect.stringMatching(/缺少.*代码块/) },
    { sourcePath: 'prompts/playbook-prompts.md', reason: expect.stringContaining('英文版') },
    { sourcePath: 'data/catalog.json#garden', reason: expect.stringContaining('资源导航'), count: 2 },
    { sourcePath: 'data/catalog.json#notes', reason: expect.stringContaining('资源导航'), count: 1 },
    { sourcePath: '.', reason: expect.stringContaining('说明文档'), count: 1 },
  ])
  expect(adapt(input)).toStrictEqual(result)
})
