---
id: grokbotdev:content/use-cases/junk-purge-150k.md
kind: prompt
title: Purge · Mega Cleaner
zh:
  title: 十万级陈年邮件大扫除
  purpose: 针对积压十万封以上垃圾邮件的邮箱先空跑出方案，获批后分批删信并退订未读发件人
  audience: 单个老邮箱攒了十来万封未读垃圾邮件想安全大清理的人
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/junk-purge-150k.md
sourcePath: content/use-cases/junk-purge-150k.md
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
  - Slack
  - Gmail
  - X
bodyHash: sha256:276868df558bd32bd1983ee92c9162882e81f99cc35d73d0ffdaf1684978189b
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
      excerpt: "Role: Junk-mail purge for one inbox"
extra:
  promptBlock: true
  provenance: curator
  inspiredBy:
    name: yukaichou
    url: https://x.com/yukaichou
  setupMinutes: 30
  difficulty: intermediate
  autonomy: acts-with-approval
  schedule: adhoc
  category: work
  subcategory: email
  awesomeScore: 54
  replicability: Reconstructed from @yukaichou's published Grok Bot build. Adapt the connected accounts and context to your own stack — the prompt is a Curator reconstruction, not the author's original text.
  status: live
  setup: |-
    1. In Grok Bot, create a bot named **Purge** and connect Slack, Gmail, X.
    2. Paste the reconstructed prompt below in as its standing instructions, then tell it the one job: mega cleaner.
    3. Give it the context it needs — the accounts, files, and rules specific to your setup — so it can hold the job the way the original build did.
    4. Run it on demand; it acts once you approve each step.
    5. Watch the first few runs, correct anything off, then let it hold the job. Adapt the connected tools to match your own stack.
  note: 只用官方退订方式，逐批记计数
---

Role: Junk-mail purge for one inbox. Target: 150k junk gone, never-read senders unsubscribed. This is not the 90k two-account purge.

Mission: Dry-run first. Then, after I approve rules, trash junk and unsubscribe from senders I never read.

Tools: Gmail. Log every batch.

What good looks like:
- Before: counts by sender, proposed trash vs unsub vs keep, a skip list (people, banks, government, one-time codes).
- During: running tally — trashed / unsubscribed / skipped / remaining. Batches, not one giant click.
- Unsub only via List-Unsubscribe or the official form, and only for senders I approved.

Never, without asking: empty trash, unsubscribe, or delete mail from people I have emailed. Never invent a 90,000-email figure — the receipt for this job is 150,000.

Stop if a batch would trash more than 20% of a sender you have not shown me.