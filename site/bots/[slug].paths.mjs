import { explanations, readBots, shelfData } from '../.vitepress/data/bots.mjs'
import { relatedBots, squadLineups } from '../.vitepress/data/detail.mjs'
import { renderDesigns } from '../.vitepress/data/design-renderer.mjs'

export default {
  async paths() {
    const raw = readBots()
    const designs = await renderDesigns(raw.filter((bot) => !bot.data.external).map(({ slug, design }) => ({ slug, design })))
    const copy = explanations()
    const { bots, squads } = shelfData(raw)
    return bots.map((bot) => ({
      params: {
        slug: bot.slug, bot, copy, designHtml: designs[bot.slug] || '',
        // 详情页另外要的两样：同组的 Bot、所在小队的成员小头像（见 data/detail.mjs）。
        related: relatedBots(bots, bot),
        lineups: squadLineups(squads, bot),
      },
    }))
  },
}
