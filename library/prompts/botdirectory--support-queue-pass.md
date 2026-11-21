---
id: botdirectory:bots/support-queue-pass.md
kind: prompt
title: Support Queue Pass
zh:
  title: 客服队列巡单员
  purpose: 每小时给有把握的工单拟答，遇到拿不准的才带着工单和原因来找你。
  audience: 想少收提醒又不能漏掉疑难单的值班客服
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/support-queue-pass.md
sourcePath: bots/support-queue-pass.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Zendesk
  - Slack
bodyHash: sha256:228b9f933ba437215c09b670a8f7a9e37b41d546926412cbc84f4c6cac3ced7c
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
  slug: support-queue-pass
  pageUrl: https://botdirectory.ai/bots/support-queue-pass
  category: Success
  addedVia: https://x.com/ericzakariasson/status/2087258964131979423
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 起草回复与待人工介入提醒并列
---

Run on an hourly schedule. Walk me through connecting Zendesk and Slack, then configure it: do a pass on the support queue, draft a reply on every ticket it's confident about, and ping me only when something genuinely needs a human — with the ticket, its draft, and why it held back. Drafts stay drafts until I approve the bot to send its easiest category. Ask me for our tone and the topics it must never answer alone, then save it.