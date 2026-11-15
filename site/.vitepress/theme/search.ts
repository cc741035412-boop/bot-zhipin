export interface SearchableBot {
  slug: string
  name: string
  tagline?: string
  category?: string
  author?: { name?: string }
}

/** AND 子串搜索；完整查询的名字命中优先，其次是分类/作者词命中。 */
export function searchBots<T extends SearchableBot>(bots: readonly T[], query: string, limit = 8): T[] {
  const normalized = query.trim().toLowerCase()
  const count = Math.max(0, Math.floor(limit))
  if (!normalized) return bots.slice(0, count)
  const words = normalized.split(/\s+/u)

  return bots.map((bot, index) => {
    const name = bot.name.toLowerCase()
    const metadata = [bot.category, bot.author?.name].map((value) => (value ?? '').toLowerCase())
    const fields = [name, ...metadata, (bot.tagline ?? '').toLowerCase(), bot.slug.toLowerCase()]
    const matches = words.every((word) => fields.some((field) => field.includes(word)))
    const rank = name.startsWith(normalized) ? 0
      : name.includes(normalized) ? 1
      : words.some((word) => metadata.some((field) => field.includes(word))) ? 2 : 3
    return { bot, index, matches, rank }
  })
    .filter(({ matches }) => matches)
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .slice(0, count)
    .map(({ bot }) => bot)
}
