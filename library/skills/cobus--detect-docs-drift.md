---
id: cobus:skills/detect-docs-drift/SKILL.md
kind: skill
title: Detect Docs Drift
zh:
  title: 代码与文档偏差排查技能
  purpose: 核对仓库代码与说明文档的不一致处，输出带文件路径的偏差表和文档修改草稿
  audience: 发版前怕接口或命令行改动忘了同步更新文档的开发与技术写作者
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/detect-docs-drift/SKILL.md
sourcePath: skills/detect-docs-drift/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:a8d21906e7e7a49788d5c2ac0272118f0b82c8d8da09bf26737b065e795f8684
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
firstTask: 只读两段安全样例：README.md 写着“每页默认显示20条”，src/list.ts 的默认页长常量是10。若仓库未连，说明查看原件需 GitHub 只读访问；这次只比较贴文，用一行表写出两处依据，再给一句能替换原文的草稿。不运行代码、不改文件、不开定时。
expect: 偏差表列出两条路径及20与10的差异，替换句写的是每页默认显示10条。
extra:
  whenToUse: |
    README, API docs, or comments claim behavior that the current code may not match, and the owner needs a draft doc diff — not a commit.
  note: 每处偏差同时引文档与代码路径
---

# Detect Docs Drift

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Detect Docs Drift”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

README, API docs, or comments claim behavior that the current code may not match, and the owner needs a draft doc diff — not a commit.


## 2. Required inputs and access

- GitHub repository or attached docs plus code
- Paths the owner named (README, API docs, OpenAPI, generated refs)
- Optional last-known-good tag

## 3. Sequence of work

1. Open the named docs and the code they describe (routes, flags, types, CLI).
2. List each drift as doc claim vs code fact, with paths.
3. Draft a doc diff the owner can paste. Prefer the smallest truthful edit.
4. Do not commit, push, or merge. Do not "fix" the code to match a wrong README.

## 4. How to validate the result

Every drift cites a doc path and a code path. No invented APIs. The deliverable is a draft, unpublished.


## 5. What to return

Drift table plus a proposed doc patch. Action log of files read.


## 6. What requires approval

Do not commit, merge, or publish the docs. Do not edit GitHub wiki or the production doc site.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.