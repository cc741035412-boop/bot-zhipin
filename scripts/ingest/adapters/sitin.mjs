import { readFileSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'
import { firstHeading } from '../lib/frontmatter.mjs'
import { githubBlobUrl, makeRecord } from '../lib/record.mjs'

const AUTHOR = { name: 'sitin', url: 'https://github.com/sit-in' }
const META = {
  适合: 'suitableFor',
  验证日期: 'verifiedAt',
  验证级别: 'verifyLevel',
  成本量级: 'cost',
}

function metadata(body) {
  const extra = {}
  const quote = /^> ([^\r\n]*)/m.exec(body)
  if (quote) extra.summary = quote[1].trim().replace(/^一句话：\s*/, '')
  const fields = /^(?:[ \t]*[-*+]\s+)?\*\*(适合|验证日期|验证级别|成本量级)\*\*[：:][ \t]*([^\r\n]+)/gm
  for (const [, label, text] of body.matchAll(fields)) {
    const value = text.trim()
    if (value) extra[META[label]] ??= value
  }
  return extra
}

export function adapt({ root, source }) {
  const records = []
  const dropped = []
  const files = new Map(readdirSync(root, { recursive: true, withFileTypes: true })
    .filter((entry) => !entry.isDirectory())
    .map((entry) => [relative(root, join(entry.parentPath, entry.name)), entry])
    .filter(([path]) => path !== '.git' && !path.startsWith('.git/')))
  let unused = 0
  for (const sourcePath of [...files.keys()].sort()) {
    if (sourcePath === 'examples/_template.md') {
      dropped.push({ sourcePath, reason: '案例填写模板，不是实际配方' })
    } else if (!/^examples\/[^/]+\.md$/.test(sourcePath) || /^examples\/README\.md$/i.test(sourcePath)) {
      unused++
    } else {
      try {
        if (!files.get(sourcePath).isFile()) throw new Error('不是普通文件')
        const body = readFileSync(join(root, sourcePath), 'utf8')
        records.push(makeRecord({
          kind: 'recipe', title: firstHeading(body), body, extra: metadata(body),
          sourceKey: source.key, sourceRepo: source.repo, sourcePath,
          sourceUrl: githubBlobUrl(source.repo, source.commit, sourcePath),
          author: AUTHOR, license: source.license, fetchedAt: source.fetchedAt,
        }))
      } catch (error) {
        dropped.push({ sourcePath, reason: `解析失败：${error.message}` })
      }
    }
  }
  if (unused) dropped.push({ sourcePath: '.', reason: '未收录说明文档和其他非入库文件', count: unused })
  return { records, dropped }
}
