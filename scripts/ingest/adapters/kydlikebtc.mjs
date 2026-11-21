import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { githubBlobUrl, makeRecord } from '../lib/record.mjs'
import { normText, textKey } from '../lib/textkey.mjs'

const attribution = () => ({
  by: 'GrokBot.dev contributors',
  repo: 'ZeroPointRepo/GrokBotDev',
  license: 'CC BY 4.0',
  licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
})

export function adapt({ root, source }) {
  const records = []
  const dropped = []
  const paths = new Set()
  const catalogs = []
  for (const filename of ['catalog.json', 'retired.json']) {
    try {
      const { entries } = JSON.parse(readFileSync(join(root, filename), 'utf8'))
      if (!Array.isArray(entries)) throw new Error('缺少 entries 数组')
      catalogs.push({ filename, entries })
    } catch (error) {
      dropped.push({ sourcePath: filename, reason: `无法读取目录：${error.message}` })
    }
  }

  // 两份目录的所有行（包括不能收录的行）都参与比对；原文和归一化索引不进入记录。
  const officialTexts = catalogs.flatMap(({ entries }) => entries.map((entry) => entry?.official_summary))
  const officials = [...new Set(officialTexts.map(normText).filter(Boolean))]
  const officialPrefixes = [...new Set(officials.map((official) => official.slice(0, 30)))]
  const rawPrefixes = [...new Set(officialTexts
    .filter((official) => typeof official === 'string' && official !== '')
    .map((official) => official.slice(0, 30)))]

  function isCopied(text) {
    const normalized = normText(text)
    const normalizedPrefix = normalized.slice(0, 40)
    return (normalized !== '' && (
      officialPrefixes.some((prefix) => normalized.includes(prefix)) ||
      officials.some((official) => official.startsWith(normalizedPrefix))
    )) || (typeof text === 'string' && text !== '' && rawPrefixes.some((prefix) => text.includes(prefix)))
  }

  for (const { filename, entries } of catalogs) {
    for (const [i, entry] of entries.entries()) {
      const hasSlug = typeof entry?.slug === 'string' && Boolean(entry.slug.trim())
      const sourcePath = `${filename}#${hasSlug ? entry.slug : i}`
      try {
        if (!hasSlug) throw new Error('缺少有效的 slug')
        if (typeof entry.bot_id !== 'string' || !/^[A-Za-z0-9_-]{21}$/.test(entry.bot_id)) {
          throw new Error('bot_id 不是合法的 21 位分享 ID')
        }
        if (paths.has(sourcePath)) throw new Error('目录内 slug 重复')
        // 分享页原文不进入记录；只保留扣除原因和该行原文的指纹。
        const extra = {
          ...(isCopied(entry.summary) ? { summaryDropped: 'x.ai 分享页原文' } : { summary: entry.summary }),
          ...(isCopied(entry.summary_zh) ? { summaryZhDropped: 'x.ai 分享页原文' } : { summaryZh: entry.summary_zh }),
          ...(entry.official_summary ? { officialKey: textKey(entry.official_summary) } : {}),
          category: entry.category,
          tags: entry.tags,
          firstSeen: entry.first_seen,
          checked: entry.checked,
          linkStatus: entry.link_status,
          catalogs: entry.sources,
          origin: entry.origin,
          aka: entry.aka,
          retired: filename === 'retired.json',
        }
        if (entry.license === 'CC-BY-4.0') extra.attribution = attribution()
        records.push(makeRecord({
          sourceKey: source.key,
          sourceRepo: source.repo,
          sourcePath,
          sourceUrl: githubBlobUrl(source.repo, source.commit, sourcePath),
          fetchedAt: source.fetchedAt,
          title: entry.name,
          kind: 'bot-link',
          shareId: entry.bot_id,
          author: { name: entry.author?.name, url: entry.author?.url },
          integrations: entry.integrations,
          license: entry.license,
          extra,
        }))
        paths.add(sourcePath)
      } catch (error) {
        dropped.push({ sourcePath, reason: `无法收录：${error.message}` })
      }
    }
  }
  records.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
  return { records, dropped }
}
