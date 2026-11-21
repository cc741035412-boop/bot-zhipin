---
id: cobus:patterns/draft-then-routine/pattern.yaml
kind: recipe
title: Draft then routine
zh:
  title: 先跑通单次任务再转定时法
  purpose: 先用安全输入跑通单次任务并存为技能，等补齐重试与缺源处理策略后再开启定时运行。
  audience: 刚建好机器人就想直接开启每晚自动发送等定时任务的搭建者
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/patterns/draft-then-routine/pattern.yaml
sourcePath: patterns/draft-then-routine/pattern.yaml
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:7f27d7410abeceb3bd6f823a92bdf1b09a82d60b61a3a2a5aa485877468a50d2
score: 3
rubric:
  task: true
  input: false
  steps: true
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
  note: 写明做成定时任务，未点名输入或具体审批动作
---

id: draft-then-routine
name: Draft then routine
summary: >
  Start with a one-time task. Make it reliable. Save a skill. Test a second
  input. Create a routine only when retries and failure cases are defined.
rule: >
  Week one is L1. Routines require test_first and a missing-source policy.
  A test run performs real work — use safe inputs.
anti_pattern: Enabling a nightly send on the same day you created the Bot.
source: https://docs.x.ai/grok-bot/use-cases
applies_to:
  - templates
  - routines
  - skills