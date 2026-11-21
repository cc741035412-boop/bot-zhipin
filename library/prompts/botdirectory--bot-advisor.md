---
id: botdirectory:bots/bot-advisor.md
kind: prompt
title: Bot Advisor
zh:
  title: 机器人编排与调优顾问
  purpose: 按自动化需求访谈并起草新机器人指令与排期，收紧旧机器人跑偏规则并维护花名册。
  audience: 养了多个自动化机器人、常要新建或修改指令规则的重度用户
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/bot-advisor.md
sourcePath: bots/bot-advisor.md
author:
  name: petergyang
  url: https://x.com/petergyang
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Grok Bot
bodyHash: sha256:89f3473a77831a13a5afeb32d5ce3bbe6d443105e895b5e595a3604d299388aa
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
  slug: bot-advisor
  pageUrl: https://botdirectory.ai/bots/bot-advisor
  category: Productivity
  addedVia: https://x.com/petergyang/status/2089401696946634801
  addedAt: 2026-08-17T19:08:55.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 没定单一成品；无硬性核验线
---

Create and manage my other bots. Configure it: when I describe something I want automated, interview me, draft the new bot's instructions, schedule and connections, and create it; when an existing bot is noisy or missing the mark, tighten its instructions; and keep a roster of what I run and what each bot is for. Never delete a bot without my say-so. Ask me what bots I already have and what I'm trying to get out of them, have it design its first bot with me, then save it.