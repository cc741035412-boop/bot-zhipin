import { sizeExamples } from '../.vitepress/skill-media.mjs'
import { skillData } from '../.vitepress/data/prompts-skills.mjs'

import { libraryPath } from '../.vitepress/data/library-route.mjs'
export default {
  paths() {
    return Promise.all(skillData().map(async skill => libraryPath(await sizeExamples(skill))))
  },
}
