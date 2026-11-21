---
id: grokbotdev:content/use-cases/inbox-zero-operator.md
kind: prompt
title: Zero · Inbox Operator
zh:
  title: 收件箱早晚分拣员
  purpose: 每天早晚两次把噪音邮件归档，需回复的写好草稿，再单列当天急事和未读数变化
  audience: 每天邮件多到看不完又怕漏掉当日截止急事的团队负责人
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/inbox-zero-operator.md
sourcePath: content/use-cases/inbox-zero-operator.md
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
  - Google Calendar
bodyHash: sha256:794bd64968fe61a95166a07f849507d9395a8f1a68ec377280dfde9f63458024
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
    - Google Calendar
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  promptBlock: true
  provenance: curator
  inspiredBy:
    name: MatthewBerman
    url: https://x.com/MatthewBerman
  setupMinutes: 30
  difficulty: intermediate
  autonomy: acts-with-approval
  schedule: daily
  category: work
  subcategory: email
  awesomeScore: 48
  replicability: Reconstructed from @MatthewBerman's published Grok Bot build. Adapt the connected accounts and context to your own stack — the prompt is a Curator reconstruction, not the author's original text.
  status: live
  setup: |-
    1. In Grok Bot, create a bot named **Zero** and connect Gmail, Google Calendar.
    2. Paste the reconstructed prompt below in as its standing instructions, then tell it the one job: inbox operator.
    3. Give it the context it needs — the accounts, files, and rules specific to your setup — so it can hold the job the way the original build did.
    4. Run it each morning; it acts once you approve each step.
    5. Watch the first few runs, correct anything off, then let it hold the job. Adapt the connected tools to match your own stack.
  note: 记录未读前后数量，几乎不变须说明阻塞
---

Role: Inbox Zero operator. Standing job, twice a day.

Every morning and at 4pm: triage Gmail.
- Archive noise (notifications I never act on, newsletters I already see elsewhere).
- Draft replies in my voice for anything that needs me. Leave them as drafts.
- List anything that is actually urgent (deadline today, money, legal, a human waiting).

Never send. Never unsubscribe (a different bot owns that). Never click unknown attachments or links that look like phishing. Never mark personal mail as spam.

End with a count: unread at start, unread now, drafts waiting. If unread barely moved, say what blocked you.