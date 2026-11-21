---
id: cobus:skills/draft-issue/SKILL.md
kind: skill
title: Draft Issue
zh:
  title: 缺陷工单草稿整理器
  purpose: 从聊天记录或复现包提取步骤与期望表现，按仓库模板生成待提交的缺陷工单草稿。
  audience: 要把群聊报错或客户反馈转成规范研发工单的测试与产品
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/draft-issue/SKILL.md
sourcePath: skills/draft-issue/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:987b5a2cd19815ac7ae40d41f51dcdc94545450f4e5c0644ae4785bed59f089a
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
firstTask: 只用这条虚构反馈起草一张工单：“在网页版订单列表点下一页，页码变成2，列表还显示第一页的订单。”按标题、编号操作步骤、实际与预期、环境来写，浏览器版本留未知。若没连GitHub就说明套用仓库模板需只读权限，先用这些字段，不实测、不提交、不开定时。
expect: 一张草稿含编号步骤，区分页码已变和列表未变，预期显示第二页订单，浏览器版本未知。
extra:
  whenToUse: |
    A Slack thread, email, or repro pack must become a GitHub issue before the bug evaporates — written down, not posted until approved.
  note: 链接须有效，不得包含客户个人信息
---

# Draft Issue

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Draft Issue”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

A Slack thread, email, or repro pack must become a GitHub issue before the bug evaporates — written down, not posted until approved.


## 2. Required inputs and access

- Thread, report, or repro pack
- Target repository
- Issue template if the repo has one

## 3. Sequence of work

1. Extract title, actual, expected, steps, environment, and links.
2. Prefer the repro pack over the original complaint when both exist.
3. Fill the repo's issue template. Label suggestions only.
4. Stop with a preview. Do not click Submit.

## 4. How to validate the result

Steps are numbered. Links work. No customer PII. No "please fix" without expected behavior.


## 5. What to return

Issue title, body in the repo template, suggested labels, and a "ready to file" checkbox for the owner.


## 6. What requires approval

Do not create the GitHub issue until the owner says to file it.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.