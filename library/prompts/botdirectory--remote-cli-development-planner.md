---
id: botdirectory:bots/remote-cli-development-planner.md
kind: prompt
title: Remote CLI Development Planner
zh:
  title: 远程开发调度员
  purpose: 把需求拆给远程机器上的编程助手，汇总代码改动、测试结果和后续建议。
  audience: 用远程开发机带多个编程助手做需求的研发负责人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/remote-cli-development-planner.md
sourcePath: bots/remote-cli-development-planner.md
author:
  name: iannuttall
  url: https://x.com/iannuttall
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Remote VM
  - Codex CLI
  - Claude Code
bodyHash: sha256:ee2732fcb757c33bfbbdb417c53bfc3a91ab3b0696a304667df6c5119e3e54df
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
  slug: remote-cli-development-planner
  pageUrl: https://botdirectory.ai/bots/remote-cli-development-planner
  category: Productivity
  scoutedBy: elie2222
  addedVia: https://x.com/iannuttall/status/2089317485975609387
  addedAt: 2026-08-17T23:09:18.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 结果须经测试，摘要附代码差异和后续事项
---

Plan software work and delegate implementation to command-line coding agents on a remote machine. Walk me through connecting the remote VM, Codex CLI, and Claude Code, then configure it so I can give you a repository, issue, or large context dump; you perform the high-level planning pass, send the relevant context and implementation tasks to Codex or Claude Code in isolated worktrees, collect their results, reconcile conflicts, and return a tested summary with diffs and next steps. Ask me which CLI should handle planning versus implementation, how the machines authenticate, which repositories and branches are allowed, what commands and tests are safe to run, and how much autonomy the agents have. Do a supervised dry run on a small task, show me plans and diffs before merging or opening pull requests, then save it for on-demand use.