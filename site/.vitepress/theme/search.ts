// 命令面板的搜索：纯函数，不碰 DOM，服务端和单测都能直接跑。

export interface SearchableBot {
  slug: string
  name: string
  /** 中文叫法（可选）。和原名一样算「名字」，两个都能搜到。 */
  nameZh?: string | null
  tagline?: string | null
  category?: string | null
  author?: { name?: string | null } | null
  /** 额外的可搜文字，分量和介绍一样（小队用它放成员的名字和队内岗位） */
  keywords?: readonly (string | null | undefined)[] | null
}

/** 统一成可比较的写法：全角转半角、不分大小写、连续空白并成一个空格。 */
function fold(value: unknown): string {
  return typeof value === 'string'
    ? value.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim()
    : ''
}

/**
 * 按查询筛选并排序 Bot，返回新数组，不修改传入的数据。
 *
 * 匹配：查询按空格拆成多个词，每个词都要是 name、nameZh、tagline、category、author.name、slug、keywords
 * 之一的子串（可以落在不同字段上）。
 *
 * 「名字」有两个：原名（name）和中文叫法（nameZh），分量一样，搜哪个都算命中名字。
 * 排序分四档，同档保持传入顺序：
 * 0 某个名字以整句查询开头；1 每个词都在名字里；2 有词命中分类或作者；3 只命中介绍、slug 或 keywords。
 * 多个词时，只有一部分词在名字里的也算第 2 档（名字不比分类、作者弱）。
 *
 * 空查询按传入顺序返回前 limit 个。
 */
export function searchBots<T extends SearchableBot>(bots: readonly T[], query: string, limit = 8): T[] {
  const max = Math.max(0, Math.floor(limit))
  const words = fold(query).split(' ').filter(Boolean)
  if (!words.length) return bots.slice(0, max)

  const phrase = words.join(' ')
  const hits: { bot: T; tier: number }[] = []
  for (const bot of bots) {
    const names = [fold(bot.nameZh), fold(bot.name)].filter(Boolean)
    const titles = [...names, fold(bot.category), fold(bot.author?.name)]
    const fields = [...titles, fold(bot.tagline), fold(bot.slug), ...(bot.keywords ?? []).map(fold)]
    if (!words.every((word) => fields.some((field) => field.includes(word)))) continue
    const tier = names.some((name) => name.startsWith(phrase)) ? 0
      : words.every((word) => names.some((name) => name.includes(word))) ? 1
      : words.some((word) => titles.some((field) => field.includes(word))) ? 2
      : 3
    hits.push({ bot, tier })
  }
  // Array.prototype.sort 是稳定排序，同档自然保持传入顺序。
  return hits.sort((a, b) => a.tier - b.tier).slice(0, max).map(({ bot }) => bot)
}

export interface SearchableSquad {
  slug: string
  name: string
  tagline?: string | null
  formation?: string | null
  author?: { name?: string | null } | null
  members?: readonly { name?: string | null; nameZh?: string | null; title?: string | null }[] | null
}

/**
 * 按查询筛选并排序小队，规则和 searchBots 一样：名字最重，其次是「小队」这两个字、队形和作者，
 * 最后是介绍、slug、成员的名字（原名和中文叫法都算）和队内岗位。空查询按传入顺序返回前 limit 支。
 */
export function searchSquads<T extends SearchableSquad>(squads: readonly T[], query: string, limit = 3): T[] {
  const rows = squads.map((squad) => ({
    slug: squad.slug, name: squad.name, tagline: squad.tagline, author: squad.author,
    category: `小队 ${squad.formation ?? ''}`,
    keywords: (squad.members ?? []).flatMap((member) => [member.name, member.nameZh, member.title]),
    squad,
  }))
  return searchBots(rows, query, limit).map((row) => row.squad)
}
