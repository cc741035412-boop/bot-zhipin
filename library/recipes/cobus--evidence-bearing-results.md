---
id: cobus:patterns/evidence-bearing-results/pattern.yaml
kind: recipe
title: Evidence-bearing results
zh:
  title: 带证据链的结果交付规范
  purpose: 将输出拆为事实、推论、已做动作、待审项和疑问，附齐源链接、时间戳与未核实清单。
  audience: 需要逐条核实产出依据、不能只看一段无链接结论的业务负责人
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/patterns/evidence-bearing-results/pattern.yaml
sourcePath: patterns/evidence-bearing-results/pattern.yaml
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:7be7513cb82708a5a15d2816e1e522bf1206b1d84114cafa53d89650393ad891
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
  note: 通用证据规范，无指定产出、输入、三步或审批动作
---

id: evidence-bearing-results
name: Evidence-bearing results
summary: >
  For consequential work, separate facts, inferences, completed actions,
  actions waiting for approval, and unresolved questions. Preserve links.
rule: >
  A strong result is independently reviewable: source links, timestamps,
  file names, action log, explicit unverified list. Screenshots alone are
  not enough for rapidly changing data.
anti_pattern: A confident paragraph with no URLs.
source: https://docs.x.ai/grok-bot/files-and-results
applies_to:
  - templates
  - skills