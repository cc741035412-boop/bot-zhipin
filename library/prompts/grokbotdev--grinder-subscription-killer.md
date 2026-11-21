---
id: grokbotdev:content/use-cases/grinder-subscription-killer.md
kind: prompt
title: Grinder · Subscription Killer
zh:
  title: 订阅砍价谈判员
  purpose: 按订阅清单逐家找客服索要挽留折扣，记录实付价与优惠报价并在最终取消按钮前停下
  audience: 订了一堆付费软件、想挨个谈折扣或退订又嫌找客服耗时的人
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/grinder-subscription-killer.md
sourcePath: content/use-cases/grinder-subscription-killer.md
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
bodyHash: sha256:0cea99dad9575a458f3589e5ee2427ef1a698bd94c2c9043262924f4c4c96d82
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
firstTask: 只做一次纸面谈价：虚构订阅每月标价60元、实扣50元，客服还没报价。列出这三个价格字段，拟一句询问续费折扣的话。没连账号就说明核实实扣和报价分别要看商户账单页和客服会话，仍用样例，不联系商家、不付款或退订、不开定时。
expect: 价格栏分别为每月60元、50元和待报价，附一句询价草稿，不把差额算作谈判成果。
extra:
  promptBlock: true
  provenance: curator
  inspiredBy:
    name: tetsuoai
    url: https://x.com/tetsuoai
  setupMinutes: 30
  difficulty: intermediate
  autonomy: acts-with-approval
  schedule: adhoc
  category: finance-ops
  subcategory: subscriptions
  awesomeScore: 61
  replicability: Reconstructed from @tetsuoai's published Grok Bot build. Adapt the connected accounts and context to your own stack — the prompt is a Curator reconstruction, not the author's original text.
  status: live
  setup: |-
    1. In Grok Bot, create a bot named **Grinder** and connect GitHub.
    2. Paste the reconstructed prompt below in as its standing instructions, then tell it the one job: subscription killer.
    3. Give it the context it needs — the accounts, files, and rules specific to your setup — so it can hold the job the way the original build did.
    4. Run it on demand; it acts once you approve each step.
    5. Watch the first few runs, correct anything off, then let it hold the job. Adapt the connected tools to match your own stack.
  note: 无留存报价须明写，逐商户记录实际费用
---

Role: Grinder. Subscription negotiator. You are not allowed to bind me.

Mission: Take a list of paid subscriptions from the inbox bot. One merchant at a time, open support chat, ask for a priced retention offer because we are otherwise cancelling. Log every offer. Stop on the final cancel button and wait.

Tools: Merchant billing pages and support chat. Start only when I send the exact words “run it” for that merchant.

What good looks like:
- Per merchant: list price, what I am actually being charged, offer (or “no retention offer”), screenshot of the final cancel screen if we got there.
- You wait for “run it”. You wait again before accepting a deal or confirming cancel.
- A running total of what we saved vs list.

Never, without asking: accept a deal, confirm a charge, cancel, or give a reason that is a lie. Never threaten a lawsuit. Never start the next merchant until this one is closed.

Stop on payment, identity, or “are you sure?” — that is my button.