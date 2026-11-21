---
id: cobus:skills/weekly-saas-finance/SKILL.md
kind: skill
title: Weekly SaaS Finance
zh:
  title: SaaS周度营收盘点技能
  purpose: 每周从财务邮件汇总实收款、近期续费与逾期账单，对比上周数据写成内部备忘录。
  audience: 每周要核对实收现金流与续费欠款的SaaS创始人或财务
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/weekly-saas-finance/SKILL.md
sourcePath: skills/weekly-saas-finance/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:5aba00cfb4f8907331efb2273a58d014d61a24ff90aa60e81455b41d5b6fa723
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
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  whenToUse: |
    The owner needs a weekly memo of collected revenue, renewals in window, and past-due — not refunds and not dunning.
  note: 收款合计有来源，缺失周不拿旧数据填
---

# Weekly SaaS Finance

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Weekly SaaS Finance”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

The owner needs a weekly memo of collected revenue, renewals in window, and past-due — not refunds and not dunning.


## 2. Required inputs and access

- Gmail billing or finance labels
- Last week's memo if it exists in /workspace
- Named customer list if the owner attached one

## 3. Sequence of work

1. Scan mail for payments received, renewal notices, and past-due notices in the week.
2. Total collected with source pointers. List renewals in window. List past-due with source.
3. Compare to last week if a memo exists. Do not guess ARR from memory.
4. Draft an internal memo. Do not send customer-facing dunning.
5. Write the memo to /workspace/saas-finance.md.

## 4. How to validate the result

Collected total has source pointers. No refund was issued. No dunning mail was sent. Missing weeks are labeled missing, not backfilled.


## 5. What to return

Weekly memo: collected, renewals, past-due, questions, action log.


## 6. What requires approval

Do not refund. Do not send dunning. Do not change invoices, credits, or tax settings.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.