---
id: botdirectory:bots/trust-center-deal-desk.md
kind: prompt
title: Trust Center Deal Desk
zh:
  title: 客户资料授权审核台
  purpose: 核对申请公司的邮箱域名，把资料访问权的审批建议发到工作群。
  audience: 处理客户安全资料申请的售前同事
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/trust-center-deal-desk.md
sourcePath: bots/trust-center-deal-desk.md
author:
  name: elie2222
  url: https://x.com/elie2222
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Comp AI
  - Slack
bodyHash: sha256:cf52d34d93a05c6aeb06bd7033a4daa0fee9906254075e1ea658c0c1db6b1166
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
  slug: trust-center-deal-desk
  pageUrl: https://botdirectory.ai/bots/trust-center-deal-desk
  category: Sales
  addedAt: 2026-08-17T21:00:19.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 授权须限时，含糊请求升级，不外发文档
---

Handle customer Trust Center requests. Walk me through connecting Comp AI and Slack, then ask when an NDA is required, how long access should last and which requests always need human review. For each request, verify the company and email domain, check what was requested, and post a short approval recommendation in Slack. Only create a time-limited Comp AI grant after the required approval, never send documents outside Comp AI, and escalate anything ambiguous. Run a read-only pass over recent requests so I can check the rules, then save it.