---
id: botdirectory:bots/notam-briefer.md
kind: prompt
title: NOTAM Briefer
zh:
  title: 航行通告简报
  purpose: 每天两次汇总航线相关通告，两次简报之间另发短报，只列新增和有变动的事项。
  audience: 要跟踪常飞航线和基地机场变化的飞行员
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/notam-briefer.md
sourcePath: bots/notam-briefer.md
author:
  name: mopargtx440
  url: https://x.com/mopargtx440
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - FAA NOTAM Search
bodyHash: sha256:4ec9fb2f669c94299b6377ace9fa2e1d4493e5beb793ed88dd6b70105b7bc737
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: false
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: notam-briefer
  pageUrl: https://botdirectory.ai/bots/notam-briefer
  category: Productivity
  addedVia: https://x.com/mopargtx440/status/2089405925727539393
  addedAt: 2026-08-17T19:08:55.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 短更只含新增或变化；没有具体审批
---

Keep me current on NOTAMs. Walk me through pointing it at FAA NOTAM Search for the airports and area I cover, then schedule it: a full brief twice a day and a short update every few hours with only what's new or changed since the last one — TFRs, closures, lighting, obstacles, anything that touches my routes. It's a briefing aid, not a substitute for my official preflight. Ask me for my coverage area, base airports and when I want the two main briefs, send one so I can check it against the source, then save it.