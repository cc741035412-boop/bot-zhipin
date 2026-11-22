import { promptData } from '../.vitepress/data/prompts-skills.mjs'

import { libraryPath } from '../.vitepress/data/library-route.mjs'
export default {
  paths() {
    return promptData().map(libraryPath)
  },
}
