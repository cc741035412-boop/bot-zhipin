// 独立从源文件算期望；不调用页面的排序、索引或投影函数。
import { readFileSync, readdirSync } from 'node:fs'
import YAML from 'yaml'
const hash = (slug) => [...slug].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 0x01000193), 0x811c9dc5) >>> 0
const load = (dir) =>
  readdirSync(dir)
    .filter((s) => s.endsWith('.yaml'))
    .map((s) => YAML.parse(readFileSync(`${dir}/${s}`, 'utf8')))
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt) || hash(a.slug) - hash(b.slug))
export const db = { prompts: load('tests/fixtures/prompts'), skills: load('tests/fixtures/skills') }
export const categories = (dir) =>
  JSON.parse(readFileSync(`schema/${dir.slice(0, -1)}.schema.json`, 'utf8')).properties.category.enum.filter((c) =>
    db[dir].some((i) => i.category === c),
  )
export const normalize = (s) => s.normalize('NFKC').trim().toLowerCase()
export function matching(dir, q, cat = '') {
  return db[dir].filter((i) => {
    const fields = [
      i.title,
      i.titleOriginal,
      i.name,
      i.category,
      i.purpose,
      ...i.scenarios,
      ...(i.tags || []),
      i.author.name,
      ...(i.agents || []),
    ]
      .filter(Boolean)
      .map(normalize)
    return (
      (!cat || cat === i.category) &&
      normalize(q)
        .split(/\s+/)
        .every((token) => fields.some((f) => f.includes(token)))
    )
  })
}
export const body =
  db.prompts.find((i) => i.body && i.usage && /<[^>]+>/.test(i.body)) || db.prompts.find((i) => i.body)
export const summary = db.prompts.find((i) => !i.body)
export const skill =
  db.skills.find((i) => i.install.length > 1) || db.skills.find((i) => i.requires?.length) || db.skills[0]
export const pathFor = (i) => `/${i.name ? 'skills' : 'prompts'}/${i.slug}`
