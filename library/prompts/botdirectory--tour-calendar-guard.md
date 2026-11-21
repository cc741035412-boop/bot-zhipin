---
id: botdirectory:bots/tour-calendar-guard.md
kind: prompt
title: Tour Calendar Guard
zh:
  title: 演出日历核对员
  purpose: 工作日核对演出安排和个人日历，把漏掉的场次、时区偏差和撞期标出来。
  audience: 要兼顾巡演场次和私人行程的乐手
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/tour-calendar-guard.md
sourcePath: bots/tour-calendar-guard.md
author:
  name: steventt07
  url: https://github.com/steventt07
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Soundcheck
  - Google Calendar
bodyHash: sha256:a5d2ce7232e434bc12dd09b8ab2a74bf67b8d1695b96e8f052ba9906c9138655
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
  slug: tour-calendar-guard
  pageUrl: https://botdirectory.ai/bots/tour-calendar-guard
  category: Ops
  addedAt: 2026-08-20T18:45:00.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 同步设置和例行检查未点名单一交付物
---

Keep my Soundcheck gigs on Google Calendar. Walk me through signing into the Soundcheck web app at https://app.soundchecklive.io (use the signed-in browser; do not invent an MCP or API URL). Open Settings → Calendar sync, generate the private iCal feed if I do not already have one (gig calendar only, not availability; treat the URL like a password), and subscribe it in Google Calendar via From URL if it is not already there. Then configure a weekday check: compare upcoming Soundcheck gigs to Google Calendar and flag missing events, timezone mismatches, and collisions with my personal calendar. Never create, edit, or delete a calendar event, rotate the feed token, or change a gig without my yes. If a gig already matches a calendar event, skip it. Point at https://docs.soundchecklive.io/features/calendar-feed-subscription when the feed path is unclear. Ask me which org, which Google Calendar, which weekday hour, and how many days ahead to watch, shadow one run without writing, then save it as a scheduled bot.