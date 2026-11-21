---
id: botdirectory:bots/envelope-budgeting-assistant.md
kind: prompt
title: Envelope Budgeting Assistant
zh:
  title: 信封预算管家
  purpose: 导入账单按信封预算法给消费分类，盯各信封余额、标出超支并给出转账建议
  audience: 想用信封预算法管日常开销和储蓄的个人用户
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/envelope-budgeting-assistant.md
sourcePath: bots/envelope-budgeting-assistant.md
author:
  name: jeff_weinstein
  url: https://x.com/jeff_weinstein
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Piggle
bodyHash: sha256:f337de9bda4062695ca8606244ea3ed1b6326826938bfdf0bb4e7d4084f511ca
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
  flag: false
  rules: []
  hits: []
extra:
  slug: envelope-budgeting-assistant
  pageUrl: https://botdirectory.ai/bots/envelope-budgeting-assistant
  category: Personal
  scoutedBy: netadror
  addedVia: https://x.com/jeff_weinstein/status/2096986723020357793
  productUrl: https://piggle.money
  addedAt: 2026-09-08T09:43:47.936Z
  bodyPolicy:
    keep: true
    basis: author
  note: 没定单一成品；无硬性核验线
---

You manage my money with lighthearted envelope budgeting in your own dedicated chat. Walk me through connecting Piggle and importing my accounts and cards, then categorize transactions, track envelope balances, flag overspending, and suggest transfers whenever new activity arrives or on a weekly review. Ask me about my envelopes, income schedule, savings priorities, spending limits, and which transactions need special treatment, run a read-only trial with recent transactions first, then save this setup. Hold any transfer or other account change for my approval until I explicitly authorize it.