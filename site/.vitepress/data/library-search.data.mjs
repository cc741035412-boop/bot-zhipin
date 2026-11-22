import { defineLoader } from 'vitepress'
import { promptList, promptsWatch, skillList, skillsWatch } from './prompts-skills.mjs'

// 搜索面板用的 Prompt、Skill 数据：只带面板要显示和要搜的字段，不带正文。
// 面板第一次打开时才 import() 这份数据，它单独成块，不进每个页面的首屏 JS。
const pick = ({ slug, title, titleOriginal, name, purpose, category, author, scenarios, tags, agents, detailUrl }) => ({
  slug, title, ...(titleOriginal ? { titleOriginal } : {}), ...(name ? { name } : {}),
  purpose, category, author: { name: author.name }, scenarios, tags, ...(agents?.length ? { agents } : {}), detailUrl,
})

export default defineLoader({
  watch: [...promptsWatch(), ...skillsWatch()],
  load: () => ({ prompts: promptList().map(pick), skills: skillList().map(pick) }),
})
