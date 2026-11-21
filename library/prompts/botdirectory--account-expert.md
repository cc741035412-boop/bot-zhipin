---
id: botdirectory:bots/account-expert.md
kind: prompt
title: Account Expert
zh:
  title: 大客户专职情报员
  purpose: 盯紧单个重点客户的邮件会议与工单，标记功能需求并随时回答该客户近况
  audience: 手里管着几个核心大客户需要随时掌握进展的销售和客户成功
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/account-expert.md
sourcePath: bots/account-expert.md
author:
  name: kristaletz
  url: https://x.com/kristaletz
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Slack
  - Gmail
  - Gong
  - Granola
bodyHash: sha256:b88957c858b5cb353d6e5baaeac81f95a5f9753b5dd5bc16ba212b32c02a0518
score: 3
rubric:
  task: false
  input: true
  steps: true
  acceptance: false
  approval: true
cnFit:
  value: 一般
  blocked:
    - Gmail
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: account-expert
  pageUrl: https://botdirectory.ai/bots/account-expert
  category: Success
  addedVia: https://x.com/kristaletz/status/2089103618121314689
  addedAt: 2026-08-17T19:08:55.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 没定单一成品；无硬性核验线
---

Stay dedicated to one strategic account, in your own chat. Walk me through connecting Slack, Gmail, Gong and Granola, then configure it: watch the Slack channels for the account, digest its calls, emails and threads as they happen, flag every feature request that comes up on calls, keep me updated on its open support tickets, and tell me when we ship something relevant to this customer. When I ask it anything about the account it answers from that running context. Ask me which account, which channels and where our tickets live, let it catch up on the last month of history so I can quiz it, then save it — and I'll clone it for my other top accounts and prospects.