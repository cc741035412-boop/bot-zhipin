export const authorKey = (github) => typeof github === 'string' && github.length ? github.toLowerCase() : null
export const authorPagePath = (github) => {
  const key = authorKey(github)
  return key ? `/authors/${key}` : null
}
export const authorAvatarPath = (github) => {
  const key = authorKey(github)
  return key ? `/api/avatar/${key}` : null
}

const cmp = (a, b) => a < b ? -1 : a > b ? 1 : 0

export function buildAuthors({ bots, squads }) {
  const rows = [...bots.map(item => ({ item, kind: 'bots' })), ...squads.map(item => ({ item, kind: 'squads' }))]
  rows.sort((a, b) => cmp(b.item.addedAt, a.item.addedAt) || cmp(a.kind, b.kind) || cmp(a.item.slug, b.item.slug))
  const authors = new Map()
  for (const { item, kind } of rows) {
    const { github: login, name } = item.author
    const key = authorKey(login)
    if (!key) continue
    if (!authors.has(key)) authors.set(key, { key, login, name, page: authorPagePath(key), avatar: authorAvatarPath(key), github: `https://github.com/${login}`, bots: [], squads: [] })
    authors.get(key)[kind].push(item)
  }
  return [...authors.values()].sort((a, b) => cmp(a.key, b.key))
}
