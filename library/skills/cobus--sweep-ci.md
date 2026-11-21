---
id: cobus:skills/sweep-ci/SKILL.md
kind: skill
title: Sweep CI
zh:
  title: 持续集成失败巡检报告
  purpose: 汇总代码库失败的构建检查，按报错聚类并标出日志摘录、偶发抖动标记和建议排查人。
  audience: 需要定期排查主干与合并请求构建失败原因的研发与测试工程师
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/sweep-ci/SKILL.md
sourcePath: skills/sweep-ci/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:53e4c2a426b2e6fbebbaff5ec37f641bf87f3e4c1ca4987a1452eaf0324763fd
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
    CI on named repositories is red or flaky and the owner needs a failure list with logs and owners — not a bot that reruns, cancels, or merges.
  note: 每行引检查链接或日志，未知波动须标明
---

# Sweep CI

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Sweep CI”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

CI on named repositories is red or flaky and the owner needs a failure list with logs and owners — not a bot that reruns, cancels, or merges.


## 2. Required inputs and access

- GitHub connector and the named repositories
- Default branch and the time window (default since last sweep)
- Optional CODEOWNERS or a pinned owner map

## 3. Sequence of work

1. List failing or cancelled checks on the default branch and on open PRs in the window. Do not invent jobs.
2. Open the log for each distinct failure. Quote the error, path, and job name.
3. Cluster duplicates. Count how often the same test failed.
4. Suggest an owner from CODEOWNERS or the PR author. Do not assign on GitHub.
5. At most one rerun, and only when the log is truncated — write that down. Never rerun-until-green.
6. Write the sweep memo. Do not cancel runs, push, merge, or mute required checks.

## 4. How to validate the result

Every row cites a check URL or log line. Flakes are labeled when the same job failed then passed without a code change; otherwise "flake unknown". No merge and no retry loop.


## 5. What to return

CI sweep: failing jobs, cluster, log quote, suggested owner, flake note, action log. At most one truncated-log rerun recorded.


## 6. What requires approval

Do not merge, push, or comment on GitHub. Do not cancel workflows or change branch protection. Do not rerun until green.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.