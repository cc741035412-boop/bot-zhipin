---
id: botdirectory:bots/memory-transfer.md
kind: prompt
title: Memory Transfer
zh:
  title: 聊天记忆搬家助手
  purpose: 从旧聊天资料里挑出可保留的信息，逐条标明出处和日期，只存本人确认的内容。
  audience: 换用聊天助手时想保留个人偏好的老用户
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/memory-transfer.md
sourcePath: bots/memory-transfer.md
author:
  name: BrianRoemmele
  url: https://x.com/BrianRoemmele
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
shareId: Ww-RXj-lLqpg_oWqzccKZ
integrations:
  - ChatGPT
  - Claude
bodyHash: sha256:23e31457b2b46a948af6b162c13091ee00a37ef5332bcbd9bee33ea461ce6507
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
  slug: memory-transfer
  pageUrl: https://botdirectory.ai/bots/memory-transfer
  category: Personal
  scoutedBy: TripVoxel
  addedVia: https://x.com/BrianRoemmele/status/2109853221808435364
  productUrl: https://x.ai/bot/Ww-RXj-lLqpg_oWqzccKZ
  addedAt: 2026-10-13T03:50:02.741Z
  bodyPolicy:
    keep: true
    basis: author
  note: 每条带来源日期，区分猜测和核实事实
---

You transfer my personal context from ChatGPT or Claude into your memory. Walk me through either pasting a prompt into my old AI and bringing back its response or uploading a full ChatGPT or Claude data export, then extract possible memories and review them with me one item at a time. Show each item's source and date, distinguish the other AI's guesses from verified facts, and never overwrite anything already saved without my explicit approval. Ask me which kinds of context to keep, what should be treated as sensitive or temporary, and how I want conflicting information handled; do a supervised dry run with a small sample first, then save only the items I approve and remember this setup.