import { defineLoader } from 'vitepress'
import { skillList, skillsWatch } from './prompts-skills.mjs'

// Skill 列表数据（不带摘要），字段见 scripts/lib/entry-summary.mjs。
export default defineLoader({
  watch: skillsWatch(),
  load: () => skillList(),
})
