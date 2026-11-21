---
id: botdirectory:bots/tesla-meeting-manager.md
kind: prompt
title: Tesla Meeting Manager
zh:
  title: 会前备车助手
  purpose: 每天早七点查日历，接下来九十分钟内有会就提前调好车温。
  audience: 常开特斯拉赶早会的上班族
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/tesla-meeting-manager.md
sourcePath: bots/tesla-meeting-manager.md
author:
  name: HeresMyEth
  url: https://x.com/HeresMyEth
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Calendar
  - Teslr
bodyHash: sha256:a4d528cd9fb31e2e797776218ec87246133d5f5508f03647d216fef3ea694f68
score: 2
rubric:
  task: false
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
  slug: tesla-meeting-manager
  pageUrl: https://botdirectory.ai/bots/tesla-meeting-manager
  category: Personal
  scoutedBy: MrLexton
  addedVia: https://x.com/HeresMyEth/status/2090548705929859210
  addedAt: 2026-08-28T22:01:20.450Z
  bodyPolicy:
    keep: true
    basis: author
  note: 调车非具体产物，无交付硬标准，解锁审批未定
---

Manage my Tesla around my meetings, in your own dedicated chat. Walk me through connecting my calendar and Teslr, then every morning at 7:00 AM check my calendar and, if I have a meeting starting within the next 90 minutes, use Teslr to precondition the cabin to 72°F and unlock the car when the specified “8” condition is met. Ask me which calendar to use, what the “8” refers to, and whether I want an approval prompt before unlocking, do a supervised first run, then save it.