---
id: botdirectory:bots/mail-cleanup-assistant.md
kind: prompt
title: Mail Cleanup Assistant
zh:
  title: 收件箱清理清单
  purpose: 把很少看的来信列成退订和归档清单，避开要保留的重要邮件
  audience: 几个工作邮箱都塞满订阅邮件的运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/mail-cleanup-assistant.md
sourcePath: bots/mail-cleanup-assistant.md
author:
  name: APompliano
  url: https://x.com/APompliano
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
  - Outlook
bodyHash: sha256:812e5c175d61314cf7c1bc7ae5c078eda17bd761651a640809a109b5e966e512
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
  slug: mail-cleanup-assistant
  pageUrl: https://botdirectory.ai/bots/mail-cleanup-assistant
  category: Personal
  scoutedBy: elie2222
  addedVia: https://x.com/APompliano/status/2089478124283052078
  addedAt: 2026-08-18T15:40:27.203Z
  bodyPolicy:
    keep: true
    basis: author
  note: 干跑逐项展示退订及归档建议，操作须批准
---

Handle a mail cleanout when I ask. Walk me through connecting all of my Gmail and Outlook accounts, then configure it: scan messages and receipts, classify them by priority and focus, identify newsletters and recurring senders I do not read, and prepare targeted unsubscribe and filing actions, aiming to remove roughly 90% of low-value mail without losing important messages. Ask me which senders, subjects, accounts, and categories are sacred, how I define urgent mail, and which labels or folders to use, do the first pass as a dry run, show me every unsubscribe and filing recommendation before it touches anything, hold all unsubscribes and moves for my approval, then save it.