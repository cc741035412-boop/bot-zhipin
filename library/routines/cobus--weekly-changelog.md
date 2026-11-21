---
id: cobus:routines/weekly-changelog/ROUTINE.md
kind: routine
title: Weekly Changelog
zh:
  title: 周五更新日志起草定时任务
  purpose: 每周五下午两点定时跑更新日志技能，将新合入PR按四类改写成带链接的用户草稿。
  audience: 每周五发版前需要整理产品更新说明的产品经理或研发负责人
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/routines/weekly-changelog/ROUTINE.md
sourcePath: routines/weekly-changelog/ROUTINE.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:bbc7a3ad0c1a8c154301d478cfd342c13b8ba06849afc8031449681aeaa95f3f
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
firstTask: 只用这两条虚构的本周已合入记录写更新草稿：#12 修好空表导出后打不开（https://example.org/12）；#13 整理测试目录（https://example.org/13）。给用户的修复说明和仅供内部核对的条目分开，各带原链接。GitHub未连就说明，不改库、不发布、不开定时。
expect: 用户可见的修复说明链接到第12条，第13条只出现在内部清单。
extra:
  note: 更新条目保留PR链接，无标签则停
---

# Weekly Changelog

Owner: **changelog**. Skill: `draft-changelog`. Cadence: Fridays 14:00 in the Bot timezone.

Official shape from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations). Confirm: owning Bot, schedule and timezone, input source, expected result, approval boundary, missing-source policy.

## Prompt to paste

> Run draft-changelog for merged PRs since the last tag. Group breaking, added, fixed, internal. Rewrite titles into user language and keep PR numbers as links. Do not tag or publish.


## Expected result

Draft changelog markdown grouped breaking / added / fixed / internal, with PR links, plus a list of PRs omitted as internal. Unpublished. No tag created.


## Approval boundary

Do not publish a GitHub release. Do not tag the repository. Do not edit CHANGELOG.md on main without approval.


## Missing source

If GitHub is not connected, or there is no tag and no previous heading, report the failure and stop. Do not invent PRs or fill with "various improvements".


## Test first

**Test run is mandatory.** A test run performs real work. It can navigate websites, change files, and call connected tools. Use safe inputs. Keep write actions behind approval.

Then open the Bot → **View conversation details** → **Routines**.