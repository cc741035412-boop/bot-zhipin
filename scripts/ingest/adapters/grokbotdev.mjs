import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import MarkdownIt from 'markdown-it'
import { splitFrontmatter } from '../lib/frontmatter.mjs'
import { githubBlobUrl, makeRecord, shareIdOf } from '../lib/record.mjs'

const markdown = new MarkdownIt('commonmark')
const attribution = () => ({
  by: 'GrokBot.dev contributors',
  repo: 'ZeroPointRepo/GrokBotDev',
  license: 'CC BY 4.0',
  licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
})

function* files(root, prefix = '') {
  const entries = readdirSync(join(root, prefix), { withFileTypes: true })
  for (const entry of entries.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))) {
    if (entry.name === '.git') continue
    const path = prefix + entry.name
    if (entry.isDirectory()) yield* files(root, `${path}/`)
    else yield [path, entry.isFile()]
  }
}

function promptSections(body) {
  const lines = body.split(/\r?\n/)
  const tokens = markdown.parse(body, {})
  let prompt = null
  let setup
  for (const [i, heading] of tokens.entries()) {
    if (heading.type !== 'heading_open' || heading.tag !== 'h2' || heading.level !== 0) continue
    const name = tokens[i + 1].content
    if (name !== 'Prompt' && name !== "How it's set up") continue
    let end = i + 3
    while (end < tokens.length) {
      const t = tokens[end]
      if (t.type === 'heading_open' && t.level === 0 && ['h1', 'h2'].includes(t.tag)) break
      end++
    }
    if (name === 'Prompt' && prompt === null) {
      const fence = tokens.slice(i + 3, end).find((t) => t.type === 'fence')
      if (fence) prompt = fence.content
    } else if (name === "How it's set up" && setup === undefined) {
      setup = lines.slice(heading.map[1], tokens[end]?.map[0]).join('\n').trim()
    }
  }
  return { prompt, setup }
}

export function adapt({ root, source }) {
  const records = []
  const dropped = []
  const collections = []
  const templates = new Map()
  let ignored = 0
  for (const [sourcePath, regularFile] of files(root)) {
    const match = regularFile && /^content\/(use-cases|templates|collections)\/([^/]+)\.md$/.exec(sourcePath)
    if (!match) {
      ignored++
      continue
    }
    const [, section, filenameSlug] = match
    try {
      const text = readFileSync(join(root, sourcePath), 'utf8')
      const { data, body } = splitFrontmatter(text)
      if (section === 'collections') {
        if (!data.name || !Array.isArray(data.members)) throw new Error('集合缺少 name 或 members 列表')
        collections.push({ sourcePath, name: data.name, members: data.members })
        continue
      }
      const base = {
        sourceKey: source.key,
        sourceRepo: source.repo,
        sourcePath,
        sourceUrl: githubBlobUrl(source.repo, source.commit, sourcePath),
        fetchedAt: source.fetchedAt,
        // 部分用例只有 headline；模板仍要求 name。
        title: data.name ?? (section === 'use-cases' ? data.headline : undefined),
        license: source.license,
      }
      if (section === 'use-cases') {
        const { prompt, setup } = promptSections(body)
        const provenance = data.prompt_provenance
        const originalAuthor = { name: data.author?.handle, url: data.author?.url }
        const credit = attribution()
        records.push(makeRecord({
          ...base,
          kind: 'prompt',
          body: prompt ?? body,
          shareId: shareIdOf(text),
          author: provenance === 'curator'
            ? { name: credit.by, url: `https://github.com/${credit.repo}`, role: 'curator' }
            : originalAuthor,
          integrations: data.integrations,
          extra: {
            promptBlock: prompt !== null,
            provenance,
            ...(provenance === 'curator' ? { inspiredBy: originalAuthor } : {}),
            setupMinutes: data.setup_minutes,
            difficulty: data.difficulty,
            autonomy: data.autonomy,
            schedule: data.schedule,
            category: data.category,
            subcategory: data.subcategory,
            awesomeScore: data.awesome_score,
            replicability: data.replicability,
            status: data.status,
            setup,
            attribution: credit,
          },
        }))
      } else {
        const shareId = shareIdOf(data.share_url)
        if (!shareId) throw new Error('share_url 没有合法的分享 ID')
        const slug = data.slug ?? filenameSlug
        const record = makeRecord({
          ...base,
          kind: 'bot-link',
          shareId,
          author: { name: data.sharer?.handle, url: data.sharer?.url, role: 'sharer' },
          extra: {
            summary: data.description || data.tagline,
            tagline: data.tagline,
            tags: data.tags,
            category: data.primary_category,
            includes: data.includes,
            sourcePost: data.source?.url,
            relatedUseCases: data.related_use_cases,
            status: data.status,
            collections: [],
            slug,
            attribution: attribution(),
          },
        })
        templates.set(slug, record)
        records.push(record)
      }
    } catch (error) {
      dropped.push({ sourcePath, reason: `无法收录：${error.message}` })
    }
  }
  for (const { sourcePath, name, members } of collections) {
    let missing = 0
    for (const member of members) {
      const template = templates.get(member?.slug)
      if (!template) missing++
      else if (!template.extra.collections.includes(name)) template.extra.collections.push(name)
    }
    if (missing) dropped.push({ sourcePath, reason: '集合成员找不到对应的模板', count: missing })
  }
  if (ignored) dropped.push({ sourcePath: '.', reason: '不收录 content/ 以外的文件及 content/ 内非用例、模板、集合的文件', count: ignored })
  for (const record of templates.values()) record.extra.collections.sort()
  records.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
  return { records, dropped }
}
