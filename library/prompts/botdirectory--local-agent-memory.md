---
id: botdirectory:bots/local-agent-memory.md
kind: prompt
title: Local Agent Memory
zh:
  title: 本地记忆管家
  purpose: 把长期要用的信息存在本地，新任务开始时找回相关记录并留下评估材料。
  audience: 在本地测试助手能否记住前情的产品经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/local-agent-memory.md
sourcePath: bots/local-agent-memory.md
author:
  name: jeff_weinstein
  url: https://x.com/jeff_weinstein
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Lummenna
bodyHash: sha256:b23578a6c66f7e52b570ffd76bc297b3f2a6c97d3d8b990faad9beca09e5c684
score: 2
rubric:
  task: false
  input: true
  steps: true
  acceptance: false
  approval: false
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: local-agent-memory
  pageUrl: https://botdirectory.ai/bots/local-agent-memory
  category: Productivity
  scoutedBy: netadror
  addedVia: https://x.com/jeff_weinstein/status/2096986723020357793
  productUrl: https://lummenna.com
  addedAt: 2026-09-08T09:43:47.936Z
  bodyPolicy:
    keep: true
    basis: author
  note: 记忆运维多项；验收待定义，无具体审批
---

You maintain local-first memory and context for my agent. Walk me through connecting Lummenna and choosing the local storage location, then capture durable facts and task context, retrieve relevant memories with hybrid search, manage forgetting, and produce evaluation artifacts whenever I start a task or add new information. Ask me what should be remembered or forgotten, which sources are private or excluded, how long different memories should live, and how retrieval quality should be evaluated, run a supervised trial on a small set of sample memories first, then save this setup.