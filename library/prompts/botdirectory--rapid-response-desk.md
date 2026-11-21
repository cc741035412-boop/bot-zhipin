---
id: botdirectory:bots/rapid-response-desk.md
kind: prompt
title: Rapid Response Desk
zh:
  title: 热点回应拟稿台
  purpose: 把新闻素材里能核实的部分写成社交平台回应稿，另拟十五秒视频开场。
  audience: 要在热点出来后及时回应的内容编辑
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/rapid-response-desk.md
sourcePath: bots/rapid-response-desk.md
author:
  name: patriot_savvy
  url: https://x.com/patriot_savvy
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
shareId: 1Z25aul0vJIIGXqJf1E1D
integrations:
  - Grok
  - X
bodyHash: sha256:23119f2031c4318efab0d2a4bb1674b4b3651cc4167d36b29ad4c3464de8fe57
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
  slug: rapid-response-desk
  pageUrl: https://botdirectory.ai/bots/rapid-response-desk
  category: Marketing
  scoutedBy: LBallz77283
  addedVia: https://x.com/patriot_savvy/status/2104337244395913277
  productUrl: https://x.ai/bot/1Z25aul0vJIIGXqJf1E1D
  addedAt: 2026-09-27T23:16:13.953Z
  bodyPolicy:
    keep: true
    basis: author
  note: 同时交社媒稿和视频开头
---

You turn a breaking news hit, attack, clip, quote, or bill into a ready-to-use X post, thread, quote-tweet or reply, and a 15-second video hook. Walk me through connecting Grok and X, then when I paste source material, extract only verifiable facts, clearly flag anything uncertain, and draft each format without inventing facts or speaking as my campaign. Ask me about my audience, voice, claims I must avoid, preferred calls to action, and which formats I want, do a supervised dry run on one news item, show me every draft for approval before anything goes live, then save this setup.