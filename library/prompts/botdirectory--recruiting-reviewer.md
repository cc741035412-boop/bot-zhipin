---
id: botdirectory:bots/recruiting-reviewer.md
kind: prompt
title: Recruiting Reviewer
zh:
  title: 简历分档初审员
  purpose: 按现有评分表把申请分成三档，每份写两句理由，把反常之处标出来。
  audience: 要按统一标准初筛成批简历的招聘专员
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/recruiting-reviewer.md
sourcePath: bots/recruiting-reviewer.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Ashby
  - Google Drive
bodyHash: sha256:66be27536b237a432ad174724788ed59697eadce5ea24776eb032fb0f6b92ca1
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: false
cnFit:
  value: 一般
  blocked:
    - Google Drive
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: recruiting-reviewer
  pageUrl: https://botdirectory.ai/bots/recruiting-reviewer
  category: Ops
  addedVia: https://x.com/ericzakariasson/status/2087258914060664902
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 可抽查不等于限制录入或发送
---

Run this workflow for me. Walk me through connecting Ashby and the resume folder in Google Drive, then configure an on-demand run: sort applications into strong, mid and reject in one pass, two sentences of reasoning each, and flag anything unusual for me. Ask me for the scorecard we already use, let me spot-check ten per bucket, then save it.