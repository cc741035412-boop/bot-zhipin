---
id: cobus:skills/draft-changelog/SKILL.md
kind: skill
title: Draft Changelog
zh:
  title: 发版更新日志起草器
  purpose: 汇总上次打标后合入的代码变更，整理成更新说明草稿与内部排除清单。
  audience: 发版前要把代码合并记录转成对外更新说明的研发或产品
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/draft-changelog/SKILL.md
sourcePath: skills/draft-changelog/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:7ec49df51287b2ee87c38b52d4dfbfe70f323b988f4f7126e4edb3e84e5095aa
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
firstTask: 假设上次打标后只合入两项：#21 修正导出表格缺少表头，#22 整理内部测试目录。给用户写一条更新说明草稿，另列不对外写的项及原因，都保留编号。若没连GitHub，先说明核对合并记录需要仓库只读权限，仍用样例，不改文件、不打标发布、不开定时。
expect: 对外草稿只有#21，说明导出的表格恢复表头；#22只在内部清单里，附排除原因。
extra:
  whenToUse: |
    Merged pull requests since the last tag must become user-facing release notes without Friday archaeology.
  note: 每条对应已合并PR或提交
---

# Draft Changelog

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Draft Changelog”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

Merged pull requests since the last tag must become user-facing release notes without Friday archaeology.


## 2. Required inputs and access

- GitHub repo
- Previous tag or changelog heading
- Audience (users vs operators)

## 3. Sequence of work

1. List merged PRs since the last tag. Do not invent PRs.
2. Group as breaking, added, fixed, or internal.
3. Rewrite titles into user language. Keep PR numbers as links.
4. Call out anything that needs a migration note.

## 4. How to validate the result

Every entry maps to a merged PR or commit. No "various improvements" filler. Unpublished.


## 5. What to return

Draft changelog markdown and a list of PRs omitted as internal, for the owner to restore if needed.


## 6. What requires approval

Do not publish a GitHub release or tag. Do not edit CHANGELOG.md on main without approval.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.