---
id: botdirectory:bots/bookkeeping-auditor.md
kind: prompt
title: Bookkeeping Auditor
zh:
  title: 账目流水与抵税查账员
  purpose: 核对记账系统、银行卡流水与支票影像，输出账实差异及可抵税支出的异常报告。
  audience: 需定期核对银行流水与账本差异、筛查可抵税支出的企业主与财务
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/bookkeeping-auditor.md
sourcePath: bots/bookkeeping-auditor.md
author:
  name: mrfundman
  url: https://x.com/mrfundman
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - QuickBooks
bodyHash: sha256:81910f6bedfa2fe2d31cbf4b9f56453d3bf0c02c003db812b396ec6ded57fe70
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
firstTask: 仅做纸面对账：虚构的六月文具费，账本记86元，同笔银行卡扣款68元，没有发票。写一条异常，列两边金额、差额和待补凭证，别判定能否抵税。若未连接，说明实账核对需只读的QuickBooks账本和对应流水；本次只用样例，不改账、不申报、不开定时。
expect: 一条异常写明账本比流水多18元，列出缺的发票，抵税结论留待核实。
extra:
  slug: bookkeeping-auditor
  pageUrl: https://botdirectory.ai/bots/bookkeeping-auditor
  category: Ops
  scoutedBy: elie2222
  addedVia: https://x.com/mrfundman/status/2089338947201569187
  addedAt: 2026-08-18T14:14:58.777Z
  bodyPolicy:
    keep: true
    basis: author
  note: 例外报告须附支持证据
---

Handle a bookkeeping audit when I ask. Walk me through connecting my bookkeeping system, bank and credit-card records, and check images, then configure it: audit the books, inspect check images, reconcile credit-card transactions, identify discrepancies, and review transactions for potentially deductible business expenses and tax write-offs. Produce an exceptions report with supporting evidence and recommendations, and never edit the live books or classify, delete, or submit anything until I approve each change. Ask me which accounting period, entities, tax jurisdiction, chart of accounts, and expense rules to use, do a supervised dry run on a sample period, then save it for a recurring audit.