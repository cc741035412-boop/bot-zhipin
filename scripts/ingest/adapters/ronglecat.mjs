import { readFileSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'
import { githubBlobUrl, makeRecord, shareIdOf } from '../lib/record.mjs'

const AUTHOR = { name: 'RongleCat', url: 'https://github.com/RongleCat' }
const PLAYBOOK = 'prompts/playbook-prompts.zh.md'
const ENGLISH = 'prompts/playbook-prompts.md'
const CATALOG = 'data/catalog.json'

function* playbookSections(text) {
  let section
  let fence
  for (const line of text.split(/\r\n?|\n/)) {
    if (fence) {
      const close = /^ {0,3}(`{3,}|~{3,})[ \t]*$/.exec(line)?.[1]
      if (close?.[0] === fence[0] && close.length >= fence.length) {
        if (section?.block && section.body === undefined) section.body = section.block.join('\n')
        fence = undefined
      } else if (section?.block && section.body === undefined) {
        section.block.push(line)
      }
      continue
    }
    if (/^ {0,3}#{1,2}(?:[ \t]|$)/.test(line)) {
      if (section) yield section
      const heading = /^ {0,3}##[ \t]+(\d+)\.[ \t]+(.+?)\s*$/.exec(line)
      section = heading ? { number: heading[1], title: heading[2].replace(/[ \t]+#+$/, '') } : undefined
      continue
    }
    const open = /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(line)
    if (open && (open[1][0] === '~' || !open[2].includes('`'))) {
      fence = open[1]
      if (section && !section.block) section.block = []
    } else if (section && !section.block && section.summary === undefined && line.trim()) {
      section.summary = line.trim()
    }
  }
  if (section) yield section
}

export function adapt({ root, source }) {
  const records = []
  const dropped = []
  const add = (sourcePath, fields) => records.push(makeRecord({
    ...fields, sourceKey: source.key, sourceRepo: source.repo, sourcePath,
    sourceUrl: githubBlobUrl(source.repo, source.commit, sourcePath),
    author: AUTHOR, license: source.license, fetchedAt: source.fetchedAt,
  }))
  const attempt = (sourcePath, parse) => {
    try { parse() } catch (error) {
      dropped.push({ sourcePath, reason: `解析失败：${error.message}` })
    }
  }
  const files = readdirSync(root, { recursive: true, withFileTypes: true })
    .filter((entry) => !entry.isDirectory())
    .map((entry) => [relative(root, join(entry.parentPath, entry.name)), entry])
    .filter(([path]) => path !== '.git' && !path.startsWith('.git/'))
  const byPath = new Map(files)
  const read = (path) => {
    if (!byPath.get(path)?.isFile()) throw new Error(`${path} 不是普通文件`)
    return readFileSync(join(root, path), 'utf8')
  }

  if (byPath.has(PLAYBOOK)) attempt(PLAYBOOK, () => {
    for (const { number, title, body, summary } of playbookSections(read(PLAYBOOK))) {
      const path = `${PLAYBOOK}#${number}`
      attempt(path, () => {
        if (!body?.trim()) throw new Error('小节缺少非空且闭合的代码块')
        add(path, { kind: 'prompt', title, body, extra: summary === undefined ? {} : { summary } })
      })
    }
  })
  if (byPath.has(ENGLISH)) dropped.push({ sourcePath: ENGLISH, reason: '同批提示词的英文版，只收中文版' })

  if (byPath.has(CATALOG)) attempt(CATALOG, () => {
    const { sections } = JSON.parse(read(CATALOG))
    if (!Array.isArray(sections)) throw new Error('目录缺少 sections 数组')
    for (const [sectionIndex, section] of sections.entries()) {
      const path = `${CATALOG}#${section?.id ?? sectionIndex}`
      if (!section?.id || !Array.isArray(section.items)) {
        dropped.push({ sourcePath: path, reason: '目录分区缺少 id 或 items 数组' })
        continue
      }
      let skipped = 0
      for (const [index, item] of section.items.entries()) {
        const shareId = shareIdOf(item?.url)
        if (!shareId) {
          skipped++
          continue
        }
        const sourcePath = `${path}/${index}`
        attempt(sourcePath, () => add(sourcePath, {
          kind: 'bot-link', title: item.title, shareId,
          extra: { summary: item.blurb?.en, summaryZh: item.blurb?.zh, section: section.id },
        }))
      }
      if (skipped) dropped.push({ sourcePath: path, reason: '资源导航链接，不含有效的 Bot 分享 ID', count: skipped })
    }
  })
  const unused = byPath.size - [PLAYBOOK, ENGLISH, CATALOG].filter((path) => byPath.has(path)).length
  if (unused) dropped.push({ sourcePath: '.', reason: '未收录说明文档和其他非入库文件', count: unused })
  records.sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0)
  return { records, dropped }
}
