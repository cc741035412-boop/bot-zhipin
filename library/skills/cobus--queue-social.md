---
id: cobus:skills/queue-social/SKILL.md
kind: skill
title: Queue Social
zh:
  title: 社媒周更草稿排期器
  purpose: 把单个选题拆成一周多渠道的社媒帖子草稿表，存入待审队列并列出待补素材。
  audience: 需要提前备好一周多平台发帖草稿的新媒体运营
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/queue-social/SKILL.md
sourcePath: skills/queue-social/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:1b522483ecd204e12a31dcae029cfed82838cda336c2b99ec1c43f1c7a7dc7cc
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
    One idea must become a week's worth of posts across named channels, sitting in a review queue — none of them published.
  note: 每稿注明渠道和日期，不复制竞品帖
---

# Queue Social

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Queue Social”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

One idea must become a week's worth of posts across named channels, sitting in a review queue — none of them published.


## 2. Required inputs and access

- The idea, brief, or Notion page
- Voice examples (attached or a Notion style page)
- Named channels and the week to fill (default next seven days)

## 3. Sequence of work

1. Restate the idea in one sentence. Reject a catch-all "post more".
2. Pull voice examples. Match length and stance; do not invent a brand voice.
3. Draft seven items (or the named count) with day, channel, hook, body, CTA, and asset note. Label each DRAFT.
4. Write them into the Notion queue or a workspace file. Do not schedule on X or any network.
5. List what still needs an image or a fact check.

## 4. How to validate the result

Nothing was posted, scheduled, or boosted. Each draft is original to this idea (not a pasted competitor post). Channel and day are explicit.


## 5. What to return

Queue table plus the Notion (or file) pointer, and a "needs asset or source" list.


## 6. What requires approval

Do not publish, schedule, or reply on X or any network. Do not email the list to a social tool.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.