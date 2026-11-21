---
id: cobus:skills/package-evidence/SKILL.md
kind: skill
title: Package Evidence
zh:
  title: 上线前证据打包器
  purpose: 汇总运行日志与测试产物，按已验证、未验证和残余风险整理成供人工拍板的证据包。
  audience: 在改动放行上线前，要核对实证决定通过还是拦截的技术评审人
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/package-evidence/SKILL.md
sourcePath: skills/package-evidence/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:4f4b65890b61faed297ab528d466631037c2951d81845e0e2627f8e461777ab1
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
    An agent or Bot run finished and a human needs an evidence pack before a ship/block verdict — what happened, what was verified, what was not.
  note: 无制品指针不得标为已验证
---

# Package Evidence

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Package Evidence”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

An agent or Bot run finished and a human needs an evidence pack before a ship/block verdict — what happened, what was verified, what was not.


## 2. Required inputs and access

- Run notes, logs, diffs, or conversation
- The original request and constraints
- Test or review output when it exists

## 3. Sequence of work

1. Restate the request and the claimed outcome.
2. Collect artifacts that actually exist (links, files, command output).
3. Mark each claim verified / unverified / contradicted.
4. List residual risk and what a human still has to look at.
5. Do not issue the verdict. That is the human's job.

## 4. How to validate the result

No claim is marked verified without an artifact pointer. Missing tests are listed as missing, not implied by a green story.


## 5. What to return

Evidence pack: Request, Artifacts, Verified, Unverified, Residual risk, Questions for the verdict.


## 6. What requires approval

Do not merge, deploy, or tag a release. Do not write the human's rationale for them.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.