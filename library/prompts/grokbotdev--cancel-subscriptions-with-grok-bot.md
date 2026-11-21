---
id: grokbotdev:content/use-cases/cancel-subscriptions-with-grok-bot.md
kind: prompt
title: Canceler · Subscription Killer
zh:
  title: 订阅退订代办
  purpose: 把指定套餐的退订详情给你过目，点头后才退，办完交回退订凭据和生效日。
  audience: 想停掉某项自动续费服务的订阅者
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/cancel-subscriptions-with-grok-bot.md
sourcePath: content/use-cases/cancel-subscriptions-with-grok-bot.md
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
bodyHash: sha256:4ce7fa506e658d8a76aff18a7503b04d0bbe5f9c8ffbeb23068489a3183d6ff2
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
    name: morganlinton
    url: https://x.com/morganlinton
  setupMinutes: 10
  difficulty: beginner
  autonomy: acts-with-approval
  schedule: adhoc
  category: finance-ops
  subcategory: subscriptions
  awesomeScore: 77
  replicability: Morgan describes the outcome, not a prompt; the setup below is a curator reconstruction. Give your bot access to your email and a browser, name the exact service to cancel, and let it work - the resourcefulness (using a magic sign-in link when a normal login fails) is emergent, not scripted.
  status: live
  setup: |-
    Cancelling a subscription is one of those small, annoying jobs that companies deliberately make hard. Morgan Linton just handed it to his Grok Bot - and the interesting part isn't that it worked, it's *how* it worked. The bot couldn't log in to the account, but rather than getting stuck and pinging him, it went looking for another way in: it found a "manage plan" link in one of the service's emails, had a one-time sign-in link sent to the inbox, used that to get in, and cancelled. He literally had to ask the bot afterward how it had done it.

    To set this up you don't need much: a Grok Bot with access to your email and a browser. You name the service you want gone, and it works the account the way a determined human would - trying the normal path first, then finding a legitimate workaround when the front door is locked. The prompt below adds one guardrail Morgan's story didn't need but you'll want: confirm the exact thing being cancelled before the final, irreversible click.
  note: 取消后须取确认邮件或编号并给生效日期
---

I want you to cancel a subscription / service for me: [SERVICE NAME, and the email or account it's under].

You have access to my email and a browser. Handle it like this:
1. Find the account and the cancellation path - check the service's site and my inbox for anything relevant (billing receipts, "manage plan" or account emails).
2. Try to cancel through the normal account settings first.
3. If a normal login does not work, do not get stuck and do not give up - look for a legitimate workaround: a "manage subscription/plan" link in one of their emails, or request a one-time sign-in / magic link to my inbox and use that to get in.
4. Before you click the final, irreversible "cancel" button, show me exactly what you are about to cancel (the service, the plan, any end date or refund note) and get my OK.
5. After it is done, confirm the cancellation (grab the confirmation email or number) and tell me the effective date.

Rules: only touch the ONE service I named - never cancel or change anything else. If you genuinely cannot complete it, tell me exactly where you got stuck and what you need from me.