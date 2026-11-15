import { parseDocument, isMap } from 'yaml'
import { botYamlTooLarge, botYamlSizeError } from './yaml-limits.mjs'
import { fail } from '../submission/errors.mjs'

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
