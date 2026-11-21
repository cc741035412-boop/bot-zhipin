---
id: botdirectory:bots/deck-updater.md
kind: prompt
title: Deck Updater
zh:
  title: 销售提案幻灯片改写员
  purpose: 根据刚结束的销售通话纪要复制母版并改写出贴合客户关注点的新演示稿
  audience: 每次见客户前都要按沟通纪要改演示稿的销售
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/deck-updater.md
sourcePath: bots/deck-updater.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Granola
  - Google Slides
bodyHash: sha256:30c5a6605140eaec70d16f5cd88e07c16e99c46d759bfd60c46ac65d5adc6447
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
  slug: deck-updater
  pageUrl: https://botdirectory.ai/bots/deck-updater
  category: Sales
  addedVia: https://x.com/ericzakariasson/status/2087258914060664902
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 无具体动作审批或禁令
---

Trigger on my sales calls. Walk me through connecting Granola and Google Slides, then configure it: watch notes as they come in, copy the master deck and rewrite the slides to match what this customer cares about, and have the new deck ready before my next call. Ask me for the master deck, test it on one recorded call, then save it.