---
id: botdirectory:bots/booking-pipeline-runner.md
kind: prompt
title: Booking Pipeline Runner
zh:
  title: 演出商单与排期核对员
  purpose: 工作日比对已赢单与演出排期，揪出未建档、未签合同和未邀客户项并起草跟进动作。
  audience: 用客户系统管商单、靠演出平台管排期的现场演出经纪与场地运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/booking-pipeline-runner.md
sourcePath: bots/booking-pipeline-runner.md
author:
  name: steventt07
  url: https://github.com/steventt07
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Soundcheck
  - HubSpot
bodyHash: sha256:ecb7a62a413b8e79e01e2f89e92c371406793903003c3bc06a726259b0d058e9
score: 3
rubric:
  task: true
  input: true
  steps: false
  acceptance: false
  approval: true
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: booking-pipeline-runner
  pageUrl: https://botdirectory.ai/bots/booking-pipeline-runner
  category: Sales
  addedAt: 2026-08-20T18:45:00.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 不足三步有序流程；无硬性核验线
---

Keep HubSpot deals and Soundcheck gigs in lockstep. Walk me through signing into the Soundcheck web app at https://app.soundchecklive.io (use the signed-in browser; do not invent an MCP or API URL). Do not claim a native HubSpot OAuth inside Soundcheck; if this org already has the signed n8n HubSpot sync, use deal vs gig status, otherwise work the in-app Leads → Convert to Gig flow and treat HubSpot as the CRM this agent already has connected. Then configure a weekday check: HubSpot closed-won with no Active gig, Active gig with an unsigned contract, and won leads whose client is not invited to the portal. Draft the next step for each. Never convert a lead, send a contract, or invite a client without my yes. Point at https://docs.soundchecklive.io when a flow is unclear. Ask me which org, which HubSpot pipeline, and which weekday hour, shadow one run without sending, then save it as a scheduled bot.