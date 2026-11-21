import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseYaml } from './frontmatter.mjs'
import { shareIdOf } from './record.mjs'
import { cmp } from './records.mjs'

const config = JSON.parse(readFileSync(new URL('../config/cn-blocked.json', import.meta.url), 'utf8'))
// textPatterns 给名字本身是英文常用词的服务用（LINE、Signal、Threads 等）：正文只认明确写法，集成字段用 patterns 按行匹配。
const checks = config.map(({ name, patterns, textPatterns }) => {
  const pattern = `(?:${patterns.join('|')})`
  const textPattern = `(?:${(textPatterns ?? patterns).join('|')})`
  return { name, integration: new RegExp(pattern, 'im'), text: new RegExp(`\\b${textPattern}(?![\\w])`, 'i') }
})
export function cnFit(members) {
  const integrations = members.flatMap(r => r.integrations).join('\n')
  const text = members.flatMap(r => [r.body, r.extra.summary, r.extra.description, r.extra.summaryZh]).filter(Boolean).join('\n')
  const blocked = checks.filter(c => c.integration.test(integrations) || c.text.test(text)).map(c => c.name)
  return { value: blocked.length ? '一般' : '好', blocked }
}

export function loadListed(botsDir) {
  const listed = new Map()
  for (const slug of readdirSync(botsDir, { withFileTypes: true }).filter(e => e.isDirectory() && e.name !== '_template').map(e => e.name).sort(cmp)) {
    const file = join(botsDir, slug, 'bot.yaml')
    try {
      const id = shareIdOf(parseYaml(readFileSync(file, 'utf8')).templateUrl)
      if (id && !listed.has(id)) listed.set(id, slug)
    } catch (error) {
      if (error.code !== 'ENOENT') throw new Error(`无法读取 ${file}：${error.message}`)
    }
  }
  return listed
}
