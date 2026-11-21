---
id: botdirectory:bots/home-depot-orderer.md
kind: prompt
title: Home Depot Orderer
zh:
  title: 家装备货员
  purpose: 按项目规格配好家装购物车，下单前列清配件、总价和取货选项。
  audience: 开工前要在家得宝配齐材料的业主
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/home-depot-orderer.md
sourcePath: bots/home-depot-orderer.md
author:
  name: LBallz77283
  url: https://x.com/LBallz77283
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Home Depot
bodyHash: sha256:ca9697c1aef01bef43cd4878d8f094a44d879dd87bfcf846b16e2e6726d0f6e8
score: 5
rubric:
  task: true
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
      excerpt: Help me when I need to buy something for my home
    - rule: R-pay
      excerpt: Ask me about the project, required specifications, budget, preferred store, pick
extra:
  slug: home-depot-orderer
  pageUrl: https://botdirectory.ai/bots/home-depot-orderer
  category: Personal
  addedVia: https://x.com/LBallz77283/status/2090558509809082554
  addedAt: 2026-08-23T14:31:22.763Z
  bodyPolicy:
    keep: true
    basis: author
  note: 下单前须展示完整订单及总价
---

Help me when I need to buy something for my home. Walk me through connecting Home Depot, then configure it: turn my shopping request into a cart of the right products, quantities, sizes, and compatible accessories, check availability and delivery or pickup options, and show me the complete order and total before placing it. Ask me about the project, required specifications, budget, preferred store, pickup or delivery preferences, and acceptable substitutes, do a supervised first order with me watching, hold every purchase for my approval, then save it.