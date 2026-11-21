---
id: botdirectory:bots/forecast-notes-updater.md
kind: prompt
title: Forecast Notes Updater
zh:
  title: 商机备注更新员
  purpose: 每次客户沟通后，把新进展按销售团队的格式补进商机备注。
  audience: 开销售预测会前要核对商机的客户经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/forecast-notes-updater.md
sourcePath: bots/forecast-notes-updater.md
author:
  name: kristaletz
  url: https://x.com/kristaletz
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Salesforce
  - Granola
  - Gong
  - Slack
  - Gmail
bodyHash: sha256:b38ab8e3bb213b656fe76110edb9e900a3beacbfd3236d65398814818477b408
score: 5
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: true
cnFit:
  value: 一般
  blocked:
    - Gmail
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: forecast-notes-updater
  pageUrl: https://botdirectory.ai/bots/forecast-notes-updater
  category: Sales
  addedVia: https://x.com/kristaletz/status/2089103618121314689
  addedAt: 2026-08-17T19:08:55.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 首周只展示拟更新内容，不写入系统
---

Keep my Salesforce opportunity notes current. Walk me through connecting Salesforce, Granola, Gong, Slack and Gmail, then configure it: after each customer touchpoint, pull what changed from the call notes, Slack threads and email and update the opportunity's notes in the exact format I give it, so my forecast call is never a scramble. Ask me for my update format and which opps are in play, show me the proposed updates for one week before it writes anything to Salesforce, then save it.