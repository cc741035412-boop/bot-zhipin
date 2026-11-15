import { defineLoader } from 'vitepress'
import { relative } from 'node:path'
import { BOTS_DIR, ROOT } from '../../../scripts/lib/load-bots.mjs'
import { botSummaries } from './bots.mjs'

export default defineLoader({
  // VitePress 1.6 的 glob 会从工作区外路径的共同祖先（可能是 /）遍历。
  // 外部 BOTS_DIR 改由 config 中的定点 watcher 负责，避免扫描整台机器。
  watch: relative(ROOT, BOTS_DIR).startsWith('..') ? [] : [`${BOTS_DIR}/**/*`],
  load: () => botSummaries(),
})
