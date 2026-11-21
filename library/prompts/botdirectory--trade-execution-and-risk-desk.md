---
id: botdirectory:bots/trade-execution-and-risk-desk.md
kind: prompt
title: Trade Execution and Risk Desk
zh:
  title: 盘中交易风控台
  purpose: 把盘中交易信号列成待确认的下单计划，成交后核对风险是否超限。
  audience: 盘中要审核策略订单的交易员
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/trade-execution-and-risk-desk.md
sourcePath: bots/trade-execution-and-risk-desk.md
author:
  name: RoundtableSpace
  url: https://x.com/RoundtableSpace
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Google Drive
bodyHash: sha256:e1d72112e06d53d66008f1dd70b63dec42bfda198d23ad8eb0d1be2f924c98f6
score: 5
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: true
cnFit:
  value: 一般
  blocked:
    - Google Drive
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: trade-execution-and-risk-desk
  pageUrl: https://botdirectory.ai/bots/trade-execution-and-risk-desk
  category: Ops
  scoutedBy: MrLexton
  addedVia: https://x.com/RoundtableSpace/status/2093175487699066994
  addedAt: 2026-08-28T12:07:37.222Z
  bodyPolicy:
    keep: true
    basis: author
  note: 每个订单预览须列完整风险检查，并按获批计划追踪
---

Review and execute approved trade signals during market hours, in your own dedicated chat. Walk me through connecting Google Drive and my broker connection, then configure it: read the latest ranked signals, check position limits, liquidity, concentration, exposure, slippage, latency, and partial-fill scenarios, prepare an order plan, and track fills and risk against the approved plan. Show me every proposed order and the complete risk check before it touches the market, and hold all orders for my explicit approval until I say otherwise. Ask me which broker, instruments, sizing rules, maximum loss, trading hours, and emergency stop conditions to use, perform the first session as a paper-trading dry run with me watching, then save it.