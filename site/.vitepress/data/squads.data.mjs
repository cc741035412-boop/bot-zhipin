import { defineLoader } from 'vitepress'
import { shelfData, shelfWatch } from './bots.mjs'

// 小队摘要数组，字段见 scripts/lib/squad-summary.mjs。
export default defineLoader({
  watch: shelfWatch(),
  load: () => shelfData().squads,
})
