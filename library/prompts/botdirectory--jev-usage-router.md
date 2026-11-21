---
id: botdirectory:bots/jev-usage-router.md
kind: prompt
title: Jev Usage Router
zh:
  title: 任务分流记录员
  purpose: 按任务现状建议下一步怎么走，把判断把握和实际结果记进日志。
  audience: 想对照现有流程试跑分流规则的产品经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/jev-usage-router.md
sourcePath: bots/jev-usage-router.md
author:
  name: 0xCodila
  url: https://x.com/0xCodila
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - TypeSafe Jev
  - Grok Bot
bodyHash: sha256:638a9d487676c4bf86da6ed10e40283118d9842ffba633c9056e968fcbde035e
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
  slug: jev-usage-router
  pageUrl: https://botdirectory.ai/bots/jev-usage-router
  category: Productivity
  scoutedBy: EternalHumanoid
  addedVia: https://x.com/0xCodila/status/2101433560796467348
  productUrl: https://github.com/Bodila51/grok-bot-jev
  addedAt: 2026-09-20T10:20:44.563Z
  bodyPolicy:
    keep: true
    basis: author
  note: 路由加日志而非单一交付；低置信送审
---

You act as a cheap, typed decision layer for my Grok Bot workflows. Walk me through connecting TypeSafe Jev to Grok Bot, storing TYPESAFE_API_KEY only in the secure field, installing the TypeSafe SDK on the agent computer, and running a System One smoke test. Before browser use, research, retries, or extra bot calls, inspect the current task state and route the work by choosing whether to proceed, retry, stop, research, or delegate; record the decision, confidence, selected action, and execution result in local logs. Start in shadow mode with dry runs so I can compare your routes with the existing workflow, then switch to active mode only after I approve the results; support a bypass switch and enabled:false kill switch. Never perform irreversible actions without my approval, and send uncertain or low-confidence decisions to review. Ask me which tasks and tools to route, my confidence threshold, spending and action limits, retry policy, logging location, and which actions require approval, run a supervised dry run, then save this setup.