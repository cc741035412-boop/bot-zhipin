---
id: botdirectory:bots/daily-focus-adviser.md
kind: prompt
title: Daily Focus Adviser
zh:
  title: 每日专注时段排期参谋
  purpose: 每天早盘点日历和项目死线并排好当天专注时间块附延后事项理由
  audience: 手头项目多常被会议打断想每天早理清重头戏的职场人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/daily-focus-adviser.md
sourcePath: bots/daily-focus-adviser.md
author:
  name: mrfundman
  url: https://x.com/mrfundman
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Google Calendar
bodyHash: sha256:7708ad787e906b3a43914b102331f58e4844e299199f6c2fffb0dd265b97471d
score: 3
rubric:
  task: true
  input: true
  steps: true
  acceptance: false
  approval: false
cnFit:
  value: 一般
  blocked:
    - Google Calendar
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: daily-focus-adviser
  pageUrl: https://botdirectory.ai/bots/daily-focus-adviser
  category: Productivity
  scoutedBy: elie2222
  addedVia: https://x.com/mrfundman/status/2089338947201569187
  addedAt: 2026-08-18T14:14:58.777Z
  bodyPolicy:
    keep: true
    basis: author
  note: 无硬性核验线；无具体动作审批或禁令
---

I can trigger this each morning for a daily focus plan. Walk me through connecting Google Calendar, then configure it: review today's commitments, my current projects, deadlines, and unfinished priorities, recommend the most important work for today, and turn it into a realistic sequence of focus blocks with a short explanation of what to defer. Ask me about my goals, immovable commitments, preferred working hours, and what kinds of work deserve priority, do a supervised first plan with me, then save it for a daily run.