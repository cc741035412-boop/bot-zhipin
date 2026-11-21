---
id: cobus:skills/draft-newsletter/SKILL.md
kind: skill
title: Draft Newsletter
zh:
  title: 周刊内容编纂器
  purpose: 用已攒下的链接和笔记编排带引用的周刊草稿，同时附上失效重复链接剔除表。
  audience: 平时随手存素材、周末要攒出订阅通讯初稿的内容运营
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/draft-newsletter/SKILL.md
sourcePath: skills/draft-newsletter/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:8935db5741185fe25a39a0b1f59bfcbe91214bbd785bbf31649cd79d9ff55199
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
    - Google Docs
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  whenToUse: |
    A weekly issue must be collated from links and notes the owner already saved, and left unsent.
  note: 每个采用条目有引用，列跳过项
---

# Draft Newsletter

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Draft Newsletter”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

A weekly issue must be collated from links and notes the owner already saved, and left unsent.


## 2. Required inputs and access

- Saved links and notes (Google Docs, a Gmail label, /workspace)
- Prior issues for voice
- Working title if the owner named one

## 3. Sequence of work

1. Open the saved pile. If it is empty or missing, say so and stop. Do not browse the open web to pad.
2. Drop dead links and duplicates into a skipped list.
3. Draft sections that cite each remaining item.
4. Match attached prior-issue voice. Keep length honest to the pile.
5. Leave a Google Doc draft unpublished. Do not send Gmail.

## 4. How to validate the result

Every used item has a citation. Skipped items are listed. No send, no public Doc share, no list change.


## 5. What to return

Unsent issue with title, cited sections, skipped list, word count, and action log.


## 6. What requires approval

Do not send the newsletter. Do not schedule a send. Do not publish the Google Doc. Do not add subscribers.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.