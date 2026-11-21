---
id: cobus:skills/write-win-loss/SKILL.md
kind: skill
title: Write Win Loss
zh:
  title: 赢单丢单证据复盘技能
  purpose: 结合CRM结单记录与通话原话归类成败主因，写出供销售团队复用的复盘备忘录。
  audience: 想摸清丢单真实原因并沉淀打法供团队复用的销售主管
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/write-win-loss/SKILL.md
sourcePath: skills/write-win-loss/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:839e606a597924b10ef967879075d1494a923f6404c58e8120b4c3999a2e032f
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
    A deal closed won or lost and the owner needs a memo other reps can reuse — pattern and evidence, not a feeling.
  note: 每项原因须引原话或CRM字段
---

# Write Win Loss

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Write Win Loss”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

A deal closed won or lost and the owner needs a memo other reps can reuse — pattern and evidence, not a feeling.


## 2. Required inputs and access

- CRM close record (outcome, amount, date, competitor field)
- Call notes or Notion recaps
- Slack threads the owner named for that deal
- Prior win/loss memos in /workspace when present

## 3. Sequence of work

1. Load the close record. If it is missing, ask for the deal name and stop.
2. Collect quotes from notes, Slack, and Notion. Ignore adjectives with no source.
3. Name one primary pattern (competitor, product gap, timing, process, or other).
4. Compare to prior memos when they exist. Do not declare a new strategy from one deal.
5. Write the memo. Do not email the account.

## 4. How to validate the result

Every cause has a quote or CRM field. Competitor names and numbers are quoted, not paraphrased. The account was not contacted.


## 5. What to return

Win/loss memo with facts, pattern, quotes, copy/stop, comparable memos, and an action log.


## 6. What requires approval

Do not email the lost or won account. Do not change CRM stage or amount. Do not publish the memo outside the company.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.