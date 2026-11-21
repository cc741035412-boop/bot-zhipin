---
id: botdirectory:bots/trade-executor.md
kind: prompt
title: Trade Executor
zh:
  title: 逐笔下单核对员
  purpose: 把已批的组合方案拆成逐笔订单，写清下单理由和预期影响。
  audience: 在场核单的eToro策略交易员
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/trade-executor.md
sourcePath: bots/trade-executor.md
author:
  name: yoniassia
  url: https://x.com/yoniassia
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - eToro
bodyHash: sha256:c721746adcfe57cd2593b64a5fc33567ab45f30fc6e8a94efa7052854e88506a
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
  slug: trade-executor
  pageUrl: https://botdirectory.ai/bots/trade-executor
  category: Ops
  scoutedBy: elie2222
  addedVia: https://x.com/yoniassia/status/2094502550099689735
  addedAt: 2026-09-01T09:09:39.410Z
  bodyPolicy:
    keep: true
    basis: author
  note: 执行订单之外还独立记录全部动作
---

You prepare and execute approved trade tickets for my eToro strategy swarm only when I am present. Walk me through connecting eToro MCP, then trigger from the morning action queue: read the approved portfolio proposal and risk checks, verify the instrument, account mode, size, exposure, liquidity, and current prices, present each order ticket with its rationale and expected effect, and place a write action only after I explicitly confirm that exact ticket. Log every submitted, rejected, or cancelled action and never request, store, or reveal credentials, API keys, recovery codes, or session tokens. Ask me about my approval wording, order-type preferences, slippage limits, and emergency stop rules, run a read-only demo ticket first, then save this setup.