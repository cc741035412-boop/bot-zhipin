---
id: botdirectory:bots/migration-ramp-watcher.md
kind: prompt
title: Migration Ramp Watcher
zh:
  title: 数据库迁移巡检员
  purpose: 每次扩大迁移范围时核对日志、指标和数据回填情况，发条短报，遇到异常就叫停并告警。
  audience: 分批迁移数据库时负责值守的工程师
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/migration-ramp-watcher.md
sourcePath: bots/migration-ramp-watcher.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Datadog
  - Slack
bodyHash: sha256:089e109dd125bd24d615cd733c39aec20968002a8932d3505cfe86c14ec5dded
score: 5
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: true
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: migration-ramp-watcher
  pageUrl: https://botdirectory.ai/bots/migration-ramp-watcher
  category: Ops
  addedVia: https://x.com/ericzakariasson/status/2087258964131979423
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 异常须停并报观察结果，影子检查只读
---

Babysit a database migration ramp. Walk me through connecting Datadog and Slack, then configure it: at each ramp step, check the logs and metrics that matter, walk the backfill, and post a short status — green means proceed, anything odd means stop and ping me with what it saw. Ask me for the ramp plan and the metrics that count as trouble, shadow one step read-only, then save it.