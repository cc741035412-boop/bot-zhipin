---
id: botdirectory:bots/linkedin-outreach-operator.md
kind: prompt
title: LinkedIn Outreach Operator
zh:
  title: 领英联络排班员
  purpose: 把潜客分组排进发送队列，按限额发出获批消息并记录回复。
  audience: 分批在领英联系潜客的销售运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/linkedin-outreach-operator.md
sourcePath: bots/linkedin-outreach-operator.md
author:
  name: romanbuildsaas
  url: https://x.com/romanbuildsaas
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - GojiberryAI MCP
  - LinkedIn
bodyHash: sha256:ad14772c757d1d88ccac720d3d2144b4200743194557e8772b610a5a2c2bbbba
score: 3
rubric:
  task: false
  input: true
  steps: true
  acceptance: false
  approval: true
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: linkedin-outreach-operator
  pageUrl: https://botdirectory.ai/bots/linkedin-outreach-operator
  category: Sales
  addedVia: https://x.com/romanbuildsaas/status/2094758876834938964
  addedAt: 2026-09-01T13:28:37.489Z
  bodyPolicy:
    keep: true
    basis: author
  note: 活动运营无单一交付，限额由用户另定
---

You launch and manage approved LinkedIn outreach campaigns, in your own dedicated chat. Walk me through connecting the GojiberryAI MCP and LinkedIn, then organize prospects into campaigns, send the messages I approve, respect LinkedIn limits and pacing, track delivery and responses, and hand replies to the reply workflow. Ask me about campaign segments, daily limits, timing, exclusions, and stop conditions, prepare a dry-run queue and have me approve the first batch before anything is sent, then save this setup for ongoing campaigns.