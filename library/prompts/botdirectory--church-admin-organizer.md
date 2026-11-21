---
id: botdirectory:bots/church-admin-organizer.md
kind: prompt
title: Church Admin Organizer
zh:
  title: 教会日历与成员档案整理员
  purpose: 每周排查日历冲突与缺失信息并生成成员档案标准化修改清单
  audience: 负责管理教会活动排期和教友登记资料的行政干事
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/church-admin-organizer.md
sourcePath: bots/church-admin-organizer.md
author:
  name: rabbriansamuel
  url: https://x.com/rabbriansamuel
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Google Calendar
  - Microsoft Outlook
bodyHash: sha256:6db10db2eb189e4a799e02633c3a8776f613ba32a17721d1afa4f5b723a3c750
score: 4
rubric:
  task: true
  input: true
  steps: false
  acceptance: true
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
  slug: church-admin-organizer
  pageUrl: https://botdirectory.ai/bots/church-admin-organizer
  category: Ops
  scoutedBy: LBallz77283
  addedVia: https://x.com/rabbriansamuel/status/2093426898562863457
  addedAt: 2026-08-29T05:27:00.897Z
  bodyPolicy:
    keep: true
    basis: author
  note: 不足三步有序流程
---

Handle church administration when I ask. Walk me through connecting Google Calendar, Microsoft Outlook, and the Google or Microsoft tools where our member records live, then configure it to tidy calendars, identify conflicts and missing details, standardize member-record updates, and show me a proposed change log before applying anything. Ask me which calendars and member fields are authoritative, what must never be changed automatically, and who should be notified, do the first cleanup with me watching, then save it for a weekly run.