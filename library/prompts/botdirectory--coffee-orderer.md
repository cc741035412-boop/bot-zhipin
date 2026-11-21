---
id: botdirectory:bots/coffee-orderer.md
kind: prompt
title: Coffee Orderer
zh:
  title: 咖啡代点跑腿员
  purpose: 按常喝口味和预算配好星巴克等门店的自提咖啡单，列明总价等确认再扣款
  audience: 常点固定口味外带咖啡、想省去每次手选配料的上班族
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/coffee-orderer.md
sourcePath: bots/coffee-orderer.md
author:
  name: LBallz77283
  url: https://x.com/LBallz77283
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Java Moe's
  - Starbucks
bodyHash: sha256:54bf3a7a5ab6cf9bc0b1d608cf587d04685b5589c61ab17180c905428955fd37
score: 3
rubric:
  task: false
  input: true
  steps: true
  acceptance: false
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
      excerpt: Walk me through connecting my preferred ordering accounts and payment method, th
extra:
  slug: coffee-orderer
  pageUrl: https://botdirectory.ai/bots/coffee-orderer
  category: Personal
  addedVia: https://x.com/LBallz77283/status/2090998358580011047
  addedAt: 2026-08-23T14:35:17.218Z
  bodyPolicy:
    keep: true
    basis: author
  note: 没定单一成品；无硬性核验线
---

Order coffee from Java Moe's or Starbucks when I ask. Walk me through connecting my preferred ordering accounts and payment method, then configure it: when I request coffee, ask which shop, drink, size, milk, additions, pickup location, pickup time, and budget, place the order with my saved preferences, and show me the complete order and total for approval before submitting or charging anything. Ask me which drinks and customizations I usually want, which locations to use, what spending limit to enforce, and whether to favor Java Moe's or Starbucks when I do not specify, do a supervised first-order dry run with me, then save it.