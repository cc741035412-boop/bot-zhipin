import { parseDocument, isMap } from 'yaml'
import { botYamlTooLarge, botYamlSizeError } from './yaml-limits.mjs'
import { fail } from '../submission/errors.mjs'

// 投稿人传来的旧值不是审阅凭证。查询失败时省略该键，让每日核对能报 missing。
export function omitTemplateVersion(text) {
  const map = parseDocument(text, { keepSourceTokens: true }).contents
  const i = map.items.findIndex(pair => pair.key.value === 'templateVersion')
  if (i < 0) return text
  const pair = map.items[i]
  let start = pair.key.range[0], end = pair.value.range[2]
  if (map.flow) {
    const commaBefore = pair.srcToken.start.find(t => t.type === 'comma')
    if (commaBefore) start = commaBefore.offset
    else {
      const commaAfter = map.srcToken.items[i + 1]?.start.find(t => t.type === 'comma')
      if (commaAfter) end = commaAfter.offset + 1
    }
  } else start = text.lastIndexOf('\n', start - 1) + 1
  return text.slice(0, start) + text.slice(end)
}

export function applyTemplateVersion(text, version) {
  if (!Number.isSafeInteger(version) || version < 1) throw new Error('模板版本必须是正安全整数')
  const doc = parseDocument(text), map = doc.contents
  if (doc.errors.length || !isMap(map)) throw new Error('bot.yaml 必须是映射')
  const splice = (start, end, value) => text.slice(0, start) + value + text.slice(end)
  const existing = map.get('templateVersion', true)
  if (existing?.range) return splice(existing.range[0], existing.range[1], String(version))
  const url = map.get('templateUrl', true), field = `templateVersion: ${version}`
  if (map.flow) {
    if (url) return splice(url.range[1], url.range[1], `, ${field}`)
    const end = map.range[1] - 1
    const separator = map.items.length && !text.slice(0, end).trimEnd().endsWith(',') ? ', ' : ''
    return splice(end, end, separator + field)
  }
  const end = url?.range[2] ?? map.range[2], nl = text.includes('\r\n') ? '\r\n' : '\n'
  const indent = ' '.repeat(map.items[0].key.range[0] - text.lastIndexOf('\n', map.items[0].key.range[0] - 1) - 1)
  return splice(end, end, (text[end - 1] === '\n' ? '' : nl) + indent + field + nl)
}

/** 只改服务器拥有的字段；Document 保留注释、引号和未改字段的节点。 */
export function applyServerFields(botYamlText, { login, addedAt }) {
  if (botYamlTooLarge(botYamlText)) fail('bot.yaml', botYamlSizeError.where, botYamlSizeError.problem, botYamlSizeError.fix)
  const doc = parseDocument(botYamlText)
  if (doc.errors.length || !isMap(doc.contents)) throw new Error('bot.yaml 无法解析为合法的「键: 值」映射。')
  // toString 会规范化未改字段的空格；只取改写字段的序列化片段，其他原文不动。
  const spans = (document) => new Map(document.contents.items.map(({ key, value }) => [
    key.value, [key.range[0], (value?.range ?? key.range)[2]],
  ]))
  const originalSpans = spans(doc)
  const flow = doc.contents.flow === true
  const insertionPoint = flow ? doc.contents.range[1] - 1 : doc.contents.range[2]
  const hadItems = doc.contents.items.length > 0
  const author = doc.get('author', true)
  if (author === undefined) doc.set('author', { name: login, github: login })
  else {
    if (!isMap(author)) throw new Error('bot.yaml 的 author 必须是「键: 值」映射。')
    if (!author.has('name')) author.set('name', login)
    author.set('github', login)
  }
  doc.set('addedAt', addedAt)
  const rendered = doc.toString()
  const renderedSpans = spans(parseDocument(rendered))
  const edits = [], additions = []
  for (const key of ['author', 'addedAt']) {
    const [start, end] = renderedSpans.get(key)
    const text = rendered.slice(start, end)
    if (originalSpans.has(key)) edits.push({ range: originalSpans.get(key), text })
    else additions.push(text)
  }
  if (additions.length) edits.push({
    range: [insertionPoint, insertionPoint],
    text: flow ? (hadItems ? ', ' : '') + additions.map((text) => text.trimEnd()).join(', ')
      : (insertionPoint && botYamlText[insertionPoint - 1] !== '\n' ? '\n' : '') + additions.join(''),
  })
  let result = botYamlText
  // 相同起点时先处理插入，避免覆盖新插入的字段。
  edits.sort((a, b) => b.range[0] - a.range[0])
  for (const { range: [start, end], text } of edits) result = result.slice(0, start) + text + result.slice(end)
  return result
}
