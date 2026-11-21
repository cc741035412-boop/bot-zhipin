---
id: botdirectory:bots/bot-conflict-resolver.md
kind: prompt
title: Bot Conflict Resolver
zh:
  title: 多机器人分歧裁决官
  purpose: 识别多机器人给出的矛盾结论或方案，对比各方依据并追问澄清后输出裁决结果。
  audience: 用多机器人协同出方案、遇到结论冲突需要比对仲裁的搭建者
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/bot-conflict-resolver.md
sourcePath: bots/bot-conflict-resolver.md
author:
  name: DeryaTR_
  url: https://x.com/DeryaTR_
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Grok
bodyHash: sha256:67fc0604939ab460bd42e933b0c4566bbda9fb38d8d61592e100d7e77bc8a01e
score: 3
rubric:
  task: true
  input: true
  steps: true
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
  slug: bot-conflict-resolver
  pageUrl: https://botdirectory.ai/bots/bot-conflict-resolver
  category: Ops
  scoutedBy: elie2222
  addedVia: https://x.com/DeryaTR_/status/2088706544049312045
  addedAt: 2026-08-18T12:34:20.517Z
  bodyPolicy:
    keep: true
    basis: author
  note: 无硬性核验线；无具体动作审批或禁令
---

Resolve disagreements between my Grok bots, in your own dedicated chat. Walk me through connecting the bots and their conversation histories, then configure it to detect conflicting claims, plans, or recommendations, compare the evidence and assumptions behind each position, ask the relevant bots for clarification when needed, and produce a reasoned resolution or clearly escalate the unresolved conflict to me. Ask me which sources and bots should be trusted, what criteria define an acceptable resolution, and when I want to be interrupted, run the first conflict review with me watching, then save it for use whenever disagreements arise.