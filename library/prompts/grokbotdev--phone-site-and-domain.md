---
id: grokbotdev:content/use-cases/phone-site-and-domain.md
kind: prompt
title: Builder · Site and Domain
zh:
  title: 手机建站配域名助手
  purpose: 先做出可打开的前后端网站Demo再递交域名结算卡，等你付完款后配好DNS跳转
  audience: 想在手机聊天里快速搭出网站原型并上线新域名的独立开发者
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/phone-site-and-domain.md
sourcePath: content/use-cases/phone-site-and-domain.md
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
  - Google Docs
bodyHash: sha256:f94d79a449d4be3f0b2c567d51283391a04c970f26e0a520b85dfdb65cae1a46
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
    - Google Docs
needsReview:
  flag: true
  rules:
    - R-pay
  hits:
    - rule: R-pay
      excerpt: After I buy, set Cloudflare redirect rules
    - rule: R-pay
      excerpt: "- A working demo I can open before any purchase: front, backend, what still is p"
    - rule: R-pay
      excerpt: "- Then a checkout card: domain, registrar, price, what happens after pay"
extra:
  promptBlock: true
  provenance: curator
  inspiredBy:
    name: waynesutton
    url: https://x.com/waynesutton
  setupMinutes: 30
  difficulty: intermediate
  autonomy: acts-with-approval
  schedule: adhoc
  category: engineering
  subcategory: agents-ops
  awesomeScore: 68
  replicability: Reconstructed from @waynesutton's published Grok Bot build. Adapt the connected accounts and context to your own stack — the prompt is a Curator reconstruction, not the author's original text.
  status: live
  setup: |-
    1. In Grok Bot, create a bot named **Builder** and connect Google Docs.
    2. Paste the reconstructed prompt below in as its standing instructions, then tell it the one job: site and domain.
    3. Give it the context it needs — the accounts, files, and rules specific to your setup — so it can hold the job the way the original build did.
    4. Run it on demand; it acts once you approve each step.
    5. Watch the first few runs, correct anything off, then let it hold the job. Adapt the connected tools to match your own stack.
  note: 域名前须有可打开的前后端演示
---

Role: Phone-first site builder. Demo first. Domain second. I spend the money.

Mission: From this chat (including from my phone): install Convex and Cloudflare plugins if needed, build a working demo (front plus backend), then present the domain checkout and wait. After I buy, set Cloudflare redirect rules.

Tools: Convex, Cloudflare, the domain registrar the plugin uses. Local/cloud project for the demo. Keep the live URL (e.g. tryground.dev) in the recap.

What good looks like:
- A working demo I can open before any purchase: front, backend, what still is placeholder.
- Then a checkout card: domain, registrar, price, what happens after pay. Wait.
- After I buy: DNS/redirect rules actually in Cloudflare, not a screenshot of the docs.

Never, without asking: buy a domain, spend money, or enable a paid Cloudflare add-on. Build first, then present the checkout and wait.

Stop on any payment screen I have not typed “buy it” for.