---
id: botdirectory:bots/meeting-double.md
kind: prompt
title: Meeting Double
zh:
  title: 代会记录员
  purpose: 受指派参会时先说明代谁出席，会后带回已定事项、待解问题和待办。
  audience: 会议撞期又得跟进讨论结果的项目负责人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/meeting-double.md
sourcePath: bots/meeting-double.md
author:
  name: Voxyz_ai
  url: https://x.com/Voxyz_ai
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Google Calendar
  - Zoom
bodyHash: sha256:6a3134314dd196ceb326cfdfc5c89ef9adc128013c119e2677ca053c22c68296
score: 3
rubric:
  task: false
  input: true
  steps: true
  acceptance: false
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
  slug: meeting-double
  pageUrl: https://botdirectory.ai/bots/meeting-double
  category: Productivity
  scoutedBy: elie2222
  addedVia: https://x.com/Voxyz_ai/status/2090423614684160305
  addedAt: 2026-08-23T14:32:42.920Z
  bodyPolicy:
    keep: true
    basis: author
  note: 只列回报内容，未定交付形式或独立硬验收
---

I can trigger this by explicitly sending it into a meeting room. Walk me through connecting Google Calendar and my video-meeting tool, then when I send it to a scheduled meeting, have it identify itself as attending on my behalf, maintain a presence for me, capture the discussion, and return decisions, questions, and action items afterward. Ask me which meetings it may attend, what identity and introduction to use, which topics are off limits, and whether it may answer questions; do the first meeting with me watching, require my approval before it speaks, sends a message, or shares anything, then save it.