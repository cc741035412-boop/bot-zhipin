---
id: cobus:skills/install-team/SKILL.md
kind: skill
title: Install Team
zh:
  title: 机器人小队组建器
  purpose: 按目录里选定的团队编号创建两到四个角色机器人并拉群，输出花名册与开场草稿。
  audience: 想照现成编制在工作区拉起一组协同机器人的团队管理员
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/install-team/SKILL.md
sourcePath: skills/install-team/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:8ba7bfc7a99b06d8d1962ce2cb2d9896e209ad38789488fb87f710f64e2d9304
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
    The owner wants a named starter team from this catalog stood up as real Grok Bots plus one group, without dumping the whole catalog.
  note: 只装二至四个，描述照录原文件
---

# Install Team

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Install Team”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

The owner wants a named starter team from this catalog stood up as real Grok Bots plus one group, without dumping the whole catalog.


## 2. Required inputs and access

- Team id (eng, sales, success, ops, marketing, product, loop, research, personal, meta)
- Confirmation that week one is L1

## 3. Sequence of work

1. Resolve the team yaml. Never invent extra Bots.
2. Create at most four Bots. Name = profile name. Description = PROFILE.md body fetched from this repo, not paraphrased.
3. Report the union of plugins to connect in Settings → Plugins.
4. Put the new Bots in one group.
5. Paste the group's kickoff as the first group message draft — do not send external messages.

## 4. How to validate the result

Bot count is 2–4. Each description is the catalog PROFILE, not a summary. No Bot has a routine enabled. No connector was authenticated by you pretending to be the owner.


## 5. What to return

Roster table (name, job, plugins), group name, kickoff text, and the first task for the lead Bot.


## 6. What requires approval

Do not send, post, pay, or contact anyone. Do not connect plugins yourself if a browser login or 2FA is required — ask the owner to take over.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.