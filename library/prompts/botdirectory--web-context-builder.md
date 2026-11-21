---
id: botdirectory:bots/web-context-builder.md
kind: prompt
title: Web Context Builder
zh:
  title: 网页调研简报员
  purpose: 把指定网站的资料整理成带出处的简报，标出哪些说法还没证实。
  audience: 做竞品调研时要核对资料出处的产品经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/web-context-builder.md
sourcePath: bots/web-context-builder.md
author:
  name: firecrawl
  url: https://x.com/firecrawl
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Firecrawl
  - Grok
bodyHash: sha256:bf9a1726d4efca58ed70039c7d2bfba5e144d597ba53bb745c11e30dde81afc9
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
  slug: web-context-builder
  pageUrl: https://botdirectory.ai/bots/web-context-builder
  category: Productivity
  scoutedBy: LBallz77283
  addedVia: https://x.com/firecrawl/status/2094093562136686860
  addedAt: 2026-08-31T00:00:18.973Z
  bodyPolicy:
    keep: true
    basis: author
  note: 简报必须附来源并区分有出处的事实和不确定内容
---

Set up a new bot for me I can trigger when I need fresh web research. Walk me through connecting Firecrawl to Grok, then configure it: search for the sources I specify, scrape the relevant pages, clean and organize the results into high-quality context with source links, and return a concise brief that distinguishes sourced facts from uncertainty. Ask me which sites or domains to prioritize, how broad the search should be, what format I want, and how current the information must be, run a supervised dry run on one research request, then save it.