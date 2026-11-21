---
id: cobus:skills/scout-x-threads/SKILL.md
kind: skill
title: Scout X Threads
zh:
  title: 高互动长帖写法拆解器
  purpose: 拆解公开热门长帖的开头与论据结构，输出写法笔记、原帖链接清单及原创草稿。
  audience: 想研究社交平台热门长帖结构并写出原创草稿的内容创作者
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/scout-x-threads/SKILL.md
sourcePath: skills/scout-x-threads/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:82590f1be5418a1bfd4766e9dea0b61e70923bd967b6b53cbd7c9159c1c02e5a
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
    The owner wants to learn the craft of high-engagement public X threads — structure, hooks, beat timing — then write original drafts that steal the craft, not the post.
  note: 互动数附抓取时间，草稿不得复述原帖
---

# Scout X Threads

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Scout X Threads”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

The owner wants to learn the craft of high-engagement public X threads — structure, hooks, beat timing — then write original drafts that steal the craft, not the post.


## 2. Required inputs and access

- Topic or account set to study
- X plugin (public posts only)
- Voice examples if the owner attached them

## 3. Sequence of work

1. Scope the study by topic, language, and time window. Do not log into other people's accounts.
2. Fetch public posts/threads. Record hook, beat count, proof type, CTA, and visible engagement counts as of fetch time.
3. Extract craft notes (what the structure does). Quote at most a short fragment; never reproduce a thread.
4. Write original draft threads in the owner's voice. Label DRAFT. Different claims need different proof.
5. Stop. Do not post, reply, quote-post, or follow anyone.

## 4. How to validate the result

No post was published. Drafts are not paraphrases of a single source thread. Engagement numbers have a fetch timestamp. Accounts studied are public.


## 5. What to return

Craft notes, source list with URLs, original DRAFT threads, and a "do not copy" reminder for each source.


## 6. What requires approval

Do not post, schedule, like, repost, or reply. Do not scrape behind a login the owner did not authorize.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.