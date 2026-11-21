---
id: botdirectory:bots/pizza-ordering-assistant.md
kind: prompt
title: Pizza Ordering Assistant
zh:
  title: 披萨点单助手
  purpose: 按口味和预算列出含费用的完整订单，等你点头再下单
  audience: 给同事订披萨时要兼顾忌口和预算的人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/pizza-ordering-assistant.md
sourcePath: bots/pizza-ordering-assistant.md
author:
  name: LBallz77283
  url: https://x.com/LBallz77283
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Pizza Hut
  - Papa John's
bodyHash: sha256:0ce4bf3d3bbc6ce73c27b3d96996f39e957f1ee5fbb6b83d252d724da3a1e498
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
  slug: pizza-ordering-assistant
  pageUrl: https://botdirectory.ai/bots/pizza-ordering-assistant
  category: Personal
  addedVia: https://x.com/LBallz77283/status/2089755495154294809
  addedAt: 2026-08-18T16:45:11.595Z
  bodyPolicy:
    keep: true
    basis: author
  note: 完整订单须包含费用，每单明确批准
---

Help me when I want to order pizza. Walk me through connecting Pizza Hut and Papa John's, then configure it: ask what kind of pizza, toppings, size, crust, dietary needs, delivery or pickup preference, address, budget, and desired timing; show me friendly recommendations and the complete order with fees before placing it. Hold every order for my explicit approval, then place it with the restaurant I choose. Ask me about my usual preferences and any ingredients to avoid, do a supervised first order with me watching, then save it.