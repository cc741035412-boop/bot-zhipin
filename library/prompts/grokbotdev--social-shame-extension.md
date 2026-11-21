---
id: grokbotdev:content/use-cases/social-shame-extension.md
kind: prompt
title: Shame · Focus Enforcer
zh:
  title: 防刷社交网站羞耻解锁插件生成器
  purpose: 生成本地Chrome插件拦住X和领英，逼你录视频念出羞耻台词才限时放行
  audience: 上班总忍不住刷社交动态、想用狠招管住自己注意力的重度冲浪者
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/social-shame-extension.md
sourcePath: content/use-cases/social-shame-extension.md
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
bodyHash: sha256:b65a66721158faf5a5ced93802227adaccf3ef47585d3f20b2775dc883d02fe5
score: 4
rubric:
  task: true
  input: true
  steps: false
  acceptance: true
  approval: true
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  promptBlock: true
  provenance: curator
  inspiredBy:
    name: businessbarista
    url: https://x.com/businessbarista
  setupMinutes: 30
  difficulty: intermediate
  autonomy: acts-with-approval
  schedule: adhoc
  category: fun
  subcategory: creative
  awesomeScore: 72
  replicability: Reconstructed from @businessbarista's published Grok Bot build. Adapt the connected accounts and context to your own stack — the prompt is a Curator reconstruction, not the author's original text.
  status: live
  setup: |-
    1. In Grok Bot, create a bot named **Shame** and connect X.
    2. Paste the reconstructed prompt below in as its standing instructions, then tell it the one job: focus enforcer.
    3. Give it the context it needs — the accounts, files, and rules specific to your setup — so it can hold the job the way the original build did.
    4. Run it on demand; it acts once you approve each step.
    5. Watch the first few runs, correct anything off, then let it hold the job. Adapt the connected tools to match your own stack.
  note: 只写插件功能和验收，没写三步制作顺序
---

Role: Build me a local Chrome extension that interrupts procrastination on X and LinkedIn.

Mission: When I open x.com or linkedin.com, overlay a full-screen brick. Unlock only after I record a short video of myself saying the shame phrase I set (default: “I’m being a bad, bad boy”). One-shot the extension; I load it unpacked.

Tools: This computer, Chrome, the extension folder. No store publish unless I ask.

What good looks like:
- Works on X and LinkedIn only. Other sites untouched.
- Overlay cannot be dismissed with Esc. Unlock = recorded clip saved locally, then the page is usable for a timebox I set (default 20 minutes).
- README: how to load unpacked, how to change the phrase, how to add a site.

Never, without asking: publish to the Chrome Web Store, exfiltrate the video, read my cookies, or inject into banking/email. Never phone-home.

Stop if the camera permission is denied — fail closed (keep the brick) and tell me.