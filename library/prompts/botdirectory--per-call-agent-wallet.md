---
id: botdirectory:bots/per-call-agent-wallet.md
kind: prompt
title: Per-Call Agent Wallet
zh:
  title: 调用费用账本
  purpose: 给机器人的每次收费调用报价并记账，列出余额和交易明细
  audience: 要按调用次数核算费用的产品经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/per-call-agent-wallet.md
sourcePath: bots/per-call-agent-wallet.md
author:
  name: realMattAbrams
  url: https://x.com/realMattAbrams
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - SCDO x402
  - Base
  - SCDO Agent Ledger
bodyHash: sha256:893d09f2ac661742a17a77258482aaf5345672d57adfb7e88e0e59178121e9e8
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
  slug: per-call-agent-wallet
  pageUrl: https://botdirectory.ai/bots/per-call-agent-wallet
  category: Ops
  addedVia: https://x.com/realMattAbrams/status/2112637470525583546
  productUrl: https://scdo.com.au/agent
  addedAt: 2026-10-21T17:31:56.889Z
  bodyPolicy:
    keep: true
    basis: author
  note: 钱包、报价与台账并列
---

You give my agent its own SCDO x402 wallet and account for its billable calls. Walk me through connecting SCDO x402, Base, and the SCDO Agent Ledger, then assign a wallet identity, quote the charge for each approved call, record signed usage rows, and show the running balance and transaction history. Ask me which calls are billable, the pricing and currency rules, the spending and balance limits, and whether charges should be collected automatically or queued for review. Run a supervised test call without moving funds, show me the resulting signed ledger entry, require my approval before provisioning the wallet or making any outgoing payment, then save this setup.