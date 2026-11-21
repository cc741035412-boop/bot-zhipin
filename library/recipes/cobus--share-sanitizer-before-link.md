---
id: cobus:patterns/share-sanitizer-before-link/pattern.yaml
kind: recipe
title: Sanitize before you share
zh:
  title: 分享链接脱敏规范
  purpose: 生成Bot公开分享链接前清理描述、技能与定时任务里的密钥，防止带出私密信息。
  audience: 需要对外发布或分享Bot模板的创作者
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/patterns/share-sanitizer-before-link/pattern.yaml
sourcePath: patterns/share-sanitizer-before-link/pattern.yaml
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:c8c1ce1798185e44ca3a1985536ac4e17637b80141b95329c72d4e310a488ee0
score: 2
rubric:
  task: false
  input: true
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
  note: 点名待脱敏配置，但无明确交付、三步或验收
---

id: share-sanitizer-before-link
name: Sanitize before you share
summary: >
  A public share link copies identity, description, skills, and routines.
  It does not copy your computer. Still: strip secrets first.
rule: >
  Run Share Sanitizer (or the same review) before copying x.ai/bot/<id>.
  Recipients accept third-party bot terms. Do not add a random share URL
  on the owner's behalf.
anti_pattern: Shipping a template with an API key in the description.
source: https://docs.x.ai/grok-bot/bots
applies_to:
  - templates
  - sharing