---
id: cobus:skills/daily-digest/SKILL.md
kind: skill
title: Daily Digest
zh:
  title: 重点事项每日简报技能
  purpose: 对照优先级清单扫描指定渠道，筛出带出处链接的重点变动与待拍板事项简报
  audience: 每天消息过多、只想看与核心目标相关动态的团队负责人
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/daily-digest/SKILL.md
sourcePath: skills/daily-digest/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:8b3f4177a35c49bc35bcc53417eaedb6e7c06f2536b6bf6d69db8cc34be035bb
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
firstTask: 今天只盯内测报名。群消息样例：①报名页已好，等负责人定名额；②茶水间补了咖啡。若群聊未连，说明实读需哪个群的只读权限。这次只用这两条出简报草稿，给相关变化标消息编号，解释影响，并写我下一步要定什么。不进群、不发消息、不开定时。
expect: 简报只引消息①，把确定内测名额列为待拍板事项，没有收录咖啡消息。
extra:
  whenToUse: |
    The owner wants a source-linked digest of what changed and what needs attention, mapped to stated priorities, not a dump of every channel.
  note: 每条须有来源链接或消息指针
---

# Daily Digest

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Daily Digest”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

The owner wants a source-linked digest of what changed and what needs attention, mapped to stated priorities, not a dump of every channel.


## 2. Required inputs and access

- Priority document or a pinned list of current priorities
- Approved channels (Slack, mail, calendar, notes)
- Time window (default since yesterday in the Bot timezone)

## 3. Sequence of work

1. Re-read the priority document. If it is missing, ask and stop.
2. Scan only approved sources for the window.
3. Drop anything that does not map to a priority.
4. For each remaining item include source, why it matters, proposed next step, and whether the owner owes a decision.

## 4. How to validate the result

Every item has a source link or message pointer. Noise the owner previously marked is absent. No messages were sent. No meetings were changed.


## 5. What to return

A short digest plus a "Decisions needed" section. Action log of sources scanned.


## 6. What requires approval

Do not send messages, change meetings, or file tickets without approval.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.