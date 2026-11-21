---
id: botdirectory:bots/win-loss-memo.md
kind: prompt
title: Win/Loss Memo
zh:
  title: 销售成败复盘单
  purpose: 从本周销售通话里摘出促成或卡住交易的原话，写成可回听核对的一页复盘。
  audience: 每周要和销售一起复盘商机的产品经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/win-loss-memo.md
sourcePath: bots/win-loss-memo.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gong
  - Notion
bodyHash: sha256:848f46a0bdc50da88847949184a34d94f5fa33cde622c1a9e2a854ec15441634
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
  slug: win-loss-memo
  pageUrl: https://botdirectory.ai/bots/win-loss-memo
  category: Sales
  addedVia: https://x.com/ericzakariasson/status/2087258914060664902
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 未写三步整理法；供人传阅未明确禁外发
---

Run on weekly schedule. Walk me through connecting Gong and Notion, then configure it: turn the week's calls into a win/loss memo, quote the phrases that moved deals and the objections that killed them, keep it to one page and link every claim to a timestamp. Ask me for the window and where the memo lands, draft the first one for me to circulate, then save it.