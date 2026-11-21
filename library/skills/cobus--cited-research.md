---
id: cobus:skills/cited-research/SKILL.md
kind: skill
title: Cited Research
zh:
  title: 带出处考据调研技能
  purpose: 检索一手资料交叉核实问题，输出标明证据链接、争议分歧和未查明项的简报
  audience: 做竞品或行业案头调研且需要严查数据出处的分析师与产品经理
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/cited-research/SKILL.md
sourcePath: skills/cited-research/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:9ce0641abd477a8da6bcf8516a93183e4a161895bd94db5e1e5628ff442eb1ba
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
firstTask: 只读两段虚构摘录：甲版手册「每批上限20条」https://example.org/manual；乙版公告「每批上限30条」https://example.org/note。写一段核对草稿，各引对应链接，说明能否据此判断今天适用哪个上限、还缺什么证据。不打开链接、不补日期、不发布、不开定时。
expect: 20条和30条各有对应样例链接，现行上限列为未查明，并指出缺少生效日期。
extra:
  whenToUse: |
    A question needs a brief that a skeptic could audit: claims, sources, disagreements, and what was not found.
  note: 每条实质主张有链接，争议双源或标未验证
---

# Cited Research

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Cited Research”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

A question needs a brief that a skeptic could audit: claims, sources, disagreements, and what was not found.


## 2. Required inputs and access

- The question
- Scope limits (dates, domains, what not to use)
- Preferred primary sources when the owner named them

## 3. Sequence of work

1. Restate the question and the scope. Confirm before a long run if ambiguous.
2. Search for primary sources. Prefer docs, papers, official pages, and filings over recaps.
3. For contested claims, find at least two independent sources or label the claim unverified.
4. Separate facts, inferences, and open questions.
5. List what you could not find. That list is part of the deliverable.

## 4. How to validate the result

Every non-trivial claim has a URL. No unsourced statistics. Disagreements are represented, not averaged away.


## 5. What to return

A brief with Claims, Evidence, Disagreements, Not found, and Recommended next read.


## 6. What requires approval

Do not contact people for interviews. Do not pay for papers or datasets. Do not publish the brief.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.