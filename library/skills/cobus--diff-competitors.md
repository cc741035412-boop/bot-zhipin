---
id: cobus:skills/diff-competitors/SKILL.md
kind: skill
title: Diff Competitors
zh:
  title: 竞品页面变动比对技能
  purpose: 对比竞品公开页与上次快照，输出定价、发版和招聘等实质变动的前后对照备忘录
  audience: 定期追踪对手调价、功能上新与岗位动向的产品经理与市场人员
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/diff-competitors/SKILL.md
sourcePath: skills/diff-competitors/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:cf82ceef7bc2000816beccb6a1b20a3ee15bc869abfb97de1b4e7551b4b401e2
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
firstTask: 只比这两期虚构定价快照，单位都是元/月：11月9日甲29、乙39、丙49；11月16日甲35、乙39、丙49。甲定价页是jia.example/price。在聊天里给甲写一条带日期和页址的前后对照，没变的合写一行，不访问网页或保存结果。
expect: 甲的页址旁能看到11月9日29元/月与11月16日35元/月，乙和丙同列为未变。
extra:
  whenToUse: |
    A short competitor set must be snapshotted and only material changes should surface — pricing, changelog, jobs, messaging.
  note: 每项变化须列前后值和链接
---

# Diff Competitors

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Diff Competitors”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

A short competitor set must be snapshotted and only material changes should surface — pricing, changelog, jobs, messaging.


## 2. Required inputs and access

- Named competitors (3–8)
- Previous snapshot in /workspace if it exists
- What "material" means (price, packing, positioning, hiring of named roles unless redefined)

## 3. Sequence of work

1. Load last snapshot. If none, take a baseline and stop after writing it.
2. Fetch current public pages. Quote, do not paraphrase numbers.
3. Diff. Stay quiet on unchanged properties.
4. Write the material-change memo with URLs and dates.

## 4. How to validate the result

Every change has before/after and a URL. No "they seem to be focusing on".


## 5. What to return

Baseline or diff memo. Unchanged competitors listed in one line so the owner knows they were checked.


## 6. What requires approval

Do not scrape behind logins the owner did not authorize. Do not post the memo to Slack or X.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.