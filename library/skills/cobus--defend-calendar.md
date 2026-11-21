---
id: cobus:skills/defend-calendar/SKILL.md
kind: skill
title: Defend Calendar
zh:
  title: 专注时段日历守卫技能
  purpose: 盘点侵占专注时段的会议冲突，输出改期婉拒草稿并标出客户或事故等必保会议
  audience: 日程被碎片会议塞满、需要留出整块工作时间的管理者与骨干
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/defend-calendar/SKILL.md
sourcePath: skills/defend-calendar/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:449ebb8d03e0f48c399501414eb02aa2bfa1f2282902bcfb19b7cd0ad292bc1e
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
    Deep-work blocks are being eaten by meetings, and the owner needs a protection pack: conflict map and unsent decline drafts, calendar left untouched.
  note: 每稿写明事件和要保护的时间块
---

# Defend Calendar

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Defend Calendar”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

Deep-work blocks are being eaten by meetings, and the owner needs a protection pack: conflict map and unsent decline drafts, calendar left untouched.


## 2. Required inputs and access

- Google Calendar for the named window
- Pinned deep-work hours or a priorities note
- Slack (or mail) where the meeting request arrived, if connected

## 3. Sequence of work

1. Load the calendar window and the pinned deep-work hours. If hours are missing, ask once and stop.
2. List events that overlap a deep-work block or stack more than the owner's stated meeting cap.
3. For each conflict, draft a decline or reschedule note in the owner's voice. Label it DRAFT. Do not send.
4. Propose a hold the owner could accept. Do not create, move, or delete events.
5. Flag anything that looks like a customer, legal, or incident meeting so it is not auto-declined in a draft.

## 4. How to validate the result

No event was created, moved, or deleted. Every draft names the event and the block it would protect. Customer/legal/incident items are called out, not declined by default.


## 5. What to return

Block map, conflict table, unsent decline drafts, and a "leave these alone" list. Action log of calendars scanned.


## 6. What requires approval

Do not change meetings, send declines, or invite anyone. Do not decline customer, legal, or incident events without asking.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.