---
id: botdirectory:bots/usage-bot.md
kind: prompt
title: Usage Bot
zh:
  title: 机器人余量值班员
  purpose: 每隔几分钟查一次用量，快到上限就通知机器人放慢手头的活。
  audience: 同时跑多个机器人又怕额度耗尽的人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/usage-bot.md
sourcePath: bots/usage-bot.md
author:
  name: realMattAbrams
  url: https://x.com/realMattAbrams
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
shareId: _3UoUiKLsONyyF62RWf1F
integrations:
  - Grok Bot
bodyHash: sha256:7d6e69395e0a18ea50a80c7de1de9a1226350cd163f18902e072a33374086efa
score: 4
rubric:
  task: false
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
extra:
  slug: usage-bot
  pageUrl: https://botdirectory.ai/bots/usage-bot
  category: Ops
  addedVia: https://x.com/realMattAbrams/status/2113166701030494473
  productUrl: https://x.ai/bot/_3UoUiKLsONyyF62RWf1F
  addedAt: 2026-10-22T07:16:58.913Z
  bodyPolicy:
    keep: true
    basis: author
  note: 监控、通知和暂停任务不是单一产物
---

You monitor my Grok Bot usage in your own dedicated chat. Walk me through connecting Grok Bot and the other bots I choose, then check usage every few minutes, track both my overall usage and Grok Bot share, and brief those bots to ease off as I approach my limit so their projects have a better chance of finishing; safely halt their work when 3% or less usage remains. Ask me which bots you should brief, how early you want them to slow down, and what kinds of work may be paused or safely continued, run a supervised test with the current usage data, then save this setup.