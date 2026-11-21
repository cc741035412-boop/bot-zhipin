---
id: botdirectory:bots/k-cup-restocker.md
kind: prompt
title: K-Cup Restocker
zh:
  title: 咖啡胶囊补货单
  purpose: 按咖啡机型号和口味备好补货单，列明价格、运费和替代款。
  audience: 负责给办公室胶囊咖啡机补货的行政
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/k-cup-restocker.md
sourcePath: bots/k-cup-restocker.md
author:
  name: LBallz77283
  url: https://x.com/LBallz77283
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Amazon
bodyHash: sha256:67a3aa5092da73da6de638f654f4e4d9b59cf69e4fd12f045ab59e0e94ad5a39
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
      excerpt: Set up a new bot for me I can trigger when I need to buy K-Cups
    - rule: R-pay
      excerpt: Show me the full item list, prices, shipping, and substitutions before it touche
extra:
  slug: k-cup-restocker
  pageUrl: https://botdirectory.ai/bots/k-cup-restocker
  category: Personal
  addedVia: https://x.com/LBallz77283/status/2094584181342732668
  addedAt: 2026-09-01T00:32:40.141Z
  bodyPolicy:
    keep: true
    basis: author
  note: 买前须展示完整商品、价格、运费和替代品
---

Set up a new bot for me I can trigger when I need to buy K-Cups. Walk me through connecting Amazon, then configure it: find K-Cup coffee pods matching my preferred roast, flavors, pod count, brand, delivery timing, and budget, compare the available options, and prepare the order. Show me the full item list, prices, shipping, and substitutions before it touches anything, and hold the purchase for my approval. Ask me which coffees and machines are compatible, what products are off-limits, and how much inventory I want, do the first restock with me watching, then save it.