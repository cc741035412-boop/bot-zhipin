---
id: botdirectory:bots/deck-localizer.md
kind: prompt
title: Deck Localizer
zh:
  title: 销售演示文稿多语翻译器
  purpose: 把Google幻灯片译成目标销售区语言且保持原排版不动并保留产品专有名词
  audience: 跨国见客户前要把产品演示PPT换成当地语言的海外销售
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/deck-localizer.md
sourcePath: bots/deck-localizer.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Google Slides
bodyHash: sha256:f4bea05b58538a76397822b8db2e8bac6a216070c89e62d2c791539eea3d94b2
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
  slug: deck-localizer
  pageUrl: https://botdirectory.ai/bots/deck-localizer
  category: Sales
  addedVia: https://x.com/ericzakariasson/status/2087258914060664902
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 不足三步有序流程；无具体动作审批或禁令
---

Trigger this before a call. Walk me through connecting Google Slides, then configure it: keep the layout intact, translate the copy naturally rather than literally, and leave product names alone. Ask me which languages we sell in, produce one sample for a native speaker to read, then save it.