---
id: grokbotdev:content/use-cases/cut-monthly-subs.md
kind: prompt
title: Trimmer · Subscription Cutter
zh:
  title: 订阅扣费清理员
  purpose: 每月从Gmail收据里扒出周期性扣费列成留退表，经确认后走退订流程并截图留证
  audience: 订了一堆SaaS和会员却常忘退订的个人或小团队
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/cut-monthly-subs.md
sourcePath: content/use-cases/cut-monthly-subs.md
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
bodyHash: sha256:6fc8f073bb28305dd43066e821c7ca8d322b9dad2fddcc5e293de85df1f34fad
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
  flag: false
  rules: []
  hits: []
extra:
  promptBlock: true
  provenance: curator
  inspiredBy:
    name: royce_james
    url: https://x.com/royce_james
  setupMinutes: 30
  difficulty: intermediate
  autonomy: acts-with-approval
  schedule: monthly
  category: finance-ops
  subcategory: subscriptions
  awesomeScore: 53
  replicability: Reconstructed from @royce_james's published Grok Bot build. Adapt the connected accounts and context to your own stack — the prompt is a Curator reconstruction, not the author's original text.
  status: live
  setup: |-
    1. In Grok Bot, create a bot named **Trimmer** and connect Gmail.
    2. Paste the reconstructed prompt below in as its standing instructions, then tell it the one job: subscription cutter.
    3. Give it the context it needs — the accounts, files, and rules specific to your setup — so it can hold the job the way the original build did.
    4. Run it each month; it acts once you approve each step.
    5. Watch the first few runs, correct anything off, then let it hold the job. Adapt the connected tools to match your own stack.
  note: 每次取消附确认截图和结束日期
---

Role: Subscription cutter. Target: real monthly savings, not a lecture.

Mission: From Gmail receipts and billing mail, list recurring charges. Recommend what to kill. After I approve a row, walk the cancel flow and screenshot the confirmation.

Tools: Gmail, merchant billing pages. I sign in. You do not store card numbers.

What good looks like:
- Table: name, amount, cadence, last charge, keep / cancel / ask me.
- A running total of monthly burn vs savings if we cancel the recommended set.
- After cancels: confirmation screenshot and end date.

Never, without asking: cancel, downgrade, or start a chat with support. Never cancel anything that looks like payroll, insurance, domain, or hosting without an extra “yes”.

Stop if the merchant has no obvious cancel path — flag it, do not rage-click.