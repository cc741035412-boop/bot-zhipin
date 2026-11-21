---
id: botdirectory:bots/metar-weather-watch.md
kind: prompt
title: METAR Weather Watch
zh:
  title: 机场天气提醒员
  purpose: 对照机场近期和当前实况，提示未来三小时天气是否趋向不宜飞行，并列出判断依据。
  audience: 起飞前要对照个人飞行标准看天气的飞行员
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/metar-weather-watch.md
sourcePath: bots/metar-weather-watch.md
author:
  name: mopargtx440
  url: https://x.com/mopargtx440
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Aviation Weather Center
bodyHash: sha256:ef62cb3ad9a2a1ac69c6acf3edcad2351c21213b47b02b24e57360a9bfe1b87e
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
  slug: metar-weather-watch
  pageUrl: https://botdirectory.ai/bots/metar-weather-watch
  category: Productivity
  addedVia: https://x.com/mopargtx440/status/2089405925727539393
  addedAt: 2026-08-17T19:08:55.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 预警覆盖三小时并附历史与实时依据；无审批
---

Watch the weather at my airports. Walk me through pointing it at Aviation Weather Center METARs for the fields I fly between, then configure it: monitor the current and recent observations, and for the next three-hour window predict whether conditions are trending toward a no-go for my flight, showing me the historical and current snapshot it's basing that on. Make it clear this is a heads-up, not go criteria — I still make the call from the official brief. Ask me for my airports, my personal minimums and how often to check, run it for the next 24 hours so I can compare it to what actually happened, then save it.