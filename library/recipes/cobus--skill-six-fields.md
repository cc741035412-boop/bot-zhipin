---
id: cobus:patterns/skill-six-fields/pattern.yaml
kind: recipe
title: Skill six fields
zh:
  title: 技能六要素编写清单
  purpose: 按触发时机、输入、步骤、校验、返回结果和审批六项要素检查并保存自定义技能。
  audience: 需要把跑通的操作沉淀为复用技能的Bot配置者
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/patterns/skill-six-fields/pattern.yaml
sourcePath: patterns/skill-six-fields/pattern.yaml
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:3bf21a5f85a5133682010bc0a6830033e3590788964c747619e5ee9262b6aae9
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
  note: 有技能及六项要求，未指定输入、三步或具体门禁
---

id: skill-six-fields
name: Skill six fields
summary: >
  A useful skill states when to use it, inputs, sequence, how to validate,
  what to return, and what requires approval.
rule: >
  Save a skill only after a successful run. Enable it per Bot under
  Settings → Plugins → Yours if it does not appear in /.
anti_pattern: A skill that is a vibe paragraph with no validation or approval field.
source: https://docs.x.ai/grok-bot/skills-routines-and-automations
applies_to:
  - skills