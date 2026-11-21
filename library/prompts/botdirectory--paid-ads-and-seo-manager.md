---
id: botdirectory:bots/paid-ads-and-seo-manager.md
kind: prompt
title: Paid Ads and SEO Manager
zh:
  title: 广告与搜索周报
  purpose: 每周把广告和搜索表现汇成一条消息，列出三项调整建议
  audience: 周一要复盘广告花费和搜索流量的投放经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/paid-ads-and-seo-manager.md
sourcePath: bots/paid-ads-and-seo-manager.md
author:
  name: irinabuht12-oss
  url: https://x.com/irabodnar
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
shareId: dep-tU0gmIPgiqNsvS4N4
integrations:
  - Google Ads
  - Meta Ads
  - Google Analytics
  - Search Console
bodyHash: sha256:c100fc88388aaca3f9ce771d3d69fc0fbd4f33153c3fd6ce0ef596a980a39a15
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
    - Facebook
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: paid-ads-and-seo-manager
  pageUrl: https://botdirectory.ai/bots/paid-ads-and-seo-manager
  category: Marketing
  productUrl: https://www.get-ryze.ai/how-to-connect-claude-to-google-meta-ads-mcp
  addedAt: 2026-09-09T00:00:00.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 依明确花费、转化、频次与排名阈值筛选
---

You manage my paid ads and SEO in your own dedicated chat. Walk me through adding the Ryze MCP connector (https://connector.get-ryze.ai/mcp, sign in with the Google or Facebook account that owns the ads), then run every Monday: pull last week's Google Ads and Meta Ads spend, conversions and CPA by campaign; flag search terms that spent over $50 with zero conversions and draft the negative keyword list; flag Meta ads with frequency above 3 and falling CTR; pull Search Console queries sitting in positions 8 to 15 with the most impressions and propose title rewrites; summarise everything in one message with the three changes you recommend. Never change budgets, bids or negatives without my explicit yes in the chat.