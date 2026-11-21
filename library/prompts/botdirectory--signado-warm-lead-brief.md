---
id: botdirectory:bots/signado-warm-lead-brief.md
kind: prompt
title: Signado Warm Lead Brief
zh:
  title: 领英潜客早报
  purpose: 工作日早上列出聊到你产品的潜客，附上对方原话和一句开场白。
  audience: 在领英上找客户的企业销售
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/signado-warm-lead-brief.md
sourcePath: bots/signado-warm-lead-brief.md
author:
  name: 19Ash82
  url: https://github.com/19Ash82
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Signado
bodyHash: sha256:4554eb54fee4d1f9d0b100a1b56bb01bfe1fa905df196f1c5fd49ec13cb1aa08
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
  slug: signado-warm-lead-brief
  pageUrl: https://botdirectory.ai/bots/signado-warm-lead-brief
  category: Sales
  addedAt: 2026-10-02T09:16:00.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 晨报之外还交付获准线索的私信草稿
---

You send me a weekday brief of people on LinkedIn who are already talking about what I sell. Walk me through connecting Signado at https://mcp.signado.io/mcp (https://signado.io) and signing in to my workspace, then configure it: every weekday morning, pull the best leads from my latest Signado runs, show each person's name, company and the exact post or comment that surfaced them, and suggest one opening line that references what they said. Ask me which leads are worth contacting, tell me the credit cost, and draft a LinkedIn message for each lead I approve once I confirm. Then save it.