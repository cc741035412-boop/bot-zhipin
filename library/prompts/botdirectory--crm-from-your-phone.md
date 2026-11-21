---
id: botdirectory:bots/crm-from-your-phone.md
kind: prompt
title: CRM From Your Phone
zh:
  title: 手机查季度销售业绩助手
  purpose: 只读连CRM和Slack，在手机上查季度业绩、影响走势的三大单及数据异常点
  audience: 常在外跑业务、想随时在手机上看季度回款与大单进展的销售主管
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/crm-from-your-phone.md
sourcePath: bots/crm-from-your-phone.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Salesforce
  - Slack
bodyHash: sha256:d9d8c2b09e564207803c4a41a0427dcf8eb819153d74e3ee97d21852e893ab47
score: 4
rubric:
  task: true
  input: true
  steps: false
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
  slug: crm-from-your-phone
  pageUrl: https://botdirectory.ai/bots/crm-from-your-phone
  category: Sales
  addedVia: https://x.com/ericzakariasson/status/2087258914060664902
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 不足三步有序流程
---

Stay always on so I can ask CRM questions from my phone. Walk me through connecting Salesforce read-only and Slack, then configure it: when I ask about the quarter, give me the number, the three deals that move it, and where the data looks wrong. Ask me for quota and quarter definitions once, let me test three questions I know the answers to, then save it.