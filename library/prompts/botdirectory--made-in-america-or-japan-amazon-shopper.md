---
id: botdirectory:bots/made-in-america-or-japan-amazon-shopper.md
kind: prompt
title: Made-in-America or Japan Amazon Shopper
zh:
  title: 美日制造选品单
  purpose: 把亚马逊上美国或日本制造的商品列成比价单，每件附上产地依据
  audience: 在亚马逊买东西时挑产地的采购员
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/made-in-america-or-japan-amazon-shopper.md
sourcePath: bots/made-in-america-or-japan-amazon-shopper.md
author:
  name: LBallz77283
  url: https://x.com/LBallz77283
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Amazon
bodyHash: sha256:148ff8a82626234c48b5eab045179aab0974fc2b59aeec7fef6e2258eb539e1f
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
      excerpt: Ask me whether I prefer American-made or Japan-made products, what categories an
extra:
  slug: made-in-america-or-japan-amazon-shopper
  pageUrl: https://botdirectory.ai/bots/made-in-america-or-japan-amazon-shopper
  category: Personal
  addedVia: https://x.com/LBallz77283/status/2090558509809082554
  addedAt: 2026-08-23T14:31:22.763Z
  bodyPolicy:
    keep: true
    basis: author
  note: 每项须有产地证据，仅限美国或日本制造
---

Help me when I need to shop on Amazon. Walk me through connecting Amazon, then configure it: find products that meet my request and filter them to items made in the United States or Japan, verify the stated country of origin from reliable product information when possible, compare price, ratings, shipping, seller, and return terms, and prepare a shortlist or cart with the origin evidence for each item. Ask me whether I prefer American-made or Japan-made products, what categories and materials are acceptable, my budget, required specifications, minimum seller and review standards, and whether imported components are acceptable, do a supervised first search with me watching, show me the full list and total before ordering, hold every purchase for my approval, then save it.