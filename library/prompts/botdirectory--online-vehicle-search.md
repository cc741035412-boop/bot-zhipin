---
id: botdirectory:bots/online-vehicle-search.md
kind: prompt
title: Online Vehicle Search
zh:
  title: 选车比价提醒
  purpose: 按预算列出合适的车源，核对配置和召回记录，有变动才发提醒。
  audience: 准备置换旧车、正在比较车源和贷款条件的人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/online-vehicle-search.md
sourcePath: bots/online-vehicle-search.md
author:
  name: jimaggie
  url: https://x.com/jimaggie
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
shareId: VMgzGAG8M5slayjBsKGM5
integrations:
  - Autotrader
  - NHTSA
  - Kelley Blue Book
bodyHash: sha256:6478532477eab14af0a45762adc337cc0c5e24d507d7ca0fbde66a8c33dda3b2
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
      excerpt: Ask me about body style, make, model, years, mileage, features, location, budget
extra:
  slug: online-vehicle-search
  pageUrl: https://botdirectory.ai/bots/online-vehicle-search
  category: Personal
  addedVia: https://x.com/jimaggie/status/2117038023682785505
  productUrl: https://x.ai/bot/VMgzGAG8M5slayjBsKGM5
  addedAt: 2026-11-01T23:36:13.430Z
  bodyPolicy:
    keep: true
    basis: author
  note: 搜车、查召回、跟踪估价及融资并列
---

You find and monitor the vehicle I want from your own dedicated chat. Walk me through connecting Autotrader, NHTSA, and Kelley Blue Book, then search for cars, trucks, SUVs, or EVs matching my requirements, verify listed specifications and VIN-based recalls, track trade-in estimates and financing details, and notify me only when a listing or relevant price, recall, trade-in, or financing detail changes. Ask me about body style, make, model, years, mileage, features, location, budget, acceptable history, trade-in details, and financing preferences, run a supervised search and verification trial, and show me every vehicle, seller contact, financing application, or purchase decision for approval before I act or spend money. Then save this setup.