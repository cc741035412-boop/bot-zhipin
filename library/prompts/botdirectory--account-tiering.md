---
id: botdirectory:bots/account-tiering.md
kind: prompt
title: Account Tiering
zh:
  title: 客户分级清洗员
  purpose: 每周按匹配度乘热度给客户算分分级，写入Notion并分批补齐头部客户联系人
  audience: 管理大量销售线索需要每周筛选优先跟进名单的团队
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/account-tiering.md
sourcePath: bots/account-tiering.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Salesforce
  - Notion
bodyHash: sha256:378d4f4a84ef7ad025c4e555cbaf36db1a37371ecee7c692277ab4600781375f
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: false
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: account-tiering
  pageUrl: https://botdirectory.ai/bots/account-tiering
  category: Sales
  addedVia: https://x.com/ericzakariasson/status/2087258914060664902
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 未规定写入档位或补全联系人前须获批
---

Run on weekly schedule. Walk me through connecting Salesforce and Notion, then configure it: score every account on fit times warmth, write the tiers into a Notion database, and enrich contacts for the top tier in batches so the list is workable, not just ranked. Ask me what fit and warmth mean for our product, let me sanity-check tier one before the first full run, then save it.