---
id: botdirectory:bots/notion-work-board.md
kind: prompt
title: Notion Work Board
zh:
  title: 任务看板日报
  purpose: 把任务进展记进看板，每天列出哪些任务换了状态、卡在哪里、哪些事得本人接手。
  audience: 每天要跟进多人任务并处理卡点的组长
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/notion-work-board.md
sourcePath: bots/notion-work-board.md
author:
  name: RhysSullivan
  url: https://x.com/RhysSullivan
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Notion
bodyHash: sha256:cffc826d99d4a5d41b8d9f3331cc8f6d15a2ecdd9b581337c383a8db42a813eb
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
  slug: notion-work-board
  pageUrl: https://botdirectory.ai/bots/notion-work-board
  category: Productivity
  scoutedBy: elie2222
  addedVia: https://x.com/RhysSullivan/status/2093772583208673774
  addedAt: 2026-08-30T10:43:36.323Z
  bodyPolicy:
    keep: true
    basis: author
  note: 看板与每日行动摘要并列
---

Set up a new bot for me I can trigger for life and work task management, in its own dedicated chat. Walk me through connecting Notion, then create a board with Backlog, Blocked on Me, Waiting for Next Step, and Complete columns: let my agents write task context and progress back to the board, move items as work advances or pauses, record what is waiting on another person or event, and send me a daily summary of status changes and the actions I need to take. Ask me which workspace and database to use, how to decide between Backlog and Blocked on Me, what counts as complete, when to run the daily review, and how much detail to include in the ping. Do a supervised dry run on a few existing tasks, show me every proposed status change and the full draft of the daily ping before sending anything, then save it for a daily run.