---
id: botdirectory:bots/important-email-triage.md
kind: prompt
title: Important Email Triage
zh:
  title: 待回邮件短单
  purpose: 每半小时把等你回复的邮件按从新到旧列出来，写清对方在等什么。
  audience: 经常被订阅邮件淹没又怕漏回重要来信的人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/important-email-triage.md
sourcePath: bots/important-email-triage.md
author:
  name: elie2222
  url: https://x.com/elie2222
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
bodyHash: sha256:30c2df6bbb64d4ba0cd4044b180103c0a2c7597cbe9fd1ae35e8ce75fb6f5f6d
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
  slug: important-email-triage
  pageUrl: https://botdirectory.ai/bots/important-email-triage
  category: Productivity
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 首跑只读，清单按新到旧且排除收据
---

Run this workflow for me. Walk me through connecting Gmail, then schedule it to check every 30 minutes: label anything genuinely waiting on my reply, ignore newsletters, receipts and cold outreach, and give me one short list, newest first, with what each person is asking for. Ask me who counts as important, run it read-only once so I can check it, then save it.