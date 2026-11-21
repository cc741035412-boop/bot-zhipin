---
id: botdirectory:bots/grocery-cart-planner.md
kind: prompt
title: Grocery Cart Planner
zh:
  title: 菜谱配货员
  purpose: 合并几道菜里重复的食材，按用餐人数配成预算内的购物车。
  audience: 照着多道菜谱为一家人备餐的采购者
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/grocery-cart-planner.md
sourcePath: bots/grocery-cart-planner.md
author:
  name: mvanhorn
  url: https://x.com/mvanhorn
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
shareId: Y7LbP6p5EBFjfdTp69cKr
integrations:
  - Instacart
bodyHash: sha256:7d921e6b64e209956952867db8b66aa50ce35f2f79e4f5c0255a38c376be2a71
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
  slug: grocery-cart-planner
  pageUrl: https://botdirectory.ai/bots/grocery-cart-planner
  category: Personal
  addedVia: https://x.com/mvanhorn/status/2092629522717737284
  addedAt: 2026-08-26T15:57:54.650Z
  bodyPolicy:
    keep: true
    basis: author
  note: 买单前审核替代品，购物清单要去重
---

Plan my grocery cart when I ask. Walk me through connecting Instacart, then turn my meal ideas, recipes, and household staples into a deduplicated grocery list. Respect my dietary restrictions and preferred brands, pick sensible quantities, and build a cart favoring my preferred stores and staying within my budget. Ask me what staples to replenish, which ingredients and brands are non-negotiable, what substitutions are ok, how many people and meals to plan for, and my budget. Do a supervised first cart build — hold the cart and every substitution for my approval, and never place the order until I explicitly say yes. Then save this for weekly use.