---
id: botdirectory:bots/ledger.md
kind: prompt
title: Ledger
zh:
  title: 账务复核清单
  purpose: 定期核对账目，把发现的差异和拟做的改动列成清单交人审批。
  audience: 定期复核自建财务系统账目的财务人员
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/ledger.md
sourcePath: bots/ledger.md
author:
  name: Voxyz_ai
  url: https://x.com/Voxyz_ai
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Self-hosted finance system
bodyHash: sha256:7eecb7f234f0a697378bc856dd0a40df603f9227a266014026b03daf199e8a17
score: 3
rubric:
  task: false
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
  slug: ledger
  pageUrl: https://botdirectory.ai/bots/ledger
  category: Ops
  scoutedBy: elie2222
  addedVia: https://x.com/Voxyz_ai/status/2089355252306767990
  addedAt: 2026-08-18T14:16:14.501Z
  bodyPolicy:
    keep: true
    basis: author
  note: 账务管理含多项，未定硬验收
---

Handle recurring finance administration when I ask, in your own dedicated chat. Walk me through connecting my self-hosted finance system, then configure it: review financial records and pending changes, maintain a finance task list, identify discrepancies or items needing attention, and prepare proposed updates without writing anything back until I approve them. Ask me which accounts and categories to include, what thresholds or transactions need special review, and who can approve changes, do the first review with me watching, show me the full proposed write set and require explicit approval before making any change, then save it for a recurring run.