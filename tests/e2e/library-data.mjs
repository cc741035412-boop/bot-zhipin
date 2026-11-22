// 独立从源文件算期望；不调用页面的排序、索引或投影函数。
import { readFileSync, readdirSync } from 'node:fs'
import YAML from 'yaml'
const hash = (slug) => [...slug].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 0x01000193), 0x811c9dc5) >>> 0
const load = (dir) =>
  readdirSync(dir)
    .filter((s) => s.endsWith('.yaml'))
    .map((s) => YAML.parse(readFileSync(`${dir}/${s}`, 'utf8')))
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt) || hash(a.slug) - hash(b.slug))
export const db = { prompts: load('prompts'), skills: load('skills') }
export const fixturePrompts = load('tests/fixtures/prompts')
export const categories = (dir) =>
  JSON.parse(readFileSync(`schema/${dir.slice(0, -1)}.schema.json`, 'utf8')).properties.category.enum.filter((c) =>
    db[dir].some((i) => i.category === c),
  )
export const normalize = (s) => s.normalize('NFKC').trim().toLowerCase()
// 独立实现的拆词：空白分词；汉字和两个字符以上的英文、数字段（+ # 算在内）交界处也断开（「做PPT」=「做 PPT」）。
// 单个字母不断开（「B站」是一个词），这种中英混写的词再拿去掉空白的字段比一次（「B 站」也算）。
const words = (q) => normalize(q).replace(/(\p{Script=Han})(?=[a-z0-9+#]{2})/gu, '$1 ').replace(/([a-z0-9+#]{2})(?=\p{Script=Han})/gu, '$1 ').split(/\s+/).filter(Boolean)
const has = (field, word) => field.includes(word) || (/\p{Script=Han}/u.test(word) && /[a-z0-9]/.test(word) && field.replace(/\s+/g, '').includes(word))
export function matching(dir, q, cat = '') {
  return db[dir].filter((i) => {
    const fields = [
      i.title,
      i.titleOriginal,
      i.name,
      i.category,
      i.purpose,
      dir === 'prompts' && i.body ? i.bodyZh ?? i.body : null,
      ...i.scenarios,
      ...(i.tags || []),
      i.author.name,
      ...(i.agents || []),
    ]
      .filter(Boolean)
      .map(normalize)
    return (
      (!cat || cat === i.category) &&
      words(q).every((token) => fields.some((f) => has(f, token)))
    )
  })
}
export const body =
  db.prompts.find((i) => i.body && !i.bodyZh && i.usage && /<[^>]+>/.test(i.body)) || db.prompts.find((i) => i.body && !i.bodyZh)
// 正式库全部有正文；仅摘要的导航、阅读与复制边界继续用 fixture 覆盖。
export const summary = fixturePrompts.find((i) => !i.body && i.usage)
export const skill =
  db.skills.find((i) => i.install.length > 1) || db.skills.find((i) => i.requires?.length) || db.skills[0]
export const pathFor = (i) => `/${i.name ? 'skills' : 'prompts'}/${i.slug}`
