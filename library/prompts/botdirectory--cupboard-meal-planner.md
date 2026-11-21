---
id: botdirectory:bots/cupboard-meal-planner.md
kind: prompt
title: Cupboard Meal Planner
zh:
  title: 冰箱库存拍照配菜助手
  purpose: 从冰箱和橱柜照片里识别现有食材与数量，结合忌口和做饭时间排出清库存做饭菜单
  audience: 看着冰箱里剩菜剩肉不知道做啥、想先清掉家里囤货的做饭人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/cupboard-meal-planner.md
sourcePath: bots/cupboard-meal-planner.md
author:
  name: RhysSullivan
  url: https://x.com/RhysSullivan
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Camera Roll
bodyHash: sha256:b4f1de8b7a60629e1e5d8e9b0613a8d2837e827a6782fff2f68171e5c59976dc
score: 3
rubric:
  task: true
  input: true
  steps: true
  acceptance: false
  approval: false
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: cupboard-meal-planner
  pageUrl: https://botdirectory.ai/bots/cupboard-meal-planner
  category: Personal
  scoutedBy: elie2222
  addedVia: https://x.com/RhysSullivan/status/2091661242159255776
  addedAt: 2026-08-23T23:20:18.950Z
  bodyPolicy:
    keep: true
    basis: author
  note: 无硬性核验线；无具体动作审批或禁令
---

Start when I upload a photo of the ingredients in my cupboards, fridge, and freezer. Walk me through connecting my camera roll, then identify the ingredients and quantities you can see, ask me about dietary restrictions, servings, foods to avoid, available cooking time, and staples I usually keep on hand, and create a practical meal plan that prioritizes what I already have. Let me correct the ingredient list and do a supervised first meal plan with me, then save it for whenever I upload an updated ingredient photo.