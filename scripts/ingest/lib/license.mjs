import { byId, groupBy, sourceKey } from './records.mjs'

const normalize = s => (s ?? '').toLowerCase().replace(/\p{P}/gu, '').replace(/\s+/gu, ' ').trim()
export function traceLicenses(records) {
  const templates = groupBy(records.filter(r => sourceKey(r) === 'grokbotdev' && r.kind === 'bot-link' && r.shareId).sort(byId), r => r.shareId)
  let traced = 0
  const updated = records.map(r => {
    if (sourceKey(r) !== 'majiayu' || r.kind !== 'bot-link') return r
    const summary = normalize(r.extra.summary)
    if (!summary) return r
    const match = templates.get(r.shareId)?.find(g => [g.extra.summary, g.extra.tagline].some(value => {
      const other = normalize(value)
      return summary === other || (Array.from(summary).length >= 60 && other.startsWith(summary))
    }))
    if (!match) return r
    traced++
    return { ...r, license: 'CC-BY-4.0', extra: { ...r.extra, attribution: match.extra.attribution,
      licenseTrace: { from: match.sourceRepo, sourcePath: match.sourcePath } } }
  })
  return { records: updated, traced }
}
