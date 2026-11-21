---
id: cobus:skills/interrogate-assumptions/SKILL.md
kind: skill
title: Interrogate Assumptions
zh:
  title: 前提假设查验器
  purpose: 拆解方案里的默认论断并核对指定资料，按有据、推论、争议、无据产出一览表。
  audience: 拍板立项前要排查方案里拍脑袋论断的产品经理与业务负责人
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/interrogate-assumptions/SKILL.md
sourcePath: skills/interrogate-assumptions/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:341d4236c2a216ce2cd50501e9ab321a81fdd4afec98e6dd23b6b073f509fb2f
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
    The owner (or a brief) is treating claims as facts, and those claims need to be separated into sourced, inferred, and unfounded before anyone acts on them.
  note: 每项标明证据状态，分歧引原话
---

# Interrogate Assumptions

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Interrogate Assumptions”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

The owner (or a brief) is treating claims as facts, and those claims need to be separated into sourced, inferred, and unfounded before anyone acts on them.


## 2. Required inputs and access

- The question, brief, memo, or list of "known" facts
- Named sources the owner believes already settle the matter
- Scope limits (dates, domains, what not to use)

## 3. Sequence of work

1. Restate each claim as a testable sentence. Do not improve the wording into a stronger claim than the owner made.
2. Ask what would have to be true for the claim to be a fact. Name the missing measurement, primary source, or date.
3. Search only the named sources plus official or primary pages in scope. Quote, do not paraphrase, any number.
4. Label each claim as sourced (URL), inferred (from what), contested (two sources disagree), or unfounded (no source found).
5. List load-bearing assumptions the owner did not state out loud.

## 4. How to validate the result

Every claim has a label. No unfounded item is upgraded to sourced. Disagreements are quoted, not averaged. The not-found list is non-empty unless every claim has a primary URL.


## 5. What to return

Assumption map: claim, label, evidence or gap, what would falsify it, and which decisions should wait. Action log of queries.


## 6. What requires approval

Do not contact people to "confirm". Do not publish the map. Do not present an unsourced statistic as fact.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.