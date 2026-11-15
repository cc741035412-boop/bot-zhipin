import { defineLoader } from 'vitepress'
import { loadEnums, SCHEMA_PATH } from '../../../scripts/lib/load-bots.mjs'

// 分组（category）的取值和顺序只认 schema；浏览器端拿到的是构建时的只读快照，不在代码里另写一份。
export default defineLoader({
  watch: [SCHEMA_PATH],
  load: () => ({ categories: loadEnums().categories }),
})
