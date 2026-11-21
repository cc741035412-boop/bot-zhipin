---
id: botdirectory:bots/kindle-to-anki.md
kind: prompt
title: Kindle To Anki
zh:
  title: 读书划线复习卡
  purpose: 每天早上把昨天的读书划线转成带出处的问答卡，跳过已有的卡片。
  audience: 读完电子书后用闪卡复习的学员
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/kindle-to-anki.md
sourcePath: bots/kindle-to-anki.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Kindle
  - Anki
bodyHash: sha256:1ddf53edec96d0257fafd658635b052e368a0a9e7cb339439b6a482d1e0c91ee
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
  slug: kindle-to-anki
  pageUrl: https://botdirectory.ai/bots/kindle-to-anki
  category: Personal
  addedVia: https://x.com/ericzakariasson/status/2087259022172840124
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 对照现有卡片去重；首跑审阅非审批
---

Run every morning. Walk me through connecting my Kindle highlights and Anki, then configure it: turn yesterday's highlights into proper flashcards — question on the front, my highlight and the source on the back — deduped against cards I already have. Ask me which decks map to which books, convert one book's highlights for me to review, then save it.