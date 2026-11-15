// 详情页除了 Bot 自己的完整摘要以外还要的两样数据：同组的 Bot、所在小队的成员小头像。
// 都是纯函数，在构建时由 site/bots/[slug].paths.mjs 算好放进路由参数，页面上不用再加载整份货架。

import { displayName } from '../../../scripts/lib/bot-name.mjs'

/** 详情页「同组的 Bot」最多放几个。 */
export const RELATED_LIMIT = 3

const byName = new Intl.Collator('zh-CN')
/**
 * 推荐顺序（构建时没有热度）：编辑置顶的在前，按置顶序号（摘要的 pick）；
 * 其余按上架日期新的在前，再按名字（界面上显示的那个：有中文叫法按中文叫法）。和首页「推荐」排序去掉热度以后一致。
 */
export const byRecommended = (a, b) =>
  (a.pick ?? Infinity) - (b.pick ?? Infinity) || String(b.addedAt).localeCompare(String(a.addedAt)) || byName.compare(displayName(a), displayName(b))

// 小头像只需要这几样：slug 定颜色和形状，avatar 是自定义头像（没有就是 null）；名字只给自定义头像的替代文字用。
const face = (bot) => ({ slug: bot.slug, name: bot.name, nameZh: bot.nameZh ?? null, avatar: bot.avatar ?? null })

/** 同一个分组里另外几个 Bot（不含自己），按推荐顺序，最多 limit 个。bots 是货架上全部 Bot 的摘要。 */
export function relatedBots(bots, bot, limit = RELATED_LIMIT) {
  return bots.filter((other) => other.category === bot.category && other.slug !== bot.slug).sort(byRecommended).slice(0, limit)
    .map((other) => ({ ...face(other), tagline: other.tagline, detailUrl: other.detailUrl }))
}

/** 这个 Bot 所在的每支小队的成员小头像：{ 小队 slug: [{ slug, name, nameZh, avatar }] }，队长排最前，其余按编制表的顺序。 */
export function squadLineups(squads, bot) {
  const mine = new Set((bot.squads || []).map((squad) => squad.slug))
  return Object.fromEntries(squads.filter((squad) => mine.has(squad.slug)).map((squad) => [
    squad.slug,
    [...squad.members].sort((a, b) => Number(b.lead === true) - Number(a.lead === true)).map((member) => face({ ...member, slug: member.bot })),
  ]))
}
