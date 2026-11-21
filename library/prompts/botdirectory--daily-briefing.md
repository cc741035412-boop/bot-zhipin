---
id: botdirectory:bots/daily-briefing.md
kind: prompt
title: Daily Briefing
zh:
  title: 工作日早七点日程晨报员
  purpose: 工作日早七点把当天会议顺序和参会背景及隔夜变动合成一条Slack消息发来
  audience: 每天早起想在Slack上一眼看清全天会议和准备重点的忙人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/daily-briefing.md
sourcePath: bots/daily-briefing.md
author:
  name: elie2222
  url: https://x.com/elie2222
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Google Calendar
  - Slack
bodyHash: sha256:648c7062547b540e384f2ac9fbb73d66602afe2f263cd8723f4fa81a81e5268f
score: 3
rubric:
  task: true
  input: true
  steps: false
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
  slug: daily-briefing
  pageUrl: https://botdirectory.ai/bots/daily-briefing
  category: Productivity
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 列的是晨报内容，不是三步流程；发简报无需先问
---

Run this workflow for me. Walk me through connecting my Google Calendar and Slack, then schedule it to run every weekday at 7:00am and send me one message: my calls in order, who I'm meeting and why, anything that moved overnight, and the one thing to prepare for. Ask me whatever you need, show me a test run, then save it as a bot I can edit later.