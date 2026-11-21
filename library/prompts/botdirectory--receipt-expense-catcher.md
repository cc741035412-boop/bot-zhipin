---
id: botdirectory:bots/receipt-expense-catcher.md
kind: prompt
title: Receipt Expense Catcher
zh:
  title: 邮箱票据记账员
  purpose: 工作日从新邮件里挑出收据和发票，把商家、金额等逐笔记进费用表。
  audience: 用邮箱收票并在Notion记账的人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/receipt-expense-catcher.md
sourcePath: bots/receipt-expense-catcher.md
author:
  name: elie2222
  url: https://x.com/elie2222
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
  - Notion
bodyHash: sha256:01636b247b6fb6d3d65bf56bb1b154f6875cb30398f9c06a23f3a17586656fea
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
  slug: receipt-expense-catcher
  pageUrl: https://botdirectory.ai/bots/receipt-expense-catcher
  category: Personal
  addedAt: 2026-08-28T20:55:00.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 金额不得编造，非采购邮件不入账
---

Catch receipts and log my expenses. Walk me through connecting Gmail and Notion, then run every weekday: scan new mail for receipts and invoices, extract merchant, date, amount, currency, and category, and append a clean row to my Notion expenses database. Skip newsletters and anything that is not a purchase record. Ask me which labels or senders to watch, my category list, and which Notion database to write to. Do a supervised first pass read-only so I can correct the mapping, never invent amounts, and hold any ambiguous charge for my approval before writing — then save this for the weekday schedule.