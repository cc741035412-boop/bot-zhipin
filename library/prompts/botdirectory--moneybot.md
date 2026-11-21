---
id: botdirectory:bots/moneybot.md
kind: prompt
title: MoneyBot
zh:
  title: 分款核对单
  purpose: 按收款人列出每笔拟付款和总额，等你逐笔确认再付。
  audience: 要按预算给多人发款的项目负责人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/moneybot.md
sourcePath: bots/moneybot.md
author:
  name: shubgaur
  url: https://x.com/shubgaur
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - PayPal
bodyHash: sha256:051dc3db21c688268370e3676b0960e12f1dbef8f28a0e473ad5766481446246
score: 5
rubric:
  task: true
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
  slug: moneybot
  pageUrl: https://botdirectory.ai/bots/moneybot
  category: Personal
  scoutedBy: elie2222
  addedVia: https://x.com/shubgaur/status/2092375056089563604
  addedAt: 2026-08-26T11:34:43.235Z
  bodyPolicy:
    keep: true
    basis: author
  note: 付款前完整列款项及汇总金额
---

Hand out money when I ask. Walk me through connecting PayPal, then configure it: collect the intended recipients, amounts, purpose, and any eligibility rules, prepare the proposed transfers, and show me the complete disbursement list with totals before sending anything. Ask me about the funding source, per-person and total budgets, recurring payments, and fraud or duplicate-payment checks, do a supervised first run with a small approved transfer, require my approval for every payment until I explicitly change that rule, then save it.