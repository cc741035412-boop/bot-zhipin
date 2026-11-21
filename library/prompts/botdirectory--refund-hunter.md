---
id: botdirectory:bots/refund-hunter.md
kind: prompt
title: Refund Hunter
zh:
  title: 退款到账核对员
  purpose: 每周对照退款邮件和原订单，列出还差多少钱、哪笔该催。
  audience: 取消过多项订阅又记不清退款进度的人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/refund-hunter.md
sourcePath: bots/refund-hunter.md
author:
  name: Voxyz_ai
  url: https://x.com/Voxyz_ai
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
bodyHash: sha256:7615dad15e946450e2f82924b11da23d5cf67caf57113f265a73d04fbfe8ce82
score: 5
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: true
cnFit:
  value: 一般
  blocked:
    - Gmail
needsReview:
  flag: true
  rules:
    - R-pay
  hits:
    - rule: R-pay
      excerpt: Walk me through connecting Gmail, then scan refund and cancellation messages, ma
extra:
  slug: refund-hunter
  pageUrl: https://botdirectory.ai/bots/refund-hunter
  category: Personal
  scoutedBy: elie2222
  addedVia: https://x.com/Voxyz_ai/status/2090423614684160305
  addedAt: 2026-08-23T14:32:42.920Z
  bodyPolicy:
    keep: true
    basis: author
  note: 报告依据原交易匹配应退实退金额及日期
---

Help me when I receive a refund, cancellation, or billing email, and run weekly to find money that should have come back. Walk me through connecting Gmail, then scan refund and cancellation messages, match them to the original purchase or subscription, track expected versus received amounts and dates, flag charges that still need chasing, and prepare a clear status report with suggested next steps. Ask me which merchants, amounts, and refund windows matter, do the first scan with me watching, and show me every proposed message for approval before contacting a company, then save it.