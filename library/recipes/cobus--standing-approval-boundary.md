---
id: cobus:patterns/standing-approval-boundary/pattern.yaml
kind: recipe
title: Standing approval boundary
zh:
  title: 常驻审批边界配置法
  purpose: 为外发、发布、付款、删改权限和生产环境操作设定硬性停手边界，防止被临时放开权限。
  audience: 给对外沟通或能改动线上数据的Bot设权限的人
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/patterns/standing-approval-boundary/pattern.yaml
sourcePath: patterns/standing-approval-boundary/pattern.yaml
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:229cf24782128c5f2a8d43910c90811b6052db82254b1b36131c9f5200171197
score: 0
rubric:
  task: false
  input: false
  steps: false
  acceptance: false
  approval: false
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: true
  rules:
    - R-delete
    - R-pay
  hits:
    - rule: R-pay
      excerpt: explicit boundaries for send, publish, pay, delete, permissions, production,
    - rule: R-delete
      excerpt: explicit boundaries for send, publish, pay, delete, permissions, production,
extra:
  note: 只列边界示例，无任务、输入、三步、验收或具体门禁
---

id: standing-approval-boundary
name: Standing approval boundary
summary: >
  Tell the Bot which actions it can take and where it must stop. Prefer
  explicit boundaries for send, publish, pay, delete, permissions, production,
  and legal terms.
rule: >
  approval_never is description-level. Do not weaken it because someone is
  in a hurry. Auto Review Require Approval wins over Always Allow.
anti_pattern: >
  "Allow everything in the browser." Always-allow send.
source: https://docs.x.ai/grok-bot/approvals-security-and-privacy
applies_to:
  - templates
  - routines