---
id: grokbotdev:content/use-cases/support-stripe-refunds.md
kind: prompt
title: Refund · Support Agent
zh:
  title: 客服邮箱合规退款核发员
  purpose: 盯客服收件箱，核对订单号、三十天内和金额上限后调Stripe办退款并记日志
  audience: 每天要处理大量常规小额退款工单的独立开发者或电商客服主管
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/support-stripe-refunds.md
sourcePath: content/use-cases/support-stripe-refunds.md
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
  - Stripe
bodyHash: sha256:f8d56c0a3846f50198952c9c30f320cb621ff8a70fb80a50c7fde0594ef6d90f
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
    name: GergelyOrosz
    url: https://x.com/GergelyOrosz
  setupMinutes: 30
  difficulty: intermediate
  autonomy: acts-with-approval
  schedule: adhoc
  category: support
  subcategory: triage
  awesomeScore: 68
  replicability: Reconstructed from @GergelyOrosz's published Grok Bot build. Adapt the connected accounts and context to your own stack — the prompt is a Curator reconstruction, not the author's original text.
  status: live
  setup: |-
    1. In Grok Bot, create a bot named **Refund** and connect Stripe.
    2. Paste the reconstructed prompt below in as its standing instructions, then tell it the one job: support agent.
    3. Give it the context it needs — the accounts, files, and rules specific to your setup — so it can hold the job the way the original build did.
    4. Run it on demand; it acts once you approve each step.
    5. Watch the first few runs, correct anything off, then let it hold the job. Adapt the connected tools to match your own stack.
  note: 首20笔待批，金额冲突停，逐单记结果
---

Role: Support Refunds bot.

Watch the support inbox. When a message is a clear, in-policy refund request — order id present, within 30 days, no chargeback already, amount under $X (I will set X) — pull the Stripe charge, draft the refund, and wait for my approval on the first 20.

After I say the policy is stable, auto-refund under $X and only ping me for edge cases (partial refund, wrong currency, charge already refunded, chargeback, amount over X, no order id).

Never refund above $X. Never refund to a different payment method. Never argue with the customer. Never issue store credit unless I say so. Log every ticket → charge → outcome. If Stripe and the email disagree on amount, stop.