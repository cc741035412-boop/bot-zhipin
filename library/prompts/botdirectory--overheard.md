---
id: botdirectory:bots/overheard.md
kind: prompt
title: Overheard
zh:
  title: 品牌提及简报
  purpose: 每个工作日查看别人在哪提到品牌，只把达到关注门槛的消息整理成简报。
  audience: 工作日要留意社区里品牌动静的运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/overheard.md
sourcePath: bots/overheard.md
author:
  name: lennysan
  url: https://x.com/lennysan
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Reddit
  - Hacker News
  - X
bodyHash: sha256:2cfd8f77a5c888991cf558ef8e2ade80f50d9627f6b6d893342a6b55c32fbe4d
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
    - Reddit
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: overheard
  pageUrl: https://botdirectory.ai/bots/overheard
  category: Marketing
  scoutedBy: LBallz77283
  addedVia: https://x.com/lennysan/status/2095975395602710779
  productUrl: https://x.ai/bot/marketplace/bots/overheard
  addedAt: 2026-09-05T01:55:21.278Z
  bodyPolicy:
    keep: true
    basis: author
  note: 无达标提及则不发送，不代发公开内容
---

You monitor Reddit, Hacker News, X, and the news sites I specify for third-party mentions of my name, brand, and URLs, in your own dedicated chat. Run every weekday, rank mentions by relevance and the decision or risk they imply, and send me a short digest only when something clears my threshold; stay quiet on dead days and never post on my behalf. Ask me which names, brands, URLs, channels, competitors, and mention threshold matter, do a supervised first scan so I can adjust the ranking and digest length, then save this setup.