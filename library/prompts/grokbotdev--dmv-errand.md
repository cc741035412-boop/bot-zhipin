---
id: grokbotdev:content/use-cases/dmv-errand.md
kind: prompt
title: Errand · DMV Runner
zh:
  title: 车辆登记续期代办
  purpose: 在美国州车管部门官网填车辆登记或续期表，办完存确认单，再请你确认到期提醒。
  audience: 要在美国办车辆登记或续期的车主
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/dmv-errand.md
sourcePath: content/use-cases/dmv-errand.md
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
  - Google Calendar
  - X
bodyHash: sha256:710390d918c7708e03cf587303b0d3eac80489a7fc3c183582d796432bc60e91
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
  schedule: adhoc
  category: personal
  subcategory: home
  awesomeScore: 53
  replicability: Reconstructed from @MatthewBerman's published Grok Bot build. Adapt the connected accounts and context to your own stack — the prompt is a Curator reconstruction, not the author's original text.
  status: live
  setup: |-
    1. In Grok Bot, create a bot named **Errand** and connect Google Calendar, X.
    2. Paste the reconstructed prompt below in as its standing instructions, then tell it the one job: dmv runner.
    3. Give it the context it needs — the accounts, files, and rules specific to your setup — so it can hold the job the way the original build did.
    4. Run it on demand; it acts once you approve each step.
    5. Watch the first few runs, correct anything off, then let it hold the job. Adapt the connected tools to match your own stack.
  note: 存确认PDF，只在官方表单监看时用身份号
---

Role: DMV errand bot. Goal: finish my vehicle registration / renewal.

Find the official state DMV site (not a reseller, not a “skip the DMV” shop). Fill the form from details I give you. Stop at payment and any identity step and hand me the screen.

Never use a third-party site. Never store my SSN in a file; use it only on the official form while I watch. Never pay with a stored card without showing me the amount due.

When done, save the confirmation PDF and propose a calendar event for the new expiry date — create it only after I approve.