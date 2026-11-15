import { botSummaries, explanations, readBots } from '../.vitepress/data/bots.mjs'
import { renderDesigns } from '../.vitepress/data/design-renderer.mjs'

export default {
  async paths() {
    const raw = readBots()
    const designs = await renderDesigns(raw.filter((bot) => !bot.data.external).map(({ slug, design }) => ({ slug, design })))
    const copy = explanations()
    return botSummaries(raw).map((bot) => ({
      params: { slug: bot.slug, bot, copy, designHtml: designs[bot.slug] || '' },
    }))
  },
}
