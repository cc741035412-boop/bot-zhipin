---
id: cobus:patterns/shared-computer-is-not-isolation/pattern.yaml
kind: recipe
title: Shared computer is not isolation
zh:
  title: 同账号云端凭据隔离规范
  purpose: 规避同账号下多Bot共用云电脑的凭据泄露风险，明确何时不能存凭证或需退出登录。
  audience: 在同一账号下运行多个业务Bot的团队管理员
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/patterns/shared-computer-is-not-isolation/pattern.yaml
sourcePath: patterns/shared-computer-is-not-isolation/pattern.yaml
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:ef889468d28c2220e64d0703ca6037eaf82d430fd77c790f6a4b06e924dbceb1
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
  note: 只有共享凭据禁令，无任务、指定输入、三步或验收
---

id: shared-computer-is-not-isolation
name: Shared computer is not isolation
summary: >
  Every Bot on an account uses the same cloud computer — cookies, files,
  CLI credentials. Separate Bots are not a security boundary.
rule: >
  Do not place a credential on the computer if another Bot should not use
  it. Sign out when the whole roster should lose a service.
anti_pattern: "The finance Bot is isolated because it is a different Bot."
source: https://docs.x.ai/grok-bot/computer-and-apps
applies_to:
  - templates
  - teams
  - safety