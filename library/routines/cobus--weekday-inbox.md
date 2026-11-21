---
id: cobus:routines/weekday-inbox/ROUTINE.md
kind: routine
title: Weekday Inbox
zh:
  title: 工作日早间收件箱分拣定时任务
  purpose: 工作日早八点半定时跑收件箱分拣技能，把昨日以来的新邮件分五类并备好回信草稿。
  audience: 希望每天早上到岗就有现成邮件分类清单和回信草稿的管理者
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/routines/weekday-inbox/ROUTINE.md
sourcePath: routines/weekday-inbox/ROUTINE.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:96f28b102a95e70ec25bc4826cc8887e92ea95b010280b7d7c17701d05af1fdd
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
  note: 仅给待回复类起草，安全邮件不忽略
---

# Weekday Inbox

Owner: **inbox-triage**. Skill: `triage-inbox`. Cadence: weekdays 08:30 in the Bot timezone.

Official shape from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations). Confirm: owning Bot, schedule and timezone, input source, expected result, approval boundary, missing-source policy.

## Prompt to paste

> Run triage-inbox for mail since yesterday 08:30 in the Bot timezone. Bucket needs-reply, fyi, newsletter, receipt, ignore. Draft replies only for needs-reply. Flag bills, legal deadlines, and security alerts. Do not send, delete, or unsubscribe.


## Expected result

Bucketed list (needs reply, fyi, newsletter, receipt, ignore) with unsent drafts on needs-reply and a handle-today top five. Nothing sent, deleted, or unsubscribed.


## Approval boundary

Do not send, delete, archive, or unsubscribe. Security-looking mail is never auto-ignored.


## Missing source

If Gmail is not connected or the fetch fails, report the failure and stop. Do not invent messages from memory or from another mailbox on the shared computer.


## Test first

**Test run is mandatory.** A test run performs real work. It can navigate websites, change files, and call connected tools. Use safe inputs. Keep write actions behind approval.

Then open the Bot → **View conversation details** → **Routines**.