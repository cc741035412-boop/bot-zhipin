---
id: cobus:skills/route-work/SKILL.md
kind: skill
title: Route Work
zh:
  title: 多机器人任务分派器
  purpose: 对照职责花名册将新需求指派给唯一负责的机器人，输出含交付要求与审批边界的交接单。
  audience: 维护多个专职机器人、需要按职责自动分单的团队管理员
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/route-work/SKILL.md
sourcePath: skills/route-work/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:bd02b8f0068b55fcd546ac5c22f3bdd99ee97a0697fcec01870a79b814778d3c
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
extra:
  whenToUse: |
    Incoming work must be assigned to exactly one owner Bot. The router does not do the work.
  note: 只分给一个负责人，不代做
---

# Route Work

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Route Work”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

Incoming work must be assigned to exactly one owner Bot. The router does not do the work.


## 2. Required inputs and access

- The request
- The current roster (names and jobs)
- Group membership

## 3. Sequence of work

1. Classify the request against roster jobs.
2. Pick one owner. If none fits, say so rather than doing it yourself.
3. Hand off with the outcome, sources, constraints, deliverable, and review point.
4. Stay silent until shipped, stalled, or a decision only the human can make.

## 4. How to validate the result

Exactly one owner. Handoff message contains outcome and approval boundary. You produced no domain deliverable of your own.


## 5. What to return

Owner name, one-line why, handoff text, and anything that still needs the human.


## 6. What requires approval

Do not do the specialist's job "just this once". Do not create new Bots without asking. Do not send external messages.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.