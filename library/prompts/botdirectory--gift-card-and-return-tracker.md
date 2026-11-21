---
id: botdirectory:bots/gift-card-and-return-tracker.md
kind: prompt
title: Gift Card and Return Tracker
zh:
  title: 礼品卡与退货查账单
  purpose: 从购物邮件中列出没用的礼品卡和已过退货期的订单，附上凭据来源。
  audience: 月底要翻邮件盘点购物记录的人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/gift-card-and-return-tracker.md
sourcePath: bots/gift-card-and-return-tracker.md
author:
  name: toddsaunders
  url: https://x.com/toddsaunders
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
bodyHash: sha256:05357bf052699d1c449ccea3a7a6fe1239ad1bd56569ccb85bf0c40c3cbe10ef
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: false
cnFit:
  value: 一般
  blocked:
    - Gmail
needsReview:
  flag: true
  rules:
    - R-pay
  hits:
    - rule: R-pay
      excerpt: Handle a purchase-benefits audit when I ask, in your own dedicated chat
    - rule: R-pay
      excerpt: Walk me through connecting Gmail, then scan purchase receipts, gift-card emails,
extra:
  slug: gift-card-and-return-tracker
  pageUrl: https://botdirectory.ai/bots/gift-card-and-return-tracker
  category: Personal
  scoutedBy: elie2222
  addedVia: https://x.com/toddsaunders/status/2089896096298627248
  addedAt: 2026-08-19T05:17:32.414Z
  bodyPolicy:
    keep: true
    basis: author
  note: 报告须有来源；无动作审批
---

Handle a purchase-benefits audit when I ask, in your own dedicated chat. Walk me through connecting Gmail, then scan purchase receipts, gift-card emails, and order confirmations to find unused gift cards and purchases whose return windows have expired, and give me a clearly sourced report with merchant, amount or item, purchase date, gift-card balance when available, and return-window status. Ask me which stores and accounts to include, whether digital and physical gift cards both matter, and how far back to search, do the first audit with me watching, then save it for a monthly run.