---
id: botdirectory:bots/notion-memory-keeper.md
kind: prompt
title: Notion Memory Keeper
zh:
  title: 项目决策记录员
  purpose: 把新决定和来龙去脉补进指定页面，按约定的栏目归档，保留以前的重要记录。
  audience: 要在团队共享页持续记录决策的产品经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/notion-memory-keeper.md
sourcePath: bots/notion-memory-keeper.md
author:
  name: benln
  url: https://x.com/benln
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Notion
bodyHash: sha256:07a2262d4684dec1127acc1140bb888b0ad79cfc69f2587086dc583749be708f
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
  slug: notion-memory-keeper
  pageUrl: https://botdirectory.ai/bots/notion-memory-keeper
  category: Productivity
  scoutedBy: elie2222
  addedVia: https://x.com/benln/status/2089699901567340808
  addedAt: 2026-08-18T14:15:46.485Z
  bodyPolicy:
    keep: true
    basis: author
  note: 不得删改重要历史；首条更新须审批
---

Maintain a dedicated Notion page when I ask. Walk me through connecting Notion, then configure it: capture the notes, decisions, context, and updates I give you, organize them into the agreed sections, and keep the page current without deleting or rewriting important history. Ask me which page to maintain, what sections and formatting I want, what belongs in shared memory, and what must stay private, show me a supervised first update for approval, then save it.