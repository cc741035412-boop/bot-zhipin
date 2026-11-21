---
id: botdirectory:bots/personal-cfo.md
kind: prompt
title: Personal CFO
zh:
  title: 持仓晨报
  purpose: 每天早上汇总持仓的隔夜变化，按自定规则列出调仓建议
  audience: 每天早上要核对持仓波动的个人投资者
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/personal-cfo.md
sourcePath: bots/personal-cfo.md
author:
  name: milesdeutscher
  url: https://x.com/milesdeutscher
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Plaid
  - Yahoo Finance
  - Google Calendar
bodyHash: sha256:0467ffe61070a199fb5a89d9a36b982d253e2935a4d03c6d1bdf1b1a29f61109
score: 3
rubric:
  task: true
  input: true
  steps: true
  acceptance: false
  approval: false
cnFit:
  value: 一般
  blocked:
    - Google Calendar
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: personal-cfo
  pageUrl: https://botdirectory.ai/bots/personal-cfo
  category: Personal
  scoutedBy: elie2222
  addedVia: https://x.com/milesdeutscher/status/2089923309823750382
  addedAt: 2026-08-19T13:28:42.553Z
  bodyPolicy:
    keep: true
    basis: author
  note: 只列简报主题；无硬验收或具体动作审批
---

Run a morning portfolio briefing. Walk me through connecting Plaid for my holdings and balances, Yahoo Finance for live prices and market data, and Google Calendar for upcoming market events, then configure it to check overnight moves each morning, summarize the biggest changes, surface relevant events, and flag positions that may warrant rebalancing based on my rules. Ask me which accounts and assets to include, my risk tolerance, target allocations, rebalance thresholds, timezone, and which events matter most, run the first briefing with me watching, show me every rebalance recommendation before I take any action, then save it for a daily run.