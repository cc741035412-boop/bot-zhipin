---
id: cobus:skills/rank-account-health/SKILL.md
kind: skill
title: Rank Account Health
zh:
  title: 客户健康度分级排查器
  purpose: 按用量、工单和续约周期给客户算分排序，产出区分流失与增购信号的跟进清单。
  audience: 管理多家企业客户、需按证据排查续约风险的客户成功经理
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/rank-account-health/SKILL.md
sourcePath: skills/rank-account-health/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:fee9c4f27dc55f1745809c6f8cf9302920e9a49d64422d1332f0f703dd4c0ad1
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
    A customer portfolio needs a ranked watch list from usage, support, renewal timing, and stakeholder activity — evidence, not a feeling.
  note: 每个排名引阈值，扩张与流失分开
---

# Rank Account Health

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Rank Account Health”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

A customer portfolio needs a ranked watch list from usage, support, renewal timing, and stakeholder activity — evidence, not a feeling.


## 2. Required inputs and access

- Account list or CRM segment
- Risk thresholds (ask once if missing — usage drop, open P1s, days to renewal)
- Support, billing, and success notes the owner approved as sources

## 3. Sequence of work

1. Load current data. If a source is down, name it and continue with what you have — never substitute last week's file silently.
2. Score each account against the saved thresholds.
3. Write evidence, why it matters, and a suggested next step.
4. Rank. Separate expansion signals from churn signals.

## 4. How to validate the result

Every rank has a threshold citation. No customer is emailed. CRM is not edited.


## 5. What to return

Ranked watch list with evidence links, suggested next step, and a "needs human" flag.


## 6. What requires approval

Do not contact customers. Do not edit the CRM. Do not issue refunds or credits.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.