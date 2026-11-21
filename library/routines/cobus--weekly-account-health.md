---
id: cobus:routines/weekly-account-health/ROUTINE.md
kind: routine
title: Weekly Account Health
zh:
  title: 周一客户健康度排行定时任务
  purpose: 每周一早八点半定时跑客户健康度技能，输出区分流失风险与增购机会的带证关注榜。
  audience: 每周一早会前要排定重点跟进客户名单的客户成功经理
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/routines/weekly-account-health/ROUTINE.md
sourcePath: routines/weekly-account-health/ROUTINE.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:45de87bf64c6659d6eeef7f69a39d7c9b5c10c12291f24696567f24d22df3cc3
score: 4
rubric:
  task: true
  input: true
  steps: false
  acceptance: true
  approval: true
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  note: 只调用技能并概述输入产出，未列三步
---

# Weekly Account Health

Owner: **account-health**. Skill: `rank-account-health`. Cadence: Mondays 08:30 in the Bot timezone.

Official shape from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations). Confirm: owning Bot, schedule and timezone, input source, expected result, approval boundary, missing-source policy.

## Prompt to paste

> Run rank-account-health on the named portfolio. Combine current usage, support, renewal timing, and stakeholder activity against saved thresholds. Return the ranked watch list. Do not contact customers or edit the CRM.


## Expected result

A ranked watch list with evidence links, why it matters, a suggested next step, and a needs-human flag. Expansion separate from churn. No customer contact. CRM untouched.


## Approval boundary

Do not contact customers. Do not edit the CRM. Do not issue refunds or credits. Internal Slack posting waits for in-chat approval.


## Missing source

If the account list is missing, report the failure and stop. If a source is down, name it and continue with what you have — never substitute last week's file silently.


## Test first

**Test run is mandatory.** A test run performs real work. It can navigate websites, change files, and call connected tools. Use safe inputs. Keep write actions behind approval.

Then open the Bot → **View conversation details** → **Routines**.