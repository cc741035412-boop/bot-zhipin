---
id: cobus:patterns/group-for-visible-handoffs/pattern.yaml
kind: recipe
title: Group for visible handoffs
zh:
  title: 多角色建群明面交接规范
  purpose: 将二到六个角色拉进群聊，在开场白写清目标、下步负责人和禁令，用点名公开交接工作。
  audience: 需要多个机器人接力干活、不想在私聊里来回传话的团队搭建者
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/patterns/group-for-visible-handoffs/pattern.yaml
sourcePath: patterns/group-for-visible-handoffs/pattern.yaml
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:96f2e70401a069832b1fa5438acc3d2c83a48de5aec40326addb208a5189cd14
score: 2
rubric:
  task: true
  input: false
  steps: false
  acceptance: true
  approval: false
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  note: 有群组启动词，无指定输入、三步或审批动作
---

id: group-for-visible-handoffs
name: Group for visible handoffs
summary: >
  Use a group when several Bots need one shared outcome and visible
  handoffs. Two to six Bots. One owner per stage. @mentions.
rule: >
  Kickoff names the outcome, who owns the next step, and the never-list.
  Avoid @everyone. Too many parallel handoffs duplicate work.
anti_pattern: Five Bots in DM hell with no group, or one Bot pretending to be five.
source: https://docs.x.ai/grok-bot/chat-and-collaboration
applies_to:
  - teams