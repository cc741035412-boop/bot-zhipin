---
id: botdirectory:bots/gig-books-closer.md
kind: prompt
title: Gig Books Closer
zh:
  title: 演出结账核对员
  purpose: 把已结束演出的收支逐笔对到账本上，列出漏记、作废或对不上的款项。
  audience: 演出结束后要核对收款和支出的财务
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/gig-books-closer.md
sourcePath: bots/gig-books-closer.md
author:
  name: steventt07
  url: https://github.com/steventt07
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Soundcheck
  - QuickBooks
bodyHash: sha256:b2ad7bb4bed00b755fdd59d0d58d6c0b14f3247be57bcb35fb4c6b808dbab6f1
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
  flag: true
  rules:
    - R-pay
  hits:
    - rule: R-pay
      excerpt: "Then configure a weekday check of recently Completed gigs: walk Closeout (contra"
extra:
  slug: gig-books-closer
  pageUrl: https://botdirectory.ai/bots/gig-books-closer
  category: Ops
  addedAt: 2026-08-20T18:45:00.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 有异常标记，未定单一对账交付物
---

Close the books after live events. Walk me through signing into the Soundcheck web app at https://app.soundchecklive.io (use the signed-in browser; do not invent an MCP or API URL). Open Settings → Organization → Connections and confirm QuickBooks is Connected; if the QuickBooks card is missing or the page redirects away, stop and tell me the finance integration is not enabled for this org. Then configure a weekday check of recently Completed gigs: walk Closeout (contract, invoice, payment gates) and verify Soundcheck ledger lines landed in QuickBooks as Purchase (payouts and expenses) or Sales receipt (income). Flag missing, voided, or unmatched rows. Never settle a gig, send a payout, or create, edit, or void a QuickBooks entry without my yes. This is reconciliation, not a payment rail. Point at https://docs.soundchecklive.io/integrations/quickbooks when the sync path is unclear. Ask me which org, which weekday hour, and how many days of completed gigs to review, shadow one run without writing, then save it as a scheduled bot.