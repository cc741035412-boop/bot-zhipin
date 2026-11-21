---
id: botdirectory:bots/used-suv-search.md
kind: prompt
title: Used SUV Search
zh:
  title: 二手越野车比选表
  purpose: 筛出附近低于三万美元的二手SUV，列成对比表并标出事故等风险。
  audience: 在美国看二手SUV又担心车况的买家
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/used-suv-search.md
sourcePath: bots/used-suv-search.md
author:
  name: MrLexton
  url: https://x.com/MrLexton
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Automotive Listing Search
bodyHash: sha256:682a756ab88c7705ad85e01fb3eef357d929c765c30843e274035945ad4fa593
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: false
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: used-suv-search
  pageUrl: https://botdirectory.ai/bots/used-suv-search
  category: Personal
  addedVia: https://x.com/MrLexton/status/2092355008276599254
  addedAt: 2026-08-25T20:54:43.929Z
  bodyPolicy:
    keep: true
    basis: author
  note: 未明确联系卖家或下单等动作要先审批
---

Handle a used SUV search when I ask. Configure it to search current vehicle listings near my location and return reliable, safe SUVs priced under $30,000, prioritizing AWD or 4WD and low mileage. Compare each candidate's price, mileage, drivetrain, safety information, reliability signals, accident history, service records, seller type, and listing link, and flag warning signs such as reported accidents, unusually high mileage, or check-engine issues. Ask me for my location or search radius, maximum mileage, preferred makes and models, minimum safety standards, acceptable vehicle age, financing or total-cost limits, and any features I consider essential, then run a supervised first search and let me refine the ranking before saving it.