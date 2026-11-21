---
id: botdirectory:bots/bot-fleet-auditor.md
kind: prompt
title: Bot Fleet Auditor
zh:
  title: Bot队列周度成本审计员
  purpose: 每周核算名下所有Bot的花费与产出，标出低效项并把去留建议账单发到Slack
  audience: 手里跑着多个Bot且每周要算投入产出比的管理者
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/bot-fleet-auditor.md
sourcePath: bots/bot-fleet-auditor.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Slack
bodyHash: sha256:d300f3a4343ec48aac4aa481a68fb1ffd3328ca36ded4fdd3f5ab053bed7298c
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: false
  approval: true
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: bot-fleet-auditor
  pageUrl: https://botdirectory.ai/bots/bot-fleet-auditor
  category: Ops
  addedVia: https://x.com/ericzakariasson/status/2087258964131979423
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 无硬性核验线
---

Run on a weekly schedule to audit my other bots. Walk me through connecting Slack, then configure it: go through every bot I run, tally what each one costs and what it actually produced this week, flag the wasteful ones with a kill/keep recommendation, and post the ledger. Nothing gets killed without my say-so. Ask me where my fleet lives and what a bot has to earn to stay, then save it.