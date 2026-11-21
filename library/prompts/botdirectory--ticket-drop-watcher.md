---
id: botdirectory:bots/ticket-drop-watcher.md
kind: prompt
title: Ticket Drop Watcher
zh:
  title: 影院放票盯梢员
  purpose: 影院一放票就按偏好选座并通知你，总价超过上限就留座等确认。
  audience: 想抢热门场次连座的影迷
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/ticket-drop-watcher.md
sourcePath: bots/ticket-drop-watcher.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Slack
bodyHash: sha256:de38fe8cfd0b3c72847d6c2abea382068c3a7683c3d298be4192814b5b1d5f71
score: 3
rubric:
  task: false
  input: true
  steps: true
  acceptance: false
  approval: true
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: true
  rules:
    - R-pay
  hits:
    - rule: R-pay
      excerpt: Ask me for the movie, my seat preferences, and my auto-buy ceiling, do a dry run
extra:
  slug: ticket-drop-watcher
  pageUrl: https://botdirectory.ai/bots/ticket-drop-watcher
  category: Personal
  addedVia: https://x.com/ericzakariasson/status/2087258964131979423
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 抢座加提醒而非单一产物，无独立验收标准
---

Watch for a ticket drop. Walk me through connecting Slack, then configure it: watch the AMC listing I give it, and the moment seats open, grab the ones matching my preferences and ping me — or hold them for a quick confirm if the total is above my limit. Ask me for the movie, my seat preferences, and my auto-buy ceiling, do a dry run on a showing that's already on sale, then save it.