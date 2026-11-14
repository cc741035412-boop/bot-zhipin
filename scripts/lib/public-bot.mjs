import { readFileSync } from 'node:fs'
import { SCHEMA_PATH } from './load-bots.mjs'

const rule = JSON.parse(readFileSync(SCHEMA_PATH, 'utf8')).properties.slug
const pattern = new RegExp(rule.pattern)

// 网站路由与 API 清单共用最小上架口径；完整内容规则仍由 validate 负责。
export function isPublicBot(bot) {
  const slug = bot.data?.slug
  return !bot.yamlError && typeof slug === 'string' && slug === bot.slug
    && slug.length >= rule.minLength && slug.length <= rule.maxLength && pattern.test(slug)
}
