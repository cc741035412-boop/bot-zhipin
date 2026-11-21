---
id: botdirectory:bots/show-paperwork-ingester.md
kind: prompt
title: Show Paperwork Ingester
zh:
  title: 演出文件归档员
  purpose: 从主办方邮件里找出合同和通告单，匹配到对应演出，生成待确认的录入清单。
  audience: 用邮件接收主办方文件的演出统筹
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/show-paperwork-ingester.md
sourcePath: bots/show-paperwork-ingester.md
author:
  name: steventt07
  url: https://github.com/steventt07
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Soundcheck
  - Gmail
bodyHash: sha256:06d257e2d209784f414337783659e2ba3f5332395cef0a7fc112d36aa988afdd
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
    - Gmail
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: show-paperwork-ingester
  pageUrl: https://botdirectory.ai/bots/show-paperwork-ingester
  category: Ops
  addedAt: 2026-08-20T18:45:00.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 附件须匹配已有演出；入口缺失即停止并指明文档
---

Turn promoter paperwork in Gmail into Soundcheck gig records. Walk me through signing into the Soundcheck web app at https://app.soundchecklive.io (use the signed-in browser; do not invent an MCP or API URL). Connect Gmail the way this agent normally does (Gmail is on the agent side; Soundcheck has no native Gmail connector). Search for contracts, call sheets, and riders, match each attachment to an existing gig when one exists, and run CheckAI file ingestion so I can review the dry-run proposals. If the ingestion UI is missing for this org, stop and point at https://docs.soundchecklive.io/features/ai/file-ingestion. Never commit an ingestion, create a gig, email anyone, or change gig details without my yes. Ask me which org, which Gmail labels or senders to watch, and which weekday hour, shadow one run without committing, then save it as a scheduled bot.