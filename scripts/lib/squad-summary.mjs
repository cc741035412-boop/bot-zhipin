// 小队摘要：纯函数，不读盘。成员信息从 Bot 摘要里并进来，页面不用再去货架上找一遍。

const text = (value) => typeof value === 'string' && value ? value : null
const texts = (value) => Array.isArray(value) ? value.filter((item) => typeof item === 'string' && item) : []
const rows = (value) => Array.isArray(value) ? value.filter((item) => item !== null && typeof item === 'object' && !Array.isArray(item)) : []

/** flow 里代表用户本人的写法。 */
const YOU = 'you'
// 成员从 Bot 摘要里带过来的字段。
const MEMBER_FIELDS = ['name', 'nameZh', 'tagline', 'category', 'detailUrl', 'templateUrl', 'quotaCost', 'permissions', 'prerequisites', 'avatar', 'needsAccount', 'selfRunning']

/**
 * squad：读出来的小队模型（用到 slug 和 data）。
 * bots：slug → Bot 摘要（summarizeBot 的结果）的 Map。
 * enums：loadEnums() 的结果，用它的顺序给权限排序、比较额度高低。
 * 不在货架上的成员会被丢掉，引用它的 flow 也一起丢掉；丢了谁由调用方对比 data.members 得知。
 */
export function summarizeSquad(squad, { bots, enums }) {
  const data = squad.data || {}
  const author = data.author || {}
  const members = rows(data.members).flatMap((member) => {
    const bot = bots.get(member.bot)
    if (!bot) return []
    return [{
      bot: member.bot, title: text(member.title), does: text(member.does),
      lead: member.lead === true, optional: member.optional === true,
      ...Object.fromEntries(MEMBER_FIELDS.map((field) => [field, bot[field]])),
    }]
  })
  const inSquad = new Set([YOU, ...members.map((member) => member.bot)])
  const costs = members.map((member) => enums.quotaCosts.indexOf(member.quotaCost)).filter((index) => index >= 0)
  const uses = (member, permission) => Array.isArray(member.permissions) && member.permissions.includes(permission)
  return {
    slug: squad.slug,
    name: data.name,
    tagline: data.tagline,
    formation: data.formation,
    origin: data.origin,
    author: {
      name: author.name,
      github: author.github || null,
      url: author.url || null,
      link: author.github ? `https://github.com/${author.github}` : author.url || null,
    },
    addedAt: data.addedAt,
    members,
    leader: members.find((member) => member.lead)?.bot ?? null,
    flow: rows(data.flow).filter((step) => inSquad.has(step.from) && inSquad.has(step.to))
      .map((step) => ({ from: step.from, to: step.to, what: text(step.what) })),
    setup: rows(data.setup).map((step) => ({ title: text(step.title), detail: text(step.detail) })),
    kickoff: text(data.kickoff),
    tryout: text(data.tryout),
    notes: texts(data.notes),
    missing: rows(data.missing).map((item) => ({ name: text(item.name), does: text(item.does) })),
    quota: {
      max: costs.length ? enums.quotaCosts[Math.max(...costs)] : null,
      perMember: members.map((member) => ({ bot: member.bot, quotaCost: member.quotaCost })),
    },
    permissions: enums.permissions.filter((permission) => members.some((member) => uses(member, permission)))
      .map((permission) => ({ permission, bots: members.filter((member) => uses(member, permission)).map((member) => member.bot) })),
    prerequisites: members.map((member) => ({ bot: member.bot, items: texts(member.prerequisites).filter((item) => item !== '无') }))
      .filter((entry) => entry.items.length),
    detailUrl: `/squads/${squad.slug}`,
  }
}
