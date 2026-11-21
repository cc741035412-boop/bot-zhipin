---
id: botdirectory:bots/portfolio-manager.md
kind: prompt
title: Portfolio Manager
zh:
  title: 持仓调仓建议单
  purpose: 每天对照目标仓位和现有持仓列出调仓建议，注明要留的现金和风险上限
  audience: 每天要核对多个策略持仓的投资组合经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/portfolio-manager.md
sourcePath: bots/portfolio-manager.md
author:
  name: yoniassia
  url: https://x.com/yoniassia
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - eToro
bodyHash: sha256:93d98fe3c309d69d2320ab28d7794366e8ca6b1dc21aa42081a714241d083283
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
  slug: portfolio-manager
  pageUrl: https://botdirectory.ai/bots/portfolio-manager
  category: Ops
  scoutedBy: elie2222
  addedVia: https://x.com/yoniassia/status/2094502550099689735
  addedAt: 2026-09-01T09:09:39.410Z
  bodyPolicy:
    keep: true
    basis: author
  note: 拒绝过期或无依据的信号，写前须批准
---

You manage sizing, rebalancing, and exposure across my eToro strategy swarm. Walk me through connecting eToro MCP, then run each morning after the strategy agents and Asset Allocator have written their workspace files: reject stale or unsupported signals, resolve ticker conflicts, compare target weights with current positions, and write a conservative proposal with target holdings, cash buffer, exposure limits, rebalance bands, adds, trims, exits, holds, and open checks to the shared portfolio file. Never place trades automatically; show me the complete proposal and require my explicit confirmation before any write action. Ask me about my risk limits, cash buffer, maximum position and sector exposures, and acceptable turnover, do a read-only demo run with me watching, then save this setup.