import { join, relative, resolve } from 'node:path'
import { BOTS_DIR, ROOT, loadAllBots, loadBot } from '../load-bots.mjs'
import { validateSchema } from './schema.mjs'
import { validateContent, validateTemplate } from './content.mjs'
import { validateImages } from './images.mjs'
import { redact, scanSecrets } from './secrets.mjs'

const DAY = 24 * 60 * 60 * 1000

function validateDate(bot, now, report) {
  const value = bot.data.addedAt
  // 非字符串或不符合 YYYY-MM-DD 的值由 schema 报告。
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return
  const timestamp = Date.parse(`${value}T00:00:00Z`)
  if (!Number.isFinite(timestamp) || new Date(timestamp).toISOString().slice(0, 10) !== value) {
    report(bot.yamlPath, 'addedAt', `addedAt 当前值 ${value} 不是有效日期`, '填写真实存在的 YYYY-MM-DD 日期，检查月份、天数和闰年。')
    return
  }
  const today = new Date(new Date(now).getTime() + 8 * 60 * 60 * 1000).toISOString().slice(0, 10)
  if (timestamp > Date.parse(`${today}T00:00:00Z`) + DAY) {
    report(bot.yamlPath, 'addedAt', `addedAt ${value} 不能晚于今天（北京时间 ${today}，允许多 1 天容差）`, `把 addedAt 改成真实上架日期，不能超过北京时间 ${today} 的次日。`)
  }
}

/** 返回加载的 Bot 及中文诊断；不输出、不写文件。now 可传 Date、时间戳或 ISO 字符串。 */
export function validateBots({ botsDir = BOTS_DIR, now = new Date() } = {}) {
  const bots = loadAllBots(resolve(botsDir))
  // 每次调用重新读取唯一模板，不在代码中复制模板原文。
  const template = loadBot('_template', join(ROOT, 'bots'))
  const errors = [], warnings = []
  const duplicates = { slug: new Map(), templateUrl: new Map() }
  const slugs = new Set(bots.map((bot) => bot.data?.slug).filter((slug) => typeof slug === 'string'))
  for (const bot of bots) {
    const report = (path, where, problem, fix, warning = false) => {
      const file = `bots/${bot.slug}/${relative(bot.dir, path).split('\\').join('/')}`
      const item = Object.fromEntries(Object.entries({ file, where, problem, fix }).map(([key, value]) => [key, redact(value)]))
      const target = warning ? warnings : errors
      const previous = target.find((entry) => entry.file === item.file && entry.where === item.where)
      if (previous) {
        if (!previous.problem.includes(item.problem)) previous.problem += `；${item.problem}`
        if (!previous.fix.includes(item.fix)) previous.fix += ` ${item.fix}`
      } else target.push(item)
    }
    // 即使 YAML 坏了也继续检查其他文件和密钥，不回显解析器的原文片段。
    if (bot.yamlError) {
      const line = Number(/at line (\d+)/.exec(bot.yamlError)?.[1] || 1)
      report(bot.yamlPath, `第 ${line} 行`, `YAML 格式错误（第 ${line} 行）：${bot.raw === null ? '找不到 bot.yaml' : '无法解析为合法的「键: 值」映射'}`, bot.raw === null ? '在这个 Bot 文件夹内创建 bot.yaml，可参考 bots/_template/bot.yaml，填写真实信息。' : '检查这一行及上一行的缩进、冒号、引号、括号和重复字段；顶层必须是「键: 值」映射。')
    } else {
      validateSchema(bot, report)
      const data = bot.data
      if (typeof data.slug === 'string' && data.slug !== bot.slug) report(bot.yamlPath, 'slug', `slug ${data.slug} 和文件夹名不一致（文件夹是 ${bot.slug}）`, `将 slug 改为 ${bot.slug}，或把文件夹改成与 slug 一致的合法名称。`)
      validateDate(bot, now, report)
      for (const field of Object.keys(duplicates)) {
        const value = data[field]
        if (typeof value !== 'string') continue
        const first = duplicates[field].get(value)
        if (first) report(bot.yamlPath, field, `${field} 重复，与 bots/${first}/bot.yaml 相同`, `修改当前 Bot 的 ${field} 为独有值；同一个模板不要重复投稿。`)
        else duplicates[field].set(value, bot.slug)
      }
      if (typeof data.forkedFrom === 'string') {
        if (data.forkedFrom === data.slug || data.forkedFrom === bot.slug) report(bot.yamlPath, 'forkedFrom', 'forkedFrom 不能是自己', '填写原 Bot 的 slug；不是改编作品就删除 forkedFrom。')
        else if (!slugs.has(data.forkedFrom)) report(bot.yamlPath, 'forkedFrom', `forkedFrom 找不到 Bot ${data.forkedFrom}`, '填写当前 bots/ 中已存在的原 Bot 的 slug；不是改编作品就删除此字段。')
      }
    }
    validateContent(bot, template, report)
    validateImages(bot, report)
    validateTemplate(bot, template, report)
    scanSecrets(bot, report)
  }
  return { bots, errors, warnings }
}

export function formatResult({ bots, errors, warnings }) {
  const lines = []
  for (const [items, mark, label, advice] of [[errors, '✗', '问题', '改法'], [warnings, '!', '提醒', '建议']]) {
    for (const item of items) lines.push(`${mark} ${item.file}\n  位置：${item.where}\n  ${label}：${item.problem}\n  ${advice}：${item.fix}\n`)
  }
  if (errors.length) {
    const failedBots = new Set(errors.map((item) => item.file.split('/')[1])).size
    lines.push(`校验未通过：${failedBots} 个 Bot 共 ${errors.length} 处错误${warnings.length ? `（另有 ${warnings.length} 条提醒）` : ''}。按上面的「改法」逐条修改后，重新运行 npm run validate。`)
  } else {
    lines.push(`✓ 校验通过：${bots.length} 个 Bot（其中 ${bots.filter((bot) => bot.data?.external === true).length} 个外部收录）`)
  }
  return lines.join('\n')
}
