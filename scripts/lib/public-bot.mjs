import { readFileSync } from 'node:fs'
import { SCHEMA_PATH } from './load-bots.mjs'

const rule = JSON.parse(readFileSync(SCHEMA_PATH, 'utf8')).properties.slug
const pattern = new RegExp(rule.pattern)
const validSlug = (slug) => typeof slug === 'string' && slug.length >= rule.minLength && slug.length <= rule.maxLength && pattern.test(slug)

// 网站路由与 API 清单共用最小上架口径；完整内容规则仍由 validate 负责。
export function isPublicBot(bot) {
  const slug = bot.data?.slug
  return !bot.yamlError && slug === bot.slug && validSlug(slug)
}

// 小队同理：squad.yaml 能解析、slug 合法且和文件夹同名。成员是否都在货架上由摘要那一步处理。
export function isPublicSquad(squad) {
  const slug = squad.data?.slug
  return !squad.yamlError && !squad.yamlTooLarge && slug === squad.slug && validSlug(slug)
}
