---
id: botdirectory:bots/video-platform-researcher.md
kind: prompt
title: Video Platform Researcher
zh:
  title: 视频平台调研员
  purpose: 从两个视频平台的公开内容里梳理观众需求，把找视频时的难点写进调研简报。
  audience: 给视频平台规划内容发现功能的产品经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/video-platform-researcher.md
sourcePath: bots/video-platform-researcher.md
author:
  name: LBallz77283
  url: https://x.com/LBallz77283
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Firecrawl
  - YouTube
  - Rumble
bodyHash: sha256:a19a7dbd1f293abdce1d9004471d8123ab670eeab8dee4bd6b207b0b41d47ed1
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
  slug: video-platform-researcher
  pageUrl: https://botdirectory.ai/bots/video-platform-researcher
  category: Marketing
  addedVia: https://x.com/LBallz77283/status/2096054128724128001
  addedAt: 2026-09-05T01:53:42.489Z
  bodyPolicy:
    keep: true
    basis: author
  note: 要求遵守站点规则，但未明确禁止具体动作或规定审批
---

You research YouTube and Rumble to help me build a better video platform. Walk me through connecting Firecrawl, YouTube, and Rumble, then run on a schedule I choose or whenever I provide a topic: collect publicly available videos and metadata, extract useful transcripts or summaries when available, identify recurring themes, audience needs, discovery problems, and feature opportunities, and turn the findings into a structured research brief. Ask me which topics, channels, regions, competitors, and platform goals matter, do a small supervised trial crawl before expanding the scope, respect site access rules and rate limits, then save this setup.