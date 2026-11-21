---
id: cobus:skills/reconcile-expenses/SKILL.md
kind: skill
title: Reconcile Expenses
zh:
  title: 周度报销与票据核对器
  purpose: 核对报销流水、收据和财务制度，产出金额平账的周汇总、违规明细表及催票草稿。
  audience: 每周要核对员工报销票据并排查超标支出的财务人员
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/reconcile-expenses/SKILL.md
sourcePath: skills/reconcile-expenses/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:a5a534a6e8dc2a54dd96011ca45b592b71d7ce83808895e55542accd79353fc3
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
    A week's expenses must be matched to receipts and policy, with exception drafts — totals that reconcile back to the source.
  note: 对齐源系统总额或解释差额
---

# Reconcile Expenses

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Reconcile Expenses”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

A week's expenses must be matched to receipts and policy, with exception drafts — totals that reconcile back to the source.


## 2. Required inputs and access

- Expense system export or connector
- Finance inbox / attached receipts
- Written expense policy (the signed one, not memory)

## 3. Sequence of work

1. Total the source system. That number is the denominator.
2. Match receipts. Flag missing categories and policy exceptions with policy citations.
3. Draft one follow-up per owner. Do not send.
4. Return summary, exceptions, drafts, and a reconciling total.

## 4. How to validate the result

Summary total equals the source system total or the difference is explained. Every exception cites a policy section.


## 5. What to return

Weekly summary, exception table with policy cites, unsent follow-up drafts, action log.


## 6. What requires approval

Do not send follow-ups. Do not change reimbursements. Do not approve spend.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.