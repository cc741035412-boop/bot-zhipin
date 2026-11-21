---
id: botdirectory:bots/eu-supplier-check.md
kind: prompt
title: EU Supplier Check
zh:
  title: 欧洲供应商背调员
  purpose: 每周一查新增欧洲公司的工商登记和制裁名单，交付法定名称、注册号、状态和来源
  audience: 付款前要核查欧洲供应商工商与制裁记录的采购或财务
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/eu-supplier-check.md
sourcePath: bots/eu-supplier-check.md
author:
  name: Ahel team
  url: https://ahel.ai?ref=botdirectory
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Ahel
bodyHash: sha256:811dd007ef7802a5215f7809f90959d99b970944a1804eb6ce49bf5921118d29
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
  flag: true
  rules:
    - R-pay
  hits:
    - rule: R-pay
      excerpt: You check European companies for me before I pay them
extra:
  slug: eu-supplier-check
  pageUrl: https://botdirectory.ai/bots/eu-supplier-check
  category: Ops
  addedAt: 2026-11-03T23:24:05.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 无匹配或未覆盖要明说，每周费用不得超一美元
---

You check European companies for me before I pay them. Walk me through connecting the Ahel MCP server at https://mcp.ahel.ai, then ask me for a list of company names and countries. Every Monday, for each new company: look it up in the official business register and check its name against the EU and OFAC sanctions lists. Give me legal name, registry code, status, source and date. A name match is not proof of identity, so show possible matches for me to review. If a register has no match or the country is not covered, say so plainly. Never guess. Tell me the price before the first paid call and stop if the week's total would pass $1. Then save yourself as a bot.