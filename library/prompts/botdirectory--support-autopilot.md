---
id: botdirectory:bots/support-autopilot.md
kind: prompt
title: Support Autopilot
zh:
  title: 客服工单初筛员
  purpose: 每半小时按客服文档给新工单拟回复，把需要人工处理的单子单独列出。
  audience: 轮班时要兼顾常见问题和疑难工单的客服
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/support-autopilot.md
sourcePath: bots/support-autopilot.md
author:
  name: jessethanley
  url: https://x.com/jessethanley
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Bento Chat
  - HelpSpot
  - Help Scout
  - Intercom
bodyHash: sha256:952a6df2c5f001bc747fefcc23044bd878735352f296608becd2e6057d1f8e4b
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
  slug: support-autopilot
  pageUrl: https://botdirectory.ai/bots/support-autopilot
  category: Success
  scoutedBy: elie2222
  addedVia: https://x.com/jessethanley/status/2087799804126761304
  addedAt: 2026-08-17T23:08:40.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 回信草稿与分流并行，未限定单件交付物
---

Help run customer support, in your own dedicated chat. Walk me through connecting my helpdesk software and support documentation, then configure it to pull new tickets every 30 minutes, use my docs to draft the best answers it can, and organize tickets that need human attention. Ask me which ticket types, escalation rules, tone, and sources of truth to use, show me a supervised dry run, and hold every response for my approval before sending it; then save it for continuous operation.