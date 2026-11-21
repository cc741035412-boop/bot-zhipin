---
id: cobus:patterns/one-job-per-bot/pattern.yaml
kind: recipe
title: One job per Bot
zh:
  title: 单职责Bot拆分法
  purpose: 按单一可打分结果拆分Bot职责，避免把销售、客服和写代码塞进同一个全能助手。
  audience: 规划多Bot分工与团队模板的AI产品经理
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/patterns/one-job-per-bot/pattern.yaml
sourcePath: patterns/one-job-per-bot/pattern.yaml
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:bc93f5854dd6440a9290556cf9e7e0c0924df1a3d1a3c3d11ecb8b04fe161591
score: 1
rubric:
  task: true
  input: false
  steps: false
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
  note: 有一句成果描述，无指定输入、三步、硬验收或门禁
---

id: one-job-per-bot
name: One job per Bot
summary: >
  Create a separate Bot when the work has a distinct goal, tools, working
  style, approval boundary, or schedule. Catch-all helpers produce weak memory.
rule: >
  Name a repeatable outcome in one sentence a stranger could score. If you
  cannot, split the Bot.
anti_pattern: General Helper. Mega-bots that sales, support, and code in one description.
source: https://docs.x.ai/grok-bot/bots
applies_to:
  - templates
  - teams