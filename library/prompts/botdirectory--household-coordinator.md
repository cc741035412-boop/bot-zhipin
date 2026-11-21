---
id: botdirectory:bots/household-coordinator.md
kind: prompt
title: Household Coordinator
zh:
  title: 家庭晨间待办
  purpose: 每天早上把家校日程理成有先后顺序的待办，附上待审消息。
  audience: 早上要协调家庭安排和学校事务的家长
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/household-coordinator.md
sourcePath: bots/household-coordinator.md
author:
  name: mrfundman
  url: https://x.com/mrfundman
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Google Calendar
  - Apple Messages
bodyHash: sha256:0b49fe5a09fcfecb5d360a7125e23fe1106a594b9b83a925f205e245784f7c5a
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
  slug: household-coordinator
  pageUrl: https://botdirectory.ai/bots/household-coordinator
  category: Personal
  scoutedBy: elie2222
  addedVia: https://x.com/mrfundman/status/2089338947201569187
  addedAt: 2026-08-18T14:14:58.777Z
  bodyPolicy:
    keep: true
    basis: author
  note: 清单与短信草稿并列；仅要求按优先级
---

Get to work each morning for household coordination. Walk me through connecting Google Calendar and Apple Messages, then configure it: check family calendars, events, kids' grades and school schedules, identify follow-ups for teachers and volunteers, and prepare a prioritized list of what needs attention. Draft texts and messages for me to review, but hold every message until I explicitly approve it. Ask me which calendars and schools matter, who may be contacted, what follow-ups are time-sensitive, and what tone to use, do a supervised first review with me, then save it for a daily run.