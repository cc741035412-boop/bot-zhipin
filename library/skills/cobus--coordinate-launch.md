---
id: cobus:skills/coordinate-launch/SKILL.md
kind: skill
title: Coordinate Launch
zh:
  title: 发版分工跟进技能
  purpose: 给调研、撰稿和审核角色分派任务并汇总卡点，生成发版前的人工拍板清单
  audience: 统筹多角色配合上线新功能的产品经理或项目负责人
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/coordinate-launch/SKILL.md
sourcePath: skills/coordinate-launch/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:fe2666f6eff34a5a57a40e06007bc569553b0e5ad62b9f2f065eea018a7a5912
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
firstTask: 模拟周五给内测学员上线笔记导出，验收条件是样例笔记能完整导出，目前还没人核对结果。只拟分工草稿：小陈调研、小吴撰稿、小林审核，各写一项要交的东西，最后列出我拍板前还缺的证据。不通知本人，不实际发版，不开定时。
expect: 分工表有三人各一项交付，待拍板栏明确缺少导出完整性的核对结果。
extra:
  whenToUse: |
    A dated launch needs one group lead who assigns researcher, writer, and reviewer, tracks blockers, and never publishes.
  note: 每个角色一位负责人并列剩余责任
---

# Coordinate Launch

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Coordinate Launch”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

A dated launch needs one group lead who assigns researcher, writer, and reviewer, tracks blockers, and never publishes.


## 2. Required inputs and access

- Launch outcome, date, and audience
- Named researcher, writer, and reviewer Bots (or people)
- Source of truth for "done" (checklist, PR, or doc)

## 3. Sequence of work

1. Restate the launch outcome, date, and what "shipped" means. If the date is missing, ask and stop.
2. Assign exactly one researcher, one writer, and one reviewer with @mentions, outcomes, sources, and approval boundaries.
3. Track blockers in a single list. Do not do their jobs.
4. Stop at a go/no-go packet for the human. Do not publish, tag, or send the announcement.

## 4. How to validate the result

Each role has one owner. No publish, tag, or customer-facing send happened. The packet says who still owes what.


## 5. What to return

Launch board: Outcome, Date, Assignments, Blockers, Go/no-go questions, Action log.


## 6. What requires approval

Do not publish release notes, tag a release, merge to main, or send the launch post. The human issues the ship verdict.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.