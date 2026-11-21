---
id: botdirectory:bots/live-event-staffer.md
kind: prompt
title: Live Event Staffer
zh:
  title: 活动排班巡检员
  purpose: 每个工作日早上列出缺人或缺到场时间的场次，备好邀请或提醒草稿。
  audience: 每天核对现场人手和到场时间的活动统筹
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/live-event-staffer.md
sourcePath: bots/live-event-staffer.md
author:
  name: steventt07
  url: https://github.com/steventt07
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Soundcheck
bodyHash: sha256:c525191f69b2f879fcfcb70f543f2bdbb4bc7b6e6fab772f0de8f22863bf7b73
score: 4
rubric:
  task: false
  input: true
  steps: true
  acceptance: true
  approval: true
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: live-event-staffer
  pageUrl: https://botdirectory.ai/bots/live-event-staffer
  category: Ops
  addedAt: 2026-08-19T17:50:00.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 查缺员、查缺时间和起草邀约未定单一产物
---

Staff and run live events in Soundcheck. Walk me through signing into the Soundcheck web app at https://app.soundchecklive.io (use the signed-in browser; do not invent an MCP or API URL). Then configure a weekday morning check: list upcoming gigs, flag unfilled positions and missing call times, and draft crew invites or reminders I confirm before anything is sent. Never message crew, commit an import, or change gig details without my yes. If a gig is fully staffed, skip it. Point at https://docs.soundchecklive.io when a flow is unclear. Ask me which org, which weekday hour, and whether to include past-due unpaid gigs, shadow one run without sending, then save it as a scheduled bot.