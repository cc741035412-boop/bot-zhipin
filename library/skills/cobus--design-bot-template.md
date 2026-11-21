---
id: cobus:skills/design-bot-template/SKILL.md
kind: skill
title: Design Bot Template
zh:
  title: 机器人岗位模板编写技能
  purpose: 按职责与数据源编写符合规范的Bot配置文档，并输出逐项合格自检表
  audience: 需要把日常工作固化成标准Bot设定模板的团队维护者
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/design-bot-template/SKILL.md
sourcePath: skills/design-bot-template/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:7ea149d9ce1f748e86837204e6ef505048ef1167e90b21edb1bd64e0fdf30e91
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
  flag: true
  rules:
    - R-pay
  hits:
    - rule: R-pay
      excerpt: approval_never has at least three items including one of send/pay/merge/publish/
extra:
  whenToUse: |
    The owner describes a job, a pain, or a keyword and needs a share-safe Grok Bot operating contract that would pass this repository's schema and Bot Ready score, not a cute persona.
  note: 评分低于80须重写，禁止项至少三条
---

# Design Bot Template

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Design Bot Template”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

The owner describes a job, a pain, or a keyword and needs a share-safe Grok Bot operating contract that would pass this repository's schema and Bot Ready score, not a cute persona.


## 2. Required inputs and access

- Outcome the Bot must own (one sentence)
- Sources and plugins that actually exist for this owner
- Autonomy target (default L1)
- Approval boundary (what must never happen)

## 3. Sequence of work

1. Parse the outcome. Reject catch-all jobs such as general helper.
2. Diagnose missing sources, missing deliverable shape, hallucination risk, and autonomy drift.
3. Fill every required template.yaml field from SPEC.md.
4. Write PROFILE-ready description text with job, sources, how, deliverable, never-list, first task, no-data policy.
5. Score it mentally against Bot Ready. If under 80, rewrite before showing it.

## 4. How to validate the result

Every required SPEC field is present. approval_never has at least three items including one of send/pay/merge/publish/production. No secrets or internal URLs. First task is runnable on an empty chat.


## 5. What to return

A complete template.yaml (or PROFILE.md) the owner can paste, plus the Bot Ready checklist with pass/fail per item.


## 6. What requires approval

Do not create Bots on the owner's account until they say to create them. Do not enable routines. Do not attach a logo.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.