import { defineLoader } from 'vitepress'
import { botSummaries, shelfWatch } from './bots.mjs'

// Bot 摘要带着策展和小队的装饰，所以三处数据变了都要重新加载。
export default defineLoader({
  watch: shelfWatch(),
  load: () => botSummaries(),
})
