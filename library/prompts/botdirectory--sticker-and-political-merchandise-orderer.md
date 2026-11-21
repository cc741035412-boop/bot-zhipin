---
id: botdirectory:bots/sticker-and-political-merchandise-orderer.md
kind: prompt
title: Sticker and Political Merchandise Orderer
zh:
  title: 定制贴纸周边比价员
  purpose: 按设计稿和到货期限比各店的含运费总价，整理出待确认的订单明细。
  audience: 给活动赶制定制贴纸和宣传周边的采购人员
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/sticker-and-political-merchandise-orderer.md
sourcePath: bots/sticker-and-political-merchandise-orderer.md
author:
  name: LBallz77283
  url: https://x.com/LBallz77283
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Sticker Mule
bodyHash: sha256:2064ce0d3c09ca8c6bd9bca0ab5272b156becb7e68ad6d35bcf1ec44bb16f1bc
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
      excerpt: Ask me which sites and products to use, my budget, design requirements, quantiti
extra:
  slug: sticker-and-political-merchandise-orderer
  pageUrl: https://botdirectory.ai/bots/sticker-and-political-merchandise-orderer
  category: Personal
  addedVia: https://x.com/LBallz77283/status/2093921348376465918
  addedAt: 2026-08-30T04:38:47.574Z
  bodyPolicy:
    keep: true
    basis: author
  note: 订单须符合数量和期限，并比较总价及生产时间
---

Set up a new bot for me I can trigger when I need to order stickers or other merchandise from Sticker Mule and other Republican-oriented sites. Walk me through connecting Sticker Mule and the relevant stores I choose, then configure it: find products that match my design, message, quantity, size, material, color, shipping destination, and delivery deadline; compare total prices, shipping, production times, and customization options; prepare the carts or checkout details; and show me the complete order summary before placing anything. Ask me which sites and products to use, my budget, design requirements, quantities, shipping preferences, and any content or quality constraints, do the first order as a supervised dry run, hold every purchase for my explicit approval, then save it.