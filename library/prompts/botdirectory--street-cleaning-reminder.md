---
id: botdirectory:bots/street-cleaning-reminder.md
kind: prompt
title: Street-Cleaning Reminder
zh:
  title: 扫街挪车提醒
  purpose: 按停车位置查这段路的清扫时段，在你设好的提前量到点时提醒挪车。
  audience: 在定时清扫禁停的街区路边停车的人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/street-cleaning-reminder.md
sourcePath: bots/street-cleaning-reminder.md
author:
  name: sophiadew
  url: https://x.com/sophiadew
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Google Maps
bodyHash: sha256:f8d734191d73070f1d71b9c4afb06ee460a80b3e0cf0b5b8f6349be17b66032c
score: 4
rubric:
  task: true
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
  slug: street-cleaning-reminder
  pageUrl: https://botdirectory.ai/bots/street-cleaning-reminder
  category: Personal
  scoutedBy: LBallz77283
  addedVia: https://x.com/sophiadew/status/2092342252266012841
  addedAt: 2026-08-26T02:53:16.557Z
  bodyPolicy:
    keep: true
    basis: author
  note: 未明确限制改日历、发信等具体动作
---

Help me when I park, in your own dedicated chat. Walk me through connecting Google Maps, then configure it: use my parked location to identify the applicable street-cleaning schedule and remind me early enough to move my car before tickets are possible. Ask me how much lead time I want, which notifications to use, and whether there are locations or days to ignore, do a supervised first reminder using a recent parking location, then save it.