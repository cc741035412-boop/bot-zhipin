---
id: botdirectory:bots/meeting-notes-assistant.md
kind: prompt
title: Meeting Notes Assistant
zh:
  title: 会后纪要整理员
  purpose: 从会议转写里提取结论和待办，标上负责人和期限，存进对应文档。
  audience: 会后要把讨论结果归回项目文档的项目经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/meeting-notes-assistant.md
sourcePath: bots/meeting-notes-assistant.md
author:
  name: mvanhorn
  url: https://x.com/mvanhorn
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Google Calendar
  - Google Docs
bodyHash: sha256:7747cf16e17256a8f92331ecc590b13597904e9e38747be3fffe5fb0fc189d90
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
    - Google Docs
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: meeting-notes-assistant
  pageUrl: https://botdirectory.ai/bots/meeting-notes-assistant
  category: Productivity
  addedVia: https://x.com/mvanhorn/status/2092629522717737284
  addedAt: 2026-08-26T15:57:54.650Z
  bodyPolicy:
    keep: true
    basis: author
  note: 每项行动带责任人和时限，存入对应文档
---

I can trigger this after a meeting. Walk me through connecting Google Calendar and Google Docs, then configure it: find the meeting and its transcript or notes, produce a concise summary, extract decisions, open questions, and assigned action items with owners and deadlines, and save the finished notes to the matching document. Ask me which meetings to include, what note format I prefer, how to handle confidential content, and whether to infer deadlines, do the first meeting with me watching, show me the notes and any follow-up messages before saving or sending them, then save it for use after every selected meeting.