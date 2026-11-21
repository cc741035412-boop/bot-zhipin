---
id: botdirectory:bots/saas-cfo-monitor.md
kind: prompt
title: SaaS CFO Monitor
zh:
  title: 订阅业务财务巡检员
  purpose: 每周查漏记和异常支出，每月把收入、成本变动和待查问题写成财报。
  audience: 需要定期核对账目的软件订阅业务负责人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/saas-cfo-monitor.md
sourcePath: bots/saas-cfo-monitor.md
author:
  name: jessethanley
  url: https://x.com/jessethanley
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Stripe
  - Xero
  - QuickBooks
  - Gmail
bodyHash: sha256:f80fb9d82752c41199b5e7b750410edaeab2547de6f261959b88e571a389f761
score: 3
rubric:
  task: false
  input: true
  steps: true
  acceptance: false
  approval: true
cnFit:
  value: 一般
  blocked:
    - Gmail
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: saas-cfo-monitor
  pageUrl: https://botdirectory.ai/bots/saas-cfo-monitor
  category: Ops
  scoutedBy: elie2222
  addedVia: https://x.com/jessethanley/status/2087799804126761304
  addedAt: 2026-08-17T23:08:40.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 同时做周扫描、审计和月报，未写硬验收项
---

Act as a lightweight CFO for my SaaS business, in your own dedicated chat. Walk me through connecting Stripe, Xero or QuickBooks, and Gmail, then schedule a weekly scan of spending to flag missed charges or unusual items, perform a cost-of-goods-sold audit, and produce a monthly CFO report with revenue, costs, notable changes, and questions requiring attention. Ask me about my accounting system, COGS definitions, reporting periods, budgets, vendors, and materiality thresholds, run the first scan and audit with me watching, and require my approval before it changes records, pays anything, or contacts anyone; then save it for weekly scans and a monthly report.