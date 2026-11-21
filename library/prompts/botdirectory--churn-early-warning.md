---
id: botdirectory:bots/churn-early-warning.md
kind: prompt
title: Churn Early Warning
zh:
  title: 客户流失苗头每日预警员
  purpose: 每天交叉比对席位闲置与工单语气并在Slack发出流失预警及挽留建议
  audience: 盯付费席位活跃度和大客户续费率的客户成功经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/churn-early-warning.md
sourcePath: bots/churn-early-warning.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Salesforce
  - PostHog
  - Slack
bodyHash: sha256:26b5228b0d0260f57953aa4193564cc0388a300b90c0617e6aa5b857339ca19e
score: 1
rubric:
  task: false
  input: true
  steps: false
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
  slug: churn-early-warning
  pageUrl: https://botdirectory.ai/bots/churn-early-warning
  category: Success
  addedVia: https://x.com/ericzakariasson/status/2087258914060664902
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 没定单一成品；不足三步有序流程；无硬性核验线；无具体动作审批或禁令
---

Run on a daily schedule to forecast account health. Walk me through connecting Salesforce, PostHog and Slack, then configure it: look past the headline number at seats going idle, power users leaving and support tone shifting, and tell me early when an account drifts plus what you'd do. Ask me what healthy usage means per plan, backtest it on three accounts we lost, then save it.