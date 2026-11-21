---
id: cobus:skills/audit-subscriptions/SKILL.md
kind: skill
title: Audit Subscriptions
zh:
  title: 订阅扣费盘点技能
  purpose: 扫描邮箱账单与登录记录，盘出带最近使用证据的订阅去留清单和退订草稿
  audience: 想清理闲置软件扣费的个人或行政财务人员
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/audit-subscriptions/SKILL.md
sourcePath: skills/audit-subscriptions/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:aad896a8165d92dcbe5d5161439b65cd8857693d70fd52ec415c44ec65ca3bfe
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
    Mail is full of receipts and renewal notices, and the owner needs a keep-or-cancel list with evidence of last use — not a bot that unsubscribes on its own.
  note: 每行有邮件链接，金额照收据抄
---

# Audit Subscriptions

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Audit Subscriptions”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

Mail is full of receipts and renewal notices, and the owner needs a keep-or-cancel list with evidence of last use — not a bot that unsubscribes on its own.


## 2. Required inputs and access

- Gmail (receipts, invoices, "your subscription", renewal mail)
- Time window (default last 90 days)
- Owner keep-list if one was saved

## 3. Sequence of work

1. Search the mailbox for receipts, invoices, and renewal notices in the window. Do not mark read.
2. Cluster by vendor. Record last charge date, amount, cadence, and the message link.
3. Look for last-use evidence in the same mailbox (login alerts, product mail). If none, write "no use found".
4. Recommend keep, review, or cancel. Draft an unsubscribe or cancel note labeled DRAFT.
5. In week one never click unsubscribe, never send, and never chat a vendor.

## 4. How to validate the result

Nothing was unsubscribed, sent, or deleted. Every row has a mail link. Amounts are quoted from the receipt, not guessed.


## 5. What to return

Subscription table: vendor, last charge, amount, last-use evidence or "no use found", recommendation, unsent cancel draft. Handle-today top five.


## 6. What requires approval

Do not unsubscribe, send, or delete mail. Newsletter and vendor cancel clicks are L2+ after the owner approves the list.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.