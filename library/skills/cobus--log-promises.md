---
id: cobus:skills/log-promises/SKILL.md
kind: skill
title: Log Promises
zh:
  title: 对客承诺登记器
  purpose: 从客户通话纪要里提取我方答应的事项，更新带原话和期限的承诺台账并标出逾期项。
  audience: 开完客户沟通会、怕漏掉口头答应事项的销售与客户成功经理
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/log-promises/SKILL.md
sourcePath: skills/log-promises/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:2815135145e844c150ad3e2cae1a5c22e8734b1aa734208bed4fa5d6de8f786f
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
    After a customer call or thread, commitments must be written down before the next meeting — owner, due date, source quote.
  note: 每行有承诺原话，缺日期写未知
---

# Log Promises

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Log Promises”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

After a customer call or thread, commitments must be written down before the next meeting — owner, due date, source quote.


## 2. Required inputs and access

- Call notes, transcript, or thread
- Existing promise log if any (workspace file)

## 3. Sequence of work

1. Extract statements that bind the company ("we'll send", "by Friday", "included").
2. Ignore vibes and sales adjectives.
3. For each row record quote, owner if named, date if named, and source link.
4. Append to /workspace/promise-log.md. Do not email the customer a recap unless asked.

## 4. How to validate the result

Every row has a quote. Dates not in the source are marked unknown, not guessed.


## 5. What to return

Updated promise table and a list of commitments that are already overdue.


## 6. What requires approval

Do not send the recap to the customer. Do not change CRM stages.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.