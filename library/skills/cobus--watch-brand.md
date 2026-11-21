---
id: cobus:skills/watch-brand/SKILL.md
kind: skill
title: Watch Brand
zh:
  title: 品牌与高管舆情摘录技能
  purpose: 扫描指定Slack频道和X的品牌提及，按四类分桶并标出需人工跟进的客诉或报道。
  audience: 每天要盯社媒和社群品牌反馈的公关与产品运营
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/watch-brand/SKILL.md
sourcePath: skills/watch-brand/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:5220793db8976afd85e342cd87c3db54661a94daae6db541a25c305ebe5ef119
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
    The owner needs a reading digest of brand, product, and executive mentions from approved Slack channels and X — not a reply thread.
  note: 每条有来源链接或消息指针
---

# Watch Brand

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Watch Brand”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

The owner needs a reading digest of brand, product, and executive mentions from approved Slack channels and X — not a reply thread.


## 2. Required inputs and access

- Pinned term list (brand, product, executives)
- Approved Slack channels
- X plugin access
- Ignore list if the owner saved one
- Time window (default since last run)

## 3. Sequence of work

1. Re-read the term list and ignore list. If terms or channels are missing, ask and stop.
2. Scan only approved Slack channels and X for the window.
3. Quote each mention. Bucket product / press / support / noise.
4. Flag "human should look" for support, legal, or press-level items only.
5. Dedup repeated URLs. Do not reply, like, or repost.

## 4. How to validate the result

Every item has a source link or message pointer. Unapproved channels were not scanned. No replies, likes, or posts were made.


## 5. What to return

Mention digest with buckets, human-look flags, and an action log of sources scanned.


## 6. What requires approval

Do not reply on X or Slack. Do not like, repost, or follow. Do not send mail to authors. Do not post a brand statement.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.