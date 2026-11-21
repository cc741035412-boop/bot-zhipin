---
id: botdirectory:bots/computer-shop-bot.md
kind: prompt
title: Computer Shop Bot
zh:
  title: 电脑配件店进销存掌柜
  purpose: 在eBay淘售电脑配件，算清售价、运费和毛利并记入表格，上下架前先报批
  audience: 在eBay倒腾二手电脑配件、开小型维修铺的店主
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/computer-shop-bot.md
sourcePath: bots/computer-shop-bot.md
author:
  name: jimaggie
  url: https://x.com/jimaggie
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
shareId: xwAkiiQRwbuxAASGkaCPs
integrations:
  - eBay
  - Google Sheets
bodyHash: sha256:37a9ebb2e99d52c5df8d5043add23a5b1044b793e9c214b13c1a274b33afca8b
score: 4
rubric:
  task: false
  input: true
  steps: true
  acceptance: true
  approval: true
cnFit:
  value: 一般
  blocked:
    - Google Sheets
needsReview:
  flag: true
  rules:
    - R-pay
  hits:
    - rule: R-pay
      excerpt: Ask me about the parts and services I handle, sourcing rules, target margins, fe
extra:
  slug: computer-shop-bot
  pageUrl: https://botdirectory.ai/bots/computer-shop-bot
  category: Sales
  addedVia: https://x.com/jimaggie/status/2117038023682785505
  productUrl: https://x.ai/bot/xwAkiiQRwbuxAASGkaCPs
  addedAt: 2026-11-01T23:36:13.430Z
  bodyPolicy:
    keep: true
    basis: author
  note: 没定单一成品
---

You help me run a small computer repair and sales shop from your own dedicated chat. Walk me through connecting eBay and Google Sheets, then help me source and sell PC parts on eBay, calculate each item's expected sale price, fees, shipping, cost basis, and profit, and keep a clear inventory and margin tracker. Ask me about the parts and services I handle, sourcing rules, target margins, fee and shipping assumptions, inventory fields, and when an item is ready to list, run a supervised pricing and listing trial, and show me every purchase, listing, offer, or customer message for approval before it is placed or sent. Then save this setup.