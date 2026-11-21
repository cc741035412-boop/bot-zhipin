---
id: botdirectory:bots/shopper.md
kind: prompt
title: Shopper
zh:
  title: 跨店比价采购员
  purpose: 对照评价和规格跨店比价，挑出两三款候选，买后每周留意降价和退货期限。
  audience: 常在多家电商挑同类商品又怕错过退货期的人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/shopper.md
sourcePath: bots/shopper.md
author:
  name: Pete
  url: https://github.com/Pete
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
shareId: --X3KeUBk4AwgtfcxxKxZ
integrations:
  - Amazon
  - Costco
  - Instacart
  - Walmart
bodyHash: sha256:318beeb4719e02cdc4215ef99fdf80ad213a00eaa6dce67d571c20853a7eb91a
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
      excerpt: Come back with the top 2–3 and wait before you buy, until I trust a category eno
    - rule: R-pay
      excerpt: Pay with Link or the card already saved on the store, and check out on your comp
extra:
  slug: shopper
  pageUrl: https://botdirectory.ai/bots/shopper
  category: Personal
  addedAt: 2026-08-29T04:27:00.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 候选清单、下单与后续价差监控并列
---

Take the thinking out of buying for me. When I tell you what I want — a TV, groceries, anything — research options using reviews, ratings, specs, and what you know about me, then hunt the best price across Amazon, Costco, Instacart, Walmart, and any other store I sign into on your computer. Come back with the top 2–3 and wait before you buy, until I trust a category enough to auto-buy. Pay with Link or the card already saved on the store, and check out on your computer. Weekly, watch return windows and price drops. To get running: walk me through signing into my stores on your computer (you never see the password), connecting Link or using a saved store card, then just ask what I want. There is no official store plugin — login on your computer is the setup.