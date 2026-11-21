---
id: cobus:skills/watch-aeo/SKILL.md
kind: skill
title: Watch AEO
zh:
  title: AI搜索引用监测技能
  purpose: 用固定词集重跑各家AI问答引擎，记录品牌与竞品被引用原话并生成补缺写作简报。
  audience: 追踪自家产品在AI搜索结果中曝光情况的市场与内容运营
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/watch-aeo/SKILL.md
sourcePath: skills/watch-aeo/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:81d3fa96339216168ed8a517fa95f5e9322521cf54aa9da63445398fdbaa864c
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
    A pinned query set must be rerun across public answer engines and AI overviews as a standing visibility program, not a one-off chatbot check.
  note: 引用须是本次所见，缺引擎须列名
---

# Watch AEO

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Watch AEO”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

A pinned query set must be rerun across public answer engines and AI overviews as a standing visibility program, not a one-off chatbot check.


## 2. Required inputs and access

- Pinned query set and competitor set
- Public answer engines the browser can reach
- Prior AEO brief in /workspace when it exists

## 3. Sequence of work

1. Load the saved query set. If it is missing, ask and stop. Do not freelance new queries.
2. Rerun each query with the same wording on the named engines. Timestamp fetches.
3. Record who is cited (us vs competitors) with verbatim snippets and URLs.
4. Diff against last brief. Label unverified appearances.
5. Write an unpublished writing brief for gaps. Do not publish pages. Do not substitute a one-off chatbot paste.

## 4. How to validate the result

Every citation was seen this run. Missing engines are named, not guessed. No page was published. Queries match the pinned set.


## 5. What to return

AEO brief with reruns, citations, gaps, unpublished writing brief, and action log of engines and timestamps.


## 6. What requires approval

Do not publish or update pages. Do not pay for placements. Do not contact an answer-engine vendor as the brand.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.