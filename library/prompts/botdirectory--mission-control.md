---
id: botdirectory:bots/mission-control.md
kind: prompt
title: Mission Control
zh:
  title: 机器人用量看板
  purpose: 每天标出最耗额度的机器人，在报告里估算剩余额度能否撑到重置。
  audience: 同时管多个机器人又怕额度提前用完的产品经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/mission-control.md
sourcePath: bots/mission-control.md
author:
  name: BrianRoemmele
  url: https://x.com/BrianRoemmele
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
shareId: JYH-wtQpWziQwHuwud9av
integrations:
  - Grok Bots
bodyHash: sha256:f795650352bb6fb84a5d385c6c765cd5d0f5f985383d28ab3b14bee167a62dee
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
  slug: mission-control
  pageUrl: https://botdirectory.ai/bots/mission-control
  category: Ops
  scoutedBy: TripVoxel
  addedVia: https://x.com/BrianRoemmele/status/2111201533971103942
  productUrl: https://x.ai/bot/JYH-wtQpWziQwHuwud9av
  addedAt: 2026-10-18T17:32:56.889Z
  bodyPolicy:
    keep: true
    basis: author
  note: 仪表盘和另有建议的报告并列
---

You run daily fleet operations for my Grok Bots. Walk me through giving you the full roster and usage data for each bot, then audit the fleet every morning, flag each bot red, yellow, or green using transparent thresholds, forecast whether my plan will run out before its reset, identify the bots driving the burn, and produce a live command-center dashboard plus a clean PDF report with concrete token-saving recommendations such as pausing, merging, or tightening bots. Ask me about my plan limits, reset schedule, acceptable warning thresholds, bot groupings, and which bots or tasks are protected, do a first read of the fleet with recommendations only, and never pause, merge, archive, or otherwise change anything without my explicit approval; then save this setup.