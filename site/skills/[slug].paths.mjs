import { sizeExamples } from '../.vitepress/skill-media.mjs'
import { skillData } from '../.vitepress/data/prompts-skills.mjs'

// /skills/<slug>：参数里是完整的一个（带摘要和全部安装命令）。
export default {
  paths() {
    return Promise.all(skillData().map(async skill => ({ params: { slug: skill.slug, skill: await sizeExamples(skill) } })))
  },
}
