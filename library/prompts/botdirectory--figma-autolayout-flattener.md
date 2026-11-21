---
id: botdirectory:bots/figma-autolayout-flattener.md
kind: prompt
title: Figma Autolayout Flattener
zh:
  title: 自动布局层级整理器
  purpose: 去掉Figma自动布局里的占位块，把画框层级整理成前端好写CSS的结构
  audience: 常要把Figma设计稿交付给前端开发的UI设计师
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/figma-autolayout-flattener.md
sourcePath: bots/figma-autolayout-flattener.md
author:
  name: johnbai
  url: https://x.com/johnbai
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Figma
bodyHash: sha256:b9facf1616ba3d0558c8e541b784b3cec2ccd9de5ae7aaa900ce25043fddaee0
score: 3
rubric:
  task: true
  input: true
  steps: false
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
  slug: figma-autolayout-flattener
  pageUrl: https://botdirectory.ai/bots/figma-autolayout-flattener
  category: Productivity
  scoutedBy: elie2222
  addedVia: https://x.com/johnbai/status/2094456490115408172
  addedAt: 2026-09-01T00:16:58.784Z
  bodyPolicy:
    keep: true
    basis: author
  note: 列的是布局规则，未写操作顺序或修改审批
---

Set up a new bot for me I can trigger when building or cleaning any Figma autolayout. Walk me through connecting Figma, then configure it: flatten the layout to CSS-friendly structure by using one relationship per frame, FILL, HUG, and SPACE_BETWEEN instead of spacer elements, putting padding on the surface, and keeping captions as siblings. Ask me which pages, frames, and component conventions to use and whether there are exceptions, run the first transformation with me watching, then save it as a reusable skill.