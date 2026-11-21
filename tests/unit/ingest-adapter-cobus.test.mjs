import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'
import { adapt } from '../../scripts/ingest/adapters/cobus.mjs'

const root = fileURLToPath(new URL('../fixtures/ingest/cobus/', import.meta.url))
const source = JSON.parse(readFileSync(new URL('../../scripts/ingest/sources.json', import.meta.url), 'utf8')).sources.find((s) => s.key === 'cobus')
const input = { root, source }
const read = (path) => readFileSync(new URL(`../fixtures/ingest/cobus/${path}`, import.meta.url), 'utf8').trim()

test('收录五种类型，profile 去掉文件头，其余类型保留全文', () => {
  const { records } = adapt(input)
  const paths = [
    'patterns/shade/pattern.yaml', 'routines/watering/ROUTINE.md', 'skills/labels/SKILL.md',
    'teams/garden/team.yaml', 'templates/planning/seed/PROFILE.md', 'templates/solo/PROFILE.md',
  ]
  expect(records.map((r) => r.id)).toEqual(paths.map((p) => `cobus:${p}`))
  expect(records.map((r) => r.kind)).toEqual(['recipe', 'routine', 'skill', 'team', 'profile', 'profile'])
  for (const record of records) {
    expect(record).toMatchObject({
      author: { name: 'Cobus Greyling', url: 'https://github.com/cobusgreyling' },
      license: 'MIT', fetchedAt: source.fetchedAt, sourceRepo: source.repo,
      sourceUrl: `https://github.com/${source.repo}/blob/${source.commit}/${record.sourcePath}`,
    })
    if (record.kind !== 'profile') expect(record.body).toBe(read(record.sourcePath))
  }
  const [recipe, routine, skill, team, profile, solo] = records
  expect(recipe.title).toBe('Check shade first')
  expect(routine.title).toBe('Watering reminder')
  expect(skill).toMatchObject({ title: 'Read garden labels', extra: { whenToUse: 'When the tag is smudged' } })
  expect(team).toMatchObject({ title: 'Garden Crew', integrations: ['Notebook', 'Calendar', 'Weather'] })
  expect(profile).toMatchObject({
    title: 'Seed Planner', body: '# Seed notes\n\nDraft a tray map.', shareId: '123456789012345678901',
    integrations: ['Notebook', 'Calendar'], extra: {
      category: 'garden', autonomy: 'draft', templateId: 'seed-planner', tagline: 'Sketch a tray map',
      hasSetup: true, hasExamples: true,
    },
  })
  expect(solo).toMatchObject({ title: 'Label Reader', shareId: null, extra: { hasSetup: false, hasExamples: false } })
})

test('坏 YAML 分别丢弃；根 README 和示例合并计数；结果可复现', () => {
  const result = adapt(input)
  expect(result.dropped).toEqual([
    { sourcePath: 'skills/broken/SKILL.md', reason: expect.stringMatching(/解析失败.*skill\.yaml.*YAML/) },
    { sourcePath: 'templates/broken/PROFILE.md', reason: expect.stringMatching(/解析失败.*frontmatter.*YAML/) },
    { sourcePath: '.', reason: expect.stringMatching(/未收录.*示例/), count: 2 },
  ])
  expect(adapt(input)).toStrictEqual(result)
})
