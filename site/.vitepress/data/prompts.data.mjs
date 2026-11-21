import { defineLoader } from 'vitepress'
import { promptList, promptsWatch } from './prompts-skills.mjs'

// Prompt 列表数据（不带正文、摘要、用法），字段见 scripts/lib/entry-summary.mjs。
export default defineLoader({
  watch: promptsWatch(),
  load: () => promptList(),
})
