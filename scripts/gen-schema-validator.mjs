// schema 是唯一真源；运行时只加载已提交的静态校验代码。
// 三份 schema 各生成一个文件：bot（Bot 卡片）、squad（小队）、curation（策展）。
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import Ajv2020 from 'ajv/dist/2020.js'
import standaloneCode from 'ajv/dist/standalone/index.js'
import { build } from 'esbuild'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
export const SCHEMAS = ['bot', 'squad', 'curation']

async function generate(name) {
  const file = `schema/${name}.schema.json`
  const source = readFileSync(resolve(root, file), 'utf8')
  const schema = JSON.parse(source)
  const ajv = new Ajv2020({ allErrors: true, verbose: true, strict: false, code: { source: true, esm: true } })
  ajv.compile(schema)
  const result = await build({
    stdin: { contents: standaloneCode(ajv, { validate: schema.$id }), resolveDir: root, sourcefile: `${name}-schema.mjs` },
    bundle: true, format: 'esm', platform: 'neutral', mainFields: ['module', 'main'], write: false,
    legalComments: 'none', minify: true,
  })
  return `// 自动生成，来源 ${file}，勿手改。\n` + result.outputFiles[0].text +
    `\nexport const schema = ${JSON.stringify(schema)}\nexport const SCHEMA_SHA256 = '${createHash('sha256').update(source).digest('hex')}'\n`
}

const check = process.argv.includes('--check')
const stale = []
for (const name of SCHEMAS) {
  const rel = `scripts/lib/validate/generated/${name}-schema.mjs`
  const target = resolve(root, rel)
  const output = await generate(name)
  if (check) {
    let current
    try { current = readFileSync(target, 'utf8') } catch { /* 缺失也视为未同步 */ }
    if (current !== output) stale.push(rel)
  } else {
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, output)
    console.log(`✓ 已生成 ${rel}`)
  }
}
if (check) {
  if (stale.length) {
    console.error(`schema 改了，请运行 npm run gen:schema（没同步的：${stale.join('、')}）`)
    process.exitCode = 1
  } else console.log('✓ schema 生成文件已同步')
}
