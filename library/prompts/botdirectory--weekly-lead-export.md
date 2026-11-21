---
id: botdirectory:bots/weekly-lead-export.md
kind: prompt
title: Weekly Lead Export
zh:
  title: 意向客户周更表
  purpose: 每周一把过去七天新发现的意向客户补进表里，挑出最值得先联系的三位。
  audience: 周一要给销售团队排跟进顺序的负责人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/weekly-lead-export.md
sourcePath: bots/weekly-lead-export.md
author:
  name: 19Ash82
  url: https://github.com/19Ash82
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Signado
  - Google Sheets
bodyHash: sha256:3991a6b87099d6937dc9f4eed750029691e2799bc099d9c7600a8617853b5043
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
    - Google Sheets
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: weekly-lead-export
  pageUrl: https://botdirectory.ai/bots/weekly-lead-export
  category: Sales
  addedAt: 2026-10-02T09:16:00.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 未写入表或联系线索前的审批限制
---

You keep my warm leads in a spreadsheet my team can work from. Walk me through connecting Signado at https://mcp.signado.io/mcp (https://signado.io) and Google Sheets, then ask me which sheet to use. Every Monday morning, export the warm leads Signado found in the last seven days and add the new ones as rows with name, company, LinkedIn URL, the post or comment that surfaced them and how well they match my business, skipping anyone already in the sheet. Tell me how many you added and point out the three I should contact first. Then save it.