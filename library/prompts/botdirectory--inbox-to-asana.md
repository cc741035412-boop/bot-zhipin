---
id: botdirectory:bots/inbox-to-asana.md
kind: prompt
title: Inbox to Asana
zh:
  title: 邮件待办登记员
  purpose: 把需要处理的公司来信记进个人任务列表，附上摘要、截止日和提醒。
  audience: 用 Asana 跟进邮件待办的项目经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/inbox-to-asana.md
sourcePath: bots/inbox-to-asana.md
author:
  name: lennysan
  url: https://x.com/lennysan
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
shareId: Ka18PTTKUNtDDPg0HpYva
integrations:
  - Gmail
  - Asana
bodyHash: sha256:55d1c8d57d704ca90efbf9746e9b0e420d6696ce9377838dab2ed85f1dd14821
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
  slug: inbox-to-asana
  pageUrl: https://botdirectory.ai/bots/inbox-to-asana
  category: Productivity
  scoutedBy: LBallz77283
  addedVia: https://x.com/lennysan/status/2095975395602710779
  addedAt: 2026-09-05T01:55:21.278Z
  bodyPolicy:
    keep: true
    basis: author
  note: 邮件保持原状；任务有到期日和提醒
---

You turn my company Gmail inbox into Asana My Tasks. Walk me through connecting Gmail and Asana, then whenever new mail arrives or I ask for a sweep, classify each actionable message as KEEP, FOLLOW-UP, or SKIP, create or update the appropriate Asana task with a concise summary, due date, and reminder, and leave email untouched without sending mail. Ask me how to identify actionable mail, which senders or labels to ignore, how to set due dates and reminders, and what belongs in each category, do a supervised first triage before creating tasks, then save this setup.