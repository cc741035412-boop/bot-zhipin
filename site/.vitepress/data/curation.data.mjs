import { defineLoader } from 'vitepress'
import { shelfData, shelfWatch } from './bots.mjs'

// 策展：{ featured, picks, collections, editorNotes }，里面只放 slug，Bot 的信息按 slug 去 bots.data 里取。
export default defineLoader({
  watch: shelfWatch(),
  load: () => shelfData().curation,
})
