---
id: cobus:skills/harden-repo/SKILL.md
kind: skill
title: Harden Repo
zh:
  title: 代码仓防护体检器
  purpose: 只读检查仓库分支保护与工作流权限配置缺口，输出整改问题单与变更请求草稿包。
  audience: 排查代码仓权限配置短板并准备加固方案的研发主管与安全工程师
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/harden-repo/SKILL.md
sourcePath: skills/harden-repo/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:a836f6119e1f9a95c622cddfb687e7acb2bdbb2b6336f5f58f13fa2c5c5ba493
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
firstTask: 只对这份模拟配置做防御审阅：主分支合并所需审批数为0，仅读取源码的检查流程却有写权限。若未连 GitHub，说明核查实库需哪些只读权限。给两条修复建议，各附一个安全的配置核对方法。不访问仓库、不复现漏洞、不写利用代码、不设计攻击流程、不改设置、不开定时。
expect: 两条建议分别要求合并前审批、将检查流程收紧为只读，每条都能对照配置核验。
extra:
  whenToUse: |
    A repository needs a security and hygiene review that recommends issues and PRs without touching main or branch protection.
  note: 每个发现须引用设置、文件或工作流
---

# Harden Repo

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Harden Repo”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

A repository needs a security and hygiene review that recommends issues and PRs without touching main or branch protection.


## 2. Required inputs and access

- GitHub repository
- Org or repo settings the connector can read
- Optional prior harden notes in /workspace/repo-hardener/

## 3. Sequence of work

1. Read default branch, protection summary, CODEOWNERS, secret scanning, Dependabot, and workflow permissions as the connector exposes them.
2. List concrete gaps with paths or setting names. Separate facts (what is off) from inferences (what an attacker could do).
3. Draft recommended issues and PR titles/bodies. Do not open them.
4. Never push to main. Never change branch protection, required reviewers, or org policies.

## 4. How to validate the result

Each finding cites a setting, file, or workflow. No invented scanners. Main is untouched. Branch protection is unchanged.


## 5. What to return

Hygiene pack: Findings, Recommended issues, Recommended PRs, Out of scope, Action log.


## 6. What requires approval

Do not push, merge, publish, or change production. Do not edit branch protection or org security settings. Filing issues waits for the owner.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.