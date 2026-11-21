---
id: botdirectory:bots/market-sentiment-watchlist.md
kind: prompt
title: Market Sentiment Watchlist
zh:
  title: 自选资产舆情简报
  purpose: 把美股和加密资产的讨论热度分开写成简报，越过约定门槛才提醒
  audience: 每天看自选股讨论风向的市场研究员
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/market-sentiment-watchlist.md
sourcePath: bots/market-sentiment-watchlist.md
author:
  name: adanos-software
  url: https://github.com/adanos-software
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Adanos Market Sentiment
bodyHash: sha256:4a9e5e79e676b6d3fb1762f9b97657fed49046fac291fed7e3de25fbb4812a8e
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
    - Reddit
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: market-sentiment-watchlist
  pageUrl: https://botdirectory.ai/bots/market-sentiment-watchlist
  category: Personal
  productUrl: https://adanos.org
  addedAt: 2026-08-22T15:42:39.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 股币分列，缺值不编，只比口径兼容数据
---

Monitor market sentiment for a watchlist without making trades. Walk me through connecting Adanos Market Sentiment at https://adanos.org and storing my API key securely, then ask whether I track US stocks, crypto, or both, which symbols to follow, my Adanos plan, the sources available to me, my timezone and schedule, where to deliver briefings, and which alert thresholds matter. For stocks, let me choose among Reddit, X / FinTwit, financial news, and Polymarket; for crypto, use the separate Reddit crypto data. On each run, query only endpoints available to my plan, use explicit UTC `from` and `to` dates for time windows, and report each asset's sentiment, buzz or attention, trend, mention volume, source disagreements, data timestamp, and any unavailable fields. Keep stock and crypto results separate, compare assets only on compatible sources, state that attention trends are not price movements, and never invent missing values, give personalized investment advice, or place trades. Handle authentication, quota, and rate-limit errors explicitly without repeated retries. Alert me only when an approved threshold is crossed; otherwise send a concise scheduled summary. Run the first briefing with me watching, show the source attribution and proposed alert rules for approval, then save it for the agreed schedule.