---
id: cobus:teams/eng/team.yaml
kind: team
title: Eng
zh:
  title: 研发复现与代码评审团队
  purpose: 三个Bot按序接力复现测试环境报错、起草未发布Issue并审查PR高风险改动。
  audience: 想把测试报错复现、建单和代码初审串成群聊流水线的研发团队
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/teams/eng/team.yaml
sourcePath: teams/eng/team.yaml
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - GitHub
  - Slack
bodyHash: sha256:3df676ec17c563d96481e24be2edb8601e740008d0cb031cfdbd396af01e6b2f
score: 4
rubric:
  task: false
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
extra:
  note: 复现、问题草稿和PR评审是不同交付
---

id: eng
name: Eng
lead: pr-reviewer
bots:
  - bug-reproduction
  - issue-drafter
  - pr-reviewer
why: >
  Staging reports stall when repro, the unsent issue, and the risk
  review live in one undifferentiated chat.
group_kickoff: >
  @Bug Reproduction reproduce the latest staging report with a fresh
  test account. @Issue Drafter turn the pack into an unsent GitHub
  issue. @PR Reviewer wait until there is a PR, then start at the
  scary diff. Do not merge. Do not comment on GitHub. Do not use
  production customer data.
plugins:
  - GitHub
  - Slack
max_bots: 4
autonomy: L1