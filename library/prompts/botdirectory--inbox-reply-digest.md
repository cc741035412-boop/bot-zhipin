---
id: botdirectory:bots/inbox-reply-digest.md
kind: prompt
title: Inbox Reply Digest
zh:
  title: 待回邮件简报
  purpose: 把新增待回邮件汇成聊天简报，每封附一句诉求和一份模仿你口吻的回信草稿。
  audience: 要定时集中回复客户来信的商务负责人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/inbox-reply-digest.md
sourcePath: bots/inbox-reply-digest.md
author:
  name: kristaletz
  url: https://x.com/kristaletz
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
bodyHash: sha256:4abe1c1c2fa5520a30700161412d76332a3883de7a4948de62b73b919c7a5206
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
  slug: inbox-reply-digest
  pageUrl: https://botdirectory.ai/bots/inbox-reply-digest
  category: Sales
  addedVia: https://x.com/kristaletz/status/2089103618121314689
  addedAt: 2026-08-17T19:08:55.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 无需回复就不发摘要；排除收据等
---

Run as a recurring routine. Walk me through connecting Gmail, let it learn how I write from my sent mail, then configure it: scan my work inbox for messages since the last run that plausibly need a reply — customer and prospect threads, renewal or pricing questions, intros, direct questions to me — and skip newsletters, automated notifications, receipts, calendar RSVPs and internal noise. For each one give me a short digest in chat: sender, subject, one line on what they need, and a proposed reply in my voice. Never auto-send. If nothing needs a reply, send no message at all. Ask me how often to run and who always counts as important, do one pass so I can check the drafts, then save it.