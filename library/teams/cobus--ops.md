---
id: cobus:teams/ops/team.yaml
kind: team
title: Ops
zh:
  title: 日常行政与账单核对组
  purpose: 按置顶重点摘录消息、对照制度核对本周花销，并把发票和续费邮件理成待审清单。
  audience: 每周要从群聊和邮箱里捞报销单、发票与重点事项的行政和运营
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/teams/ops/team.yaml
sourcePath: teams/ops/team.yaml
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Slack
  - Gmail
  - Google Calendar
  - Google Drive
bodyHash: sha256:6bbe3ac19c3aa8120fba16159cdbafdc7e927b781afd9cce0a4b0f767e77e89a
score: 3
rubric:
  task: false
  input: true
  steps: false
  acceptance: true
  approval: true
cnFit:
  value: 一般
  blocked:
    - Gmail
    - Google Calendar
    - Google Drive
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  note: 三个独立职责，不是有序流程
---

id: ops
name: Ops
lead: chief-of-staff
bots:
  - chief-of-staff
  - expense-manager
  - vendor-inbox
why: >
  The week hides in Slack, receipts, and vendor mail until someone
  maps it to priorities without sending a chase.
group_kickoff: >
  @Chief of Staff digest only items that map to the pinned priorities.
  @Expense Manager reconcile this week's spend to the signed policy.
  @Vendor Inbox sort invoices and renewals into a review list.
  Do not send messages. Do not pay. Do not change meetings.
plugins:
  - Slack
  - Gmail
  - Google Calendar
  - Google Drive
max_bots: 4
autonomy: L1