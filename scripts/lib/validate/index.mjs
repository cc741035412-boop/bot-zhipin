// Node 适配器：保留 CLI 返回的原始磁盘模型；纯内核只看到相对路径。
import { join, relative, resolve } from 'node:path'
import { BOTS_DIR, ROOT, loadAllBots, loadBot } from '../load-bots.mjs'
import { validateModels } from './core.mjs'
export { formatResult } from './core.mjs'

function portable(bot) {
  const rel = (path) => relative(bot.dir, path).split('\\').join('/')
  const entry = (file) => ({ ...file, rel: rel(file.path), path: rel(file.path) })
  return {
    ...bot, rel: '', yamlPath: 'bot.yaml', yamlRel: 'bot.yaml',
    skills: bot.skills.map(entry), screenshots: bot.screenshots.map(entry), files: bot.files.map(entry),
    avatar: bot.avatar ? entry(bot.avatar) : null,
    // 保持旧 index 的 resolve/relative 规则，包括非标准 botsDir 名称和根目录链接。
    symlinks: bot.symlinks.map((link) => rel(resolve(bot.dir, '../..', link))),
  }
}

export function validateBots({ botsDir = BOTS_DIR, now = new Date() } = {}) {
  const bots = loadAllBots(resolve(botsDir))
  const template = portable(loadBot('_template', join(ROOT, 'bots')))
  return { bots, ...validateModels(bots.map(portable), { template, now }) }
}
