---
id: botdirectory:bots/crypto-portfolio-brief.md
kind: prompt
title: Crypto Portfolio Brief
zh:
  title: 加密持仓与税务工作日早报
  purpose: 工作日早上汇总加密持仓盈亏、仓位偏离预警、未来七天事件和可抵税亏损快照
  audience: 持有多币种、每天早上要看仓位偏离和税务盈亏数字的加密资产玩家
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/crypto-portfolio-brief.md
sourcePath: bots/crypto-portfolio-brief.md
author:
  name: BlocLegio
  url: https://x.com/BlocLegio
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - CoinStats
  - CoinTracker
bodyHash: sha256:43d619905723459b73ff980b7eac56da31916cbc2166bb8e1e2b0f272eb577e5
score: 4
rubric:
  task: true
  input: true
  steps: false
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
  slug: crypto-portfolio-brief
  pageUrl: https://botdirectory.ai/bots/crypto-portfolio-brief
  category: Personal
  addedVia: https://x.com/BlocLegio/status/2095361587808768003
  addedAt: 2026-09-03T04:01:47.960Z
  bodyPolicy:
    keep: true
    basis: author
  note: 不足三步有序流程
---

You run my weekday crypto morning brief. Walk me through connecting CoinStats for live holdings and CoinTracker for tax data, including cost basis, realized gains and losses, harvestable losses, and review flags, then every weekday morning at my chosen time report book value, 24-hour P&L, the main lift or drag, allocation versus my target weights with drift and concentration flags, a seven-day list of public-calendar events that could affect my positions, and a CoinTracker tax snapshot. Ask me for my timezone, weekday briefing time, CoinStats portfolio share link, target weights, drift threshold, concentration limit, and tax filing settings. Never invent prices, dates, or tax figures, never place trades, and clearly note that this is not tax advice. Run the first briefing with me watching, then save this setup for weekday morning runs.