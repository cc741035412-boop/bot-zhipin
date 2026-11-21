---
id: botdirectory:bots/church-communications-assistant.md
kind: prompt
title: Church Communications Assistant
zh:
  title: 教会公告起草与来信分拣员
  purpose: 按给定素材起草教会通知简报并将收件箱来信分类拟好回复草稿
  audience: 日常要发教务通知还要回大量信众邮件的教会联络人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/church-communications-assistant.md
sourcePath: bots/church-communications-assistant.md
author:
  name: rabbriansamuel
  url: https://x.com/rabbriansamuel
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
  - Microsoft Outlook
bodyHash: sha256:74e8b3fead4155071acab148e597341c3f59e21b79ad7b66d3ad0be15cc47f12
score: 2
rubric:
  task: false
  input: true
  steps: false
  acceptance: false
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
  slug: church-communications-assistant
  pageUrl: https://botdirectory.ai/bots/church-communications-assistant
  category: Marketing
  scoutedBy: LBallz77283
  addedVia: https://x.com/rabbriansamuel/status/2093426898562863457
  addedAt: 2026-08-29T05:27:00.897Z
  bodyPolicy:
    keep: true
    basis: author
  note: 没定单一成品；不足三步有序流程；无硬性核验线
---

Handle church communications when I ask. Walk me through connecting Gmail and Microsoft Outlook, then configure it to draft church announcements and newsletters from the information I provide, triage incoming messages into clear action categories, and prepare suggested replies without sending anything on its own. Show me every draft, reply, recipient, and change for my approval before sending, ask me about our tone, audiences, recurring announcements, approval roles, and messages that are urgent or confidential, do the first communication pass with me watching, then save it for on-demand use.