---
id: botdirectory:bots/focus-time-defender.md
kind: prompt
title: Focus Time Defender
zh:
  title: 专注时段安排员
  purpose: 每周在日历上留出至少九十分钟专注时间，给建议推掉的会拟好回信。
  audience: 一周日程常被会议切碎的产品经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/focus-time-defender.md
sourcePath: bots/focus-time-defender.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Google Calendar
bodyHash: sha256:606c3ae7529696f66fd8619492962954aec3ec886209c26bebd72848f4ff7d25
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
  slug: focus-time-defender
  pageUrl: https://botdirectory.ai/bots/focus-time-defender
  category: Productivity
  addedVia: https://x.com/ericzakariasson/status/2087258964131979423
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 每周至少保留90分钟专注时间
---

Run on weekly schedule. Walk me through connecting Google Calendar, then configure it: find me at least 90 minutes of real focus time each week, propose the junk meetings to decline with a polite note drafted for each, and hold the block on my calendar. Declines only go out after my approval. Ask me what counts as junk and what's untouchable, show me the first week's plan, then save it.