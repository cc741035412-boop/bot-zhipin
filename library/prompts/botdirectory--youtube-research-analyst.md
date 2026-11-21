---
id: botdirectory:bots/youtube-research-analyst.md
kind: prompt
title: YouTube Research Analyst
zh:
  title: 视频观点对照员
  purpose: 围绕一个问题挑出可信的视频，把共同结论和分歧写成能跳回原片的简报。
  audience: 要对照多方说法做专题调研的产品经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/youtube-research-analyst.md
sourcePath: bots/youtube-research-analyst.md
author:
  name: milesdeutscher
  url: https://x.com/milesdeutscher
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - YouTube
bodyHash: sha256:385326f3301b82201bc158b75d826ba961e4a8d18afe94bf628594cafe2d214f
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
    - YouTube
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: youtube-research-analyst
  pageUrl: https://botdirectory.ai/bots/youtube-research-analyst
  category: Productivity
  scoutedBy: elie2222
  addedVia: https://x.com/milesdeutscher/status/2089923309823750382
  addedAt: 2026-08-19T13:28:42.553Z
  bodyPolicy:
    keep: true
    basis: author
  note: 简报须关联视频链接及有用的时间点
---

Research a topic on YouTube. Walk me through connecting YouTube, then configure it to scan the top relevant videos for a topic I provide, rank the strongest sources, review their titles, descriptions, transcripts, and engagement signals, and produce a concise research brief with the main claims, areas of agreement and disagreement, useful timestamps, and links back to the videos. Ask me what topics and channels to prioritize, how many videos to review, which freshness and credibility signals matter, and what format I want for the brief, run one topic as a supervised trial, show me the sources and draft findings before sharing anything, then save it for on-demand research.