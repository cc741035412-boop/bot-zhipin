---
id: grokbotdev:content/use-cases/give-your-grok-bot-its-own-email-inbox.md
kind: prompt
title: One prompt that gives your Grok Bot its own email inbox and identity
zh:
  title: 独立邮箱配置向导
  purpose: 按步引导装好邮箱插件并建好专属收发信箱，发测试信并读回信跑通收发闭环
  audience: 不想把个人邮箱授权出去、要给它配独立收发信箱的人
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/give-your-grok-bot-its-own-email-inbox.md
sourcePath: content/use-cases/give-your-grok-bot-its-own-email-inbox.md
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
bodyHash: sha256:c56209921ce5520c8a1ee8c0bd949a4c2b9ec47bb81830f49010570b7dab18b4
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
    - R-credential
    - R-send
  hits:
    - rule: R-send
      excerpt: "First, explain briefly why this matters: my built-in Gmail plugin points at MY i"
    - rule: R-credential
      excerpt: "First, explain briefly why this matters: my built-in Gmail plugin points at MY i"
    - rule: R-credential
      excerpt: "From then on this inbox is YOURS: use it to sign yourself up for services (read "
extra:
  promptBlock: true
  provenance: curator
  inspiredBy:
    name: adisingh
    url: https://x.com/adisingh
  setupMinutes: 10
  difficulty: beginner
  autonomy: acts-with-approval
  schedule: adhoc
  category: work
  subcategory: email
  awesomeScore: 88
  replicability: Works with any Grok Bot plan that supports plugins (Cursor Ultra, SuperGrok Heavy, or Cursor Premium Teams) plus a free AgentMail account. The prompt walks you through each manual step and pauses; all you provide is the OAuth approval and your real email for the test.
  status: live
  setup: |-
    The idea, from AgentMail co-founder **Adi Singh**'s guide: your Grok Bot shouldn't run on your personal Gmail. That plugin points at *your* inbox, so any bot can read your private mail and 2FA codes and send as you - and one malformed email could prompt-inject it. Give the bot its own AgentMail inbox and that access stays contained.

    This use case packages his step-by-step into a single prompt. Paste it into a fresh bot and the bot becomes your setup guide - it explains the why, tells you exactly what to do on your end at each step, and pauses until you've done it:

    1. Confirm you're on a plugin-capable Grok Bot plan (Cursor Ultra, SuperGrok Heavy, or Cursor Premium Teams) and create a free account at **agentmail.to**.
    2. Open **Settings -> Plugins**, search for **AgentMail**, and click **Install**.
    3. Approve the **OAuth** prompt in your browser (it reads "Cursor wants to access AgentMail..." - that's expected). No API key to paste.
    4. Confirm the connector card shows AgentMail's tools, then let the bot take over: it creates its own inbox, tells you the address, and sends you a test email to prove the loop works end to end.
  note: 以测试邮件及同线程回复证明收发
---

I want you to have your own email inbox and internet identity, completely separate from my personal email. We'll use AgentMail, which has a native Grok Bot plugin. Walk me through the whole setup one step at a time, and wait for me to confirm each step before moving on.

First, explain briefly why this matters: my built-in Gmail plugin points at MY inbox, so any bot using it can read my private mail and my password/2FA codes and send email as me - and a single malicious email could prompt-inject you. Your own AgentMail inbox keeps all of that contained.

Then guide me through what I need to do on my end, pausing after each step until I confirm:
1. Confirm I'm on a Grok Bot plan that supports plugins (Cursor Ultra, SuperGrok Heavy, or Cursor Premium Teams). If I'm not, tell me and stop here.
2. Have me create a free account at agentmail.to (the free tier is enough).
3. Have me open Settings -> Plugins, search for "AgentMail", and click Install.
4. Tell me to approve the OAuth prompt in my browser (it will say "Cursor wants to access AgentMail..." - that's expected). There is no API key to paste. Have me confirm your AgentMail tools now show on the connector card before you continue.

Once the plugin is connected, take over: create yourself a dedicated inbox (pick a clear name and tell me the exact address), then prove it works - send a short test email to me at [YOUR EMAIL], ask me to reply from my normal inbox, and read my reply back to me in the same thread.

From then on this inbox is YOURS: use it to sign yourself up for services (read the verification code from your own inbox and finish signup), run outreach and reply threads from your own address, own a support inbox, and join any thread I CC you on. Safety rules that never change: before you send any email, show me the exact recipient(s), subject, and full body and wait for my explicit approval; never send in bulk without me confirming the whole list first; never invent an address or contact AgentMail didn't return; and never touch my personal inbox.