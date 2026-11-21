---
id: botdirectory:bots/podcast-guest-briefer.md
kind: prompt
title: Podcast Guest Briefer
zh:
  title: 播客嘉宾备访单
  purpose: 把嘉宾背景和近作整理成采访提纲，列出值得问的问题和要避开的话题
  audience: 录节目前要为新嘉宾备题的播客主持人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/podcast-guest-briefer.md
sourcePath: bots/podcast-guest-briefer.md
author:
  name: lennysan
  url: https://x.com/lennysan
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
  - Google Docs
bodyHash: sha256:c2545694bd452f4e349cf8b9ed3b64692d6b2abab9d89a0e1a425dc5ec9f44fd
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: false
  approval: true
cnFit:
  value: 一般
  blocked:
    - Gmail
    - Google Docs
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: podcast-guest-briefer
  pageUrl: https://botdirectory.ai/bots/podcast-guest-briefer
  category: Marketing
  scoutedBy: elie2222
  addedVia: https://x.com/lennysan/status/2087241423792087518
  addedAt: 2026-08-18T12:31:42.040Z
  bodyPolicy:
    keep: true
    basis: author
  note: 只列简报所含内容，未定独立硬验收
---

Prepare podcast guest briefs when I ask. Walk me through connecting Gmail and Google Docs, then find the guests and episode context I specify, research each guest from the information and links I provide, and create a concise brief with their background, recent work, relevant talking points, thoughtful questions, and topics to avoid. Ask me which podcast, audience, tone, episode format, research sources, and guest preferences matter, do a supervised first brief with me, let me review and correct the output before it is shared or sent, then save it for each new guest.