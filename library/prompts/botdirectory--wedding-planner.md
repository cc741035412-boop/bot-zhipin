---
id: botdirectory:bots/wedding-planner.md
kind: prompt
title: Wedding Planner
zh:
  title: 多日婚礼筹备管家
  purpose: 跟着供应商回信更新婚礼总日程和预算，每周日列出待拍板的事和近期支出。
  audience: 正在筹备多日婚礼、要对接多家供应商的新人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/wedding-planner.md
sourcePath: bots/wedding-planner.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
  - Notion
bodyHash: sha256:0590257cc0b4e9be834561cb8df2a956eed46c09367a531c0b9449a1b581c730
score: 4
rubric:
  task: false
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
  slug: wedding-planner
  pageUrl: https://botdirectory.ai/bots/wedding-planner
  category: Personal
  addedVia: https://x.com/ericzakariasson/status/2087259022172840124
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 日程、预算、外联和摘要并行
---

Run the logistics of a multi-day wedding. Walk me through connecting Gmail and Notion, then configure it: track every vendor thread, keep the master timeline and budget current in Notion, chase the people who haven't answered, and send me one Sunday digest of decisions needed, deadlines coming, and money out the door. Drafts to vendors wait for my approval. Ask me for the date, the vendor list so far, and the budget, then save it.