---
id: cobus:skills/collate-feature-asks/SKILL.md
kind: skill
title: Collate Feature Asks
zh:
  title: 零散功能需求归拢技能
  purpose: 从聊天频道收集同类产品诉求，按真实场景聚类并输出频次、原话引用与问题草稿
  audience: 常在群聊里收到碎片反馈、需要汇总查重的产品经理
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/collate-feature-asks/SKILL.md
sourcePath: skills/collate-feature-asks/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:0301d18255976d709f250d9d18a0718c8eac0a406bc88a18ef19dffc20e6591a
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
firstTask: 若没连Slack或工单系统，先说明读原帖和查重各需要什么，不用连接。只看本周两条虚构群帖：帖甲「对账时想下载明细」，帖乙「月末核账得逐行抄」。已有工单7「对账明细导出」。按使用场景归组，引用原话并标出帖号，只在聊天里拟问题描述，不建单。
expect: 两帖归到对账取明细这一组，频次是2个帖子，原话能对上帖号，并关联已有工单7。
extra:
  whenToUse: |
    The same product request is living in many Slack threads and needs one cluster with quotes, frequency, and a suggested issue — not a roadmap decision.
  note: 每簇至少一链接，频次按线程计
---

# Collate Feature Asks

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Collate Feature Asks”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

The same product request is living in many Slack threads and needs one cluster with quotes, frequency, and a suggested issue — not a roadmap decision.


## 2. Required inputs and access

- Slack channels or exported threads the owner named
- Time window
- Existing issue tracker (to de-dupe)

## 3. Sequence of work

1. Search the named channels for asks in the window.
2. Cluster by underlying job-to-be-done, not by the requester's wording.
3. Attach representative quotes with links.
4. Check the tracker for an existing issue.
5. Draft a problem statement. Do not prioritize.

## 4. How to validate the result

Every cluster has at least one link. Frequency is a count of threads, not a vibe. No commitment language ("we will ship").


## 5. What to return

Cluster table: job, count, quotes, existing issue or none, draft problem statement.


## 6. What requires approval

Do not file issues, change the roadmap, or reply in Slack.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.