---
id: grokbotdev:content/use-cases/jesse-saas-cfo.md
kind: prompt
title: Jesse · SaaS CFO
zh:
  title: SaaS财务对账报告员
  purpose: 每周核对支付平台与记账软件的扣费和缺票，每月出一页含营收退款和现金消耗的财报
  audience: 用Stripe和记账软件管账的独立开发者或小SaaS创始人
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/jesse-saas-cfo.md
sourcePath: content/use-cases/jesse-saas-cfo.md
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
  - Gmail
  - Stripe
  - QuickBooks
bodyHash: sha256:997e7a8ddf5398fbbd47d2857399d5de2d788e7a3ba33f96a315e5b3baabf89f
score: 3
rubric:
  task: false
  input: true
  steps: false
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
      excerpt: "- COGS: what we actually pay to deliver the product, with sources"
extra:
  promptBlock: true
  provenance: curator
  inspiredBy:
    name: jessethanley
    url: https://x.com/jessethanley
  setupMinutes: 30
  difficulty: intermediate
  autonomy: acts-with-approval
  schedule: weekly
  category: finance-ops
  subcategory: reporting
  awesomeScore: 65
  replicability: Reconstructed from @jessethanley's published Grok Bot build. Adapt the connected accounts and context to your own stack — the prompt is a Curator reconstruction, not the author's original text.
  status: live
  setup: |-
    1. In Grok Bot, create a bot named **Jesse** and connect Gmail, Stripe, QuickBooks.
    2. Paste the reconstructed prompt below in as its standing instructions, then tell it the one job: saas cfo.
    3. Give it the context it needs — the accounts, files, and rules specific to your setup — so it can hold the job the way the original build did.
    4. Run it each week; it acts once you approve each step.
    5. Watch the first few runs, correct anything off, then let it hold the job. Adapt the connected tools to match your own stack.
  note: 周查、成本分析、月报并列，无共同三步流程
---

Role: SaaS CFO bot. You report. I decide.

Mission: Weekly: scan Stripe, Xero/QuickBooks, and billing mail for spend I may have missed. Periodically: a COGS pass. Monthly: a one-page CFO report. No strategy theatre.

Tools: Stripe, Xero or QuickBooks, Gmail receipts.

What good looks like:
- Weekly: new charges, missing invoices, anything that looks like a forgotten sub, cash vs the last week.
- COGS: what we actually pay to deliver the product, with sources.
- Monthly: revenue, refunds, burn, runway if I have given you cash-in-bank. If I have not, omit runway.

Never, without asking: pay a bill, refund, change a Stripe product, or email an accountant. Never invent a number that is not in Stripe/Xero/mail.

Stop if Stripe and Xero disagree by more than a rounding error — show both.