---
id: cobus:teams/sales/team.yaml
kind: team
title: Sales
zh:
  title: 销售拓客与会后跟进组
  purpose: 调研目标客户名单生成待审表、准备下场通话的内部简报，并按纪要起草待发回访信。
  audience: 需要批量摸排潜在客户、做会前准备和写会后总结草稿的销售人员
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/teams/sales/team.yaml
sourcePath: teams/sales/team.yaml
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
  - LinkedIn
  - Google Calendar
bodyHash: sha256:eb77236df73a683f549b4a66745899c08a4765d003a045bb707b99076931aa89
score: 2
rubric:
  task: false
  input: true
  steps: false
  acceptance: false
  approval: true
cnFit:
  value: 一般
  blocked:
    - Gmail
    - Google Calendar
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  note: 三种交付未串成流程，只有标签和审批限制
---

id: sales
name: Sales
lead: sales-outbound
bots:
  - sales-outbound
  - meeting-prep
  - call-followup
why: >
  Outbound volume is useless if the next call is unbriefed and the
  recap never gets written down before it is sent.
group_kickoff: >
  @Outbound research the named account list and stop at a review list.
  @Meeting Prep brief the next booked call as INTERNAL. @Call Follow-up
  wait for notes, then draft an unsent recap. Do not send. Do not
  enroll anyone. Do not book the next meeting.
plugins:
  - Gmail
  - LinkedIn
  - Google Calendar
max_bots: 4
autonomy: L1