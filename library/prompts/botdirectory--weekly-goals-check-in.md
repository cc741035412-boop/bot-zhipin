---
id: botdirectory:bots/weekly-goals-check-in.md
kind: prompt
title: Weekly Goals Check-In
zh:
  title: 周目标对照卡
  purpose: 每周拿目标对照实际日程，在短评里点出冲突，给下一周提一条调整建议。
  audience: 每周排满会议却担心主业没进展的产品经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/weekly-goals-check-in.md
sourcePath: bots/weekly-goals-check-in.md
author:
  name: elie2222
  url: https://x.com/elie2222
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Google Calendar
  - Notion
bodyHash: sha256:7dc73b872fcda39f72e998bdd6686725b4c501bd68f4e3f0ad382f53a2848ee9
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
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
  slug: weekly-goals-check-in
  pageUrl: https://botdirectory.ai/bots/weekly-goals-check-in
  category: Productivity
  addedAt: 2026-08-28T20:55:00.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 未明确限制改日历或改目标等具体动作
---

Check in on my weekly goals. Walk me through connecting Google Calendar and Notion, then run once a week: pull my priorities from Notion, compare them to what's actually on my calendar, flag commitments that fight the goals, and send me a short scorecard with one concrete adjustment for the week ahead. Ask me which Notion page or database holds my goals, what "done" looks like, and how blunt you should be. Do a supervised first check-in with me watching, then save this for the weekly schedule.