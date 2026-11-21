---
id: cobus:skills/draft-call-followup/SKILL.md
kind: skill
title: Draft Call Follow-up
zh:
  title: 会后跟进包起草技能
  purpose: 根据通话纪要和日历，生成会后纪要草稿、双方待办清单、下次时间建议与客户记录草稿
  audience: 开完客户沟通会需要理出双方待办和跟进邮件的销售与客户成功
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/draft-call-followup/SKILL.md
sourcePath: skills/draft-call-followup/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:cb2e7971a7faa62851f34c60fe55475564cc5f65ca65ca79290dfa619057ef6a
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
firstTask: 只用这次模拟纪要：我方说“周四发报价”，客户说“我确认席位数”。起草跟进邮件和客户记录，双方待办分开列，日期有原话才填。日历、历史邮件若未接，说明各用来查什么；没给空闲时间就别约。不发信、不建日程、不写入客户系统、不开定时。
expect: 有邮件和客户记录两份草稿，双方各一项待办，仅报价标周四，下次时间待确认。
extra:
  whenToUse: |
    A call just happened and the owner needs an unsent recap, split tasks, and a suggested next window — not a sent email.
  note: 有日期的承诺须有原话，否则标未知
---

# Draft Call Follow-up

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Draft Call Follow-up”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

A call just happened and the owner needs an unsent recap, split tasks, and a suggested next window — not a sent email.


## 2. Required inputs and access

- Call notes, transcript, or recording
- Calendar event for attendees and time
- Prior mail thread with the account when present
- Promise log in /workspace when present

## 3. Sequence of work

1. Read the notes. If they are missing, ask and stop.
2. List attendees from the calendar event. If the event is missing, mark attendees unknown.
3. Draft a recap of what was said. Separate facts from inferences.
4. Split owner tasks from customer tasks. Dates not in the notes stay unknown.
5. Propose a next window from free/busy. Do not book it.
6. Label the recap DRAFT. Do not send.

## 4. How to validate the result

Recap is labeled DRAFT. No email was sent. No calendar event was created. Every dated commitment has a source quote, or the date is unknown.


## 5. What to return

After-call pack: recap, owner tasks, customer tasks, suggested window, CRM note draft, action log.


## 6. What requires approval

Do not send the recap. Do not book or move meetings. Do not create CRM records unless the owner names that action later.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.