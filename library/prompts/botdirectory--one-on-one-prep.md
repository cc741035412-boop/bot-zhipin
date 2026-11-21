---
id: botdirectory:bots/one-on-one-prep.md
kind: prompt
title: One-On-One Prep
zh:
  title: 经理面谈备忘单
  purpose: 把上次面谈的待办和进展列清楚，给出这周要跟经理聊的短议程。
  audience: 每周要和直属经理单聊的产品经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/one-on-one-prep.md
sourcePath: bots/one-on-one-prep.md
author:
  name: kristaletz
  url: https://x.com/kristaletz
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Granola
  - Google Calendar
bodyHash: sha256:6f2a98d956cf3e83d825b81ac97d6c1399ac092b8bf65e06a3763ee00593bc19
score: 3
rubric:
  task: true
  input: true
  steps: true
  acceptance: false
  approval: false
cnFit:
  value: 一般
  blocked:
    - Google Calendar
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: one-on-one-prep
  pageUrl: https://botdirectory.ai/bots/one-on-one-prep
  category: Productivity
  addedVia: https://x.com/kristaletz/status/2089103618121314689
  addedAt: 2026-08-17T19:08:55.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 只列议程和提醒内容，无独立硬标准或审批
---

Prep my weekly manager sync. Walk me through connecting Granola and Google Calendar, then configure it: before each 1:1, pull the notes from our last one, list the tasks my manager and I discussed and where each stands, set reminders for the ones I owe, and give me a short agenda of what to raise this week. Ask me who my manager is and which recurring meeting is our 1:1, prep the next one so I can check it, then save it.