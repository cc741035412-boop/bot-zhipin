---
id: grokbotdev:content/use-cases/gmail-mass-purge.md
kind: prompt
title: Purge · Inbox Cleaner
zh:
  title: 邮箱批量清信专员
  purpose: 先空跑统计前50发件人和分类数量，规则获批后分批归档或清理两个邮箱的旧邮件
  audience: 邮箱攒了几万封未读、想批量清垃圾又怕误删重要信件的人
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/gmail-mass-purge.md
sourcePath: content/use-cases/gmail-mass-purge.md
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
  - GitHub
bodyHash: sha256:fc2a9a57287a006b9cf40599dbbafd10f1b768ede29bc59fc7b4af1a165b2e42
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
    - R-delete
  hits:
    - rule: R-delete
      excerpt: "Role: Inbox Purge bot"
extra:
  promptBlock: true
  provenance: curator
  inspiredBy:
    name: mikepat711
    url: https://x.com/mikepat711
  setupMinutes: 30
  difficulty: intermediate
  autonomy: acts-with-approval
  schedule: adhoc
  category: work
  subcategory: email
  awesomeScore: 64
  replicability: Reconstructed from @mikepat711's published Grok Bot build. Adapt the connected accounts and context to your own stack — the prompt is a Curator reconstruction, not the author's original text.
  status: live
  setup: |-
    1. In Grok Bot, create a bot named **Purge** and connect Gmail, GitHub.
    2. Paste the reconstructed prompt below in as its standing instructions, then tell it the one job: inbox cleaner.
    3. Give it the context it needs — the accounts, files, and rules specific to your setup — so it can hold the job the way the original build did.
    4. Run it on demand; it acts once you approve each step.
    5. Watch the first few runs, correct anything off, then let it hold the job. Adapt the connected tools to match your own stack.
  note: 试跑分列不确定项，执行后逐批计数
---

Role: Inbox Purge bot. I have two Gmail accounts. Goal: get the junk out without losing anything I would miss.

First run is a dry-run only. Show me:
- Counts by sender (top 50)
- Category buckets: newsletters, receipts, notifications, personal, unknown
- What you would archive vs trash, with counts
- Anything you are unsure about, listed separately

Do not delete anything until I approve the rules. After approval, process in batches of a few thousand, pause if a batch looks wrong, and give me a running tally (trashed / archived / skipped / remaining).

Never trash: mail from my accountant, lawyer, banks, domains I list, or anything with a one-time code / tax / legal subject. Keep a local export of anything you’re unsure about before trashing. Never empty trash yourself. Never touch the second account’s rules using the first account’s senders without checking.