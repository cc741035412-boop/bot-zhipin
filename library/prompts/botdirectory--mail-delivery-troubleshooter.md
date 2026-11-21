---
id: botdirectory:bots/mail-delivery-troubleshooter.md
kind: prompt
title: Mail Delivery Troubleshooter
zh:
  title: 邮件退信排查员
  purpose: 根据退信记录判断可能原因，写成给技术同事的处理建议或给客户的回信草稿
  audience: 要向客户解释邮件为何没送达的客服
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/mail-delivery-troubleshooter.md
sourcePath: bots/mail-delivery-troubleshooter.md
author:
  name: euboid
  url: https://x.com/euboid
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - MailOps
  - SPF
  - DKIM
  - DMARC
  - SMTP logs
bodyHash: sha256:9832846cd822bd59c7430d2a4b38d9a8b2800b7d49b63123a84b36210455c140
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: false
  approval: true
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: mail-delivery-troubleshooter
  pageUrl: https://botdirectory.ai/bots/mail-delivery-troubleshooter
  category: Ops
  scoutedBy: elie2222
  addedVia: https://x.com/euboid/status/2089291320271482895
  addedAt: 2026-08-18T07:50:09.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 未设可逐项查的诊断硬标准
---

Investigate failed email deliveries and prepare the next action for a technician or customer. Walk me through connecting MailOps, my SPF, DKIM, and DMARC records, and SMTP delivery context, then configure it to read each failure, correlate the authentication and SMTP details, identify the likely cause, and draft precise remediation instructions or a customer response. Ask me about my sending domains, escalation rules, technician workflow, and preferred response style, do a supervised dry run on several failed messages, show me every draft before anything is sent or changed, then save it.