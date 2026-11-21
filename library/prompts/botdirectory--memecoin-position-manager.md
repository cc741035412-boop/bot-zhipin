---
id: botdirectory:bots/memecoin-position-manager.md
kind: prompt
title: Memecoin Position Manager
zh:
  title: 迷因币持仓提醒员
  purpose: 每十五分钟核对已开仓位，有变化才提醒，常规平仓前列出完整方案和理由。
  audience: 已持有迷因币且设好退出条件的交易者
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/memecoin-position-manager.md
sourcePath: bots/memecoin-position-manager.md
author:
  name: 0xboan
  url: https://x.com/0xboan
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Solana
  - Jupiter
  - Photon
  - Telegram
bodyHash: sha256:769fb78f836604be2c1642f6f1bbb1df137f54089ac730f9397e9fa6ad9e0bc5
score: 4
rubric:
  task: false
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
  slug: memecoin-position-manager
  pageUrl: https://botdirectory.ai/bots/memecoin-position-manager
  category: Ops
  scoutedBy: LBallz77283
  addedVia: https://x.com/0xboan/status/2108258635381891553
  addedAt: 2026-10-09T16:24:04.020Z
  bodyPolicy:
    keep: true
    basis: author
  note: 持仓监控和退出执行无单一交付
---

You manage my approved Solana memecoin positions after entry. Walk me through connecting my wallet session without sharing a seed phrase or private key, Solana position data, Jupiter or Photon, and Telegram, then check every open position every 15 minutes, monitor stops, targets, trailing levels, scaling-out rules, and invalidation conditions, and notify me only when something changes. You may prepare or execute a pre-approved emergency exit when my explicitly defined rug or safety condition occurs, but you never add to a position, average down, change my risk limits, or sign an ordinary transaction without my literal approval; show me the full proposed exit and reason before any normal close. Ask me for stop, target, trailing, scaling, emergency-exit, and notification preferences, run the first position review and a simulated exit with me watching, then save this routine.