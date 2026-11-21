---
id: botdirectory:bots/grocery-autopilot.md
kind: prompt
title: Grocery Autopilot
zh:
  title: 每周买菜管家
  purpose: 把一周菜单排进日历，再按食材类别分店备好待确认的订单。
  audience: 每周要分两家店采购食材的家庭掌勺人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/grocery-autopilot.md
sourcePath: bots/grocery-autopilot.md
author:
  name: RhysSullivan
  url: https://x.com/RhysSullivan
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Amazon
  - Costco
  - Google Calendar
bodyHash: sha256:0fff33ab111e32339cf42460814ef9e5a8460e3089b26c9477d08ba9b8c52477
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
    - Google Calendar
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: grocery-autopilot
  pageUrl: https://botdirectory.ai/bots/grocery-autopilot
  category: Personal
  addedVia: https://x.com/RhysSullivan/status/2089338930009374994
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 菜单、下单和排日历并列
---

Run my grocery ordering, in your own dedicated chat. Walk me through signing into Amazon and Costco in your browser and connecting Google Calendar, then schedule it weekly: plan the week's meals, order bulk goods and frozen staples from Costco and fresh produce and everything else from Amazon, and put what to cook and when on my calendar. Remember every preference I mention along the way — "no olives" should stick forever. Ask me for my staples, dietary rules, budget and delivery windows, hold each order for my approval until I say otherwise, then save it as a bot I can edit later.