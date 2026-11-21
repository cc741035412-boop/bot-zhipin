---
id: cobus:patterns/smallest-useful-roster/pattern.yaml
kind: recipe
title: Smallest useful roster
zh:
  title: 最小Bot阵容配置规范
  purpose: 控制团队Bot数量上限并按端到端结果或业务范围扩编，防止按心情建出一堆闲置角色。
  audience: 搭建多Bot协作团队并控制维护成本的负责人
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/patterns/smallest-useful-roster/pattern.yaml
sourcePath: patterns/smallest-useful-roster/pattern.yaml
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:52005a3cb2e523fcbb5669b30703848c0c1d436cfa0b88b3c4239ba14341fcaf
score: 2
rubric:
  task: false
  input: false
  steps: false
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
  note: 无具体交付、指定输入或三步；限制另增Bot
---

id: smallest-useful-roster
name: Smallest useful roster
summary: >
  Give one Bot ownership of an end-to-end outcome. Add another only when
  the work has a stable specialist role. Cap installer teams at four.
rule: >
  An account can have up to 50 Bots and group chats combined. That is a
  ceiling, not a target. Duplicate for scope (region, product), not for security.
anti_pattern: Spawning a Bot per mood. 20 Bots nobody remembers.
source: https://docs.x.ai/grok-bot/bots
applies_to:
  - teams
  - meta