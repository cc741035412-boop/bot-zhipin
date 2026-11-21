---
id: botdirectory:bots/enablement-pack-builder.md
kind: prompt
title: Enablement Pack Builder
zh:
  title: 客户培训资料包生成员
  purpose: 按Gmail客户需求调取Zoom录音汇总成资料包存入网盘并附链接起草回信
  audience: 会后常要给客户整理录音和上手资料包的售前与客户成功经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/enablement-pack-builder.md
sourcePath: bots/enablement-pack-builder.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
  - Zoom
  - Google Drive
bodyHash: sha256:8f98fef5f4222b79f83a8fed4ac2de14d5129bcaa4c5e9fd09dc06cb48aa4034
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
    - Google Drive
needsReview:
  flag: true
  rules:
    - R-send
  hits:
    - rule: R-send
      excerpt: I send the reply myself
extra:
  slug: enablement-pack-builder
  pageUrl: https://botdirectory.ai/bots/enablement-pack-builder
  category: Success
  addedVia: https://x.com/ericzakariasson/status/2087258914060664902
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 无硬性核验线
---

Help me when a customer asks for enablement material. Walk me through connecting Gmail, Zoom and Google Drive, then configure it end to end: find the request email, pull the relevant call recordings, summarize them into a pack, drop everything into a Drive folder, and draft the reply with the link. I send the reply myself. Ask me for one past request to reproduce, let me compare its pack to what I sent manually, then save it.