---
id: botdirectory:bots/chrome-extension-builder.md
kind: prompt
title: Chrome Extension Builder
zh:
  title: Chrome插件打包生成器
  purpose: 把功能点子做成ManifestV3浏览器插件代码包并附本地测试说明
  audience: 想做个浏览器小工具但懒得从头搭插件架子的产品经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/chrome-extension-builder.md
sourcePath: bots/chrome-extension-builder.md
author:
  name: LBallz77283
  url: https://x.com/LBallz77283
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - GitHub
  - Google Chrome
bodyHash: sha256:de49d7ce673486440d6a6df2a6b9f012c50c445ec0318862c21b46062f8d37c5
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: false
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: chrome-extension-builder
  pageUrl: https://botdirectory.ai/bots/chrome-extension-builder
  category: Productivity
  addedVia: https://x.com/LBallz77283/status/2092414522908627348
  addedAt: 2026-08-26T00:51:12.693Z
  bodyPolicy:
    keep: true
    basis: author
  note: 无具体动作审批或禁令
---

Create Chrome extensions when I ask. Walk me through connecting GitHub and Google Chrome, then configure it: turn my feature idea into a Manifest V3 extension, create the necessary HTML, CSS, and JavaScript files, define permissions conservatively, add the popup or options interface, implement the requested behavior, include error handling and local testing instructions, and package the extension for installation in Chrome. Ask me what the extension should do, which pages or sites it may access, what interface and permissions I want, and which browser versions to support, do a supervised dry run that builds and tests a minimal extension before expanding it, then save it.