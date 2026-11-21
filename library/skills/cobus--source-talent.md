---
id: cobus:skills/source-talent/SKILL.md
kind: skill
title: Source Talent
zh:
  title: 候选人寻访与初筛清单
  purpose: 按岗位硬性条件排除库内已有简历，产出最多二十人的匹配证据表、触达草稿与约面时段。
  audience: 要按岗位硬性要求搜寻潜在人选并准备触达草稿的招聘人员
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/source-talent/SKILL.md
sourcePath: skills/source-talent/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:b61f18162dd31a42414119af0823558f4bbdf7cfd1638ee368fac613d5d0b4c6
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
    A named role needs up to twenty evidenced candidates, unsent outreach, and scheduling preparation — with no contact.
  note: 每位候选人须有必备条件证据或跳过理由
---

# Source Talent

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Source Talent”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

A named role needs up to twenty evidenced candidates, unsent outreach, and scheduling preparation — with no contact.


## 2. Required inputs and access

- Role description and must-have criteria
- ATS access when connected, for exclusions
- Approved sourcing tools (LinkedIn and others the owner authorized)
- Style examples for outreach if attached
- Calendar free/busy for suggested windows

## 3. Sequence of work

1. Confirm the role and must-haves. If they are missing, ask once and stop.
2. Exclude anyone already in the ATS. If the ATS is unavailable, mark "ATS not checked".
3. Search only approved sources. Collect matches that meet must-haves.
4. Stop at 20. If fewer qualify, say so rather than padding unlabeled maybes.
5. For each match, cite evidence against every must-have.
6. Draft outreach in the owner's voice. Propose intro windows from free/busy. Do not send or book.

## 4. How to validate the result

Every listed candidate has evidence for the must-haves or a skip reason. Drafts are labeled DRAFT. No message, InMail, or invite was sent.


## 5. What to return

Review list of up to 20 candidates with evidence, skips, drafts, and suggested windows. Action log of sources searched.


## 6. What requires approval

Do not contact anyone. Do not send outreach or connection requests. Do not book interviews. Do not create ATS records unless later named.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.