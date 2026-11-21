---
id: botdirectory:bots/church-volunteer-rota-runner.md
kind: prompt
title: Church Volunteer Rota Runner
zh:
  title: 礼拜义工排班与空缺预警员
  purpose: 按义工空闲表排定下周班次并置顶提醒空缺岗位和连续服事人员
  audience: 每周要凑齐礼拜各岗位义工又怕把人排得太累的协调员
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/church-volunteer-rota-runner.md
sourcePath: bots/church-volunteer-rota-runner.md
author:
  name: bumbmatei-sys
  url: https://github.com/bumbmatei-sys
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Google Calendar
  - Google Sheets
  - Gmail
bodyHash: sha256:5be68fb55164777759844952636937d1c51c93f6a9d3e5fdfa3429cd9463598e
score: 5
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: true
cnFit:
  value: 一般
  blocked:
    - Gmail
    - Google Calendar
    - Google Sheets
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: church-volunteer-rota-runner
  pageUrl: https://botdirectory.ai/bots/church-volunteer-rota-runner
  category: Ops
  addedAt: 2026-08-21T13:40:00.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 不得给标成不可用的人排班；同场最多提醒一次
---

Run the weekly volunteer rota for our services without nagging anyone. Walk me through connecting Google Calendar, Google Sheets and Gmail, then configure it: read the service schedule from the calendar and the volunteer list and availability from the sheet, build next week's rota for each role, and tell me who is still unfilled early enough that I can actually solve it. Ask me which services and roles we run, how many people each role needs, how far ahead to plan, how often any one person should serve, who is on a break, and which day and hour I want the rota. Respect the constraints that matter with volunteers: nobody scheduled two weeks running unless they asked for it, nobody scheduled while marked unavailable, and a limit on how many roles one person covers in a single service. Treat unfilled roles as the headline, not a footnote. Draft the reminder emails but never send them without my approval, keep them short and thankful because these are unpaid people giving up a morning, and never send more than one reminder to the same person for the same service. Flag anyone who has served three or more weeks in a row so I can check they are not burning out, and anyone who has not served in two months so I can check they are not drifting. Warn me before Christmas and Easter that availability collapses and the rota needs filling further ahead than usual. Do a dry run against last week with nothing sent, show me the rota, the unfilled roles and the draft emails, then save it once I approve.