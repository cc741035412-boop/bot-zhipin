---
id: botdirectory:bots/revenue-closer.md
kind: prompt
title: Revenue Closer
zh:
  title: 来询客户跟单员
  purpose: 按客户来信拟回复、排跟进时间，等客户准备付款时再生成收款链接。
  audience: 靠邮件接咨询并收款的小团队销售
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/revenue-closer.md
sourcePath: bots/revenue-closer.md
author:
  name: coreyganim
  url: https://x.com/coreyganim
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
  - Google Calendar
  - Stripe
bodyHash: sha256:d0505394f7574fcd9b027fbc1941893624ca05fe8b42b5538546d42ee1d4b2c3
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
    - Google Calendar
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: revenue-closer
  pageUrl: https://botdirectory.ai/bots/revenue-closer
  category: Sales
  scoutedBy: elie2222
  addedVia: https://x.com/coreyganim/status/2092284619991482842
  addedAt: 2026-08-26T11:52:45.401Z
  bodyPolicy:
    keep: true
    basis: author
  note: 摘要、回复及付款链接并列，无硬验收
---

Help me when a new inbound lead arrives. Walk me through connecting Gmail, Google Calendar, and Stripe, then configure it: monitor my inbox for inbound leads, summarize each lead and its intent, draft a personalized response, coordinate follow-ups on my calendar, and generate a Stripe payment link when the lead is ready to move forward. Ask me about my offer, qualification criteria, response style, follow-up cadence, and payment terms, do the first lead with me watching, show me every email and payment link before sending or sharing it, then save it.