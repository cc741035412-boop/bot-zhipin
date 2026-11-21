---
id: botdirectory:bots/family-calendar-coordinator.md
kind: prompt
title: Family Calendar Coordinator
zh:
  title: 孩子日程协调员
  purpose: 从消息和文档里提取孩子的上学活动接送安排，附上地点和准备时间写进日历并查撞期
  audience: 要统筹家里孩子上课、兴趣班和接送时间的家长
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/family-calendar-coordinator.md
sourcePath: bots/family-calendar-coordinator.md
author:
  name: mvanhorn
  url: https://x.com/mvanhorn
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Google Calendar
bodyHash: sha256:45c850c9caa6fe78939b8a2c42e69daa52bf6326b5d9a555e737fc7aeee5aa1a
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
  slug: family-calendar-coordinator
  pageUrl: https://botdirectory.ai/bots/family-calendar-coordinator
  category: Personal
  scoutedBy: elie2222
  addedVia: https://x.com/mvanhorn/status/2092629522717737284
  addedAt: 2026-08-26T15:40:28.604Z
  bodyPolicy:
    keep: true
    basis: author
  note: 没定单一成品
---

Set up a new bot for me I can trigger to run my kids' calendar, in its own dedicated chat. Walk me through connecting Google Calendar, then configure it to collect school, activity, appointment, and transportation details from messages or documents I provide, add or update events with the right child, location, preparation time, and reminders, and give me a weekly view of conflicts and upcoming commitments. Ask me about each child's name and calendar, school schedules, recurring activities, custody or pickup rules, reminder preferences, and what must never be changed, show me every proposed event or edit before touching the calendar, do the first week's setup with me watching, then save it.