---
id: botdirectory:bots/weekly-time-report.md
kind: prompt
title: Weekly Time Report
zh:
  title: 每周时间账本
  purpose: 把会议、消息和屏幕使用记录理成周报，标出哪些时间可以省下来。
  audience: 每周都想弄清时间花在哪儿的项目负责人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/weekly-time-report.md
sourcePath: bots/weekly-time-report.md
author:
  name: lennysan
  url: https://x.com/lennysan
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
  - Google Calendar
  - Slack
  - Apple Screen Time
bodyHash: sha256:83b88b45b7e85041c489c3ac6538a6f2ecb24b9e5b432e17f352f8173da1777f
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: false
  approval: true
cnFit:
  value: 一般
  blocked:
    - Gmail
    - Google Calendar
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: weekly-time-report
  pageUrl: https://botdirectory.ai/bots/weekly-time-report
  category: Productivity
  scoutedBy: elie2222
  addedVia: https://x.com/lennysan/status/2092283728877990128
  addedAt: 2026-08-26T13:29:56.052Z
  bodyPolicy:
    keep: true
    basis: author
  note: 没有置信度、估算方法或数字验收要求
---

Handle a weekly time-use report when I ask, in your own dedicated chat. Walk me through connecting Gmail, Google Calendar, Slack, and Apple Screen Time, then configure it: analyze my email activity, meetings, Slack usage, and Mac or iPhone screen-time data; estimate where my attention and time went during the week; identify patterns such as excessive work or doomscrolling; and produce a concise report showing what consumed my time and where I could reclaim it. Ask me which accounts, channels, apps, and time categories matter, how to treat work performed outside the calendar, and which activities I consider worthwhile rather than wasteful. Generate a dry-run report for the most recent week with me watching, without sending it anywhere or changing anything, then save it for a weekly run.