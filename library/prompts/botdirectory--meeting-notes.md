---
id: botdirectory:bots/meeting-notes.md
kind: prompt
title: Meeting Notes
zh:
  title: 会议跟进起草员
  purpose: 把转写和参会材料整理成纪要，在文档里留好带负责人和期限的待办及跟进草稿。
  audience: 散会后要给参会同事发跟进消息的会议主持人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/meeting-notes.md
sourcePath: bots/meeting-notes.md
author:
  name: mvanhorn
  url: https://x.com/mvanhorn
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Google Calendar
  - Google Docs
bodyHash: sha256:cfdaa466228be7c68d5e322fe637476b95020a0562828f14df3da3c75012a292
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
  slug: meeting-notes
  pageUrl: https://botdirectory.ai/bots/meeting-notes
  category: Productivity
  scoutedBy: elie2222
  addedVia: https://x.com/mvanhorn/status/2092629522717737284
  addedAt: 2026-08-26T15:40:28.604Z
  bodyPolicy:
    keep: true
    basis: author
  note: 每项行动注明负责人及期限；发送前审批
---

Set up a new bot for me I can trigger after a meeting to create meeting notes, in its own dedicated chat. Walk me through connecting Google Calendar and Google Docs, then configure it to use the meeting title, attendees, transcript, and any materials I provide to produce a summary, decisions, open questions, action items with owners and due dates, and a follow-up draft saved as a Google Doc. Ask me about my preferred note format, which meetings to include, how to handle uncertain speaker attribution, and who may receive follow-ups, do the first meeting with me watching, require my approval before sending any message or sharing notes, then save it.