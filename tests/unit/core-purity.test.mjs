import { expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { build } from 'esbuild'
import { ROOT } from '../../scripts/lib/load-bots.mjs'

const entries = [
  'scripts/lib/bot-model.mjs', 'scripts/lib/validate/core.mjs',
  ...['schema', 'content', 'images', 'secrets'].map((name) => `scripts/lib/validate/${name}.mjs`),
  'scripts/lib/submit-fields.mjs', 'scripts/submission/bundle-core.mjs',
  'scripts/lib/bundle-web.mjs', 'scripts/submission/screenshot-plan.mjs',
  // V5：小队和策展的模型、校验、摘要也都是纯函数。
  'scripts/lib/bot-summary.mjs', 'scripts/lib/squad-model.mjs', 'scripts/lib/squad-summary.mjs',
  'scripts/lib/curation-summary.mjs', 'scripts/lib/validate/squads.mjs',
]
function scan(file, seen = new Set()) {
  if (seen.has(file)) return
  seen.add(file)
  const source = readFileSync(file, 'utf8')
  expect(source, file).not.toMatch(/\bnew\s+Function\b|\beval\s*\(|\bBuffer\b|\bprocess\b/)
  const imports = [...source.matchAll(/(?:\bfrom\s*|\bimport\s*(?:\(\s*)?)["']([^"']+)["']/g)].map((match) => match[1])
  for (const specifier of imports) {
    expect(specifier, file).not.toMatch(/^(?:node:|fs(?:\/|$)|ajv(?:\/|$))/)
    if (specifier.startsWith('.')) scan(resolve(dirname(file), specifier), seen)
  }
}
it.each(entries)('%s 及相对 import 闭包无 Node/运行时编译依赖', (file) => scan(join(ROOT, file)))
it.each(['browser', 'workerd'])('%s 条件实际打包不引入 Node 或运行时 Ajv', async (kind) => {
  const result = await build({
    stdin: { contents: entries.map((file, i) => `import * as m${i} from './${file}'; export { m${i} };`).join('\n'), resolveDir: ROOT },
    bundle: true, format: 'esm', write: false, metafile: true,
    platform: kind === 'browser' ? 'browser' : 'neutral',
    conditions: kind === 'browser' ? ['browser'] : ['workerd', 'worker', 'browser'], mainFields: ['module', 'main'],
  })
  expect(Object.keys(result.metafile.inputs).some((file) => /node_modules\/ajv\//.test(file) || file.startsWith('node:'))).toBe(false)
  expect(result.outputFiles[0].text).not.toMatch(/\bnew Function\b|\beval\s*\(/)
})
