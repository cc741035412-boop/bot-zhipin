// 文字指纹：用来判断一段摘要是不是照抄了 x.ai 分享页上的介绍，而不把那段原文本身存下来。
import { createHash } from 'node:crypto'

// 归一化：NFKC、小写、去掉标点和符号、空白压成一个空格。
export function normText(text) {
  return String(text ?? '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\p{P}\p{S}]+/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim()
}

export const KEY_CHARS = 40

// 归一化后前 40 个字符的 sha256。不足 40 个字符的取全部。空文字返回 null。
export function textKey(text, n = KEY_CHARS) {
  const norm = normText(text)
  if (!norm) return null
  return `sha256:${createHash('sha256').update(norm.slice(0, n), 'utf8').digest('hex')}`
}
