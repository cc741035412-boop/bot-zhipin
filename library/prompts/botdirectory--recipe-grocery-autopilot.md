---
id: botdirectory:bots/recipe-grocery-autopilot.md
kind: prompt
title: Recipe Grocery Autopilot
zh:
  title: 食谱配菜购物车
  purpose: 把食谱照片变成配送购物车，列出每种食材买几包、整单多少钱。
  audience: 在美国用全食超市配送买菜的人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/recipe-grocery-autopilot.md
sourcePath: bots/recipe-grocery-autopilot.md
author:
  name: benln
  url: https://x.com/benln
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Photos
  - Whole Foods
  - Whole Foods delivery
bodyHash: sha256:6cd68345a045b3708fc2be62f03ffaf313093590e222b44c4634ed8a4f6c2a92
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
  flag: false
  rules: []
  hits: []
extra:
  slug: recipe-grocery-autopilot
  pageUrl: https://botdirectory.ai/bots/recipe-grocery-autopilot
  category: Personal
  scoutedBy: elie2222
  addedVia: https://x.com/benln/status/2087929147406299313
  addedAt: 2026-08-17T21:45:00.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 模糊商品单列，完整购物车须列数量与总价
---

I can trigger this by sending a recipe photo. Walk me through connecting my photo library and Whole Foods delivery, then configure it: read the recipe, identify ingredients and quantities, resolve reasonable package sizes and substitutions, turn the result into a Whole Foods delivery cart, and group ambiguous items for my review. Ask me about dietary restrictions, preferred brands, pantry staples I already have, acceptable substitutions, delivery location, and budget, show me the full cart with quantities and total, and hold the order for my approval before placing it. Do a supervised cart-building trial with one recipe, then save it.