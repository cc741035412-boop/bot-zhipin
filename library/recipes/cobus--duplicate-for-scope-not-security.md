---
id: cobus:patterns/duplicate-for-scope-not-security/pattern.yaml
kind: recipe
title: Duplicate for scope, not security
zh:
  title: 按业务范围复制角色指南
  purpose: 分区域复用同一岗位时复制角色并重命名业务范围，别把复制当成隔离账号凭证的手段。
  audience: 想按地区拆出多个同岗位机器人、或误以为复制能隔离权限的管理员
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/patterns/duplicate-for-scope-not-security/pattern.yaml
sourcePath: patterns/duplicate-for-scope-not-security/pattern.yaml
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:115f8062423364a52a097d7a85d652ac8531d7a32df3c72492e69903f73035fd
score: 0
rubric:
  task: false
  input: false
  steps: false
  acceptance: false
  approval: false
cnFit:
  value: 一般
  blocked:
    - Gmail
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  note: 只教复制分工，未定产出、输入、三步、验收或审批
---

id: duplicate-for-scope-not-security
name: Duplicate for scope, not security
summary: >
  Duplicate a Bot when you want the same role for a different scope —
  one Account Health per region. The copy gets profile, skills, routines,
  avatar — not history or memory.
rule: >
  Rename and give the new scope before assigning work. Do not duplicate
  in the hope that credentials will not leak across copies. They share a computer.
anti_pattern: "I'll copy Finance so it cannot see Gmail."
source: https://docs.x.ai/grok-bot/bots
applies_to:
  - teams
  - safety