---
id: cobus:skills/recommend-media-realloc/SKILL.md
kind: skill
title: Recommend Media Realloc
zh:
  title: 广告预算调配建议书
  purpose: 对比各广告系列花费与目标获客成本，产出带前后数据对比的预算调整表和汇报草稿。
  audience: 要按月度预算和获客成本调配买量花费的投放运营
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/recommend-media-realloc/SKILL.md
sourcePath: skills/recommend-media-realloc/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:10abcc248ea11dd3318f43f5f66f1ab72ef045032bad8209caaca2545b3e58a2
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
    Current paid-media spend and performance must be compared with monthly budget and target CAC, then turned into unsent realloc recommendations and a Slack draft.
  note: 总额对账，每条建议有支持数字
---

# Recommend Media Realloc

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Recommend Media Realloc”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

Current paid-media spend and performance must be compared with monthly budget and target CAC, then turned into unsent realloc recommendations and a Slack draft.


## 2. Required inputs and access

- Advertising platform export or connector
- Analytics the owner named
- Monthly budget spreadsheet in Google Drive
- Pinned target CAC

## 3. Sequence of work

1. Load budget spreadsheet and target CAC. If either is missing, ask and stop.
2. Pull current spend and performance by campaign. If a platform is down, name it; do not reuse last week's file silently.
3. Reconcile totals to the spreadsheet.
4. Recommend hold / shift / stop with before/after numbers.
5. Draft a Slack update labeled DRAFT. Do not change budgets. Do not send.

## 4. How to validate the result

Totals reconcile to the spreadsheet. Every recommendation has supporting numbers. No campaign control was touched. Slack was not sent.


## 5. What to return

Realloc memo, table of spend vs budget vs CAC, Slack DRAFT, action log.


## 6. What requires approval

Do not change budgets, bids, or campaign status. Do not send the Slack message. Do not create or pause ads. Do not spend or move money.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.