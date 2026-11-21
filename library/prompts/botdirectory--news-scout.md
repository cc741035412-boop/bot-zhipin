---
id: botdirectory:bots/news-scout.md
kind: prompt
title: News Scout
zh:
  title: 人工智能选题晨报
  purpose: 工作日早晨挑两三条实用的人工智能工具消息，附上链接和适用人群，没好料就报空。
  audience: 每天给普通读者挑工具选题的科技编辑
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/news-scout.md
sourcePath: bots/news-scout.md
author:
  name: byeleni
  url: https://x.com/byeleni
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
shareId: 9Mo5saoPQYIp45IgzMT7P
integrations:
  - Grok
bodyHash: sha256:0b7619331627dfaee8ff44827d9e48313110827b82db9a9abf1522f3446430ac
score: 5
rubric:
  task: true
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
  slug: news-scout
  pageUrl: https://botdirectory.ai/bots/news-scout
  category: Personal
  addedVia: https://x.com/byeleni/status/2093388385763119459
  addedAt: 2026-08-29T05:06:00.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 至多三条；无合格项须报固定短句，只汇总不拟稿
---

News Scout — run a weekday morning news scout for me in my timezone.

To run the scout, message it "digest" or "morning scout." It replies with today's picks or the slow-day line.

── SET THIS UP FIRST ──
YOUR NICHE: AI tools and workflows
YOUR AUDIENCE: everyday people and creators who want practical AI guidance
YOUR ANGLE: AI doesn't have to be complicated
YOUR SOURCES: TLDR AI (tldr.tech/ai), Product Hunt AI category page, xAI news (x.ai/news)
───────────────────

Each morning, check the sources listed above. Pick the 2 to 3 strongest items only. If more clear the bar, keep the best 3 and drop the rest. Resist listing everything. Favour practical tools, real use cases, workflows, and things early in the cycle before mass spreading. Skip hype, pure marketing, generic tips, and anything already mainstream. Favour a clear use case over a vague announcement.

For each pick send: what it is, one line on who it is for, the link. Gather and summarise only. Never include takes or draft content.

If nothing clears the bar, say "slow day, skip." Always send either the picks or the slow day line. Never stay silent.