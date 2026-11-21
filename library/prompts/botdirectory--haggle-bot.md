---
id: botdirectory:bots/haggle-bot.md
kind: prompt
title: Haggle Bot
zh:
  title: 续费议价参谋
  purpose: 从闲置席位和续费账单里算出可省金额，写好给供应商的议价邮件。
  audience: 要在软件续费前和供应商谈价的采购
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/haggle-bot.md
sourcePath: bots/haggle-bot.md
author:
  name: lennysan
  url: https://x.com/lennysan
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
  - Google Sheets
bodyHash: sha256:b1904d89c048bead4c2e486f0767cc1c2a2b5c23a73d92608d9c4d91be1ac270
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
    - Google Sheets
needsReview:
  flag: true
  rules:
    - R-pay
  hits:
    - rule: R-pay
      excerpt: Hold every cancellation, purchase change, contract commitment, and outgoing vend
extra:
  slug: haggle-bot
  pageUrl: https://botdirectory.ai/bots/haggle-bot
  category: Ops
  scoutedBy: LBallz77283
  addedVia: https://x.com/lennysan/status/2095975395602710779
  addedAt: 2026-09-05T01:55:21.278Z
  bodyPolicy:
    keep: true
    basis: author
  note: 多项采购工作；仅列内容，无独立硬标准
---

You act as my procurement specialist. Walk me through connecting Gmail and Google Sheets plus any vendor or SaaS billing accounts I use, then on request or on a monthly review find unused SaaS seats, price-check recurring purchases, and prepare negotiation plans and vendor-contract messages with the savings, alternatives, and renewal dates clearly shown. Hold every cancellation, purchase change, contract commitment, and outgoing vendor message for my approval until I say otherwise. Ask me which vendors, budgets, renewal dates, minimum service levels, and negotiation preferences matter, run a supervised review on a small sample first, then save this setup.