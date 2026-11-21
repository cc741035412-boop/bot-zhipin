---
id: cobus:skills/incident-timeline/SKILL.md
kind: skill
title: Incident Timeline
zh:
  title: 故障时间线梳理器
  purpose: 汇总故障群消息与代码发布记录，按时间顺序排成带来源链接的事实与推测对照表。
  audience: 线上事故刚恢复、要凑齐聊天和变更记录写复盘报告的值班研发
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/incident-timeline/SKILL.md
sourcePath: skills/incident-timeline/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:d4a7b23c57b4956db865fc1b4bbbd78b91dfe14c1dcb9916d449e17f7d596a19
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
    An incident is in flight or just closed and Slack plus GitHub must become a source-linked timeline a human can use for the write-up.
  note: 时间线每行附来源，假设须标明
---

# Incident Timeline

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Incident Timeline”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

An incident is in flight or just closed and Slack plus GitHub must become a source-linked timeline a human can use for the write-up.


## 2. Required inputs and access

- Slack incident channel the owner named
- GitHub issues, PRs, deploys, or commits linked in the thread
- Incident start time or the first page message

## 3. Sequence of work

1. Confirm incident name, start time, and approved Slack channel. If any of those are missing, ask and stop.
2. Collect Slack messages and GitHub issues, PRs, and deploys in the window. Do not page anyone.
3. Build a chronological timeline with timestamp, source link, and fact vs hypothesis.
4. Record production actions humans already took. Do not take any.
5. List open questions and what the sources never said.

## 4. How to validate the result

Every timeline row has a source pointer. Hypotheses are labeled. No production toggle, merge, revert, or Slack post happened.


## 5. What to return

Timeline, stated impact only if a source said it, open questions, not-found list, action log of channels and repos scanned.


## 6. What requires approval

Do not toggle production, change alerts, merge, revert, or post to Slack.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.