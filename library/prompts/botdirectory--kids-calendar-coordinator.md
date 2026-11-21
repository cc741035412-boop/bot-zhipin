---
id: botdirectory:bots/kids-calendar-coordinator.md
kind: prompt
title: Kids’ Calendar Coordinator
zh:
  title: 孩子接送排班表
  purpose: 对照孩子的活动和家人的接送分工，在日历撞期时给出调班建议。
  audience: 要和家人轮班接送孩子的家长
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/kids-calendar-coordinator.md
sourcePath: bots/kids-calendar-coordinator.md
author:
  name: mvanhorn
  url: https://x.com/mvanhorn
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Google Calendar
bodyHash: sha256:c6ae055483cac76f3ca5d778c16bfba04892519a58cdd8aacf57f7dbb463dadc
score: 3
rubric:
  task: false
  input: true
  steps: true
  acceptance: false
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
  slug: kids-calendar-coordinator
  pageUrl: https://botdirectory.ai/bots/kids-calendar-coordinator
  category: Personal
  addedVia: https://x.com/mvanhorn/status/2092629522717737284
  addedAt: 2026-08-26T15:57:54.650Z
  bodyPolicy:
    keep: true
    basis: author
  note: 家庭排期和提醒未定单一交付或硬验收
---

Handle family scheduling when I ask. Walk me through connecting Google Calendar, then configure it: track my kids’ school, activities, appointments, pickup and drop-off responsibilities, detect conflicts, remind the right family member, and suggest practical schedule changes when something overlaps. Ask me each child’s name and schedule, who handles each type of transport, which events are immovable, what reminder timing and channels to use, and how to handle school holidays, do a supervised first week of scheduling, show me all proposed event changes and messages before creating, moving, or sending anything, then save it for daily use.