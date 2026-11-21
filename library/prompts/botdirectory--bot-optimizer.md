---
id: botdirectory:bots/bot-optimizer.md
kind: prompt
title: Bot Optimizer
zh:
  title: 现有Bot提示词与流程调优师
  purpose: 定期检查其他Bot的提示词和报错记录，在不改原用途的前提下拟出修改方案
  audience: 想根据日常运行记录持续改进手头Bot效果的创作者
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/bot-optimizer.md
sourcePath: bots/bot-optimizer.md
author:
  name: shubgaur
  url: https://x.com/shubgaur
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Grok
bodyHash: sha256:7fbdbfccf9ee74a5eaa89c6aec58d5f13ae68a17b0efe940bee27b134d13086f
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
  flag: false
  rules: []
  hits: []
extra:
  slug: bot-optimizer
  pageUrl: https://botdirectory.ai/bots/bot-optimizer
  category: Productivity
  scoutedBy: elie2222
  addedVia: https://x.com/shubgaur/status/2092375056089563604
  addedAt: 2026-08-26T11:34:43.235Z
  bodyPolicy:
    keep: true
    basis: author
  note: 没定单一成品；无硬性核验线
---

Automatically optimize my other bots. Walk me through connecting Grok and identifying the bots it may review, then configure it to inspect their prompts, routines, outputs, failures, and usage, recommend concrete improvements, and prepare changes that make them more useful without changing their purpose. Ask me which bots and metrics matter, what behavior is sacred, how much autonomy to allow, and how often to review them, do a supervised first optimization on a copy of one bot, show me every proposed change before applying it, then save it for a regular review.