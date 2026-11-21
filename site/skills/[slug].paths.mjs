import { skillData } from '../.vitepress/data/prompts-skills.mjs'

// /skills/<slug>：参数里是完整的一个（带摘要和全部安装命令）。
export default {
  paths() {
    return skillData().map((skill) => ({ params: { slug: skill.slug, skill } }))
  },
}
