import { isDeepStrictEqual } from 'node:util'
import { cnFit } from './context.mjs'
import { byId, cmp, groupBy, ordered, sourceKey, union } from './records.mjs'

const byLicense = ordered(['CC0-1.0', 'MIT', 'CC-BY-4.0'], r => r.license)
const byTextSource = ordered(['cobus', 'sitin', 'ronglecat', 'majiayu', 'grokbotdev', 'botdirectory'])
const byLinkSource = ordered(['grokbotdev', 'botdirectory', 'majiayu', 'kydlikebtc', 'ronglecat', 'cobus', 'sitin'])
const zhSources = ['majiayu', 'kydlikebtc', 'ronglecat']
const byZhSource = ordered(zhSources)

function provenance(r) {
  const { sourceRepo, sourcePath, sourceUrl, license, author } = r
  const entry = { sourceRepo, sourcePath, sourceUrl, license, author }
  if (license === 'CC-BY-4.0' && r.extra.attribution) entry.attribution = r.extra.attribution
  if (r.extra.licenseTrace) entry.licenseTrace = r.extra.licenseTrace
  if (r.extra.withheld) entry.withheld = r.extra.withheld
  return entry
}
function flags(members, withHits) {
  const rules = union(members.flatMap(m => m.needsReview.rules))
  if (!withHits) return { flag: !!rules.length, rules }
  // 相同摘录只展示一次。
  const hits = new Map(members.flatMap(m => m.needsReview.hits.map(h => [JSON.stringify(h), h])))
  return { flag: !!rules.length, rules, hits: [...hits.values()] }
}
function summary(members, get) {
  for (const r of members) {
    const text = get(r)
    if (text?.trim()) return { text, license: r.license, from: r.sourceRepo }
  }
  return null
}

export function deduplicate(records, listed) {
  const texts = [], links = [], textIds = new Map()
  for (const members of groupBy(records.filter(r => r.body), r => r.bodyHash).values()) {
    members.sort((a, b) => byLicense(a, b) || byTextSource(a, b) || byId(a, b))
    const [primary, ...rest] = members
    for (const r of members) textIds.set(r.id, primary.id)
    texts.push({ ...primary, members, alsoIn: rest.map(r => ({ id: r.id, ...provenance(r) })),
      listed: members.map(r => listed.get(r.shareId)).find(Boolean) ?? null,
      cnFit: cnFit(members), needsReview: flags(members, true) })
  }
  for (const [shareId, members] of groupBy(records.filter(r => r.shareId), r => r.shareId)) {
    members.sort((a, b) => byLinkSource(a, b) || byId(a, b))
    const zh = members.filter(r => zhSources.includes(sourceKey(r))).sort((a, b) => byZhSource(a, b) || byId(a, b))
    const kyd = members.filter(r => sourceKey(r) === 'kydlikebtc')
    const author = members.find(r => r.author)?.author ?? null
    const sources = members.map(r => {
      const entry = provenance(r)
      if (isDeepStrictEqual(entry.author, author)) delete entry.author
      return entry
    })
    links.push({ shareId, title: members.find(r => r.title)?.title ?? null, author,
      summary: summary(members, r => r.extra.summary || r.extra.description || r.extra.tagline),
      summaryZh: summary(zh, r => r.extra.summaryZh),
      status: kyd.length && kyd.every(r => r.extra.retired) ? 'retired' : 'live',
      categories: members.filter(r => r.extra.category).map(r => ({ from: r.sourceRepo, value: r.extra.category })),
      tags: union(members.flatMap(r => r.extra.tags ?? [])), integrations: union(members.flatMap(r => r.integrations)),
      collections: union(members.flatMap(r => r.extra.collections ?? [])), sources,
      fullText: union(members.map(r => textIds.get(r.id))), listed: listed.get(shareId) ?? null,
      cnFit: cnFit(members), needsReview: flags(members, false) })
  }
  return { texts: texts.sort(byId), links: links.sort((a, b) => cmp(a.shareId, b.shareId)) }
}
