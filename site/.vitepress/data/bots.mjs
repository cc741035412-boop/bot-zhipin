import { loadAllBots, loadEnums } from '../../../scripts/lib/load-bots.mjs'
import { summarizeBot, permissionCopy, quotaCopy } from '../../../scripts/lib/bot-summary.mjs'
import { isPublicBot } from '../../../scripts/lib/public-bot.mjs'

export function readBots() {
  return loadAllBots().filter((bot) => {
    if (isPublicBot(bot)) return true
    console.warn(`[货架] 跳过 ${bot.yamlRel}：${bot.yamlError ? '无法解析 bot.yaml' : 'slug 不合法或与文件夹不同'}`)
    return false
  })
}

export function botSummaries(bots = readBots()) {
  const names = new Map(bots.map((bot) => [bot.slug, bot.data.name]))
  return bots.map((bot) => summarizeBot(bot, {
    asset: (file) => `/bot-assets/${bot.slug}/${encodeURIComponent(file)}`,
    names,
  }))
}

export function explanations() {
  const enums = loadEnums()
  return {
    permissions: Object.fromEntries(enums.permissions.map((key) => [key, permissionCopy[key]])),
    quota: Object.fromEntries(enums.quotaCosts.map((key) => [key, quotaCopy[key]])),
  }
}
