---
id: botdirectory:bots/crypto-dca-autopilot.md
kind: prompt
title: Crypto DCA Autopilot
zh:
  title: 比特币以太坊月度定投管家
  purpose: 每月固定日期按设定额度生成比特币和以太坊定投订单计划，确认后在同一平台买入
  audience: 想按月固定金额买比特币和以太坊但下单前要自己过目的投资者
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/crypto-dca-autopilot.md
sourcePath: bots/crypto-dca-autopilot.md
author:
  name: dee_bosa
  url: https://x.com/dee_bosa
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Bitcoin
  - Ether
bodyHash: sha256:a63268f16aa071b51df26d3d5195b51c10d929ed5a08a3966ee2a52ba8fed861
score: 2
rubric:
  task: false
  input: true
  steps: false
  acceptance: false
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
      excerpt: Walk me through connecting the single crypto platform where I want to keep every
    - rule: R-pay
      excerpt: Show me the complete order plan before every purchase and hold each order for my
extra:
  slug: crypto-dca-autopilot
  pageUrl: https://botdirectory.ai/bots/crypto-dca-autopilot
  category: Personal
  scoutedBy: Tuviae
  addedVia: https://x.com/dee_bosa/status/2090473195740524659
  addedAt: 2026-08-23T14:30:23.596Z
  bodyPolicy:
    keep: true
    basis: author
  note: 没定单一成品；不足三步有序流程；无硬性核验线
---

Handle a monthly dollar-cost-average investment when I ask. Walk me through connecting the single crypto platform where I want to keep everything, then configure it to buy my chosen amounts of Bitcoin and Ether on the same day each month and keep the holdings consolidated there. Ask me how much to allocate to each asset, which day and funding account to use, what spending limits and safety rules apply, and how to handle failed payments or price volatility. Show me the complete order plan before every purchase and hold each order for my approval until I say otherwise, do the first month as a supervised dry run, then save it for a monthly run.