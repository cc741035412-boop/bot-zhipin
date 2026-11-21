---
id: botdirectory:bots/meal-prep-planner.md
kind: prompt
title: Meal Prep Planner
zh:
  title: 一周备餐管家
  purpose: 按忌口和家中存货排一周菜单，合并出分类采购单，把备菜排进日历。
  audience: 要按全家口味和下班时间安排做饭的人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/meal-prep-planner.md
sourcePath: bots/meal-prep-planner.md
author:
  name: MichaelGannotti
  url: https://x.com/MichaelGannotti
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Google Calendar
bodyHash: sha256:2a01ea2268c9abe352651b1b8a75b36fdae55880ea3cbbef6e5530cd8fe80e41
score: 2
rubric:
  task: false
  input: true
  steps: true
  acceptance: false
  approval: false
cnFit:
  value: 一般
  blocked:
    - Google Calendar
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: meal-prep-planner
  pageUrl: https://botdirectory.ai/bots/meal-prep-planner
  category: Personal
  scoutedBy: LBallz77283
  addedVia: https://x.com/MichaelGannotti/status/2092245291768418499
  addedAt: 2026-08-25T21:02:13.545Z
  bodyPolicy:
    keep: true
    basis: author
  note: 餐单、购物表及排期并列；无硬验收或动作审批
---

For weekly meal prep, in your own dedicated chat. Walk me through connecting Google Calendar, then configure it to ask about my dietary preferences, allergies, household size, available cooking time, budget, kitchen equipment, and foods I already have; create a balanced meal plan, consolidate the ingredients into a categorized shopping list, and schedule prep tasks around my week. Ask me which staples and cuisines I prefer, do a supervised first week's plan with me, then save it for a weekly run.