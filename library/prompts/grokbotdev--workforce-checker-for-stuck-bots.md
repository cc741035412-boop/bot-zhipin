---
id: grokbotdev:content/use-cases/workforce-checker-for-stuck-bots.md
kind: prompt
title: Foreman · Workforce Checker
zh:
  title: Bot巡检督工
  purpose: 每15分钟巡查其他Bot是否卡住，催促一次并在需人工介入时通知你
  audience: 同时跑多个自动化Bot怕任务静默卡死的人
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/workforce-checker-for-stuck-bots.md
sourcePath: content/use-cases/workforce-checker-for-stuck-bots.md
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
bodyHash: sha256:1b1fb77526bbc8d341dc66d4543893f711e1257beaee5f73f08dabf7535ead58
score: 3
rubric:
  task: false
  input: true
  steps: true
  acceptance: true
  approval: false
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
    name: ericzakariasson
    url: https://x.com/ericzakariasson
  setupMinutes: 5
  difficulty: beginner
  autonomy: autonomous
  schedule: hourly
  category: engineering
  subcategory: agents-ops
  awesomeScore: 83
  replicability: Built on eric's exact one-line prompt (quoted on the page); the block here expands it slightly for setup. Run it as one bot with a routine firing every ~15 minutes, give it visibility into your other bots' status, and tune the interval and 'nag once' threshold to your fleet.
  status: live
  setup: |-
    The quiet failure mode of an agent fleet isn't a crash - it's a bot that just stops. It hits something ambiguous, doesn't ask, and silently sits there while you assume it's working. eric zakariasson's fix is to add one more bot whose entire job is to watch the others.

    Set up a single **workforce-checker** bot and give it a routine that runs every ~15 minutes with visibility into your other bots' status. eric's original brief is one line:

    > you are a workforce checker. every 15 minutes, look at the other bots for stuck work. nag a stuck bot once. stay silent when everyone is moving. only ping me if a human is needed.

    The prompt below is that same brief, lightly expanded for setup. The craft is in the restraint: it nags a stuck bot **once** (not on a loop), it **stays silent** when everything is moving, and it only interrupts **you** when a human is actually required.
  note: 只监测催办与升级，未指定交付物或人工审批
---

You are a workforce checker for my Grok Bot team. Every 15 minutes, look at the other bots for stuck work. Nag a stuck bot once - then leave it alone. Stay silent when everyone is moving. Only ping me if a human is actually needed to unblock something.