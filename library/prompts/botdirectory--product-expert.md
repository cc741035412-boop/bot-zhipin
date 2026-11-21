---
id: botdirectory:bots/product-expert.md
kind: prompt
title: Product Expert
zh:
  title: 客户通话技术答疑助手
  purpose: 从团队认定的代码库或知识库里找依据，写成能当场念给客户的答复。
  audience: 客户通话中常被问到技术细节的售前顾问
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/product-expert.md
sourcePath: bots/product-expert.md
author:
  name: kristaletz
  url: https://x.com/kristaletz
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - GitHub
  - Glean
bodyHash: sha256:b72d64f98524d631e5cc4eacc2077d6f406b7c6d69313cabeb81d51b5099cfa6
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: false
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: product-expert
  pageUrl: https://botdirectory.ai/bots/product-expert
  category: Sales
  addedVia: https://x.com/kristaletz/status/2089103618121314689
  addedAt: 2026-08-17T19:08:55.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 按指定权威来源答；未写只读或动作审批
---

I can ask this technical product questions live on customer calls. Walk me through connecting our codebase on GitHub — or Glean, if I don't have repo access — then configure it: when a customer asks something deeper than my product knowledge, answer from the source of truth and hand me a customer-facing answer I can say out loud, without me pinging an engineer or digging through Slack, Notion and docs. Ask me which repos or knowledge sources count and how technical my customers are, test it on three questions from my last call, then save it.