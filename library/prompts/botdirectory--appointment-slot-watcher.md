---
id: botdirectory:bots/appointment-slot-watcher.md
kind: prompt
title: Appointment Slot Watcher
zh:
  title: 办证号源盯盘预约员
  purpose: 盯住护照签证或车管所放号页面，出号立刻发消息并在确认后代约。
  audience: 急着抢护照签证或车管所办事名额的申请人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/appointment-slot-watcher.md
sourcePath: bots/appointment-slot-watcher.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Slack
bodyHash: sha256:a825980208c0ecdf2b4c75f499a3e2aca7a51d32c29b6e7649015e90fb63c81a
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: false
  approval: true
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: appointment-slot-watcher
  pageUrl: https://botdirectory.ai/bots/appointment-slot-watcher
  category: Personal
  addedVia: https://x.com/ericzakariasson/status/2087259022172840124
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 无硬性核验线
---

Watch appointment calendars. Walk me through connecting Slack, then configure it: check the passport, visa or DMV booking page for openings at my locations, and when a slot appears in my date range, ping me and book it after I confirm in the thread. Ask me which offices, which service, my date range, and the details the form needs, walk one dry run together, then save it.