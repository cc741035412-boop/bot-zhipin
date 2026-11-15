// schema 是唯一真源；运行时只加载已提交的静态校验代码。
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import Ajv2020 from 'ajv/dist/2020.js'
import standaloneCode from 'ajv/dist/standalone/index.js'
import { build } from 'esbuild'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = readFileSync(resolve(root, 'schema/bot.schema.json'), 'utf8')
const schema = JSON.parse(source)
const ajv = new Ajv2020({ allErrors: true, verbose: true, strict: false, code: { source: true, esm: true } })
ajv.compile(schema)
const result = await build({
  stdin: { contents: standaloneCode(ajv, { validate: schema.$id }), resolveDir: root, sourcefile: 'bot-schema.mjs' },
  bundle: true, format: 'esm', platform: 'neutral', mainFields: ['module', 'main'], write: false,
  legalComments: 'none', minify: true,
})
const output = '// 自动生成，来源 schema/bot.schema.json，勿手改。\n' + result.outputFiles[0].text +
  `\nexport const schema = ${JSON.stringify(schema)}\nexport const SCHEMA_SHA256 = '${createHash('sha256').update(source).digest('hex')}'\n`
const target = resolve(root, 'scripts/lib/validate/generated/bot-schema.mjs')
if (process.argv.includes('--check')) {
  let current
  try { current = readFileSync(target, 'utf8') } catch { /* 缺失也视为未同步 */ }
  if (current !== output) {
    console.error('schema 改了，请运行 npm run gen:schema')
    process.exitCode = 1
  } else console.log('✓ schema 生成文件已同步')
} else {
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, output)
  console.log('✓ 已生成 scripts/lib/validate/generated/bot-schema.mjs')
}
