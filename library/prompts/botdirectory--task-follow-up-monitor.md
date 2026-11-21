---
id: botdirectory:bots/task-follow-up-monitor.md
kind: prompt
title: Task Follow-Up Monitor
zh:
  title: 后台任务跟进员
  purpose: 定时告诉你后台任务做到哪一步、哪里卡住了，漏报也会重试并提醒你。
  audience: 把耗时任务交出去后要跟进进度的项目负责人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/task-follow-up-monitor.md
sourcePath: bots/task-follow-up-monitor.md
author:
  name: techdevnotes
  url: https://x.com/techdevnotes
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Google Calendar
  - Slack
  - Email
bodyHash: sha256:d5481148eaf681c364d017db8ec900d16e379cd84818eea1785fd43751f33724
score: 5
rubric:
  task: true
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
  slug: task-follow-up-monitor
  pageUrl: https://botdirectory.ai/bots/task-follow-up-monitor
  category: Productivity
  scoutedBy: LBallz77283
  addedVia: https://x.com/techdevnotes/status/2089389212625772893
  addedAt: 2026-08-18T06:05:13.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 定时检查漏跑须重试并告知用户
---

Help me when I hand it a task that needs background work. Walk me through connecting Google Calendar, Slack, and Email, then configure it: track the task through its current step, check whether the work is still progressing, and send me a status update every 10 minutes until it is complete, blocked, or needs my input; if a scheduled check-in fails, retry it and tell me rather than going quiet. Ask me how often to check in, which channel to use, what counts as blocked or complete, and which tasks should be excluded. Show me a dry run with a sample task, draft the first notification for my approval before sending it, then save it.