---
id: cobus:patterns/no-data-policy/pattern.yaml
kind: recipe
title: No-data / stale-data policy
zh:
  title: 数据源缺失直接报错规范
  purpose: 在模板和定时任务里配置缺源处理规则，拉不到最新数据时直接报失败，不拿旧表凑数。
  audience: 配置定时巡检或报表、怕拉不到新数据时被旧数据误导的负责人
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/patterns/no-data-policy/pattern.yaml
sourcePath: patterns/no-data-policy/pattern.yaml
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:96f4b5b4997829744798db3a73f8dfc72cf01c9b1f722034893cf94678304bad
score: 1
rubric:
  task: false
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
  note: 只有缺数据硬规则，无任务、输入、三步或审批
---

id: no-data-policy
name: No-data / stale-data policy
summary: >
  If the source is unavailable, report the failure instead of using old
  data. Missing CI is "CI not found", not "tests look fine".
rule: >
  Every template has no_data. Every routine has missing_source.
  Yesterday's numbers are not today's.
anti_pattern: Silent fallback to last week's spreadsheet.
source: https://docs.x.ai/grok-bot/skills-routines-and-automations
applies_to:
  - templates
  - routines