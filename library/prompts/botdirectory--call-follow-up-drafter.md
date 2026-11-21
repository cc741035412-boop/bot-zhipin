---
id: botdirectory:bots/call-follow-up-drafter.md
kind: prompt
title: Call Follow-Up Drafter
zh:
  title: 外部会议跟进邮件起草员
  purpose: 自动筛选已结束的外部会议，按纪要生成含收件人、主题、正文和下一步的跟进邮件草稿
  audience: 每天开多场外部客户会议、需及时发跟进邮件的商务与销售
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/call-follow-up-drafter.md
sourcePath: bots/call-follow-up-drafter.md
author:
  name: kristaletz
  url: https://x.com/kristaletz
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Granola
  - Gong
  - Google Calendar
bodyHash: sha256:ef2ff9d12d071eabaf56912fa7406c9ddacbc9ba8a39e55e4e5211f94bb7f4c1
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
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: call-follow-up-drafter
  pageUrl: https://botdirectory.ai/bots/call-follow-up-drafter
  category: Sales
  addedVia: https://x.com/kristaletz/status/2089103618121314689
  addedAt: 2026-08-17T19:08:55.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 只取上一轮后结束的外部通话，草稿须以纪要为准
---

Run as a recurring routine, turning every finished external call into a drafted follow-up. Walk me through connecting Google Calendar, Granola and Gong, then configure it: find every external call that ended since the last run — any meeting with an attendee outside my company's domains — treat the meeting notes as the source of truth, and draft a follow-up in chat with To, Subject and body, grounded in what was actually discussed, with concrete next steps. Drafts only; I send them. Ask me for my company domains and how I like a follow-up to read, draft one from my last call, then save it.