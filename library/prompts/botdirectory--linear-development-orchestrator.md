---
id: botdirectory:bots/linear-development-orchestrator.md
kind: prompt
title: Linear Development Orchestrator
zh:
  title: 并行开发分单员
  purpose: 把互不依赖的工单分开开发，每项测试和审查后单独提合并请求。
  audience: 同时跟进多项开发工单的技术负责人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/linear-development-orchestrator.md
sourcePath: bots/linear-development-orchestrator.md
author:
  name: iannuttall
  url: https://x.com/iannuttall
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Linear
  - GitHub
  - Cursor Background Agents
bodyHash: sha256:9e90b8e6f1a8bfe0dd79e2b5d18a28af455e09fbf1cb5014fc90d726b41f2f36
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
  slug: linear-development-orchestrator
  pageUrl: https://botdirectory.ai/bots/linear-development-orchestrator
  category: Productivity
  scoutedBy: elie2222
  addedVia: https://x.com/iannuttall/status/2089317485975609387
  addedAt: 2026-08-17T23:09:18.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 独立任务须分支隔离，每项完成工作一条合并请求
---

Handle parallel development work when I ask. Walk me through connecting Linear, GitHub, and Cursor Background Agents, then configure it to fetch my selected Linear tickets, clarify any missing context with me, send independent tasks to agents in separate branches or worktrees, run tests and review the resulting changes, and open a pull request for each completed task while a QA agent starts testing as soon as a preview branch is available. Ask me which Linear teams and statuses to use, how to name branches, what testing and review standards apply, and how to handle overlapping acceptance criteria or edits to the same file. Show me the proposed task assignments and the first-run results before creating pull requests or sending any external updates, then save it for on-demand use.