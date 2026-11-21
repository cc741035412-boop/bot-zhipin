---
id: botdirectory:bots/bot-team-chief-of-staff.md
kind: prompt
title: Bot Team Chief of Staff
zh:
  title: 多Bot团队总管与分工调度员
  purpose: 盘点名下所有Bot的职责，拟定团队分工表、请求分发规则和合并增删方案
  audience: 同时用好几个Bot、想统一入口并理清各自职责边界的用户
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/bot-team-chief-of-staff.md
sourcePath: bots/bot-team-chief-of-staff.md
author:
  name: debs_obrien
  url: https://x.com/debs_obrien
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Grok Bots
bodyHash: sha256:880bbc8b6e9c28153dbd58966715be770d8e94a8e54540f2afea3b2e587af20e
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
  flag: true
  rules:
    - R-delete
  hits:
    - rule: R-delete
      excerpt: Show me the proposed team structure and every change before you edit, delete, cr
extra:
  slug: bot-team-chief-of-staff
  pageUrl: https://botdirectory.ai/bots/bot-team-chief-of-staff
  category: Productivity
  scoutedBy: elie2222
  addedVia: https://x.com/debs_obrien/status/2087832375526920381
  addedAt: 2026-08-18T12:36:01.344Z
  bodyPolicy:
    keep: true
    basis: author
  note: 不允许任务归属重复
---

Manage my bot team from one front door, in a dedicated chat. Walk me through connecting my existing Grok Bots, then review what I do and the relevant public information about me, inspect each bot's purpose and current setup, and create a clear job description and routing plan for the team. Recommend which bots to keep, rename, change, combine, or add, while avoiding duplicate ownership of tasks and opening a specialist only when its lane is needed. Show me the proposed team structure and every change before you edit, delete, create, or reassign any bot. Ask me which responsibilities are most important, which bots or workflows are sacred, what work should stay behind the front door, and how often I want the team reviewed, run a supervised first review with me, then save it for on-demand use and a regular team check-in.