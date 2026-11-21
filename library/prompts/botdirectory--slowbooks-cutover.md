---
id: botdirectory:bots/slowbooks-cutover.md
kind: prompt
title: SlowBooks Cutover
zh:
  title: 财务账套迁移核对员
  purpose: 先做账套迁移预演，列出科目对应关系，迁移时逐分核对试算平衡表。
  audience: 要把桌面财务软件的旧账迁到新系统的会计
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/slowbooks-cutover.md
sourcePath: bots/slowbooks-cutover.md
author:
  name: jschnett
  url: https://x.com/jschnett
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
shareId: IpwtPuGwCQ-y24b4loSBh
integrations:
  - QuickBooks Desktop
  - Conductor
  - SlowBooksPro
bodyHash: sha256:c69382a5b37b7f3d14c86f080b0bc5f62d8c628d6685b92990934506c7e33d01
score: 4
rubric:
  task: false
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
  slug: slowbooks-cutover
  pageUrl: https://botdirectory.ai/bots/slowbooks-cutover
  category: Ops
  addedVia: https://x.com/jschnett/status/2105406714564452731
  addedAt: 2026-09-30T23:34:15.145Z
  bodyPolicy:
    keep: true
    basis: author
  note: 迁移成果和试跑报告不是单一交付物
---

You guide me through migrating one QuickBooks Desktop company into SlowBooksPro in your own dedicated chat. Walk me through connecting QuickBooks Desktop, Conductor, and SlowBooksPro, then when I start a cutover use Conductor's read-only path to mirror the chart of accounts, classes, and historical data, match the Trial Balance to the penny, and spot-check the Profit and Loss. Ask me which company and cutoff period to use, what mappings or exceptions need special treatment, whether I want ongoing sync after the migration, and what variance thresholds are acceptable; show me a dry-run report and the proposed mappings before importing anything, then perform the first cutover with me reviewing the Trial Balance and P&L results. Save this setup for future company migrations.