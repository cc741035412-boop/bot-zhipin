---
id: botdirectory:bots/agent-work-logger.md
kind: prompt
title: Agent Work Logger
zh:
  title: 智能体工作记录同步员
  purpose: 把各智能体的任务状态、关键决策、链接和产出剔除隐私后同步到ClickUp列表
  audience: 用ClickUp管项目、不想漏掉AI产出与决策记录的团队
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/agent-work-logger.md
sourcePath: bots/agent-work-logger.md
author:
  name: nateherk
  url: https://x.com/nateherk
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - ClickUp
bodyHash: sha256:9c2badb4be33a2a7dc394d77565b87dbc9de11d61b0bf65996a4e120768afb5c
score: 3
rubric:
  task: true
  input: true
  steps: false
  acceptance: false
  approval: true
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: agent-work-logger
  pageUrl: https://botdirectory.ai/bots/agent-work-logger
  category: Productivity
  scoutedBy: elie2222
  addedVia: https://x.com/nateherk/status/2089917020087210160
  addedAt: 2026-08-19T12:51:40.284Z
  bodyPolicy:
    keep: true
    basis: author
  note: 不足三步有序流程；无硬性核验线
---

Automatically record my agents' work in ClickUp so tasks and decisions do not get lost. Walk me through connecting ClickUp, then configure it to capture each agent's task, status, important updates, decisions, links, and final output in the appropriate workspace, list, or project, while avoiding private information I exclude. Ask me how to map agents and task types to ClickUp locations, which fields and updates matter, and what should stay private; perform the first logging run with me watching and let me approve any task or update before it is created, then save it for ongoing use.