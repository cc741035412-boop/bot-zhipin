---
id: botdirectory:bots/call-follow-up-nudge.md
kind: prompt
title: Call Follow-Up Nudge
zh:
  title: 会后承诺待办提醒员
  purpose: 会后半小时在Slack发提醒，列出你在会上答应联系的人、要发的资料和待查事项
  audience: 连轴转开会容易忘掉口头答应事项的业务负责人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/call-follow-up-nudge.md
sourcePath: bots/call-follow-up-nudge.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Google Calendar
  - Slack
bodyHash: sha256:b9bbdfb22f7adc8f42caa55f3e6f7b9e18a3ec6eac94adddc5b696e496cc3922
score: 2
rubric:
  task: true
  input: true
  steps: false
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
  slug: call-follow-up-nudge
  pageUrl: https://botdirectory.ai/bots/call-follow-up-nudge
  category: Productivity
  addedVia: https://x.com/ericzakariasson/status/2087258914060664902
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 只写会后发提醒，没写三步、核验线或发送审批
---

Trigger after my calls. Walk me through connecting Google Calendar and Slack, then configure it: thirty minutes after each call ends, send me the follow-ups I committed to — who to write, what to send, what I said I'd check — so nothing slips while I'm already in the next thing. Ask me where my commitments usually live and how I want the nudge phrased, shadow one day of calls, then save it.