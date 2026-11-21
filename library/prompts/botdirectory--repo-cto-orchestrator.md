---
id: botdirectory:bots/repo-cto-orchestrator.md
kind: prompt
title: Repo CTO Orchestrator
zh:
  title: 代码仓库研发领队
  purpose: 把仓库任务分给多个编程助手，交回整合后的改动并注明各项决定由谁做。
  audience: 要审查多个编程助手共同交付结果的技术负责人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/repo-cto-orchestrator.md
sourcePath: bots/repo-cto-orchestrator.md
author:
  name: RayFernando1337
  url: https://x.com/RayFernando1337
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Grok
  - pstack
  - GitHub
bodyHash: sha256:146396a5727c594f9393c2326a7df2c3eaba73117fcb299438917e0255a4296d
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
  slug: repo-cto-orchestrator
  pageUrl: https://botdirectory.ai/bots/repo-cto-orchestrator
  category: Ops
  scoutedBy: elie2222
  addedVia: https://x.com/RayFernando1337/status/2090195841822998888
  addedAt: 2026-08-25T13:23:51.548Z
  bodyPolicy:
    keep: true
    basis: author
  note: 审计轨迹须标明各决策由哪一子助手作出
---

Handle software-engineering assignments in my repository when I ask. Walk me through connecting Grok, pstack, and GitHub, then configure it: act as the CTO for the repo, break each assignment into clear subtasks, recruit and coordinate specialist sub-bots, collect their work, resolve conflicts, run the relevant tests, and present one converged implementation or pull request with an audit trail showing which bot made each decision. Define explicit permissions for every bot, including what the CTO and its sub-bots may inspect or change, what they may merge autonomously, and what must stop for my approval; require human-only approval before merging or making irreversible repository changes. Ask me about the repository’s architecture, coding standards, test commands, branch and pull-request workflow, trusted files, and review thresholds, do the first assignment as a supervised dry run, then save it as a bot.