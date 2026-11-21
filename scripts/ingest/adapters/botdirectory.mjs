import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { firstHeading, splitFrontmatter } from '../lib/frontmatter.mjs'
import { githubBlobUrl, makeRecord, shareIdOf } from '../lib/record.mjs'

const SITE_ACCOUNTS = ['BotDirectoryAI']

function isSourceLink(value) {
  if (typeof value !== 'string') return false
  const url = value.trim()
  return url !== '' && !/x\.ai\//i.test(url) && !/^(?:(?:https?:)?\/\/)?x\.com\/BotDirectoryAI\//i.test(url)
}

export function adapt({ root, source }) {
  const records = []
  const dropped = []
  const dir = join(root, 'bots')
  const files = readdirSync(dir, { withFileTypes: true }).filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
  for (const filename of files.map((entry) => entry.name).sort()) {
    const sourcePath = `bots/${filename}`
    const slug = filename.slice(0, -3)
    try {
      const { data, body } = splitFrontmatter(readFileSync(join(dir, filename), 'utf8'))
      const contributor = typeof data.contributor === 'string' ? data.contributor.trim() : ''
      const authorKnown = Boolean(contributor) && !(SITE_ACCOUNTS.includes(contributor) && data.scouted_by)
      const sources = Array.isArray(data.sources) ? data.sources : []
      const hasSourceLink = [...sources.map((item) => item?.url), data.added_via].some(isSourceLink)
      const hasBody = Boolean(body.trim())
      const keep = hasBody && (authorKnown || hasSourceLink)
      const extra = {
        slug,
        pageUrl: `https://botdirectory.ai/bots/${encodeURIComponent(slug)}`,
        category: data.category,
        description: data.description,
        scoutedBy: data.scouted_by,
        addedVia: data.added_via,
        sources: data.sources,
        productUrl: data.url,
        addedAt: data.added_at,
      }
      if (keep) extra.bodyPolicy = { keep: true, basis: authorKnown ? 'author' : 'source-link' }
      else if (hasBody) extra.linkOnly = { reason: '投稿人不是原作者，也没有来源链接' }
      records.push(makeRecord({
        sourceKey: source.key,
        sourceRepo: source.repo,
        sourcePath,
        sourceUrl: githubBlobUrl(source.repo, source.commit, sourcePath),
        fetchedAt: source.fetchedAt,
        title: data.name ?? data.title ?? firstHeading(body) ?? slug,
        kind: keep ? 'prompt' : 'bot-link',
        body: keep ? body : null,
        shareId: shareIdOf(data.grok_share_url),
        author: contributor ? { name: contributor, url: data.contributor_url ?? `https://github.com/${contributor}` } : null,
        integrations: data.integrations,
        license: source.license,
        extra,
      }))
    } catch (error) {
      dropped.push({ sourcePath, reason: `无法收录：${error.message}` })
    }
  }
  return { records, dropped }
}
