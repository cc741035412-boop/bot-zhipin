// 计时包含模型构造、YAML/frontmatter 解析和所有校验，不包含输入准备。
import { modelFromBundle } from './lib/bot-model.mjs'
import { validateModels } from './lib/validate/core.mjs'
import { schema } from './lib/validate/generated/bot-schema.mjs'
import { LIMITS } from './submission/bundle-core.mjs'

const slug = 'benchmark-bot', prefix = `bots/${slug}/`
const data = {
  slug, name: '性能样例', tagline: '仅用于离线校验基准', category: schema.properties.category.enum[0],
  author: { name: 'Benchmark', github: 'benchmark' }, templateUrl: 'https://x.ai/bot/benchmark',
  addedAt: '2026-11-14', prerequisites: '无', quotaCost: schema.properties.quotaCost.enum[0], permissions: [],
}
// JSON 也是合法 YAML，避免在准备阶段引入磁盘或 Node 适配器。
const files = { [`${prefix}bot.yaml`]: JSON.stringify(data), [`${prefix}ROLE.md`]: '离线岗位说明\n', [`${prefix}DESIGN.md`]: '正文'.repeat(100) + '\n' }
for (let i = 0; i < 25; i++) files[`${prefix}skills/skill-${i}/SKILL.md`] = `---\nname: skill-${i}\ndescription: 离线基准技能\n---\n`
const nearMiss = ['gh' + 'p_' + 'a'.repeat(35), 'sk' + '-' + 'b'.repeat(19), 'api_key: short-value'].join(' ') + '\n'
const encoder = new TextEncoder()
const bodyPaths = Object.keys(files).filter((path) => !path.endsWith('bot.yaml'))
const initialBytes = Object.values(files).reduce((sum, text) => sum + encoder.encode(text).length, 0)
let remaining = LIMITS.totalBytes - 64 - initialBytes
bodyPaths.forEach((path, index) => {
  const count = Math.floor(remaining / (bodyPaths.length - index))
  files[path] += nearMiss + 'x'.repeat(count - encoder.encode(nearMiss).length)
  remaining -= count
})
const bundle = { slug, files, screenshots: ['shot.png'] }
const images = [{ name: 'shot.png', size: 16, format: 'png' }]
const template = modelFromBundle({ slug: '_template', files: {
  'bots/_template/bot.yaml': JSON.stringify({ slug: 'template-marker', pitch: '模板占位台词', author: { github: 'template-author' } }),
  'bots/_template/DESIGN.md': '', 'bots/_template/routines.md': '',
}, screenshots: [] })
const once = () => validateModels([modelFromBundle(bundle, images)], { template, now: '2026-11-14T00:00:00Z' })
for (let i = 0; i < 20; i++) once()
const runs = 250, times = []
for (let i = 0; i < runs; i++) {
  const start = performance.now()
  const result = once()
  times.push(performance.now() - start)
  if (result.errors.length) throw new Error('基准输入意外未通过校验')
}
times.sort((a, b) => a - b)
const result = { runs, p50: times[Math.ceil(runs * 0.5) - 1], p99: times[Math.ceil(runs * 0.99) - 1] }
console.log(process.argv.includes('--json') ? JSON.stringify(result) : `校验基准（毫秒）：${JSON.stringify(result)}`)
