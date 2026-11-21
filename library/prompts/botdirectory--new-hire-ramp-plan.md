---
id: botdirectory:bots/new-hire-ramp-plan.md
kind: prompt
title: New Hire Ramp Plan
zh:
  title: 新人首周安排表
  purpose: 参照同岗前辈的入职记录，列出新人首周要见的人、要读的资料和周五要交的成果。
  audience: 正给新同事安排第一周工作的组长
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/new-hire-ramp-plan.md
sourcePath: bots/new-hire-ramp-plan.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Google Calendar
  - Slack
bodyHash: sha256:07f052d1c4808f23cfac5279e4efdb9487eb39e200400a1961030aaf88620739
score: 3
rubric:
  task: true
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
  slug: new-hire-ramp-plan
  pageUrl: https://botdirectory.ai/bots/new-hire-ramp-plan
  category: Ops
  addedVia: https://x.com/ericzakariasson/status/2087258964131979423
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 周五是计划内容；没有独立硬标准或动作审批
---

Help me when someone new joins. Walk me through connecting Google Calendar and Slack, then configure it: study how the last few people in the role actually spent their first weeks — meetings, channels, docs — and write a first-week plan for the new hire: who to meet, what to read, what to ship by Friday. Ask me for the role and the people to learn from, let me edit the first plan, then save it.