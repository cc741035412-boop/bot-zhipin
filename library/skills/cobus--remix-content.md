---
id: cobus:skills/remix-content/SKILL.md
kind: skill
title: Remix Content
zh:
  title: 多渠道稿件改写工具
  purpose: 提取长文核心论据，改写成适配各社交平台与邮件字数限制的待审草稿并附原文出处。
  audience: 要把一篇主稿拆成多平台宣发草稿的内容营销与编辑
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/remix-content/SKILL.md
sourcePath: skills/remix-content/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:c4556115c6678aba460fb979753f7495bc79a0b23b00a2808dc58bd3ea54bcca
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
    One source draft must become review-ready social and email variants that stay unpublished.
  note: 每项主张都可追溯到源稿
---

# Remix Content

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Remix Content”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

One source draft must become review-ready social and email variants that stay unpublished.


## 2. Required inputs and access

- Source draft (Notion, chat, or attached file)
- Brand voice examples if the owner attached them
- Named channels (default X, LinkedIn, email, short page)

## 3. Sequence of work

1. Read the source. If it is missing, ask and stop.
2. Extract claims. Do not add statistics the source does not contain.
3. Write one variant per named channel, inside that channel's limits.
4. Map each variant sentence back to a source claim.
5. Label every variant DRAFT. Do not publish, schedule, or send.

## 4. How to validate the result

Every variant is labeled DRAFT. Every claim traces to the source. Nothing was posted, scheduled, or mailed.


## 5. What to return

Remix pack with source claims, per-channel DRAFT variants, character counts, and an action log.


## 6. What requires approval

Do not publish or schedule. Do not post to X, LinkedIn, Slack, or a CMS. Do not send the email variant. Do not edit the live source page unless named.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.