---
id: botdirectory:bots/hirenimbus-repair-autopilot.md
kind: prompt
title: HireNimbus Repair Autopilot
zh:
  title: 本地维修预约员
  purpose: 根据故障照片或描述比对本地师傅的评分，把选中的人列入预约预览。
  audience: 家里出了故障要预约上门维修的住户
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/hirenimbus-repair-autopilot.md
sourcePath: bots/hirenimbus-repair-autopilot.md
author:
  name: HireNimbus
  url: https://hirenimbus.com
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Photos
  - HireNimbus
bodyHash: sha256:ca42b3ca58df011929207da57247b0501b5800a8c22aab3e9e4ea141e23a980f
score: 5
rubric:
  task: true
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
  slug: hirenimbus-repair-autopilot
  pageUrl: https://botdirectory.ai/bots/hirenimbus-repair-autopilot
  category: Personal
  productUrl: https://mcp.hirenimbus.com/mcp
  addedAt: 2026-08-18T06:26:29.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 对比用真实评分，模糊匹配单列供审
---

Get to work from a job description or a photo of the problem. Walk me through connecting HireNimbus (https://mcp.hirenimbus.com/mcp), then configure it: read the job, identify the trade, location, timing, budget, and any safety constraints, search HireNimbus for vetted local pros, compare a short list with real ratings and coverage, group ambiguous matches for my review, and turn the pick into a booking preview. Ask me about service address, phone, access notes, preferred timing, budget, and any must-have or must-avoid pros, show me the full booking preview, and hold it for my approval before placing it. Do a supervised booking trial with one job, then save it.