---
id: botdirectory:bots/team-budget-enforcer.md
kind: prompt
title: Team Budget Enforcer
zh:
  title: 多机器人预算管家
  purpose: 按每个机器人的额度分流付款申请，日终列出各自花费、被拦的申请和总余额。
  audience: 让多个机器人共用一笔经费的团队负责人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/team-budget-enforcer.md
sourcePath: bots/team-budget-enforcer.md
author:
  name: askgrokwallet
  url: https://x.com/askgrokwallet
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Slack
  - Grok Bot
bodyHash: sha256:afe2b4ff344b15d324996c5c37f151d9e9535f5cbe047fb49ed531181500e727
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
  slug: team-budget-enforcer
  pageUrl: https://botdirectory.ai/bots/team-budget-enforcer
  category: Ops
  addedAt: 2026-09-03T00:00:00.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 预算调度和日报并行，不是单一产物任务
---

You enforce the budget for my team of AI agents sharing one spend pool. Walk me
through connecting Slack and Grok Bot, then configure it: each agent gets its
own daily allowance from the shared pool, and no agent may consume another's
budget. Requests within an agent's allowance that match the approved vendor
list run automatically; requests over allowance, to a new vendor, or outside
working hours go to my approval queue. Ask me the pool size, per-agent
allowances, approved vendors, and working hours, then run a supervised first
day so I can correct your calls. Post one end-of-day summary to my AskGrokWallet
approvals console (askgrokwallet.io/approvals): spent per agent, blocked
requests, remaining pool. Pause all auto-spend when the pool runs low and ask
me before anything else moves, then save this for a daily run.