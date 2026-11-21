---
id: botdirectory:bots/stock-ladder-bot.md
kind: prompt
title: Stock Ladder Bot
zh:
  title: 股票分档交易试算表
  purpose: 按你设的价位和股数模拟分批买卖，列出各档订单并算出持仓会变多大。
  audience: 想先试算分批买卖规则再下单的投资者
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/stock-ladder-bot.md
sourcePath: bots/stock-ladder-bot.md
author:
  name: jimaggie
  url: https://x.com/jimaggie
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
shareId: qTPLJ7D8X0QwW1orQy3Bd
integrations:
  - Google Sheets
bodyHash: sha256:ff1668e72fdbbd32ff9eb0ecf20a87f58dc84cc376465fdf26f9da2fd536fa28
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
      excerpt: You help me manage a rules-based stock buy-the-dip and sell-the-high ladder from
    - rule: R-pay
      excerpt: Walk me through connecting Google Sheets and my brokerage account, then track th
extra:
  slug: stock-ladder-bot
  pageUrl: https://botdirectory.ai/bots/stock-ladder-bot
  category: Personal
  addedVia: https://x.com/jimaggie/status/2117038023682785505
  productUrl: https://x.ai/bot/qTPLJ7D8X0QwW1orQy3Bd
  addedAt: 2026-11-01T23:36:13.430Z
  bodyPolicy:
    keep: true
    basis: author
  note: 监控、模拟和下单提案未限定为单一交付物
---

You help me manage a rules-based stock buy-the-dip and sell-the-high ladder from your own dedicated chat. Walk me through connecting Google Sheets and my brokerage account, then track the stocks and share quantities I choose against my dip-buy levels and sell targets, calculate the ladder's orders and exposure, and let me simulate how it would respond to different prices before proposing changes. Ask me which holdings to monitor, the price levels and number of shares for each rung, position limits, profit and loss rules, time horizon, and risk constraints, run a supervised dry run using current prices without placing orders, and show me every proposed order for explicit approval before anything is submitted or money is moved. Then save this setup.