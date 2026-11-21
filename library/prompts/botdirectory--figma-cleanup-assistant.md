---
id: botdirectory:bots/figma-cleanup-assistant.md
kind: prompt
title: Figma Cleanup Assistant
zh:
  title: 设计稿图层规范巡检员
  purpose: 按团队命名和间距规范批量整理Figma图层与组件变体，并附带改动说明
  audience: 要维护组件库整洁或交接前清稿的UI设计师
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/figma-cleanup-assistant.md
sourcePath: bots/figma-cleanup-assistant.md
author:
  name: johnbai
  url: https://x.com/johnbai
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Figma
bodyHash: sha256:15e3810414f09515b2b0d333890ce5bf6f1ade0bc146971b0d6a65252f1b015e
score: 2
rubric:
  task: false
  input: true
  steps: true
  acceptance: false
  approval: false
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: figma-cleanup-assistant
  pageUrl: https://botdirectory.ai/bots/figma-cleanup-assistant
  category: Productivity
  scoutedBy: elie2222
  addedVia: https://x.com/johnbai/status/2094456490115408172
  addedAt: 2026-09-01T00:16:58.784Z
  bodyPolicy:
    keep: true
    basis: author
  note: 罗列清理事项，未定义统一成品、硬标准或动作审批
---

Set up a new bot for me I can trigger for repetitive Figma cleanup tasks, in its own dedicated chat. Walk me through connecting Figma, then configure it: rename layers consistently, clean up component variants, and check spacing across the selected frames, explaining any changes it recommends or makes. Ask me for my layer-naming convention, variant rules, spacing scale, and which frames or pages are in scope, do the first cleanup with me watching, then save it.