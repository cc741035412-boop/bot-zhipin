import { expect, it } from 'vitest'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join } from 'node:path'
import Ajv2020 from 'ajv/dist/2020.js'
import { ROOT } from '../../scripts/lib/load-bots.mjs'
import { validate, schema, SCHEMA_SHA256 } from '../../scripts/lib/validate/generated/bot-schema.mjs'

it('生成文件逐字同步（CI 强制运行 --check）', () => {
  expect(execFileSync(process.execPath, ['scripts/gen-schema-validator.mjs', '--check'], { cwd: ROOT, encoding: 'utf8', timeout: 15000 })).toContain('已同步')
})
it('导出的 schema 和 SHA256 对应唯一真源文件', () => {
  const text = readFileSync(join(ROOT, 'schema/bot.schema.json'), 'utf8')
  expect(schema).toEqual(JSON.parse(text))
  expect(SCHEMA_SHA256).toBe(createHash('sha256').update(text).digest('hex'))
})
const runtime = new Ajv2020({ allErrors: true, verbose: true, strict: false }).compile(schema)
const base = {
  slug: 'test-bot', name: '测试', tagline: '这是测试样例', category: schema.properties.category.enum[0],
  author: { name: '作者', github: 'user' }, templateUrl: 'https://x.ai/bot/test', addedAt: '2026-11-14',
  prerequisites: '无', quotaCost: schema.properties.quotaCost.enum[0], permissions: [],
}
it.each([
  {}, null, [],
  { ...base, name: '<坏名字>', extra: 'unknown' },
  { ...base, name: '😀'.repeat(21), author: { githb: '@bad' } },
  { ...base, category: '非法枚举', quotaCost: 2, permissions: ['联网', '联网'] },
  { ...base, prerequisites: ['', null, 1] },
  { ...base, prerequisites: {}, external: 'true', addedAt: 'wrong' },
  { ...base, templateUrl: 'http://wrong', slug: 'UPPER' },
])('standalone 与运行时 errors 全字段相等（%#）', (data) => {
  expect(validate(data)).toBe(runtime(data))
  expect(validate.errors).toEqual(runtime.errors)
  for (const error of validate.errors) {
    for (const field of ['keyword', 'instancePath', 'schemaPath', 'params', 'parentSchema']) expect(error).toHaveProperty(field)
  }
})
it('成功校验清除上一次 errors', () => {
  validate({})
  expect(validate(base)).toBe(true)
  expect(validate.errors).toBe(null)
})
