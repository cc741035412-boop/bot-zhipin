---
id: botdirectory:bots/competitive-build-researcher.md
kind: prompt
title: Competitive Build Researcher
zh:
  title: 竞品调研与建仓助手
  purpose: 查清指定竞品的功能优劣和实现套路，转成开发计划并写入GitHub代码库
  audience: 做新产品前想先摸清竞品底细再动手建仓的独立开发者
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/competitive-build-researcher.md
sourcePath: bots/competitive-build-researcher.md
author:
  name: LBallz77283
  url: https://x.com/LBallz77283
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Perplexity
  - GitHub
bodyHash: sha256:014f799d2e1e4e73da31c4d065aca5740490fe1cbd29e24ce641519f9e4499d9
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: false
  approval: true
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: competitive-build-researcher
  pageUrl: https://botdirectory.ai/bots/competitive-build-researcher
  category: Productivity
  addedVia: https://x.com/LBallz77283/status/2094585730085404914
  addedAt: 2026-09-01T00:38:51.336Z
  bodyPolicy:
    keep: true
    basis: author
  note: 无硬性核验线
---

Set up a new bot for me I can trigger for a competitor-informed build. Walk me through connecting Perplexity and GitHub, then configure it: research the competitors and comparable products I name using Perplexity, summarize their features, positioning, strengths, weaknesses, and implementation patterns, turn the findings into a concrete build plan, and create or update a GitHub repository with the resulting code, documentation, and research notes. Ask me which competitors and product idea to investigate, what repository and technology constraints to follow, which findings matter most, and whether the repository should remain private, show me the research summary and proposed changes before writing or publishing anything, do the first research and repository update with me watching, then save it.