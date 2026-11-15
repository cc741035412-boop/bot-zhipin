// Bot 怎么称呼：纯函数，不读盘，构建脚本和页面共用。
// bot.yaml 里 name 是原名（和 x.ai 模板页上的一致），nameZh 是可选的中文叫法。
// 全站的规矩只在这里定：有中文叫法的以它为主，原名跟在后面；没有的照旧只有原名。
// 传进来的可以是 bot.yaml 的数据、Bot 摘要，或者小队成员（它们都带 name 和 nameZh）。

const text = (value) => typeof value === 'string' && value.trim() ? value : null

/** 界面上叫它什么：有中文叫法用中文叫法，没有用原名。排序、读屏、网页标题也用这个。 */
export function displayName(bot) {
  return text(bot?.nameZh) ?? bot?.name
}

/** 跟在后面的原名：写了中文叫法、并且和原名不一样时才有，否则是 null。 */
export function originalName(bot) {
  const zh = text(bot?.nameZh), name = text(bot?.name)
  return zh && name && zh !== name ? name : null
}

/** 一行纯文字里的全称（网页标题用）：「中文叫法（原名）」；没有中文叫法就是原名。 */
export function fullName(bot) {
  const original = originalName(bot)
  return original ? `${displayName(bot)}（${original}）` : displayName(bot)
}

/** 中文叫法里至少要有一个汉字，不然它就不是中文叫法。校验用。 */
export const hasChinese = (value) => typeof value === 'string' && /\p{Script=Han}/u.test(value)
