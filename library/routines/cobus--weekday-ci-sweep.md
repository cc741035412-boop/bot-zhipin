---
id: cobus:routines/weekday-ci-sweep/ROUTINE.md
kind: routine
title: Weekday CI Sweep
zh:
  title: 工作日早间CI巡检定时任务
  purpose: 工作日早九点定时跑CI巡检技能，区分新故障与偶发抖动并输出带日志链接的报告。
  audience: 每天早上要排查构建报错并决定是否暂停合入的值班研发
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/routines/weekday-ci-sweep/ROUTINE.md
sourcePath: routines/weekday-ci-sweep/ROUTINE.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:e3bce6806c6dc79e078f00b50d2803d9237ff4edd5a32849c12ef9489a349306
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
firstTask: 若没连 GitHub，说明正式巡检需仓库的只读构建日志。本次只看两段模拟记录：排版检查「昨日通过，今日缩进错误」；截图检查「同一提交首次超时，第二次通过」。分清新故障与疑似偶发项，各引一句日志并给一条排查建议。只回报告，不重跑、不改仓库、不开定时。
expect: 报告有两项：排版列为新故障，截图列为疑似偶发，每项都有日志摘录和建议。
extra:
  note: 检查须给名称和运行链接
---

# Weekday CI Sweep

Owner: **ci-sweeper**. Skill: `sweep-ci`. Cadence: weekdays 09:00 in the Bot timezone.

Official shape from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations). Confirm: owning Bot, schedule and timezone, input source, expected result, approval boundary, missing-source policy.

## Prompt to paste

> Run sweep-ci on the named repositories since yesterday 09:00. Split new breakage from flakes, quote log lines, suggest owners, and list holds. Do not merge. Do not rerun until green.


## Expected result

Sweep report: new failures, flakes, infra/timeouts, suggested holds, with check names and run URLs. Nothing merged. No rerun-until-green.


## Approval boundary

Do not merge, push, or comment on GitHub. Do not cancel workflows or change branch protection. At most one rerun, and only when a log is truncated.


## Missing source

If GitHub is not connected or a named repo cannot be opened, report the failure and stop for that repo. Do not invent jobs or treat a missing log as green.


## Test first

**Test run is mandatory.** A test run performs real work. It can navigate websites, change files, and call connected tools. Use safe inputs. Keep write actions behind approval.

Then open the Bot → **View conversation details** → **Routines**.