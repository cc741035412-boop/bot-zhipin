---
id: grokbotdev:content/use-cases/build-a-one-person-hedge-fund.md
kind: prompt
title: Fund Desk · One-Person Hedge Fund
zh:
  title: 一人量化基金架构师
  purpose: 按先后台合规再投研风控的顺序搭建八个分工协作的模拟盘基金角色
  audience: 想用多智能体跑通量化投研和模拟交易全流程的独立交易员
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/build-a-one-person-hedge-fund.md
sourcePath: content/use-cases/build-a-one-person-hedge-fund.md
author:
  name: GrokBot.dev contributors
  url: https://github.com/ZeroPointRepo/GrokBotDev
  role: curator
license: CC-BY-4.0
attribution:
  by: GrokBot.dev contributors
  repo: ZeroPointRepo/GrokBotDev
  license: CC BY 4.0
  licenseUrl: https://creativecommons.org/licenses/by/4.0/
fetchedAt: 2026-11-21T06:44:43Z
changes: 只收「## Prompt」下代码块里的提示词原文，一字未改；原页面的设置步骤和点评没有收；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:e69d49dcd09f196f784e1f19d4dc8ac78890078f554b3137157ac7e9dcd2147a
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
  promptBlock: true
  provenance: curator
  inspiredBy:
    name: RohOnChain
    url: https://x.com/RohOnChain
  setupMinutes: 90
  difficulty: advanced
  autonomy: acts-with-approval
  schedule: daily
  category: engineering
  subcategory: agents-ops
  awesomeScore: 82
  replicability: The prompt is a curator reconstruction of the paper's architecture, not the paper itself. Treat it as a research/operations blueprint, not financial advice. Keep it in paper-trading mode - live execution and especially accepting outside capital are regulated activities to clear with counsel first.
  status: live
  setup: |-
    RohOnChain posted a practitioner's paper - as an image - making one sharp claim: for thirty years the wall between a solo quant and an institutional fund was **headcount**, and that wall just fell. A real fund runs three teams (a research desk, a trading operation, a back office); the paper maps them onto **eight named bots on one shared cloud computer**, and reports a thirty-day run covering 100 stocks for roughly $3,000/year against an institutional stack it pegs near $3.8M.

    The counterintuitive part is the **construction order**, and it's the whole lesson:

    1. **Business operations first.** Every solo quant makes the same mistake - they build a beautiful research layer, hit a perfect backtest, then hit the wall that kills them: no entity, no way to accept capital, no billing, no compliance. So you build the boring layer first, using the [Whop plugin](/plugins/) for entity/billing/subscription plumbing through plain conversation.
    2. **Research second.** Now the research desk has somewhere to plug in. Academic methods anchor it - insider-cluster signals, Loughran-McDonald sentiment on filings, Fama-French factor decomposition - so output is checkable, not confident hallucination.
    3. **Six layers, eight bots:** research, signal generation, execution, risk, business operations, and growth - each a named bot with one job.
    4. **Maker-checker separation.** No bot grades its own output. The bot that generates a signal is never the bot that approves it - the single rule that keeps the whole thing honest.
    5. **Three primitives make it possible:** the shared cloud computer (bots share one filesystem, browser and terminal), the native plugin marketplace (Whop, Composio, Notion, etc. over MCP), and native X integration for real-time signal.
  note: 运营、研究、风控和执行是多项交付
---

Act as my fund architect. Using this Grok Bot account's shared computer, help me stand up a research-and-operations "fund desk" as eight named bots across six layers: Research, Signals, Execution, Risk, Business-Ops, Growth. Build in this order, and do not skip ahead:

1. BUSINESS-OPS FIRST. Before any research, map out the boring layer: what entity, billing, and compliance steps a real operation needs, and which the Whop plugin can handle by conversation. List what only a human/lawyer can do. Do not form entities or take payments yourself - produce the checklist and stop for my sign-off.
2. RESEARCH SECOND. Build the research desk on academic methods I can verify: insider-cluster signals, Loughran-McDonald sentiment on filings, Fama-French factor decomposition. Cite the method for every signal. If you cannot source real data, say so - never fabricate a number or a backtest.
3. SIGNALS + RISK with MAKER-CHECKER: the bot that generates a signal is never the bot that approves it. Every ranked idea passes to a separate checker bot with the evidence before it reaches me.
4. EXECUTION stays in PAPER-TRADING ONLY. Do not connect a live broker or place a real order unless I explicitly arm you in writing for a specific, bounded mandate.

Hard rules: this is not financial advice and you will label it so. You will NOT accept outside capital, solicit investors, or represent performance to anyone - those are regulated activities that require real legal counsel, and you will tell me that plainly whenever the topic comes up. Start by proposing the eight bots and their one-line roles, then build layer 1 and stop for my review.