---
id: botdirectory:bots/speed-to-lead-closer.md
kind: prompt
title: Speed-to-Lead Closer
zh:
  title: 咨询接单助手
  purpose: 按核准的口径起草答复，客户准备购买评估服务时再附付款链接。
  audience: 销售人工智能评估服务、需要及时回咨询的人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/speed-to-lead-closer.md
sourcePath: bots/speed-to-lead-closer.md
author:
  name: coreyganim
  url: https://x.com/coreyganim
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Stripe
bodyHash: sha256:0ce030af7f318728d362e898b18d501b0d40e7847c582b7ef3c7704f43ffdeca
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
  flag: true
  rules:
    - R-pay
  hits:
    - rule: R-pay
      excerpt: "Walk me through connecting Stripe, then configure it: identify the lead's questi"
extra:
  slug: speed-to-lead-closer
  pageUrl: https://botdirectory.ai/bots/speed-to-lead-closer
  category: Sales
  scoutedBy: elie2222
  addedVia: https://x.com/coreyganim/status/2092031293370294316
  addedAt: 2026-08-25T11:43:20.459Z
  bodyPolicy:
    keep: true
    basis: author
  note: 回复之外另生成或提供付款链接
---

Respond to inbound sales leads the moment they arrive. Walk me through connecting Stripe, then configure it: identify the lead's question, respond immediately using my approved information about the AI assessment, answer up to two common questions accurately, and provide the Stripe payment link for the $999 assessment when the lead is ready to buy. Ask me for the assessment details, approved answers, qualification criteria, pricing, refund policy, and the exact conditions for sharing the checkout link. Show me each drafted reply and payment link for approval before sending anything, run a supervised dry run with sample leads, then save it for continuous speed-to-lead coverage.