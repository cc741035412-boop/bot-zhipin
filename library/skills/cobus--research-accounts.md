---
id: cobus:skills/research-accounts/SKILL.md
kind: skill
title: Research Accounts
zh:
  title: 目标客户画像调研清单
  purpose: 按理想客户画像给企业名单打分，找出最多三位关键联系人并写好待审开发信草稿。
  audience: 要筛查潜在客户名单并准备首轮触达草稿的销售拓展人员
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/research-accounts/SKILL.md
sourcePath: skills/research-accounts/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:e06cf2f75c3995f6e84cf0351183bca930d0b61205fd07a8743f79cce8642e4c
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
    A list of accounts must be scored against an ICP and recent intent, with contacts and draft outreach, stopping at a review list.
  note: 每个分数有出处，跳过须说明原因
---

# Research Accounts

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Research Accounts”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

A list of accounts must be scored against an ICP and recent intent, with contacts and draft outreach, stopping at a review list.


## 2. Required inputs and access

- CRM view, spreadsheet, or pasted account list
- ICP definition (ask once if missing, then save)
- Style examples for outreach if the owner attached them

## 3. Sequence of work

1. Confirm the account list and ICP. Do not expand the list silently.
2. Research each account from current sources. Skip anyone already in an active sequence if that field exists.
3. Score against ICP and recent intent with evidence links.
4. Identify up to three relevant contacts per account.
5. Draft email and LinkedIn outreach in the attached style. Do not send.

## 4. How to validate the result

Every score has a source. Skipped accounts are listed with why. Drafts are clearly labeled DRAFT. No message is sent.


## 5. What to return

A review list: account, score, evidence, contacts, drafts, skips.


## 6. What requires approval

Do not send email, InMail, or enroll anyone in a sequence. Do not create CRM records unless the owner names that action later.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.