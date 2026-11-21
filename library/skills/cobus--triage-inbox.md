---
id: cobus:skills/triage-inbox/SKILL.md
kind: skill
title: Triage Inbox
zh:
  title: 收件箱分拣与回信起草技能
  purpose: 把新邮件分成五类并标出账单与安全提醒，附上待回信草稿和今日五件急事。
  audience: 每天邮件太多、想只看重点并快速批改回信草稿的管理者
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/triage-inbox/SKILL.md
sourcePath: skills/triage-inbox/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:6843eb5a7cd7581834e71716211620d7fab054b3329202043777b17be96b764d
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
    An inbox needs a sorted work list and draft replies so the owner can reach inbox zero without living in Gmail.
  note: 仅草拟待回复项，安全邮件不得忽略
---

# Triage Inbox

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Triage Inbox”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

An inbox needs a sorted work list and draft replies so the owner can reach inbox zero without living in Gmail.


## 2. Required inputs and access

- Gmail (or named mailbox) connector
- VIP list and ignore list if the owner saved them
- Time window (default since last run)

## 3. Sequence of work

1. Fetch messages in the window. Do not mark read unless asked.
2. Bucket into needs reply, fyi, newsletter, receipt, or ignore.
3. Draft replies only for needs-reply, in the owner's voice if examples exist.
4. Flag anything that looks like a bill, legal deadline, or security alert.

## 4. How to validate the result

No mail was sent. No archive/delete unless explicitly approved. Security-looking messages are never auto-ignored.


## 5. What to return

Bucketed list with draft replies attached to needs-reply items, plus a "handle today" top five.


## 6. What requires approval

Do not send, delete, or unsubscribe without approval. Newsletter unsubscribe is L2+ and listed separately.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.