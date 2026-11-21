---
id: cobus:routines/weekday-cos-digest/ROUTINE.md
kind: routine
title: Weekday CoS Digest
zh:
  title: 工作日早间幕僚简报定时任务
  purpose: 工作日早八点定时跑每日简报技能，筛出匹配既定优先级的事项并单列待拍板清单。
  audience: 每天开会前想先看关键进展和待办决策的团队负责人或高管
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/routines/weekday-cos-digest/ROUTINE.md
sourcePath: routines/weekday-cos-digest/ROUTINE.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:69044a6ff6e201b1a3012bfe349163a0bbeb530af8083fd0c3e30258f66786fb
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
firstTask: 今天只关注试点验收。请从昨早以来的两条模拟记录写晨会简报草稿：纪要甲说「试点验收缺签收人，等负责人指定」，便签乙说「茶水间换了杯子」。只留符合优先级的事，注明来源、影响和下一步，另列待拍板项。不查真实频道、不发消息、不改会议、不开定时。
expect: 正文只保留纪要甲，说明缺签收人对验收的影响，待拍板栏有一项指定签收人的决定。
extra:
  note: 每条匹配固定优先项且附来源
---

# Weekday CoS Digest

Owner: **chief-of-staff**. Skill: `daily-digest`. Cadence: weekdays 08:00 in the Bot timezone.

Official shape from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations). Confirm: owning Bot, schedule and timezone, input source, expected result, approval boundary, missing-source policy.

## Prompt to paste

> Run daily-digest for the window since yesterday 08:00 in the Bot timezone. Return only items that map to the pinned priorities. For each item include source, why it matters, proposed next step, and whether I owe a decision. Do not send messages or change meetings.


## Expected result

A source-linked digest of items that map to stated priorities, plus a Decisions needed section. Nothing sent. No meetings changed.


## Approval boundary

Do not send messages, change meetings, file tickets, or invite people. Drafts stay in this conversation until the owner asks to post.


## Missing source

If the priority document is missing, report the failure and stop. If a named channel is unavailable, list it in the action log and continue with the rest. Never reuse yesterday's digest as if it were current.


## Test first

**Test run is mandatory.** A test run performs real work. It can navigate websites, change files, and call connected tools. Use safe inputs. Keep write actions behind approval.

Then open the Bot → **View conversation details** → **Routines**.