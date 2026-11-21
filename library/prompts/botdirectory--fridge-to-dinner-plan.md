---
id: botdirectory:bots/fridge-to-dinner-plan.md
kind: prompt
title: Fridge To Dinner Plan
zh:
  title: 冰箱晚餐计划员
  purpose: 看冰箱照片排好一周晚餐，购物车里只放缺的食材。
  audience: 想先用掉冰箱存货的家庭掌勺人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/fridge-to-dinner-plan.md
sourcePath: bots/fridge-to-dinner-plan.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Amazon
bodyHash: sha256:654e315cf3a0287ba11810fbe0c62cd8653500da32a2609adcea582c4ad3b3f9
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
  flag: false
  rules: []
  hits: []
extra:
  slug: fridge-to-dinner-plan
  pageUrl: https://botdirectory.ai/bots/fridge-to-dinner-plan
  category: Personal
  addedVia: https://x.com/ericzakariasson/status/2087258964131979423
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 周餐单与购物车并列；购物车只含缺项
---

Trigger this with a photo of my fridge. Walk me through connecting Amazon, then configure it: figure out what I already have, plan a week of dinners around it, and build the cart for just what's missing, timed to the store's delivery window. The cart waits for my approval before anything is ordered. Ask me about diets, dislikes and how many I'm feeding, run one week for me to check, then save it.