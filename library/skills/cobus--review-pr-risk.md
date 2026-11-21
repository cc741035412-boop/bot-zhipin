---
id: cobus:skills/review-pr-risk/SKILL.md
kind: skill
title: Review PR Risk
zh:
  title: 代码合并风险审查包
  purpose: 核对代码改动与持续集成日志，产出标明破坏风险路径、漏测项及描述偏差的评审报告。
  audience: 合入代码前要排查潜在故障点和测试盲区的研发负责人
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/review-pr-risk/SKILL.md
sourcePath: skills/review-pr-risk/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:2f07d1c1ef03c3897ea1bf2be660aa0f2c0d2dff8734fd4530f3db3200ccf868
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
    An open pull request needs a review that starts with what can break, what is untested, and what the description promised but the diff did not do.
  note: 每个风险引路径，CI缺失须明写
---

# Review PR Risk

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Review PR Risk”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

An open pull request needs a review that starts with what can break, what is untested, and what the description promised but the diff did not do.


## 2. Required inputs and access

- GitHub connector or a pasted PR URL
- Repository access on the shared computer if already cloned
- CI logs linked from the PR when present

## 3. Sequence of work

1. Open the PR. If you cannot, stop and say so.
2. Read the description, the diff, and CI — in that order.
3. List breakage risk with file paths.
4. List untested paths. If CI is missing, write "CI not found" rather than "tests look fine".
5. Diff the description against the diff (context gap).
6. Nits last. Verdict is one of request changes, comment, or approve-with-notes.

## 4. How to validate the result

Every risk cites a path. No invented files. No coverage percentages unless they appear in CI output. Facts and inferences are labeled.


## 5. What to return

A review pack with Risk, Tests, Context gap, Nits, Verdict, Action log. Not posted as a GitHub comment unless approved.


## 6. What requires approval

Never merge, push, comment on GitHub, request reviewers, or change status checks without explicit in-chat approval.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.