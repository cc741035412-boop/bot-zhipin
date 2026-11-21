---
id: cobus:skills/garden-memory/SKILL.md
kind: skill
title: Garden Memory
zh:
  title: 机器人记忆修剪器
  purpose: 比对权威资料清理机器人设定里的过时记忆，输出设定修改对比稿与免记事项清单。
  audience: 发现机器人老拿旧偏好说事、想修正设定又不误删边界的维护者
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/garden-memory/SKILL.md
sourcePath: skills/garden-memory/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:0c280078c8a7d1051bdd59f9f4459f1d0bc3de2096dda2999fed5e91f38bf567
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
firstTask: 只核对一条旧记忆：「周报默认群发」。新版《周报约定》写着「机器人只拟稿，是否对外分享由当周负责人决定」，本周由小陈负责。请列一条修改前后对照草稿，注明依据和不该长期记的信息，留给我确认。不保存草稿，不改设定或记忆，不设定时。
expect: 对照稿引用《周报约定》，建议改为只拟稿、由当周负责人决定是否分享，并把本周人选列为免记项。
extra:
  whenToUse: |
    A Bot (this one or another) is acting on stale preferences or invented standing facts, and the owner wants memory corrected without wiping the role.
  note: 修正须引用来源，不得删无关边界
---

# Garden Memory

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Garden Memory”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

A Bot (this one or another) is acting on stale preferences or invented standing facts, and the owner wants memory corrected without wiping the role.


## 2. Required inputs and access

- The stale claim the Bot keeps using
- The source of truth that contradicts it
- Which Bot owns the memory

## 3. Sequence of work

1. Quote the stale claim and the contradicting source.
2. Propose the corrected standing fact in description-ready language.
3. List anything that should be forgotten vs updated vs moved to a source system.
4. Ask the owner to confirm. Then, only if they own this Bot, update the description.

## 4. How to validate the result

Corrections cite a source. You did not delete unrelated boundaries. Changing facts were not stored as memory — they were pointed at the source system.


## 5. What to return

Diff of proposed description changes and a "do not remember" list.


## 6. What requires approval

Do not edit another Bot's description without the owner asking. Do not scrape private conversations for gossip.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.