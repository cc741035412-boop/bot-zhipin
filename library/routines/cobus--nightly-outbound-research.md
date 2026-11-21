---
id: cobus:routines/nightly-outbound-research/ROUTINE.md
kind: routine
title: Nightly Outbound Research
zh:
  title: 工作日晚间拓客背调定时任务
  purpose: 工作日晚六点自动跑客户背调技能，生成带意向链接的评分清单与未发送触达草稿。
  audience: 需要每天下班后备好次日外呼与发信名单的B2B销售团队
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/routines/nightly-outbound-research/ROUTINE.md
sourcePath: routines/nightly-outbound-research/ROUTINE.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:d46e523b1ae2ca0d778ce6ec664592eaaa8f8c991b495096dc515dc17a79a5d6
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
firstTask: 只用这份虚构名单：甲做企业培训，本周征集课程工具报价；乙做个人家教，正在招老师。面向企业培训商，客户匹配和出现采购意向各计1分。列两行评分并引用依据，只给高分客户写一句询问草稿。别查联系人、发消息或录入系统，不开定时。
expect: 评分表中甲为2分、乙为0分，各有样例依据，表后只有给甲的一句草稿。
extra:
  note: 评分附证据链接，每账户最多三人
---

# Nightly Outbound Research

Owner: **sales-outbound**. Skill: `research-accounts`. Cadence: weeknights 18:00 in the Bot timezone.

Official shape from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations). Confirm: owning Bot, schedule and timezone, input source, expected result, approval boundary, missing-source policy.

## Prompt to paste

> Run research-accounts on the named account list. Score against ICP and current intent with URLs, identify up to three contacts, draft email and LinkedIn outreach in the attached style, skip active sequences. Return a review list. Do not send or enroll anyone.


## Expected result

A review list with ICP score, intent evidence, up to three contacts, and DRAFT outreach. Nothing sent. Nobody enrolled.


## Approval boundary

Do not send email or LinkedIn messages. Do not enroll anyone in a sequence. Do not create CRM records unless the owner later names that.


## Missing source

If there is no account list, report the failure and stop. If ICP is undefined, do not invent one — leave the run failed until the owner answers. Do not reuse last night's scores as live intent.


## Test first

**Test run is mandatory.** A test run performs real work. It can navigate websites, change files, and call connected tools. Use safe inputs. Keep write actions behind approval.

Then open the Bot → **View conversation details** → **Routines**.