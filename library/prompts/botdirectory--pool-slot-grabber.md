---
id: botdirectory:bots/pool-slot-grabber.md
kind: prompt
title: Pool Slot Grabber
zh:
  title: 泳池空位候补助手
  purpose: 盯着常去时段的泳池预约，有人退订就补位并发来预约确认
  audience: 常去的健身房泳池总约不上的游泳爱好者
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/pool-slot-grabber.md
sourcePath: bots/pool-slot-grabber.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Slack
bodyHash: sha256:bf8f16895d07e21560f3ef127c041eeaba9f89cd2cbfee0b994c2195020eafe5
score: 3
rubric:
  task: true
  input: true
  steps: true
  acceptance: false
  approval: false
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: pool-slot-grabber
  pageUrl: https://botdirectory.ai/bots/pool-slot-grabber
  category: Personal
  addedVia: https://x.com/ericzakariasson/status/2087258964131979423
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 未写具体校验要求；抢位直接执行
---

For the gym pool slots that are always booked. Walk me through connecting Slack, then configure it: watch the booking page for the times I actually swim, grab a spot the moment one opens, and message me the confirmation. Ask me for my gym, my preferred times, and how many bookings a week is enough, catch one cancellation live so I can see it work, then save it.