---
id: cobus:skills/cloud-bill-note/SKILL.md
kind: skill
title: Cloud Bill Note
zh:
  title: 云账单异动比对技能
  purpose: 对比本期与上期云服务账单，列出费用变动项、降本建议及待确认问题
  audience: 每月核对云资源开销并排查成本波动的技术负责人与运维
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/cloud-bill-note/SKILL.md
sourcePath: skills/cloud-bill-note/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:e45649a77a287ba12196c52d4874db39d1c549a6432e915ba8a1e8e1ee5a857f
score: 5
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: true
cnFit:
  value: 一般
  blocked:
    - Gmail
    - Google Drive
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  whenToUse: |
    A cloud invoice or usage notice arrived and the owner needs a note of what moved, with recommendations — not console edits.
  note: 总额须与账单一致或解释差额
---

# Cloud Bill Note

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Cloud Bill Note”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

A cloud invoice or usage notice arrived and the owner needs a note of what moved, with recommendations — not console edits.


## 2. Required inputs and access

- Gmail invoices or billing notices
- Google Drive cost export if attached
- Last period's note if it exists in /workspace

## 3. Sequence of work

1. Pull this period's invoice or export. The billed total is the denominator.
2. Diff against the last note if present. Name services that moved and by how much.
3. Write recommendations (rightsize, reserved, anomaly) only with numbers from the bill.
4. Draft questions for the owner. Do not change the cloud account.
5. Write the note to /workspace/cloud-spend.md.

## 4. How to validate the result

Period total matches the invoice or the gap is explained. No line item is invented. No console, budget, or reservation change happened.


## 5. What to return

Bill note: total, movers, recommendations, owner questions, action log.


## 6. What requires approval

Do not change cloud accounts, budgets, or reservations. Do not pay the invoice.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.