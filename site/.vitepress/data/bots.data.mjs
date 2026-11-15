import { defineLoader } from 'vitepress'
import { listSummaries, shelfWatch } from './bots.mjs'

// 列表数据：Bot 摘要带着策展和小队的装饰（三处数据变了都要重新加载），不带 about 全文。
export default defineLoader({
  watch: shelfWatch(),
  load: () => listSummaries(),
})
