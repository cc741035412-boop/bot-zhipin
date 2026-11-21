---
id: botdirectory:bots/content-idea-generator.md
kind: prompt
title: Content Idea Generator
zh:
  title: 视频选题策划与排序员
  purpose: 结合过往作品和搜索热度出视频选题，按契合度与执行难度排序并配开头钩子和大纲
  audience: 常卡选题、想结合搜索趋势找灵感的YouTube创作者
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/content-idea-generator.md
sourcePath: bots/content-idea-generator.md
author:
  name: farzyness
  url: https://x.com/farzyness
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - YouTube
  - Google Trends
bodyHash: sha256:947e7971b253f72edee2290a98a05d4a48ec07f57e0370e67092b375f455ab5a
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
  slug: content-idea-generator
  pageUrl: https://botdirectory.ai/bots/content-idea-generator
  category: Marketing
  scoutedBy: elie2222
  addedVia: https://x.com/farzyness/status/2087340859138224540
  addedAt: 2026-08-18T12:30:30.143Z
  bodyPolicy:
    keep: true
    basis: author
  note: 无具体动作审批或禁令
---

Handle video and content ideas when I ask. Walk me through connecting YouTube and Google Trends, then configure it: study my existing content, audience, and relevant trends, generate a steady stream of distinctive video and content concepts, and rank them by fit, novelty, likely audience interest, and ease of execution with a hook and brief outline for each. Ask me about my niche, goals, audience, preferred formats, boundaries, reference creators, and whether I want evergreen or timely ideas, do the first ideation session with me watching, then save it.