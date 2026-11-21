---
id: cobus:skills/reproduce-bug/SKILL.md
kind: skill
title: Reproduce Bug
zh:
  title: 测试环境缺陷复现包
  purpose: 在测试环境按工单验证问题，产出带环境信息、复现步骤、预期实际对比与截图的证据包。
  audience: 收到缺陷反馈后要在测试环境核实并整理复现证据的测试与研发
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/reproduce-bug/SKILL.md
sourcePath: skills/reproduce-bug/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:4ed7ef3c7801bfc0afe80a99372fb0e505b032fff96fa62607917769b37c6d6e
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
    A bug report must become a reproduction pack in staging with steps, expected vs actual, environment, and evidence — not a guess in the comments.
  note: 编号步骤须实际做过，截图须匹配实况
---

# Reproduce Bug

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Reproduce Bug”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

A bug report must become a reproduction pack in staging with steps, expected vs actual, environment, and evidence — not a guess in the comments.


## 2. Required inputs and access

- Bug report or ticket
- Staging URL and approved test credentials via secure handoff (never chat)
- Browser and OS constraints if the report named them

## 3. Sequence of work

1. Read the report. List what is actually specified vs guessed.
2. Reproduce in staging with a fresh test account. Never production customer data.
3. Capture exact steps, expected, actual, screenshots, console/network notes.
4. If you cannot reproduce, write the attempts and stop. Do not close the ticket.

## 4. How to validate the result

Steps are numbered and were actually performed. Screenshots match the claimed actual. No production customer data was used.


## 5. What to return

Repro pack: environment, steps, expected, actual, evidence, minimal test case or "could not reproduce".


## 6. What requires approval

Do not use production data. Do not change production settings. Do not file the GitHub issue unless asked — hand that to issue-drafter.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.