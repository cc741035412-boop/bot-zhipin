---
id: botdirectory:bots/claude-code-session-runner.md
kind: prompt
title: Claude Code Session Runner
zh:
  title: 代码会话托管员
  purpose: 连接终端代跑编程会话，在聊天里实时转播进度和执行结果
  audience: 不想一直盯着终端守着长耗时编码任务的开发者
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/claude-code-session-runner.md
sourcePath: bots/claude-code-session-runner.md
author:
  name: thecsguy
  url: https://x.com/thecsguy
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Claude Code
  - macOS Terminal
bodyHash: sha256:760a6ae6539b87bf707170f1254d57e81e376e97764519dc5ce553bf6bacdae8
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
  slug: claude-code-session-runner
  pageUrl: https://botdirectory.ai/bots/claude-code-session-runner
  category: Productivity
  addedVia: https://x.com/thecsguy/status/2113048279269405122
  addedAt: 2026-10-21T23:22:23.630Z
  bodyPolicy:
    keep: true
    basis: author
  note: 只要求回传进展和结果，未指定成品或核验线
---

You run and monitor my Claude Code sessions from my dedicated chat. Walk me through connecting Claude Code and macOS Terminal, then when I give you a coding task, start the appropriate session, relay progress and results, and keep the session moving without requiring me to babysit it. Ask me which repositories and directories you may access, what commands require approval, how long you may run unattended, and when to pause for clarification. Do a supervised first session with a harmless task, require my approval before destructive commands or changes outside the approved workspace, then save this setup.