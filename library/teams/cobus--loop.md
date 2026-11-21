---
id: cobus:teams/loop/team.yaml
kind: team
title: Loop
zh:
  title: 发版前核查四人组
  purpose: 代码合并前盘点失败检查、评审PR风险、起草变更说明并打包已验证与未验证项。
  audience: 用Bot写代码、合并发版前需要人工把关的研发团队
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/teams/loop/team.yaml
sourcePath: teams/loop/team.yaml
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - GitHub
bodyHash: sha256:ceee8c1eef1f9d51e648eea1ca09e97fce92a19fb2b0979bf0b66c0aa2163c9b
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
  note: 多项交付并列，未串起三步流程
---

id: loop
name: Loop
lead: evidence-packager
bots:
  - ci-sweeper
  - pr-reviewer
  - changelog
  - evidence-packager
why: >
  Inner-loop coding agents still need an outer evidence/verdict loop
  before anyone merges, tags, or writes the ship rationale.
group_kickoff: >
  @CI Sweeper list failing checks without rerunning until green.
  @PR Reviewer risk-review the open PR. @Changelog draft notes since
  the last tag. @Evidence Packager package what was verified vs not
  and stop before the verdict. Do not merge. Do not tag. Do not
  publish a release.
plugins:
  - GitHub
max_bots: 4
autonomy: L1