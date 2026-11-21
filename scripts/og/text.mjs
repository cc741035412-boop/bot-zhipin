// 测宽和查缺字都看实际要画的那一份 OTF，不问操作系统装了什么字体。
const graphemes = new Intl.Segmenter('zh', { granularity: 'grapheme' })
const words = new Intl.Segmenter('zh', { granularity: 'word' })
export function cleanText(text, font) {
  let value = '', emoji = false
  const missing = new Set()
  for (const { segment } of graphemes.segment(text || '')) {
    if (/\p{Extended_Pictographic}|\p{Regional_Indicator}|\u20e3/u.test(segment)) { emoji = true; continue }
    value += segment
    for (const ch of segment) if (!/\s/u.test(ch) && !font.charToGlyphIndex(ch)) missing.add(ch)
  }
  return { value, missing: [...missing], emoji }
}

const closing = /^[，。、；：！？）》】」』〉〕”’…,.!?:;%)]/u
const opening = /^[（《「『“‘【〈〔]/u
const preferredBreak = /[，。、；：！？]$/u
const EXTRA_LINE = 8

function wrap(text, width, measure, limit) {
  const tokens = []
  let prefix = ''
  for (const { segment } of words.segment(text.trim())) {
    if (opening.test(segment) || (prefix && !segment.trim())) prefix += segment
    else if (!prefix && closing.test(segment) && tokens.length) tokens[tokens.length - 1] += segment
    else {
      tokens.push(prefix + segment)
      prefix = ''
    }
  }
  if (prefix) tokens.push(prefix)
  // 超宽片段才逐字拆；拆开后闭标点仍粘在前一个字上，不落到行首。
  const chars = token => [...token].reduce((out, ch) => {
    if (out.length && closing.test(ch)) out[out.length - 1] += ch
    else out.push(ch)
    return out
  }, [])
  const parts = tokens.flatMap(token => measure(token) > width ? chars(token) : [token])

  // 先取贪心排出的行数；需要截断时直接保留贪心结果。
  const lines = []
  let line = ''
  for (const part of parts) {
    if (line.trim() && measure((line + part).trimEnd()) > width) {
      lines.push(line.trimEnd()); line = ''
    }
    line += line ? part : part.trimStart()
  }
  if (line.trim()) lines.push(line.trimEnd())
  const n = lines.length, count = parts.length
  if (n < 2 || n > limit) return lines

  // 每个候选行只量一次；状态是从 start 开始、恰好还要排 remaining 行。
  const spans = parts.map((_, start) => {
    let raw = ''
    return parts.slice(start).map(part => {
      raw += part
      const value = raw.trim()
      return { value, advance: measure(value) }
    })
  })
  // 行数上限没用满时，也试试多排一行：多一行要加 EXTRA_LINE，只有能避开词中间断行时才划算
  // （比如「…专员，盯竞 / 品、写定位…」改成「…专员，/ 盯竞品、写定位、改官网、/ 看投放数据」）。
  const most = Math.min(limit, n + 1)
  const best = Array.from({ length: most + 1 }, () => [])
  best[0][count] = { cost: 0 }
  for (let remaining = 1; remaining <= most; remaining++) {
    for (let start = 0; start <= count - remaining; start++) {
      for (let end = start + 1; end <= count - remaining + 1; end++) {
        const rest = best[remaining - 1][end]
        if (!rest) continue
        const { value, advance } = spans[start][end - start - 1]
        if (!value || advance > width) continue
        const cost = remaining === 1
          ? (advance < width * 0.25 ? 30 : 0)
          : rest.cost + (preferredBreak.test(parts[end - 1]) ? 0 : 20) + 100 * ((width - advance) / width) ** 2
        // 从短到长枚举，同分保留最先找到的断点。
        if (!best[remaining][start] || cost < best[remaining][start].cost) best[remaining][start] = { cost, end, value }
      }
    }
  }
  // 如果连单字也比行宽宽，就没有可行的断法，仍沿用原贪心结果。
  if (!best[n][0]) return lines
  const rows = most > n && best[most][0] && best[most][0].cost + EXTRA_LINE < best[n][0].cost ? most : n
  const balanced = []
  for (let remaining = rows, start = 0; remaining > 0; remaining--) {
    const { end, value } = best[remaining][start]
    balanced.push(value)
    start = end
  }
  return balanced
}
// 先累加字体单位再换成像素，避免刚好满行时的浮点误差（两个 36px 全角字正好是 72px）。
const ruler = (font, size) => str => font.getAdvanceWidth(str, font.unitsPerEm) * size / font.unitsPerEm
export function nameLayout(text, font, squad = false) {
  const [large, medium, small, last] = squad ? [68, 60, 52, 46] : [76, 64, 56, 48]
  for (const size of [large, medium, small]) {
    if (ruler(font, size)(text) <= 528) return { size, lines: [text] }
  }
  for (const size of [small, last]) {
    const lines = wrap(text, 528, ruler(font, size), 2)
    if (lines.length <= 2) return { size, lines }
  }
  // 合法名字最多 20 字。极端的长词/禁则组合优先保全名字，允许拆词。
  const chars = [...text], mid = Math.ceil(chars.length / 2)
  return { size: last, lines: [chars.slice(0, mid).join(''), chars.slice(mid).join('')] }
}
export function bodyLines(text, font, size, limit = 3, width = 528) {
  const measure = ruler(font, size), all = wrap(text, width, measure, limit)
  if (all.length <= limit) return all
  const lines = all.slice(0, limit), tail = [...lines.pop()]
  while (tail.length && measure(tail.join('') + '…') > width) tail.pop()
  return [...lines, tail.join('').trimEnd() + '…']
}
