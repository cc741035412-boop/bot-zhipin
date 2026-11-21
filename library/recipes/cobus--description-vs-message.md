---
id: cobus:patterns/description-vs-message/pattern.yaml
kind: recipe
title: Description vs message
zh:
  title: 常驻规则与单次指令分离法
  purpose: 把长期禁令写进角色描述、把当次任务放进对话消息，防止开新对话后丢掉安全边界。
  audience: 经常把几千字规则和当次任务混在一条聊天里发给机器人的配置者
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/patterns/description-vs-message/pattern.yaml
sourcePath: patterns/description-vs-message/pattern.yaml
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:496008354586f984ed01c16d7f3c5ba3227037f969038d6330061deb7be2b973
score: 1
rubric:
  task: false
  input: false
  steps: false
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
  note: 仅示例对比两处规则，无任务、输入、三步或验收
---

id: description-vs-message
name: Description vs message
summary: >
  Standing rules live in the Bot description. This-task instructions live
  in the conversation. Descriptions survive new threads; messages do not.
rule: >
  Put "Never send external messages without approval" in the description.
  Put "Draft follow-ups for these twelve accounts" in the message.
anti_pattern: A 4k-line prompt dumped into one chat, with no description-level never-list.
source: https://docs.x.ai/grok-bot/bots
applies_to:
  - templates