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
// 大部分正文没有任何凭据前缀；先线性筛选，避免每条规则反复扫描长正文。
const candidate = /gh[pousr]_|github_pat_|sk-|xai-|AKIA|ASIA|-----BEGIN |AIza|xox[abprs]-|token|secret|password|api_key/i
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
    // 看内容而不是扩展名，避免把伪装成 .png 的文本漏掉。
    if (file.format !== undefined ? file.format : imageFormat(file.head || new Uint8Array())) continue
    if (file.size > 100 * 1024) {
      report(file.path, '文件大小', `非图片文件超过 100KB：实际 ${file.size} 字节`, '将每个非图片文件缩减到 100KB（102400 字节）以内。')
      continue
    }
    const lines = (file.text ?? '').split(/\r\n|\n|\r/)
    lines.forEach((line, index) => {
      if (!candidate.test(line)) return
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
