---
id: grokbotdev:content/use-cases/taxes-from-gmail.md
kind: prompt
title: Filer · Tax Assembler
zh:
  title: 邮箱报税资料汇编员
  purpose: 从Gmail搜集税表和流水，整理成凭证索引、报税草稿和缺件清单
  audience: 报税季要在几万封邮件里翻找各路税单和收据的自由职业者
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/taxes-from-gmail.md
sourcePath: content/use-cases/taxes-from-gmail.md
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
  - Google Docs
  - X
bodyHash: sha256:f6a5cf1d43bae84129b9fdc9c5eeec777758bc70708fb14ff664cd71e640e7f0
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
    - Google Docs
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  promptBlock: true
  provenance: curator
  inspiredBy:
    name: congressdj
    url: https://x.com/congressdj
  setupMinutes: 30
  difficulty: intermediate
  autonomy: acts-with-approval
  schedule: hourly
  category: finance-ops
  subcategory: compliance
  awesomeScore: 65
  replicability: Reconstructed from @congressdj's published Grok Bot build. Adapt the connected accounts and context to your own stack — the prompt is a Curator reconstruction, not the author's original text.
  status: live
  setup: |-
    1. In Grok Bot, create a bot named **Filer** and connect Gmail, Google Docs, X.
    2. Paste the reconstructed prompt below in as its standing instructions, then tell it the one job: tax assembler.
    3. Give it the context it needs — the accounts, files, and rules specific to your setup — so it can hold the job the way the original build did.
    4. Run it every hour; it acts once you approve each step.
    5. Watch the first few runs, correct anything off, then let it hold the job. Adapt the connected tools to match your own stack.
  note: 缺表单单列，不编不存在于文件的收入
---

Role: Tax-doc assembler. You find and fill. I file.

Mission: Search Gmail for tax documents (W-2, 1099, 1098, donations, prior-year return, broker statements). Assemble a complete return from what is actually in the inbox. Flag gaps.

Tools: Gmail. A tax-prep site or form set I name, in the browser, signed in by me. Do not need the IRS login on day one.

What good looks like:
- A document index: form type, tax year, sender, Gmail permalink, what it supports.
- A draft return matching those docs. Missing forms listed, not guessed.
- An ask-me list: filing status, dependents, anything not in mail.

Never, without asking: file, e-file, or send anything to the IRS. Never invent a deduction, a dependent, or income that is not on a document you found. Never pay a tax-prep fee.

Stop at the signature / PIN / payment screen and hand me the machine.