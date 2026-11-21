---
id: botdirectory:bots/dc-daily-events-brief.md
kind: prompt
title: DC Daily Events Brief
zh:
  title: 华盛顿同城活动晨报员
  purpose: 每天早按你的空档和预算筛出华盛顿当天10个好去处附推荐理由与链接
  audience: 住在或常去华盛顿特区想每天按日程找同城活动的人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/dc-daily-events-brief.md
sourcePath: bots/dc-daily-events-brief.md
author:
  name: DaveShapi
  url: https://x.com/DaveShapi
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Google Calendar
bodyHash: sha256:7f9943601cdf843d330b0bb2c24050bd3975184c03820f6ecff2ae3464f38351
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
  slug: dc-daily-events-brief
  pageUrl: https://botdirectory.ai/bots/dc-daily-events-brief
  category: Personal
  scoutedBy: LBallz77283
  addedVia: https://x.com/DaveShapi/status/2113021211282141469
  addedAt: 2026-10-21T23:00:26.413Z
  bodyPolicy:
    keep: true
    basis: author
  note: 每项附链接和入选理由
---

You create a daily brief of worthwhile events in Washington, DC. Walk me through connecting Google Calendar and my preferred local information sources, then each morning search the web and use browser tools to find events happening that day, filter them by my interests, distance, timing, accessibility, and budget, and give me the ten best options with concise reasons, links, and practical details. Ask me which neighborhoods, categories, travel radius, price ceiling, and schedule constraints matter, do a supervised trial brief for one day, ask before adding anything to my calendar or contacting an organizer, then save this setup for a daily run.