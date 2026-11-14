import { readFileSync } from 'node:fs'
import { imageFormat } from './images.mjs'

// 只保存匹配规则；测试凭据必须在运行时拼接。
const patterns = [
  /gh[pousr]_[A-Za-z0-9]{36,}/g,
  /github_pat_[A-Za-z0-9_]{22,}/g,
  /sk-(?:proj-|ant-)?[A-Za-z0-9_-]{20,}/g,
  /xai-[A-Za-z0-9_-]{20,}/g,
  /(?:AKIA|ASIA)[A-Z0-9]{16}/g,
  /-----BEGIN (?:[A-Z0-9]+ )*PRIVATE KEY-----/g,
  /AIza[A-Za-z0-9_-]{35}/g,
  /xox[abprs]-[A-Za-z0-9-]{10,}/g,
]
const generic = /\b(?:token|secret|password|api_key)["']?\s*[:=]\s*["']?([A-Za-z0-9_+/.=\-]{20,})/gi
export const secretFix = '删掉它；如果这个密钥曾经推到过 GitHub，就当它已经泄露，马上到对应平台撤销重建。'
const mask = (value) => `${value.slice(0, 4)}***`

export function redact(text) {
  let safe = String(text)
  for (const pattern of patterns) safe = safe.replace(pattern, mask)
  return safe.replace(generic, (match, value) => match.replace(value, mask(value)))
}

export function scanSecrets(bot, report) {
  for (const file of bot.files) {
    const bytes = readFileSync(file.path)
    // 看内容而不是扩展名，避免把伪装成 .png 的文本漏掉。
    if (imageFormat(bytes)) continue
    const lines = bytes.toString('utf8').split(/\r\n|\n|\r/)
    lines.forEach((line, index) => {
      const hits = patterns.flatMap((pattern) => [...line.matchAll(pattern)].map((m) => m[0]))
      for (const hit of new Set(hits)) {
        report(file.path, `第 ${index + 1} 行`, `疑似密钥 ${mask(hit)}（第 ${index + 1} 行）`, secretFix)
      }
      for (const match of line.matchAll(generic)) {
        if (hits.some((hit) => match[1].includes(hit))) continue
        report(file.path, `第 ${index + 1} 行`, `疑似通用凭据 ${mask(match[1])}（第 ${index + 1} 行），请确认是否为密钥`, secretFix, true)
      }
    })
  }
}
