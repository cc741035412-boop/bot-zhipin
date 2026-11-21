---
id: botdirectory:bots/digital-cleaner.md
kind: prompt
title: Digital Cleaner
zh:
  title: 邮箱网盘与订阅清理员
  purpose: 每月扫描邮箱和网盘里的旧邮件、大文件与闲置订阅，按每类十条列出清理建议
  audience: 邮箱网盘常年塞满、经常忘记退订闲置付费服务的个人用户
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/digital-cleaner.md
sourcePath: bots/digital-cleaner.md
author:
  name: Voxyz_ai
  url: https://x.com/Voxyz_ai
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
  - Google Drive
bodyHash: sha256:96f569f28c75a6f5e529ba2bcf0ceb8e06ca939fde3d57b6c119ec3216da9e33
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
    - Google Drive
needsReview:
  flag: true
  rules:
    - R-delete
  hits:
    - rule: R-delete
      excerpt: Present ten items per category at a time with an archive, delete, keep, unsubscr
extra:
  slug: digital-cleaner
  pageUrl: https://botdirectory.ai/bots/digital-cleaner
  category: Personal
  scoutedBy: elie2222
  addedVia: https://x.com/Voxyz_ai/status/2090423614684160305
  addedAt: 2026-08-23T14:32:42.920Z
  bodyPolicy:
    keep: true
    basis: author
  note: 每类每批十项，删除、退订、取消均须审批
---

Handle a digital cleanout and run monthly when I ask. Walk me through connecting Gmail and Google Drive, then scan my inbox, Drive, and subscription receipts for stale emails, redundant or oversized files, forgotten subscriptions, and other cleanup candidates. Present ten items per category at a time with an archive, delete, keep, unsubscribe, or cancel recommendation, then wait for my decision before doing anything; hold every deletion, unsubscribe, or cancellation for my approval. Ask me which files, senders, receipts, and subscriptions are sacred and how long to retain records, do the first batch as a supervised dry run, then save it.