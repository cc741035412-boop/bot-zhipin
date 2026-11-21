---
id: cobus:routines/weekly-competitor-diff/ROUTINE.md
kind: routine
title: Weekly Competitor Diff
zh:
  title: 周一竞品页面比对定时任务
  purpose: 每周一早九点定时跑竞品比对技能，对比公开页与上期快照并输出带链接的变动报告。
  audience: 需要按周追踪竞品官网定价与功能改动的市场或产品经理
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/routines/weekly-competitor-diff/ROUTINE.md
sourcePath: routines/weekly-competitor-diff/ROUTINE.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:61ba99b996f4403efef7c00d34534820fdfd639b2926fc5042dc7d68a5feabef
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
firstTask: 假设今天是11月16日，只看虚构定价页摘录：云尺基础版29元/月（yun.example/price）。没有上周快照，请在聊天里拟一行首次基线，说明这次能不能判断调价。不访问网页，不保存快照，也别开启每周定时。
expect: 基线一行列出11月16日、样例页地址和29元/月，没有把首次记录说成调价。
extra:
  note: 缺页写未找到，变化须有前后值与链接
---

# Weekly Competitor Diff

Owner: **competitor-watch**. Skill: `diff-competitors`. Cadence: Mondays 09:00 in the Bot timezone.

Official shape from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations). Confirm: owning Bot, schedule and timezone, input source, expected result, approval boundary, missing-source policy.

## Prompt to paste

> Run diff-competitors on the named set. Load last snapshot; baseline if none. Fetch current public pages. Quote numbers. Report only material changes with URLs and dates. Do not post the memo.


## Expected result

Baseline (first run) or material-change memo with before/after, URL, and date. Unchanged competitors listed in one line. Slack draft labeled DRAFT and unsent.


## Approval boundary

Do not post the memo to Slack or X. Do not scrape behind a login the owner did not authorize. Do not email competitors.


## Missing source

If the competitor list is missing, report the failure and stop. If a page is unavailable, write "page not found" rather than reusing last week's number silently. If no snapshot exists, take a baseline and stop after writing it.


## Test first

**Test run is mandatory.** A test run performs real work. It can navigate websites, change files, and call connected tools. Use safe inputs. Keep write actions behind approval.

Then open the Bot → **View conversation details** → **Routines**.