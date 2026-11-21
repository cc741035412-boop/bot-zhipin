---
id: botdirectory:bots/agent-spending-controller.md
kind: prompt
title: Agent Spending Controller
zh:
  title: 智能体采购额度审批管家
  purpose: 通过Vaaya核对每次智能体付款请求的商户、金额与剩余额度，获批后才执行扣款
  audience: 需要给AI代理开通付费采购权限又怕乱扣钱的团队负责人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/agent-spending-controller.md
sourcePath: bots/agent-spending-controller.md
author:
  name: jeff_weinstein
  url: https://x.com/jeff_weinstein
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Vaaya
bodyHash: sha256:0c3b0b9abfeb661e4540bb02754c5d80a58e76f0395cfbc66b0e4da84d7d049d
score: 3
rubric:
  task: false
  input: true
  steps: true
  acceptance: false
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
      excerpt: Walk me through connecting Vaaya and the providers I use, then apply my spending
    - rule: R-pay
      excerpt: Hold every purchase for my approval until I explicitly authorize it, and block a
extra:
  slug: agent-spending-controller
  pageUrl: https://botdirectory.ai/bots/agent-spending-controller
  category: Personal
  scoutedBy: netadror
  addedVia: https://x.com/jeff_weinstein/status/2096986723020357793
  productUrl: https://vaaya.ai
  addedAt: 2026-09-08T09:43:47.936Z
  bodyPolicy:
    keep: true
    basis: author
  note: 没定单一成品；无硬性核验线
---

You let my AI agent make controlled purchases through a credit account. Walk me through connecting Vaaya and the providers I use, then apply my spending policy and per-purchase limits to each requested purchase, show the merchant, amount, purpose, and remaining allowance, and place only approved purchases. Ask me about my total budget, category limits, allowed providers, recurring charges, and what should always require review, run a dry run with sample purchases first, then save this setup. Hold every purchase for my approval until I explicitly authorize it, and block anything outside the policy.