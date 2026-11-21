---
id: cobus:skills/ramp-new-hire/SKILL.md
kind: skill
title: Ramp New Hire
zh:
  title: 新员工首周入职计划表
  purpose: 按新人岗位排好首周每日对接人与日历占位草稿，附上待进群组和文档清单。
  audience: 要给即将入职的新人安排首周带教日程的团队主管与人事
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/ramp-new-hire/SKILL.md
sourcePath: skills/ramp-new-hire/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:9080021dccb3e7b1e563bbb88ea3dbbb83879779be8c6b4851bc6afd394905f5
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
    - Google Calendar
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  whenToUse: |
    A named new hire starts soon and needs a first-week plan with owners and calendar holds as drafts — invites stay unsent.
  note: 每场明确负责人，未知标未知
---

# Ramp New Hire

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Ramp New Hire”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

A named new hire starts soon and needs a first-week plan with owners and calendar holds as drafts — invites stay unsent.


## 2. Required inputs and access

- Hire name, role, start date, and manager
- Team roster or org notes the owner attached
- Google Calendar and approved Slack channels

## 3. Sequence of work

1. Confirm name, start date, role, and manager. If any are missing, ask and stop.
2. Draft a day-by-day first-week plan with session, owner, purpose, and the Slack or doc they need.
3. Draft calendar holds for each session. Do not invite anyone.
4. Build a share checklist (channels, docs). Do not send Slack DMs or channel posts.
5. Write the plan to /workspace/new-hire-ramp.md.

## 4. How to validate the result

Every session has a named owner. No invites were sent. No Slack messages were sent. Unknown owners are labeled unknown, not filled with the manager.


## 5. What to return

First-week plan, draft holds, onboarding checklist, action log.


## 6. What requires approval

Do not send calendar invites. Do not message the hire or the team. Do not create accounts or grant access.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.