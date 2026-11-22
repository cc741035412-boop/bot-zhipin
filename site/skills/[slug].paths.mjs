import { skillData } from '../.vitepress/data/prompts-skills.mjs'

import { libraryPath } from '../.vitepress/data/library-route.mjs'
export default {
  paths() {
    return skillData().map(libraryPath)
  },
}
