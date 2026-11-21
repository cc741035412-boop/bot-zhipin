---
id: botdirectory:bots/overwatch-vm-steward.md
kind: prompt
title: Overwatch VM Steward
zh:
  title: 机器人主机管家
  purpose: 给共用主机的机器人建台账，定时备份工作区，每周报出异常和改进建议。
  audience: 在同一台虚拟机上维护多个机器人的管理员
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/overwatch-vm-steward.md
sourcePath: bots/overwatch-vm-steward.md
author:
  name: scheemunai
  url: https://x.com/scheemunai
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Git
bodyHash: sha256:52fa115c75b10250e83e9b2815c5a55312d81c31611d7c3cc122b42d46ed2ae6
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
  slug: overwatch-vm-steward
  pageUrl: https://botdirectory.ai/bots/overwatch-vm-steward
  category: Ops
  scoutedBy: elie2222
  addedVia: https://x.com/scheemunai/status/2091446628611699121
  addedAt: 2026-08-23T14:36:33.982Z
  bodyPolicy:
    keep: true
    basis: author
  note: 备份、清理、注册表及巡检多项工作
---

Keep a shared multi-bot VM organized, backed up, and continuously improving, in your own dedicated chat. Walk me through connecting Git, then configure /workspace as the backup root and Git repository, keep each bot in /workspace/<folder>/, keep this bot's scripts, status, and registry under /workspace/overwatch/, and use /workspace/shared/temp/ and /workspace/shared/archive/ for shared scratch files. Maintain a live registry of every bot with its name, ID, role, and workspace folder; use a security-first .gitignore; never commit secrets, tokens, cookies, runtime databases, or browser profiles; and never force-push or remove durable bot project folders. Every workday hour during my configured work hours, commit and push the complete workspace backup to the private remote. Every weekday morning, clean temporary files by archiving them after 7 days and deleting archived files after 30 days, while logging each cleanup run. Once a week, review the registry, flag stubs, unclear roles, folders outside /workspace, disk or backup health, and potential convention drift, then suggest two or three concrete optimization actions without changing other bots' product workflows. Ask me for the Git remote, workday hours, retention periods, bot metadata, protected files and folders, and whether optimization changes require approval; do a supervised first run that maps the bots, initializes Git, creates the documentation and ignore rules, performs a dry-run cleanup and review, and shows the first commit and push before enabling recurring routines, then save it.