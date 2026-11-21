---
id: botdirectory:bots/call-coach.md
kind: prompt
title: Call Coach
zh:
  title: 销售通话复盘教练
  purpose: 每次通话后在Gong里按时间戳标出抢话、漏信号和漏提问处，并给两条下次练习建议
  audience: 用Gong录销售电话并希望改进沟通话术的销售代表
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/call-coach.md
sourcePath: bots/call-coach.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gong
bodyHash: sha256:1ffbd0e6e4cbd1b9dfc82673049be6c76aa8db0443fa01ad9c39e9f4eec5bacb
score: 3
rubric:
  task: true
  input: true
  steps: false
  acceptance: true
  approval: false
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: call-coach
  pageUrl: https://botdirectory.ai/bots/call-coach
  category: Sales
  addedVia: https://x.com/ericzakariasson/status/2087258914060664902
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 按时间戳给点评不构成三步流程，未限制发评
---

Run automatically after each of my calls. Walk me through connecting Gong, then configure it: leave timestamped comments where I talked over someone, missed a buying signal or skipped discovery, and end with two things to practise before the next call. Ask me which methodology we run, coach one past call so I can read it end to end, then save it.