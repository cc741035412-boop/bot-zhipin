---
id: cobus:routines/weekly-expenses/ROUTINE.md
kind: routine
title: Weekly Expenses
zh:
  title: 周一费用报销核对定时任务
  purpose: 每周一早九点定时跑报销核对技能，比对系统总额与收据并输出异常表和追问草稿。
  audience: 每周一要审核员工报销单据并催补缺失票据的财务人员
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/routines/weekly-expenses/ROUTINE.md
sourcePath: routines/weekly-expenses/ROUTINE.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:5b092bea31b518e39a44b85cd2f0f8b01843bba51a7b8b23b019267a11017356
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
firstTask: 只核对这份虚构周账：甲报车费60元，有60元收据；乙报车费40元，没附收据。样例制度第2条要求车费附收据。列申报总额、有票金额和差额，给缺票人拟一句补票消息并标条款。报销系统未连就说明，只出草稿，不发消息、不审批付款、不开定时。
expect: 申报100元、有票60元、差额40元，只有乙有补票草稿，并注明第2条。
extra:
  note: 总额与源一致或解释差额，每例附政策引用
---

# Weekly Expenses

Owner: **expense-manager**. Skill: `reconcile-expenses`. Cadence: Mondays 09:00 in the Bot timezone.

Official shape from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations). Confirm: owning Bot, schedule and timezone, input source, expected result, approval boundary, missing-source policy.

## Prompt to paste

> Run reconcile-expenses for this week. Total the source system first, match receipts, cite policy on every exception, and draft one unsent follow-up per owner. Return the summary and drafts. Do not send messages or change reimbursements.


## Expected result

Weekly summary whose total equals the source (or an explained gap), exception table with policy citations, one unsent follow-up draft per owner. Nothing sent. No reimbursements changed.


## Approval boundary

Do not send follow-ups. Do not change reimbursements. Do not approve spend or pay vendors.


## Missing source

If the signed policy is missing, report the failure and stop. If the expense system is unavailable, say so and do not treat last week's file as this week's total.


## Test first

**Test run is mandatory.** A test run performs real work. It can navigate websites, change files, and call connected tools. Use safe inputs. Keep write actions behind approval.

Then open the Bot → **View conversation details** → **Routines**.