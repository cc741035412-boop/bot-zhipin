---
id: botdirectory:bots/prospect-meeting-booker.md
kind: prompt
title: Prospect Meeting Booker
zh:
  title: 客户约会排期助手
  purpose: 按双方空档拟好约见邮件，时间敲定后备好带参会人和议程的邀请。
  audience: 常要和潜在客户协调见面时间的销售
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/prospect-meeting-booker.md
sourcePath: bots/prospect-meeting-booker.md
author:
  name: benln
  url: https://x.com/benln
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
  - Google Calendar
  - CRM
bodyHash: sha256:04c2273182daad85f39c2f06eff390d05a17fb5a8f77060024d8ccd7da4ad54e
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: false
  approval: true
cnFit:
  value: 一般
  blocked:
    - Gmail
    - Google Calendar
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: prospect-meeting-booker
  pageUrl: https://botdirectory.ai/bots/prospect-meeting-booker
  category: Sales
  scoutedBy: elie2222
  addedVia: https://x.com/benln/status/2087929147406299313
  productUrl: https://t.co/jpyLAl0vDm
  addedAt: 2026-08-17T21:45:00.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 会议属性由用户设定，没写独立硬验收
---

Help me when I want to book a meeting with a prospect or customer. Walk me through connecting Gmail, Google Calendar, and my CRM, then configure it: identify the relevant prospect or customer, check availability and meeting context, propose suitable times, coordinate by email, and create the meeting with the correct attendees, agenda, and notes once a time is agreed. Ask me which calendar and CRM fields to use, my preferred meeting lengths and hours, scheduling boundaries, follow-up tone, and what information belongs in the invite, draft the outreach and hold every booking for my approval before sending or creating it, do the first booking with me watching, then save it.