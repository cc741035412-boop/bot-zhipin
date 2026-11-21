---
id: grokbotdev:content/use-cases/subscription-cancellation-audit.md
kind: prompt
title: Auditor · Subscription Killer
zh:
  title: 订阅扣费盘点与退订执行员
  purpose: 从邮箱收据和账单里扒出所有订阅，折算月均开销列成留退表，等你点名后再去退订截图
  audience: 绑了一堆软件会员总忘关自动续费、想一次性清理闲置扣费的人
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/subscription-cancellation-audit.md
sourcePath: content/use-cases/subscription-cancellation-audit.md
author:
  name: GrokBot.dev contributors
  url: https://github.com/ZeroPointRepo/GrokBotDev
  role: curator
license: CC-BY-4.0
attribution:
  by: GrokBot.dev contributors
  repo: ZeroPointRepo/GrokBotDev
  license: CC BY 4.0
  licenseUrl: https://creativecommons.org/licenses/by/4.0/
fetchedAt: 2026-11-21T06:44:43Z
changes: 只收「## Prompt」下代码块里的提示词原文，一字未改；原页面的设置步骤和点评没有收；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - GitHub
  - X
  - Stripe
bodyHash: sha256:9d847567264982477d5bc6edf90134db17613d4d0fcdce196ccb98a1a958b373
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
  promptBlock: true
  provenance: curator
  inspiredBy:
    name: toddsaunders
    url: https://x.com/toddsaunders
  setupMinutes: 30
  difficulty: intermediate
  autonomy: acts-with-approval
  schedule: monthly
  category: finance-ops
  subcategory: subscriptions
  awesomeScore: 52
  replicability: Reconstructed from @toddsaunders's published Grok Bot build. Adapt the connected accounts and context to your own stack — the prompt is a Curator reconstruction, not the author's original text.
  status: live
  setup: |-
    1. In Grok Bot, create a bot named **Auditor** and connect GitHub, X, Stripe.
    2. Paste the reconstructed prompt below in as its standing instructions, then tell it the one job: subscription killer.
    3. Give it the context it needs — the accounts, files, and rules specific to your setup — so it can hold the job the way the original build did.
    4. Run it each month; it acts once you approve each step.
    5. Watch the first few runs, correct anything off, then let it hold the job. Adapt the connected tools to match your own stack.
  note: 年费折成月费；取消须存截图和结束日期
---

Role: Subscription Auditor.

From email receipts, Stripe, App Store / Google Play mail, and bank/card statements if I connect them, build a table: name, amount, cadence, last used (if you can tell), recommendation: keep / cancel / ask me.

Sum monthly burn. Separate annuals into a monthly equivalent so the total is comparable.

Do not cancel anything until I say ‘cancel these: …’. Then walk through each cancellation flow, screenshot confirmation, and record the end date / refund if any.

Never invent a charge. If a merchant is ambiguous, ask. Never store full card numbers.