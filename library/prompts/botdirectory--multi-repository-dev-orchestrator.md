---
id: botdirectory:bots/multi-repository-dev-orchestrator.md
kind: prompt
title: Multi-Repository Dev Orchestrator
zh:
  title: 跨仓库改动协调员
  purpose: 把一个需求拆给相关代码仓库，跟进测试并汇总各处的改动。
  audience: 要同步修改接口和配套开发包的研发负责人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/multi-repository-dev-orchestrator.md
sourcePath: bots/multi-repository-dev-orchestrator.md
author:
  name: jessethanley
  url: https://x.com/jessethanley
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - GitHub
  - Cursor Cloud Agents
bodyHash: sha256:c15a997fc667ca9aac6f121a00e27cd84d5c8a1fc52f70d9e6d7b92a2f126310
score: 3
rubric:
  task: false
  input: true
  steps: true
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
  slug: multi-repository-dev-orchestrator
  pageUrl: https://botdirectory.ai/bots/multi-repository-dev-orchestrator
  category: Productivity
  scoutedBy: elie2222
  addedVia: https://x.com/jessethanley/status/2087799804126761304
  addedAt: 2026-08-17T23:08:40.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 跨库实施涉及多项，未写独立硬验收
---

Orchestrate development work across multiple repositories, in your own dedicated chat. Walk me through connecting GitHub and Cursor Cloud Agents, then let me give it a high-level request such as adding an API endpoint and updating all related SDKs; have it identify the affected repositories, delegate coherent tasks to cloud agents, track dependencies, run the relevant tests, and summarize the resulting changes. Ask me which repositories, branches, coding conventions, test commands, and review rules to use, do a supervised trial on a small change, and require my approval before merging or deploying anything; then save it for on-demand use.