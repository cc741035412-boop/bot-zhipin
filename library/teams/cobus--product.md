---
id: cobus:teams/product/team.yaml
kind: team
title: Product
zh:
  title: 产品排查与发版核对组
  purpose: 用看板和链路查清延迟峰值、归类群里的功能诉求，并维护上线清单直到发版决策前。
  audience: 要同时盯线上延迟异常、整理群聊需求并核对发版清单的产品经理
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/teams/product/team.yaml
sourcePath: teams/product/team.yaml
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - GitHub
  - Slack
  - Notion
bodyHash: sha256:fa7d2e4287663a7e2b7006b0c5a921e70455d445668fca2b606b7bf34a622596
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
  note: 性能、需求、发布各做各的，无有序流程或硬标准
---

id: product
name: Product
lead: product-performance
bots:
  - product-performance
  - feature-ask-collator
  - launch-coordinator
why: >
  Latency, Slack asks, and launch day collide unless one Bot owns
  evidence, one clusters asks, and one refuses to publish.
group_kickoff: >
  @Product Performance investigate the named latency spike with
  dashboards and traces. @Feature Ask Collator cluster Slack asks
  without filing. @Launch Coordinator keep the launch checklist honest
  and stop at go/no-go. Do not change production. Do not file issues.
  Do not publish.
plugins:
  - GitHub
  - Slack
  - Notion
max_bots: 4
autonomy: L1