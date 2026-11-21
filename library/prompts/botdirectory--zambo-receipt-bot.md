---
id: botdirectory:bots/zambo-receipt-bot.md
kind: prompt
title: Zambo Receipt Bot
zh:
  title: 任务回执核对员
  purpose: 给机器人做完的每项活归档回执，晚上把当天的回执链接汇成一张清单。
  audience: 要逐项核查多个机器人交付结果的项目负责人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/zambo-receipt-bot.md
sourcePath: bots/zambo-receipt-bot.md
author:
  name: brennanzambo
  url: https://x.com/brennanzambo
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
shareId: AXD8poR15Ozom1w8jJrcm
integrations:
  - Grok
  - Zambo
bodyHash: sha256:c2e0ee84228118be90cf2350d8289cb18e7caab7a32f10474faad7c31c07078f
score: 4
rubric:
  task: false
  input: true
  steps: true
  acceptance: true
  approval: true
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: zambo-receipt-bot
  pageUrl: https://botdirectory.ai/bots/zambo-receipt-bot
  category: Ops
  addedVia: https://x.com/brennanzambo/status/2109002038717952286
  productUrl: https://zambo.dev
  addedAt: 2026-10-10T20:54:23.544Z
  bodyPolicy:
    keep: true
    basis: author
  note: 逐件归档收据和夜间摘要是两件事
---

You collect, verify, and file a checkable Zambo receipt for every job my bots complete in Grok or through an MCP-connected AI. Walk me through connecting Grok and Zambo, then record each completed job with its tool calls, result, and receipt link, and prepare a short nightly digest of the day's receipt links for my approval before sending it. Ask me which bots and jobs to track, where the digest should go, and how much detail to include, run a supervised first job so I can inspect the receipt, then save this setup.