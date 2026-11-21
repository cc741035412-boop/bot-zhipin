---
id: botdirectory:bots/x-ai-merch-buyer.md
kind: prompt
title: X AI Merch Buyer
zh:
  title: 周边商品代购员
  purpose: 按尺码和预算比好货价与运费，列出整单明细，等你确认后下单并留存收据。
  audience: 要从 X AI 商店订购周边的买家
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/x-ai-merch-buyer.md
sourcePath: bots/x-ai-merch-buyer.md
author:
  name: LBallz77283
  url: https://x.com/LBallz77283
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - X AI Store
bodyHash: sha256:8b19545c9db849b08bd1500178af9899ec4319f580a7df32ab6bf0c101e64da0
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
      excerpt: Set up a new bot for me I can trigger to shop for and buy merchandise from the X
extra:
  slug: x-ai-merch-buyer
  pageUrl: https://botdirectory.ai/bots/x-ai-merch-buyer
  category: Personal
  addedVia: https://x.com/LBallz77283/status/2094085200439296186
  addedAt: 2026-08-30T15:29:53.283Z
  bodyPolicy:
    keep: true
    basis: author
  note: 核准前须展示最终商品、总价和运送细节
---

Set up a new bot for me I can trigger to shop for and buy merchandise from the X AI Store. Walk me through connecting the X AI Store, then ask for the products or designs I want, sizes, quantities, budget, shipping address, acceptable alternatives, and any spending limits. Find matching items, compare prices and shipping, and prepare the complete order for my review. Hold every order until I explicitly approve the final items, total, and shipping details, then place it and save the receipt. Ask me what purchases require extra confirmation, do the first order with me watching, then save it.