---
id: botdirectory:bots/class-action-matcher.md
kind: prompt
title: Class Action Matcher
zh:
  title: 集体诉讼赔偿资格核对员
  purpose: 比对邮箱收据与近期集体诉讼和解案并生成含截止日与预估金额的索赔报告
  audience: 网购账单多且想查查自己能不能领到消费集体诉讼赔偿金的人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/class-action-matcher.md
sourcePath: bots/class-action-matcher.md
author:
  name: mrfundman
  url: https://x.com/mrfundman
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
bodyHash: sha256:7802a7ded33a18256b73b8244fbfd4c3f9afc3b126c84315345ba81d71c00f3b
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
needsReview:
  flag: true
  rules:
    - R-pay
  hits:
    - rule: R-pay
      excerpt: Walk me through connecting Gmail and providing my statements and order histories
    - rule: R-pay
      excerpt: Ask me what jurisdictions and purchase categories to include, which privacy boun
extra:
  slug: class-action-matcher
  pageUrl: https://botdirectory.ai/bots/class-action-matcher
  category: Personal
  scoutedBy: elie2222
  addedVia: https://x.com/mrfundman/status/2089338947201569187
  addedAt: 2026-08-18T14:14:58.777Z
  bodyPolicy:
    keep: true
    basis: author
  note: 只列报告要写的字段，没要求引用证据或交叉核验
---

Handle a class-action claim search when I ask. Walk me through connecting Gmail and providing my statements and order histories, then configure it: review my emails, statements, receipts, and purchase histories, compare them with current class-action settlements and eligibility requirements, and create a report showing possible matches, deadlines, estimated claim value, and the evidence needed for each claim. Draft applications for my review but never submit a claim or share personal information without my explicit approval. Ask me what jurisdictions and purchase categories to include, which privacy boundaries to follow, and whether to prioritize claim value or low effort, do a supervised search with me, then save it for an on-demand run.