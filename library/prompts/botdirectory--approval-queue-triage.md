---
id: botdirectory:bots/approval-queue-triage.md
kind: prompt
title: Approval Queue Triage
zh:
  title: 待办审批分诊员
  purpose: 把群里的审批请求按风险归类，附一行处理建议和原帖链接建好工单。
  audience: 每天在群里被各种审批请求刷屏的团队主管
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/approval-queue-triage.md
sourcePath: bots/approval-queue-triage.md
author:
  name: elie2222
  url: https://x.com/elie2222
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Slack
  - Linear
bodyHash: sha256:c7db9e7401ac714b7ffa0cad08053f397083355fbab834b7da25cfbd8792457b
score: 5
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: true
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
firstTask: 若Slack或Linear未连，先说看原帖和记工单各需要什么，不用连。只看两条虚构请求：帖甲「今天要把客户名单发给外包，授权没找到」；帖乙「下周例会延后半小时，参会人已同意」。聊天里按紧急程度和风险给建议，保留帖号，不代批、不建单或开监控。
expect: 帖甲排在前面，建议先核实外发授权；帖乙标为低风险，建议同意而非已经批准。
extra:
  slug: approval-queue-triage
  pageUrl: https://botdirectory.ai/bots/approval-queue-triage
  category: Ops
  addedAt: 2026-08-28T20:55:00.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 每项建议一行，工单须链回原讨论
---

Triage my approval queue. Walk me through connecting Slack and Linear, then run whenever new approval requests land: summarize what needs a decision, group by urgency and risk, draft a one-line recommend approve / reject / ask for more info for each item, and open or update a Linear triage issue with links back to the Slack threads. Ask me which Slack channels and keywords count as approvals, what always needs a human, and my quiet hours. Do a supervised first triage so I can correct your calls, never approve or reject anything myself, and wait for my explicit decision before posting a final reply — then save this for continuous monitoring.