import { defineLoader } from 'vitepress'
import { loadEnums, SCHEMA_PATH } from '../../../scripts/lib/load-bots.mjs'
import { loadLibraryEnums, PROMPT_SCHEMA_PATH, SKILL_SCHEMA_PATH } from '../../../scripts/lib/load-prompts-skills.mjs'

// 分组（category）的取值和顺序只认 schema；浏览器端拿到的是构建时的只读快照，不在代码里另写一份。
// Prompt、Skill 的分类和 Skill 的 agents 同理，分别来自 prompt.schema.json、skill.schema.json。
export default defineLoader({
  watch: [SCHEMA_PATH, PROMPT_SCHEMA_PATH, SKILL_SCHEMA_PATH],
  load: () => {
    const { prompt, skill } = loadLibraryEnums()
    return {
      categories: loadEnums().categories,
      promptCategories: prompt.categories,
      skillCategories: skill.categories,
      skillAgents: skill.agents,
    }
  },
})
