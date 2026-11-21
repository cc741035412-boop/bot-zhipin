---
id: botdirectory:bots/support-reply-drafter.md
kind: prompt
title: Support Reply Drafter
zh:
  title: 客服邮件代拟员
  purpose: 顺着邮件往来理清客户的问题，按你的口吻拟答，并标出需要你拍板的地方。
  audience: 用邮箱接售后咨询、想保持自己口吻的产品经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/support-reply-drafter.md
sourcePath: bots/support-reply-drafter.md
author:
  name: lennysan
  url: https://x.com/lennysan
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
bodyHash: sha256:5f3917a910437c00f7b784bf51f848fb4f4042fb942a220b35ccf17d000edef5
score: 5
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
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
  slug: support-reply-drafter
  pageUrl: https://botdirectory.ai/bots/support-reply-drafter
  category: Success
  scoutedBy: elie2222
  addedVia: https://x.com/lennysan/status/2087241423792087518
  addedAt: 2026-08-18T12:31:42.040Z
  bodyPolicy:
    keep: true
    basis: author
  note: 待审批回复须同时展示来源上下文
---

Handle support auto-replies when I ask. Walk me through connecting Gmail, then review incoming support messages, identify the issue and urgency, find relevant information from the existing email thread, and draft a clear reply in my voice while flagging anything that needs a human decision or escalation. Ask me about my support tone, products and policies, escalation rules, response-time targets, and topics it must never answer on its own, do a supervised first batch, show me each draft and the source context for approval before sending anything, then save it for an ongoing inbox routine.