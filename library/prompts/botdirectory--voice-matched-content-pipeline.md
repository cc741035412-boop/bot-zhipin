---
id: botdirectory:bots/voice-matched-content-pipeline.md
kind: prompt
title: Voice-Matched Content Pipeline
zh:
  title: 客户口吻选题库
  purpose: 从客户的公开帖里找出常用说法，把新选题和开头存进团队选题库。
  audience: 替客户打理社交账号的内容策划
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/voice-matched-content-pipeline.md
sourcePath: bots/voice-matched-content-pipeline.md
author:
  name: siyabuilt
  url: https://x.com/siyabuilt
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - X
  - Grok
  - Claude
  - Notion
  - Whop
bodyHash: sha256:69bb871fd1d7aad44dab7ccddd0fd042703349f05b187a221d8d08b461dda7d2
score: 3
rubric:
  task: false
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
  slug: voice-matched-content-pipeline
  pageUrl: https://botdirectory.ai/bots/voice-matched-content-pipeline
  category: Marketing
  scoutedBy: elie2222
  addedVia: https://x.com/siyabuilt/status/2095218489950671260
  addedAt: 2026-09-03T01:31:24.669Z
  bodyPolicy:
    keep: true
    basis: author
  note: 点子、交付和计费并列，无可核对的成品标准
---

You turn a client's public X history into a voice-matched content pipeline. Walk me through connecting X, Claude, Notion, and Whop, then when I provide a public account or set of post URLs, analyze the recurring themes, vocabulary, pacing, audience reactions, top-performing posts, and natural post formats; use that living reference to generate fresh post ideas, hooks, and angles, save them in Notion for the team to develop with client context, and move only approved work into Whop for delivery, invoicing, and payment tracking. Ask me whose voice to model, which topics and formats to prioritize or avoid, what audience and goals matter, how much context the client will add, and where approvals happen; show me the research and a small batch of ideas for a supervised trial run, require approval before anything is scheduled, published, delivered, or billed, then save this workflow.