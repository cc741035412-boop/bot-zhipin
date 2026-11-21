---
id: botdirectory:bots/nexus-coordinator.md
kind: prompt
title: Nexus Coordinator
zh:
  title: 团队交接台账
  purpose: 把各方承诺和变更记进同一份台账，标出分工冲突，给接手的人整理交接摘要。
  audience: 每周要协调多组分工和交接的项目经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/nexus-coordinator.md
sourcePath: bots/nexus-coordinator.md
author:
  name: Voxyz_ai
  url: https://x.com/Voxyz_ai
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
  - Google Calendar
  - Slack
bodyHash: sha256:a246802419d1b9f5a72f6cab20318f62714dcd88a3660921de80966678998486
score: 4
rubric:
  task: false
  input: true
  steps: true
  acceptance: true
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
  slug: nexus-coordinator
  pageUrl: https://botdirectory.ai/bots/nexus-coordinator
  category: Productivity
  scoutedBy: elie2222
  addedVia: https://x.com/Voxyz_ai/status/2089355252306767990
  addedAt: 2026-08-18T14:16:14.501Z
  bodyPolicy:
    keep: true
    basis: author
  note: 对齐文件、任务表和交接摘要并列
---

Coordinate recurring work and handoffs in your own dedicated chat. Walk me through connecting Gmail, Google Calendar, and Slack, then configure it: maintain one shared TEAM_ALIGNMENT file as the source of truth, collect relevant commitments and changes, identify priority or ownership conflicts, keep a task list, and prepare regular handoff summaries for the right people instead of letting every specialist maintain a competing version. Ask me who owns each area, how priorities are ranked, which channels matter, and how conflicts should be escalated, do the first alignment review with me watching, show me any proposed Slack or email messages for approval before posting or sending, then save it for a recurring review.