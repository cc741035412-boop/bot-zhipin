---
id: cobus:skills/prep-meeting/SKILL.md
kind: skill
title: Prep Meeting
zh:
  title: 客户会前内部简报编写
  purpose: 汇总日历与邮件记录，产出带上次承诺、未决问题和禁提项的内部会前简报。
  audience: 开客户会议前要快速对齐历史承诺的销售与客户经理
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/prep-meeting/SKILL.md
sourcePath: skills/prep-meeting/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:b58131ba66a557d6f8294676f6942aab00f03d96edcaf349ea24c3752c442fd3
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
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  whenToUse: |
    A customer meeting is on the calendar and the owner needs an internal pre-call brief that leads with the last promise and who is in the room.
  note: 承诺须带日期原话，否则明确缺失
---

# Prep Meeting

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Prep Meeting”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

A customer meeting is on the calendar and the owner needs an internal pre-call brief that leads with the last promise and who is in the room.


## 2. Required inputs and access

- Calendar event or named meeting
- CRM notes for the account when present
- Gmail threads with attendees
- Slack channels the owner named for that account
- Promise log in /workspace when present

## 3. Sequence of work

1. Open the calendar event. If there is no upcoming customer meeting, stop and say so.
2. Pull CRM stage and notes. Mark missing fields unknown.
3. Read mail and Slack for attendees. Extract the last dated promise, or write "no promise found".
4. List open issues with source links.
5. Write one walk-in line and a short "do not reopen" list.
6. Label the brief INTERNAL. Do not send it to the customer.

## 4. How to validate the result

Attendees match the invite. Every promise is a dated quote or explicitly absent. Brief is labeled INTERNAL. No mail or Slack was sent outward.


## 5. What to return

Internal pre-call brief plus an action log of sources opened.


## 6. What requires approval

Do not send the brief or any pre-read to the customer. Do not change the calendar event or create CRM records unless the owner names that later.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.