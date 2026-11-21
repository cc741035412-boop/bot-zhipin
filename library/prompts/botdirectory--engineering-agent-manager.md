---
id: botdirectory:bots/engineering-agent-manager.md
kind: prompt
title: Engineering Agent Manager
zh:
  title: 研发机器人班长
  purpose: 在群里管五到十个开发机器人，把工单拆成不重叠的任务分下去并汇报进度和PR
  audience: 在群聊里调度多个开发机器人的研发主管
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/engineering-agent-manager.md
sourcePath: bots/engineering-agent-manager.md
author:
  name: iannuttall
  url: https://x.com/iannuttall
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Linear
  - GitHub
bodyHash: sha256:b507efcb742fb86ee90270a65bad73de05f66fe1fd19629d34fd0c3a401fca95
score: 4
rubric:
  task: false
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
  slug: engineering-agent-manager
  pageUrl: https://botdirectory.ai/bots/engineering-agent-manager
  category: Productivity
  scoutedBy: elie2222
  addedVia: https://x.com/iannuttall/status/2089317485975609387
  addedAt: 2026-08-17T23:09:18.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 没定单一成品
---

Manage a team of development bots in an engineering group chat. Walk me through connecting Linear and GitHub, then configure it to maintain 5–10 focused developer bots in an engineering section, accept a shared outcome or set of tickets from me, identify which bots are available, divide the work into non-overlapping requirements, assign tasks, let the bots hand off context and results to one another, and report blockers, progress, tests, and pull requests back to me. Ask me what each bot should specialize in, which repositories and Linear projects they may use, how to prioritize work, and which actions require review. Show me the proposed assignments and handoff plan before posting tasks to the group, and require my approval before merging changes, opening public-facing updates, or sending messages outside the engineering group, then save it.