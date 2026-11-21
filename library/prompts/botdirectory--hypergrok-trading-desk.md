---
id: botdirectory:bots/hypergrok-trading-desk.md
kind: prompt
title: HyperGrok Trading Desk
zh:
  title: 交易研究台筹备员
  purpose: 配好七个分工不同的交易台角色，完成只读检查后交付配置回执。
  audience: 想先在研究模式下试用交易台的产品经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/hypergrok-trading-desk.md
sourcePath: bots/hypergrok-trading-desk.md
author:
  name: galleonlabs
  url: https://x.com/galleonlabs
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Hyperliquid
  - GitHub
  - Grok Bot
bodyHash: sha256:c187fdedec0af96424996e34f87014f0add9b0d0a280fbd08bd7e312d8f2bc3f
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
  slug: hypergrok-trading-desk
  pageUrl: https://botdirectory.ai/bots/hypergrok-trading-desk
  category: Personal
  productUrl: https://github.com/galleonlabs/hypergrok-trading-desk
  addedAt: 2026-08-19T15:42:42.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 七个专员、十七项技能、五项只读核验
---

Stand up the HyperGrok Trading Desk. Follow https://github.com/galleonlabs/hypergrok-trading-desk/blob/main/SETUP.md from top to bottom: clone the repository, create the seven specialist Bots—Desk Lead, Market Analyst, Research Analyst, Strategist, Risk Manager, Execution Trader, and Trade Reviewer—install the seventeen shared skills, and create the Trading Floor group chat with the first six (the Trade Reviewer works by DM). Walk me through connecting GitHub so you can fetch the desk files and Hyperliquid starting in research mode with no keys and no orders, then a trade-only API wallet on testnet before any mainnet wallet. Ask me for engagement level (research, testnet, or mainnet), the Hyperliquid account address the desk should read if I want live state, and my written risk limits. Run the five read-only verification checks from SETUP.md with me watching, never send an order without my explicit approval by ticket id, then finish with the receipt SETUP.md asks for and save the desk.