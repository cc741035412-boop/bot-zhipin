---
id: botdirectory:bots/podcast-summarizer.md
kind: prompt
title: Podcast Summarizer
zh:
  title: 播客项目笔记
  purpose: 按手头项目整理节目里的主张和可试的做法，附上逐字稿和原文链接
  audience: 听行业播客给项目找思路的产品经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/podcast-summarizer.md
sourcePath: bots/podcast-summarizer.md
author:
  name: GavinSBaker
  url: https://x.com/GavinSBaker
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Podcast RSS feeds
  - YouTube
bodyHash: sha256:a8934535a026d79ec2620d2151ab4f42ea05c78d3b362e5f7a4b746b6023ee30
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: false
cnFit:
  value: 一般
  blocked:
    - YouTube
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: podcast-summarizer
  pageUrl: https://botdirectory.ai/bots/podcast-summarizer
  category: Productivity
  scoutedBy: elie2222
  addedVia: https://x.com/GavinSBaker/status/2089379355692527813
  addedAt: 2026-08-17T21:26:11.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 须附原转录与来源链接；无动作审批
---

I can trigger this with a podcast episode or feed, in your own dedicated chat. Walk me through connecting my podcast sources, then configure it: retrieve or create a transcript, summarize each episode in the context of what I work on, highlight decisions, claims, and actionable ideas, and include the raw transcript and source links so I can verify everything myself. Ask me what topics and projects matter, how long the summaries should be, which sections I want, and whether I prefer summaries on demand or on a schedule, run the first episode with me watching, then save it.