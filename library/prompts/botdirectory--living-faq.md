---
id: botdirectory:bots/living-faq.md
kind: prompt
title: Living FAQ
zh:
  title: 常见问题更新员
  purpose: 每天把通话里的新问题补进问答页，合并重复提问，标出与产品现状不符的答案。
  audience: 根据客户通话维护问答页的产品运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/living-faq.md
sourcePath: bots/living-faq.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gong
  - Notion
bodyHash: sha256:5bc68f7fea539f30b7a32ce9db4d3d22812302d1925509788ab03437d5a86b82
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
  slug: living-faq
  pageUrl: https://botdirectory.ai/bots/living-faq
  category: Marketing
  addedVia: https://x.com/ericzakariasson/status/2087258914060664902
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 去重且标与已发布内容冲突的答案；无审批
---

Run every morning. Walk me through connecting Gong and the Notion FAQ page, then configure it: add the new questions people asked on calls, merge duplicates, and flag answers that contradict what we shipped. Ask me to seed it with the questions we already answer daily, let me watch the merge behaviour for a week, then save it.