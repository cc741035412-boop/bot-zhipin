export const sourceKey = r => r.id.slice(0, r.id.indexOf(':'))
export const cmp = (a, b) => a < b ? -1 : a > b ? 1 : 0
export const byId = (a, b) => cmp(a.id, b.id)
export const union = values => [...new Set(values.filter(Boolean))].sort(cmp)
export function groupBy(records, key) {
  const groups = new Map()
  for (const r of records) {
    const k = key(r)
    if (!groups.has(k)) groups.set(k, [])
    groups.get(k).push(r)
  }
  return groups
}
export function ordered(keys, get = sourceKey) {
  const ranks = new Map(keys.map((k, i) => [k, i]))
  return (a, b) => (ranks.get(get(a)) ?? keys.length) - (ranks.get(get(b)) ?? keys.length)
}
