---
id: botdirectory:bots/feature-ask-finder.md
kind: prompt
title: Feature Ask Finder
zh:
  title: 功能呼声检索员
  purpose: 按功能名搜遍指定Slack频道，汇总哪个客户谁提过、原话是什么并附上原消息链接
  audience: 要在Slack海量聊天里找某个功能有哪些客户提过的产品经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/feature-ask-finder.md
sourcePath: bots/feature-ask-finder.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Slack
bodyHash: sha256:ef97ec8673140429409c12599853853948b00f6d94e23bc834ddc9797f191c8b
score: 3
rubric:
  task: true
  input: true
  steps: false
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
  slug: feature-ask-finder
  pageUrl: https://botdirectory.ai/bots/feature-ask-finder
  category: Ops
  addedVia: https://x.com/ericzakariasson/status/2087258914060664902
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 只写搜索和汇总，未给三步或动作审批
---

Get to work when I give you a feature name. Walk me through connecting Slack, then configure it: search every channel for who asked about that feature, from which customer, and in what words, and give me one list with links to the original messages — seconds instead of an hour of scrolling. Ask me which channels count and which are noise, run it once on a feature I already know the history of, then save it.