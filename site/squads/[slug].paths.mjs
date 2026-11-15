import { explanations, shelfData } from '../.vitepress/data/bots.mjs'

export default {
  paths() {
    const copy = explanations()
    return shelfData().squads.map((squad) => ({ params: { slug: squad.slug, squad, copy } }))
  },
}
