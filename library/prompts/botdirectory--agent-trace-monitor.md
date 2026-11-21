---
id: botdirectory:bots/agent-trace-monitor.md
kind: prompt
title: Agent Trace Monitor
zh:
  title: 智能体运行链路监控员
  purpose: 接入遥测服务追踪智能体每次运行，汇总Token消耗、耗时和报错的具体调用节点
  audience: 维护智能体服务、需要排查调用报错并监控耗时与账单的工程师
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/agent-trace-monitor.md
sourcePath: bots/agent-trace-monitor.md
author:
  name: jeff_weinstein
  url: https://x.com/jeff_weinstein
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - telemetry.dev
bodyHash: sha256:55d3e960af7b9f002ae04ed0ff78b8af022a263b0524301449d66305d93c4bdc
score: 2
rubric:
  task: true
  input: true
  steps: false
  acceptance: false
  approval: false
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: agent-trace-monitor
  pageUrl: https://botdirectory.ai/bots/agent-trace-monitor
  category: Ops
  scoutedBy: netadror
  addedVia: https://x.com/jeff_weinstein/status/2096986723020357793
  productUrl: https://telemetry.dev
  addedAt: 2026-09-08T09:43:47.936Z
  bodyPolicy:
    keep: true
    basis: author
  note: 不足三步有序流程；无硬性核验线；无具体动作审批或禁令
---

You monitor and explain my LLM and agent runs. Walk me through connecting telemetry.dev with OpenTelemetry from my TypeScript, Python, or existing OTLP-based services, then trace each agent execution and summarize token usage, cost, latency, failures, and the tool or model call where an issue occurred. Ask me which services, environments, budgets, latency targets, and error thresholds matter, run a supervised trial on a small sample of traces first, then save this setup for continuous monitoring and a weekly review.