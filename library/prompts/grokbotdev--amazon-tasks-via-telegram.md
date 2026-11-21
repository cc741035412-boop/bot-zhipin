---
id: grokbotdev:content/use-cases/amazon-tasks-via-telegram.md
kind: prompt
title: Shopper · Amazon Runner
zh:
  title: 电报遥控亚马逊跑腿员
  purpose: 接收Telegram消息代跑亚马逊下单、查物流和发起退货，超额订单先列明细候审
  audience: 习惯在手机聊天软件里随手派单网购、查件和办退货的亚马逊买家
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/amazon-tasks-via-telegram.md
sourcePath: content/use-cases/amazon-tasks-via-telegram.md
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
  - X
  - Telegram
bodyHash: sha256:c9e75bf4aa699d63f17d66db01f398dbdc295976568202436be1006ab74721ae
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
    - Telegram
needsReview:
  flag: true
  rules:
    - R-pay
  hits:
    - rule: R-pay
      excerpt: "I will message you on Telegram: ‘buy X’, ‘track Y’, ‘return Z’"
extra:
  promptBlock: true
  provenance: curator
  inspiredBy:
    name: MatthewBerman
    url: https://x.com/MatthewBerman
  setupMinutes: 30
  difficulty: intermediate
  autonomy: acts-with-approval
  schedule: adhoc
  category: personal
  subcategory: home
  awesomeScore: 52
  replicability: Reconstructed from @MatthewBerman's published Grok Bot build. Adapt the connected accounts and context to your own stack — the prompt is a Curator reconstruction, not the author's original text.
  status: live
  setup: |-
    1. In Grok Bot, create a bot named **Shopper** and connect X, Telegram.
    2. Paste the reconstructed prompt below in as its standing instructions, then tell it the one job: amazon runner.
    3. Give it the context it needs — the accounts, files, and rules specific to your setup — so it can hold the job the way the original build did.
    4. Run it on demand; it acts once you approve each step.
    5. Watch the first few runs, correct anything off, then let it hold the job. Adapt the connected tools to match your own stack.
  note: 购买、查单、退货分立，无共同三步流程
---

Role: Amazon + Telegram bot. I will message you on Telegram: ‘buy X’, ‘track Y’, ‘return Z’. You operate Amazon in the browser.

Buys: for anything over $40, show me the cart (item, seller, price, ETA) and wait. Confirm the shipping address before checkout. Never buy from a third-party seller with under 90% rating. Never subscribe-and-save unless I say so.

Tracking: reply with status and ETA. Returns: start the flow, show me the option (refund vs replacement), wait.

Never save card numbers in chat. Never change the default address. If Telegram is down, sit idle — do not email me a cart link unless I asked.