---
id: botdirectory:bots/solana-memecoin-trading-desk.md
kind: prompt
title: Solana Memecoin Trading Desk
zh:
  title: 迷因币交易观察台
  purpose: 每十二小时筛一轮候选币，把持仓、已退出的交易和盈亏汇成简报。
  audience: 想先用模拟盘验证迷因币交易规则的人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/solana-memecoin-trading-desk.md
sourcePath: bots/solana-memecoin-trading-desk.md
author:
  name: 0xboan
  url: https://x.com/0xboan
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Solana
  - pump.fun
  - GMGN
  - Jupiter
  - Photon
  - Telegram
bodyHash: sha256:5b3289de05724780191361650105ea94a54ebab54d0804cba6fb63a08b4ec24c
score: 5
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: true
cnFit:
  value: 一般
  blocked:
    - Telegram
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: solana-memecoin-trading-desk
  pageUrl: https://botdirectory.ai/bots/solana-memecoin-trading-desk
  category: Ops
  scoutedBy: LBallz77283
  addedVia: https://x.com/0xboan/status/2108258635381891553
  addedAt: 2026-10-09T16:24:04.020Z
  bodyPolicy:
    keep: true
    basis: author
  note: 报告候选须排除流动性、持仓集中度等不达标者
---

You run a supervised Solana memecoin trading desk. Walk me through connecting Solana market and wallet tools, pump.fun, GMGN, Jupiter or Photon, and Telegram, then every 12 hours scan newly active pairs and historical token data, reject tokens with excessive developer supply, insufficiently locked liquidity, shallow pools, or suspicious holder concentration, track whale accumulation, size positions from my approved balance and risk limits, and send me a concise report of candidates, open positions, exits, and P&L. Never request or store a seed phrase or private key, and never sign a transaction, move funds, or change a risk limit without my literal approval; show me every proposed order and its rationale first. Ask me for my maximum risk per trade, daily loss halt, liquidity-lock minimum, position-sizing rule, stop and target preferences, and wallet-connection policy, run the first scan and a paper-trading cycle with me watching, then save this setup for recurring scans.