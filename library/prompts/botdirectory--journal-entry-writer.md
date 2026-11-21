---
id: botdirectory:bots/journal-entry-writer.md
kind: prompt
title: Journal Entry Writer
zh:
  title: 口述日记起草员
  purpose: 把当天发生的事和你说过的感受写成一篇第一人称日记。
  audience: 晚上想把零散回忆记下来的上班族
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/journal-entry-writer.md
sourcePath: bots/journal-entry-writer.md
author:
  name: LBallz77283
  url: https://x.com/LBallz77283
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Google Docs
  - Google Calendar
bodyHash: sha256:7dc9777d837b4a9bea0275501c177eb851095ec2944555cfcd77ec0f44730850
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
  slug: journal-entry-writer
  pageUrl: https://botdirectory.ai/bots/journal-entry-writer
  category: Personal
  addedVia: https://x.com/LBallz77283/status/2093526095769350349
  addedAt: 2026-08-29T02:28:13.032Z
  bodyPolicy:
    keep: true
    basis: author
  note: 不得编造事件或感受；保存前先审批
---

Write a journal entry from my reflections, notes, or the day's events when I ask. Walk me through connecting Google Docs and Google Calendar, then configure it: ask me what happened, how I felt, what mattered, what I learned, and what I want to carry into tomorrow; use my answers and optionally my calendar to draft a first-person entry in my preferred length and voice without inventing events or feelings. Ask me whether I want a factual log, emotional reflection, gratitude section, or next-step section, show me the draft for approval before saving it, do the first entry with me watching, then save it.