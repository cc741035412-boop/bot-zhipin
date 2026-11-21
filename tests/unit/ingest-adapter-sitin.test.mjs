import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'
import { adapt } from '../../scripts/ingest/adapters/sitin.mjs'

const root = fileURLToPath(new URL('../fixtures/ingest/sitin/', import.meta.url))
const source = JSON.parse(readFileSync(new URL('../../scripts/ingest/sources.json', import.meta.url), 'utf8')).sources.find((s) => s.key === 'sitin')
const input = { root, source }

test('收配方全文，按约定提取摘要和四项可选元数据', () => {
  const { records } = adapt(input)
  expect(records.map((r) => r.id)).toEqual(['sitin:examples/drawer.md', 'sitin:examples/shelf notes.md'])
  expect(records.map((r) => r.kind)).toEqual(['recipe', 'recipe'])
  for (const record of records) {
    expect(record).toMatchObject({
      kind: 'recipe', license: 'MIT', fetchedAt: source.fetchedAt,
      author: { name: 'sitin', url: 'https://github.com/sit-in' },
      body: readFileSync(join(root, record.sourcePath), 'utf8').trim(),
    })
  }
  expect(records[0].title).toBe('清点抽屉')
  expect(records[0].extra).toEqual({})
  expect(records[1]).toMatchObject({ title: '整理书架', sourceUrl: `https://github.com/${source.repo}/blob/${source.commit}/examples/shelf%20notes.md` })
  expect(records[1].extra).toEqual({
    summary: '先按书脊颜色记下现状。', suitableFor: '社区小图书角', verifiedAt: '2026-04-12',
    verifyLevel: '桌面演练', cost: '低',
  })
})

test('跳过模板、README 和缺一级标题的案例，结果可复现', () => {
  const result = adapt(input)
  expect(result.dropped).toEqual([
    { sourcePath: 'examples/_template.md', reason: expect.stringContaining('模板') },
    { sourcePath: 'examples/no-heading.md', reason: expect.stringMatching(/解析失败.*title/) },
    { sourcePath: '.', reason: expect.stringContaining('说明文档'), count: 1 },
  ])
  expect(adapt(input)).toStrictEqual(result)
})
