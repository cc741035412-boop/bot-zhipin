import { expect, it } from 'vitest'
import { join } from 'node:path'
import YAML from 'yaml'
import { ROOT } from '../../scripts/lib/load-bots.mjs'
import { loadEntries, loadLibraryEnums } from '../../scripts/lib/load-prompts-skills.mjs'
import { buildEntryModel } from '../../scripts/lib/library-model.mjs'
import { listPrompt, summarizePrompt } from '../../scripts/lib/entry-summary.mjs'
import { validateLibrary } from '../../scripts/lib/validate/library.mjs'

const fixtures = (kind) => loadEntries(kind, join(ROOT, 'tests/fixtures', `${kind}s`))
const prompt = fixtures('prompt').find(({ slug }) => slug === 'demo-socratic-tutor')
const skill = fixtures('skill')[0]
const enums = loadLibraryEnums()
function change(entry, patch, name = entry.name) {
  return buildEntryModel(entry.kind, name, { raw: YAML.stringify({ ...entry.data, ...patch }) })
}
function problems(...entries) {
  return validateLibrary(entries[0].kind, entries).errors
}
const at = (entry, where, problem) => expect.objectContaining({ file: `${entry.kind}s/${entry.name}`, where, problem: expect.stringContaining(problem), fix: expect.any(String) })

it.each(['prompt', 'skill'])('合法 %s 夹具通过全部校验', (kind) => {
  const entries = fixtures(kind)
  expect(entries.length).toBeGreaterThan(0)
  expect(validateLibrary(kind, entries)).toEqual({ errors: [], warnings: [] })
})
it.each([prompt, skill])('$kind：非法分类提示字段与正确取值', (entry) => {
  expect(problems(change(entry, { category: '不在枚举中' }))).toContainEqual(at(entry, 'category', enums[entry.kind].categories[0]))
})
it('未声明许可也保留原文和译文，列表只带一份复制正文', () => {
  const item = change(prompt, { license: '未声明' })
  expect(problems(item)).toEqual([])
  const detail = summarizePrompt(item)
  expect(detail.body).toBe(item.data.body)
  expect(detail.bodyZh).toBe(item.data.bodyZh)
  const list = listPrompt(detail)
  expect(list.hasBody).toBe(true)
  expect(list.copyText).toBe(item.data.bodyZh)
  expect(listPrompt({ ...detail, bodyZh: null }).copyText).toBe(item.data.body)
  expect(listPrompt({ ...detail, body: null }).copyText).toBeNull()
  expect(list).not.toHaveProperty('body')
  expect(list).not.toHaveProperty('bodyZh')
})
it('只有译文没有原文时报错', () => {
  expect(problems(change(prompt, { body: undefined }))).toContainEqual(at(prompt, 'bodyZh', '没有 body'))
})
it('中文原文不能另写译文', () => {
  expect(problems(change(prompt, { lang: 'zh' }))).toContainEqual(at(prompt, 'bodyZh', '中文原文'))
})
it('英文有正文但没有译文只提醒', () => {
  expect(validateLibrary('prompt', [change(prompt, { bodyZh: undefined })])).toEqual({
    errors: [], warnings: [at(prompt, 'bodyZh', '英文原文尚无中文译文')],
  })
})
it('MIT 带正文、没有摘要仍然合法；保留正文换行', () => {
  const item = change(prompt, { license: 'MIT', summary: undefined })
  expect(problems(item)).toEqual([])
  expect(summarizePrompt(item).body).toBe(item.data.body)
})
it('有正文须有原版权行，纯摘要不要求', () => {
  expect(problems(change(prompt, { copyright: undefined }))).toContainEqual(at(prompt, 'copyright', '原版权行'))
  expect(problems(change(prompt, { copyright: 'Copyright 示例作者' }))).toEqual([])
  expect(problems(change(prompt, { body: undefined, bodyZh: undefined, copyright: undefined }))).toEqual([])
})
it.each(['', 'a\nb', 'x'.repeat(201)])('拒绝无效版权行 %j', (copyright) => {
  expect(problems(change(prompt, { copyright })).some(e => e.where === 'copyright')).toBe(true)
})
it('没有正文必须有摘要', () => {
  expect(problems(change(prompt, { body: undefined, summary: undefined }))).toContainEqual(at(prompt, 'summary', '摘要'))
})
it('不允许转载的条目，摘要或用法里的长引文被拒', () => {
  const quote = `“${'引'.repeat(31)}”`
  const item = change(prompt, { body: undefined, license: '未声明', usage: quote })
  expect(problems(item)).toContainEqual(at(item, 'usage', '30 字'))
})
it('未声明许可但有正文时，用法里的长引文不报错', () => {
  const item = change(prompt, { license: '未声明', usage: `“${'引'.repeat(31)}”` })
  expect(problems(item)).toEqual([])
})
it('文件名必须等于 slug', () => {
  const item = change(prompt, {}, 'other-file.yaml')
  expect(problems(item)).toContainEqual(at(item, 'slug', '文件名'))
})
it.each([prompt, skill])('$kind：GitHub 仓库首页即使加查询参数也被拒，具体文件或目录可用', (entry) => {
  const source = { ...entry.data.source, url: 'https://GitHub.com/example/project/?tab=readme-ov-file' }
  expect(problems(change(entry, { source }))).toContainEqual(at(entry, 'source.url', '仓库首页'))
  expect(problems(change(entry, { source: { ...source, url: 'https://github.com/example/project/blob/main/examples/item.md' } }))).toEqual([])
})
it('同类 slug 重复时报告另一个文件', () => {
  const copy = change(prompt, {}, 'other-file.yaml')
  expect(problems(prompt, copy)).toContainEqual(at(copy, 'slug', `重复，与 prompts/${prompt.name}`))
})
it('Skill 即使可转载也不能放 SKILL.md 正文', () => {
  expect(problems(change(skill, { body: '不该写在这里', license: 'MIT' }))).toContainEqual(at(skill, 'body', 'Skill 不收正文'))
})
it('运行依赖每项最多 80 字，仍限五项且不能重复', () => {
  const validate = (requires) => problems(change(skill, { requires }))
  expect(validate(['依'.repeat(80)])).toEqual([])
  for (const bad of [['依'.repeat(81)], ['a', 'a'], [...'abcdef']]) {
    expect(validate(bad).some(e => e.where.startsWith('requires'))).toBe(true)
  }
})
it('两份 schema 中的许可枚举一致，均可放正文，仅可转载许可缺链接时提醒', () => {
  expect(enums.prompt.licenses).toEqual(enums.skill.licenses)
  for (const license of enums.prompt.licenses) {
    const { errors, warnings } = validateLibrary('prompt', [change(prompt, { license, licenseUrl: undefined })])
    expect(errors, license).toEqual([])
    expect(warnings.map(w => w.where), license).toEqual(enums.prompt.reusable.includes(license) ? ['licenseUrl'] : [])
  }
})
