---
id: botdirectory:bots/hardware-parts-buyer.md
kind: prompt
title: Hardware Parts Buyer
zh:
  title: 五金配货员
  purpose: 对照两家五金店的库存和价格，凑出符合取货或配送要求的待审订单。
  audience: 做维修项目前要跨店配齐零件的采购员
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/hardware-parts-buyer.md
sourcePath: bots/hardware-parts-buyer.md
author:
  name: LBallz77283
  url: https://x.com/LBallz77283
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Lowe's
  - Home Depot
bodyHash: sha256:c1046462dd91ca4f99cb15bf40fe3006dd0d38e5d4fe6461bc5af92367864ed0
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: false
  approval: true
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: hardware-parts-buyer
  pageUrl: https://botdirectory.ai/bots/hardware-parts-buyer
  category: Personal
  addedVia: https://x.com/LBallz77283/status/2098065479629676661
  addedAt: 2026-09-10T15:06:08.987Z
  bodyPolicy:
    keep: true
    basis: author
  note: 仅列比较维度，没设独立验收条件
---

You find and order the hardware parts I need from Lowe's and Home Depot. Walk me through connecting those stores, then when I give you a parts list or describe a project, compare availability, prices, and delivery or pickup options, recommend the best combination, and hold the complete order for my approval before purchasing anything. Ask me about my budget, preferred store, acceptable substitutes, quantity, and pickup or delivery preferences, do a supervised first order, then save this setup.