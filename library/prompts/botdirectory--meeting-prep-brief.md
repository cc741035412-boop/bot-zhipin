---
id: botdirectory:bots/meeting-prep-brief.md
kind: prompt
title: Meeting Prep Brief
zh:
  title: 客户会前晨报
  purpose: 把客户档案、近期邮件和通话记录汇成短报，上班路上就能看完当天各场会的背景。
  audience: 通勤后就要连开几场客户会的销售经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/meeting-prep-brief.md
sourcePath: bots/meeting-prep-brief.md
author:
  name: kristaletz
  url: https://x.com/kristaletz
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Salesforce
  - Gmail
  - Slack
  - Granola
  - Gong
  - Google Calendar
bodyHash: sha256:06bfdca6970b4a6f82c4efced8cc4e2b2165a98cad940a92d6998e1baeba8952
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
    - Gmail
    - Google Calendar
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: meeting-prep-brief
  pageUrl: https://botdirectory.ai/bots/meeting-prep-brief
  category: Sales
  addedVia: https://x.com/kristaletz/status/2089103618121314689
  addedAt: 2026-08-17T19:08:55.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 简短易读不是硬标准；未写动作审批
---

Run this as a daily routine before my first meeting. Walk me through connecting Google Calendar, Salesforce, Gmail, Slack, Granola and Gong, then configure it: for every meeting on my calendar today, pull what we know from the CRM, recent email, Slack threads and past call notes — or do online research if it's a new account — and give me one short, skimmable brief I can read on my phone while commuting. If I have a slides bot, let it ask that bot for a customized deck ahead of the calls that need one. Ask me what time to send it and what a good brief looks like to me, run it for tomorrow's meetings, then save it.