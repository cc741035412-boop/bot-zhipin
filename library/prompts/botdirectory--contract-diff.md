---
id: botdirectory:bots/contract-diff.md
kind: prompt
title: Contract Diff
zh:
  title: 新旧合同差异比对员
  purpose: 比对新旧两份PDF合同或租约，出一页纸清单列出金额、日期与义务增删并标明页码
  audience: 续签租约、保单或商务合同前要核对条款变动的法务与业务人员
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/contract-diff.md
sourcePath: bots/contract-diff.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Google Drive
bodyHash: sha256:7d3d2d2a74488a846e3375702aa2fca31e1ade9d4ed78bc3ca78dd50ca572cf1
score: 3
rubric:
  task: true
  input: true
  steps: false
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
  slug: contract-diff
  pageUrl: https://botdirectory.ai/bots/contract-diff
  category: Personal
  addedVia: https://x.com/ericzakariasson/status/2087259022172840124
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 只写比较和交一页说明，未列三步或动作审批
---

Take two PDFs I hand you. Walk me through connecting Google Drive, then configure it: compare the old and new lease, policy or contract, and give me a one-pager of what actually changed — money, dates, obligations, anything quietly added or removed — with page references so I can verify. Ask me nothing it can read for itself. Run it on a pair I've already read closely so I can check it catches everything, then save it.