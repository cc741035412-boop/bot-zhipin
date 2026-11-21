import { readFileSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'
import { firstHeading } from '../lib/frontmatter.mjs'
import { githubBlobUrl, makeRecord, shareIdOf } from '../lib/record.mjs'

const AUTHOR = { name: 'majiayu000', url: 'https://github.com/majiayu000' }
const CATALOG = 'catalog.json'
const DOC = 'docs/first-ten-bots.md'
const PACK = /^packs\/[^/]+\.md$/

export function adapt({ root, source }) {
  const records = []
  const dropped = []
  const files = new Map(readdirSync(root, { recursive: true, withFileTypes: true })
    .filter((entry) => !entry.isDirectory())
    .map((entry) => [relative(root, join(entry.parentPath, entry.name)), entry])
    .filter(([path]) => path !== '.git' && !path.startsWith('.git/')))
  const read = (path) => {
    if (!files.get(path)?.isFile()) throw new Error(`${path} 不是普通文件`)
    return readFileSync(join(root, path), 'utf8')
  }
  const add = (sourcePath, fields) => records.push(makeRecord({
    author: AUTHOR, license: source.license, ...fields,
    sourceKey: source.key, sourceRepo: source.repo, sourcePath,
    sourceUrl: githubBlobUrl(source.repo, source.commit, sourcePath), fetchedAt: source.fetchedAt,
  }))
  const attempt = (sourcePath, parse) => {
    try { parse() } catch (error) {
      dropped.push({ sourcePath, reason: `解析失败：${error.message}` })
    }
  }

  if (files.has(CATALOG)) attempt(CATALOG, () => {
    const { entries } = JSON.parse(read(CATALOG))
    if (!Array.isArray(entries)) throw new Error('目录缺少 entries 数组')
    const reserved = new Set(entries.map((entry) => entry?.slug))
    const occurrences = new Map()
    for (const [index, entry] of entries.entries()) {
      const slug = entry?.slug
      if (typeof slug !== 'string' || !slug.trim()) {
        dropped.push({ sourcePath: `${CATALOG}#第${index + 1}项`, reason: '目录条目缺少 slug' })
        continue
      }
      let occurrence = (occurrences.get(slug) ?? 0) + 1
      if (occurrence > 1) while (reserved.has(`${slug}~${occurrence}`)) occurrence++
      occurrences.set(slug, occurrence)
      const sourcePath = `${CATALOG}#${occurrence === 1 ? slug : `${slug}~${occurrence}`}`
      attempt(sourcePath, () => {
        const shareId = shareIdOf(entry.import)
        if (!shareId) throw new Error('import 不含有效的 Bot 分享 ID')
        if (entry.license !== 'CC0-1.0' && entry.license !== 'MIT') throw new Error('逐行许可必须是 CC0-1.0 或 MIT')
        add(sourcePath, {
          kind: 'bot-link', title: entry.name, shareId, author: entry.author, license: entry.license,
          extra: {
            summary: entry.summary, summaryZh: entry.summary_zh, category: entry.category, tags: entry.tags,
            shelf: entry.shelf, verified: entry.verified, updated: entry.updated, sourcePost: entry.source,
            related: entry.related, firstSafeTask: entry.first_safe_task, approvalBoundary: entry.approval_boundary,
            connectors: entry.connectors, mcpCustom: entry.mcp_custom,
          },
        })
      })
    }
  })

  const counts = { 'catalog/': 0, 'templates/': 0, '.': 0 }
  for (const sourcePath of [...files.keys()].sort()) {
    if (sourcePath === CATALOG) continue
    const isPack = PACK.test(sourcePath) && !/^packs\/README\.md$/i.test(sourcePath)
    if (isPack || sourcePath === DOC) {
      attempt(sourcePath, () => {
        const body = read(sourcePath)
        const heading = firstHeading(body)
        add(sourcePath, { kind: isPack ? 'team' : 'recipe', title: isPack ? heading?.replace(/^Pack:[ \t]*/, '') : heading, body })
      })
    } else if (sourcePath.startsWith('catalog/')) counts['catalog/']++
    else if (sourcePath.startsWith('templates/')) counts['templates/']++
    else counts['.']++
  }
  for (const [sourcePath, reason] of [
    ['catalog/', '站点生成的分语言目录副本，不重复收录'],
    ['templates/', '本次只收目录分享链接、队伍和指定配方，不收模板目录'],
    ['.', '未收录说明文档和其他非入库文件'],
  ]) {
    if (counts[sourcePath]) dropped.push({ sourcePath, reason, count: counts[sourcePath] })
  }
  records.sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0)
  return { records, dropped }
}
