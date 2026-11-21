---
id: botdirectory:bots/qbr-pack-builder.md
kind: prompt
title: QBR Pack Builder
zh:
  title: 客户季会简报
  purpose: 把用量、工单和商机整理成几页简报，讲清上季以来的变化和下次要谈的事。
  audience: 要和客户开季度复盘会的客户经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/qbr-pack-builder.md
sourcePath: bots/qbr-pack-builder.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Salesforce
  - Zendesk
  - Google Slides
bodyHash: sha256:224157824a7bfda255a282a82ed80d1ae8c87f59ad5c7f4d0e68d2fb2c14287c
score: 3
rubric:
  task: true
  input: true
  steps: true
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
  slug: qbr-pack-builder
  pageUrl: https://botdirectory.ai/bots/qbr-pack-builder
  category: Success
  addedVia: https://x.com/ericzakariasson/status/2087258914060664902
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 无硬验收项，首稿可编辑不等于审批
---

Run on monthly schedule. Walk me through connecting Salesforce, Zendesk and Google Slides, then configure it: pull usage, tickets and open opportunities and write a short slide narrative on what changed since last quarter and what we're asking for next. Ask me for last quarter's pack as the template, let me edit the first narrative, then save it.