import { expect, it } from 'vitest'
import { parse } from 'yaml'
import { applyServerFields } from '../../scripts/lib/submit-fields.mjs'

const fields = { login: 'New-User', addedAt: '2026-11-15' }
it('缺少 author 时新建 name 和 github', () => {
  expect(parse(applyServerFields('slug: test-bot\n', fields))).toEqual({ slug: 'test-bot', author: { name: fields.login, github: fields.login }, addedAt: fields.addedAt })
})
it('已有 author 缺少 name 时补齐', () => {
  expect(parse(applyServerFields('author:\n  github: old-user\n', fields)).author).toEqual({ name: fields.login, github: fields.login })
})
it('改写 github，保留原作者名字', () => {
  expect(parse(applyServerFields('author: { name: 原作者, github: old-user }\n', fields)).author).toEqual({ name: '原作者', github: fields.login })
})
it('保留注释、引号、流式集合和未改字段', () => {
  const text = '# 顶部注释\nname: "原名字" # 名字注释\npermissions: [联网] # 权限注释\nauthor:\n  name: 原作者 # 作者注释\n  github: old-user # 账号注释\naddedAt: "2026-01-01" # 日期注释\n'
  const result = applyServerFields(text, fields)
  for (const part of ['# 顶部注释', 'name: "原名字" # 名字注释', 'permissions: [联网] # 权限注释', 'name: 原作者 # 作者注释', 'github: New-User # 账号注释', 'addedAt: "2026-11-15" # 日期注释']) expect(result).toContain(part)
})
it('addedAt 完全使用调用方值，允许保留更新前的原日期', () => {
  expect(parse(applyServerFields('addedAt: 2026-11-15\n', { ...fields, addedAt: '2025-02-01' })).addedAt).toBe('2025-02-01')
})
it.each(['name: [坏掉', '- item\n', 'author: nope\n'])('非法 YAML 或 author 类型给中文报错（%#）', (text) => {
  expect(() => applyServerFields(text, fields)).toThrow(/映射/)
})
it.each(['{slug: test-bot}', '{}', '---\nslug: test-bot\n...\n', 'slug: test-bot'])('保留顶层流式映射/文档边界（%#）', (text) => {
  expect(parse(applyServerFields(text, fields))).toMatchObject({ author: { name: fields.login, github: fields.login }, addedAt: fields.addedAt })
})
it('不悄悄覆盖已存在但为空的 name，由校验器决定是否有效', () => {
  expect(parse(applyServerFields('author: { name: "" }\n', fields)).author.name).toBe('')
})
