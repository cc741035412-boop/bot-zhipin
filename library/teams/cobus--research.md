---
id: cobus:teams/research/team.yaml
kind: team
title: Research
zh:
  title: 资料考证与假设挑刺组
  purpose: 针对群内提问写带出处的调研简报、保留带链接的三分钟速读版，并挑出隐含假设。
  audience: 做案头调研时需要核对引用出处、排查主观假设的研究与产品人员
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/teams/research/team.yaml
sourcePath: teams/research/team.yaml
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:37dc0e39fab25822a8c6d6e1d1a27226d9b8e490b8ae3f646e2ac0bcd1bde3ce
score: 3
rubric:
  task: false
  input: true
  steps: false
  acceptance: true
  approval: true
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  note: 多种研究交付，并非同一份产出的有序流程
---

id: research
name: Research
lead: research-desk
bots:
  - research-desk
  - cited-brief
  - source-interrogator
why: >
  Deep briefs, three-minute answers, and assumption hunts are different
  jobs; mixing them hides the not-found list.
group_kickoff: >
  @Research Desk produce the cited brief for the question in this chat.
  @Cited Brief keep a three-minute version with URLs. @Source Interrogator
  list assumptions treated as facts. Do not publish. Do not invent
  citations. Do not contact people for interviews.
plugins: []
max_bots: 4
autonomy: L1