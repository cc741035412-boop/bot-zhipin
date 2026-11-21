---
id: cobus:teams/success/team.yaml
kind: team
title: Success
zh:
  title: 客户健康度与承诺追踪组
  purpose: 按预设阈值给客户健康度排序、引用条款起草待发客服首响，并从纪要里提取承诺事项。
  audience: 负责老客户续约、拟定客诉回复和跟进通话承诺的客户成功经理
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/teams/success/team.yaml
sourcePath: teams/success/team.yaml
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Slack
  - Gmail
bodyHash: sha256:1da61ada75b2646a9a930acec982d98e418a8c2172d01c3b13af0ef7af03bd6f
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
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  note: 三个独立交付，无共同的三步顺序
---

id: success
name: Success
lead: account-health
bots:
  - account-health
  - support-replies
  - promise-log
why: >
  Renewals slip when health is a vibe, replies go out uncited, and
  promises evaporate after the call.
group_kickoff: >
  @Account Health rank the portfolio against saved thresholds.
  @Support Replies draft unsent first responses that cite policy.
  @Promise Log extract commitments from the latest call notes.
  Do not contact customers. Do not edit the CRM. Do not issue refunds.
plugins:
  - Slack
  - Gmail
max_bots: 4
autonomy: L1