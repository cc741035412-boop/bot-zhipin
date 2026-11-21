---
id: botdirectory:bots/google-ads-optimizer.md
kind: prompt
title: Google Ads Optimizer
zh:
  title: 搜索词投放优化员
  purpose: 给搜索词的购买意向打分，结合有效演示成本给出否定关键词建议。
  audience: 靠搜索广告获取产品演示预约的投放经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/google-ads-optimizer.md
sourcePath: bots/google-ads-optimizer.md
author:
  name: codyschneider
  url: https://x.com/codyschneider
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Cursor
  - Google Ads
bodyHash: sha256:be53973ff021e5db20aac9cb8cbe7b517e1a96ea8251829dfaf02d23ed01f642
score: 4
rubric:
  task: false
  input: true
  steps: true
  acceptance: true
  approval: true
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: true
  rules:
    - R-pay
  hits:
    - rule: R-pay
      excerpt: Walk me through connecting Cursor and Google Ads, then configure a scheduled dai
extra:
  slug: google-ads-optimizer
  pageUrl: https://botdirectory.ai/bots/google-ads-optimizer
  category: Marketing
  scoutedBy: elie2222
  addedVia: https://x.com/codyschneider/status/2089729039158088042
  addedAt: 2026-08-19T13:25:48.487Z
  bodyPolicy:
    keep: true
    basis: author
  note: 搜索意图有固定量表，但未定单一交付
---

Continuously improve my Google Ads account, in your own dedicated chat. Walk me through connecting Cursor and Google Ads, then configure a scheduled daily manager that reads unified campaign and conversion data, evaluates search-term intent on a 1–10 scale for whether each query indicates someone wants to buy my product, adds appropriate negative keywords, and recommends or applies other account optimizations while tracking cost per qualified demo and downstream lead quality rather than conversion volume alone. Ask me how I define a qualified demo, which outcomes or closed-revenue signals should count, my budget limits, targeting constraints, and which changes require review. Show me the proposed changes and expected impact before anything that changes targeting, bids, ads, or spend, run the first optimization as a supervised dry run, then save it for daily execution.