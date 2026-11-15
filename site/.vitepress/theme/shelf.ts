// 首页「全部 Bot」的排序、分组和地址栏状态：纯函数，不碰 DOM，服务端和单测都能直接跑。
import { displayName } from '../../../scripts/lib/bot-name.mjs'

export type ShelfSort = 'rec' | 'new' | 'hot'
export const SHELF_SORTS: readonly ShelfSort[] = ['rec', 'new', 'hot']
/** 「全部」这一项在分组切换和地址栏里的取值；不会和分组名撞（分组名都是中文）。 */
export const ALL_ROLES = 'all'
/**
 * 按分组分段显示时，每组先露两行，其余收在「展开 N 个」后面：
 * 两列时 4 张；单列（窄于 NARROW_QUERY）时 2 张。
 */
export const GROUP_PREVIEW = 4
export const GROUP_PREVIEW_NARROW = 2
export const NARROW_QUERY = '(max-width: 899px)'

export interface ShelfBot {
  slug: string
  name: string
  /** 中文叫法（可选）。有它的话，按名字排序时用它，和界面上显示的一致。 */
  nameZh?: string | null
  category: string
  addedAt: string
  pick?: number | null
}
export interface ShelfCollection { slug: string; title: string; bots: readonly string[] }
export interface ShelfGroup<T> { category: string; bots: T[] }
export type Heat = Readonly<Record<string, number>>

const byName = new Intl.Collator('zh-CN')
const heatOf = (heat: Heat, slug: string) => heat[slug] ?? 0

/**
 * 三种排序的比较函数。「按名字」指界面上显示的那个名字：有中文叫法按中文叫法，没有按原名。
 * 最新：上架日期新的在前，同一天按名字。
 * 最热：热度高的在前，热度一样按「最新」。
 * 推荐：编辑置顶的（pick 有值）按置顶顺序排在最前，其余按「最热」。
 */
export function shelfComparator<T extends ShelfBot>(sort: ShelfSort, heat: Heat = {}): (a: T, b: T) => number {
  const newest = (a: T, b: T) => String(b.addedAt).localeCompare(String(a.addedAt)) || byName.compare(displayName(a), displayName(b))
  const hottest = (a: T, b: T) => heatOf(heat, b.slug) - heatOf(heat, a.slug) || newest(a, b)
  if (sort === 'new') return newest
  if (sort === 'hot') return hottest
  const rank = (bot: T) => typeof bot.pick === 'number' ? bot.pick : Infinity
  return (a, b) => {
    const left = rank(a), right = rank(b)
    return left === right ? hottest(a, b) : left - right
  }
}

/** 返回排好序的新数组，不改传入的数据。 */
export function sortBots<T extends ShelfBot>(bots: readonly T[], sort: ShelfSort, heat: Heat = {}): T[] {
  return [...bots].sort(shelfComparator<T>(sort, heat))
}

/** 按分组分段：分组的顺序跟 categories（schema 枚举）走，组内保持传入顺序；没有 Bot 的分组不出现。 */
export function groupBots<T extends ShelfBot>(bots: readonly T[], categories: readonly string[]): ShelfGroup<T>[] {
  return categories
    .map((category) => ({ category, bots: bots.filter((bot) => bot.category === category) }))
    .filter((group) => group.bots.length)
}

/**
 * 一个专题里的 Bot。ordered 是已经按当前排序排好的整个货架。
 * 「推荐」就是编辑在专题里排的顺序；「最新」「最热」沿用 ordered 里的先后。
 * 专题里写了、货架上没有的 slug 直接跳过。
 */
export function collectionBots<T extends ShelfBot>(collection: ShelfCollection, ordered: readonly T[], sort: ShelfSort): T[] {
  if (sort !== 'rec') return ordered.filter((bot) => collection.bots.includes(bot.slug))
  const bySlug = new Map(ordered.map((bot) => [bot.slug, bot]))
  return collection.bots.flatMap((slug) => bySlug.get(slug) ?? [])
}

export interface ShelfFilter { role: string; collection: string | null }

/**
 * 从地址栏的查询串里读筛选：?c=<专题 slug> 或 ?role=<分组>。
 * 专题优先（选了专题，分组就回到「全部」）；不认识的值当没写。
 */
export function readShelfQuery(search: string, known: { categories: readonly string[]; collections: readonly string[] }): ShelfFilter {
  const params = new URLSearchParams(search)
  const collection = params.get('c')
  if (collection && known.collections.includes(collection)) return { role: ALL_ROLES, collection }
  const role = params.get('role')
  return { role: role && known.categories.includes(role) ? role : ALL_ROLES, collection: null }
}

/**
 * 把筛选写回查询串，其他参数原样保留。没有筛选时返回空串或剩下的参数。
 * 返回值带开头的问号（没有参数时是空串）。
 */
export function writeShelfQuery(search: string, filter: ShelfFilter): string {
  const params = new URLSearchParams(search)
  params.delete('c')
  params.delete('role')
  if (filter.collection) params.set('c', filter.collection)
  else if (filter.role !== ALL_ROLES) params.set('role', filter.role)
  const text = params.toString()
  return text ? `?${text}` : ''
}
