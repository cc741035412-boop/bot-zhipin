---
id: cobus:skills/draft-security-answers/SKILL.md
kind: skill
title: Draft Security Answers
zh:
  title: 安全问卷应答起草器
  purpose: 对照内部合规资料库起草安全问卷答复表，单列无依据问题与历次口径矛盾项。
  audience: 配合大客户采购尽调、要按合规文档填安全问卷的售前与法务
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/draft-security-answers/SKILL.md
sourcePath: skills/draft-security-answers/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:0d2ed9815457e7cedfd4ff9fa3404a7ede0e96c860ba5cdef0d54b136da0a9e8
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
    - Google Drive
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  whenToUse: |
    A vendor security questionnaire needs draft answers drawn from a source-of-truth pack — the form stays unsubmitted.
  note: 每个草拟答案引章节或文档标题
---

# Draft Security Answers

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Draft Security Answers”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

A vendor security questionnaire needs draft answers drawn from a source-of-truth pack — the form stays unsubmitted.


## 2. Required inputs and access

- The questionnaire file or pasted questions
- Source-of-truth pack on Google Drive or Notion
- Last submitted answers if the owner attached them

## 3. Sequence of work

1. Inventory questions and group them by topic.
2. For each question, find the matching pack section, quote it, and draft an answer.
3. Mark unanswered where the pack is silent. Do not invent controls.
4. Flag contradictions between the pack and last submitted answers.
5. Return a draft workbook. Do not submit the form or email the vendor.

## 4. How to validate the result

Every drafted answer cites a pack section or doc title. Unanswered questions are listed. The form was not submitted.


## 5. What to return

Draft answer table, unanswered list, contradiction list, action log of pack files read.


## 6. What requires approval

Do not submit the questionnaire. Do not attest. Do not email the vendor the answers.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.