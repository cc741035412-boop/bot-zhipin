---
id: botdirectory:bots/org-chart-keeper.md
kind: prompt
title: Org Chart Keeper
zh:
  title: 客户决策关系图
  purpose: 每周更新重点客户的组织图，标出谁能影响成交、谁只是来参会。
  audience: 跟进重点客户时要找对决策人的销售
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/org-chart-keeper.md
sourcePath: bots/org-chart-keeper.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Salesforce
  - LinkedIn
bodyHash: sha256:ca61a1db50f215f71c39e196ce9b711f0e81b70de65efe6b51cd7bdd42efed2c
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
  slug: org-chart-keeper
  pageUrl: https://botdirectory.ai/bots/org-chart-keeper
  category: Sales
  addedVia: https://x.com/ericzakariasson/status/2087258914060664902
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 区别决策影响者和仅参会者；无动作审批
---

Run on weekly schedule to keep our account org charts current. Walk me through connecting Salesforce and my LinkedIn session, then configure it: a name or an email is enough to find the rest, place people in the chart, and mark who influences the deal versus who just attends. Ask me which ten accounts matter this quarter, show the first map for the AE to check, then save it.