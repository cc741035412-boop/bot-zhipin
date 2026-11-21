---
id: grokbotdev:content/use-cases/dangerously-good-at-grok-bot.md
kind: prompt
title: Dangerously Good at Grok Bot · Beginner to Pro
zh:
  title: 单任务Bot调教教练
  purpose: 带人按五要素写清单一任务简报，用附件试跑并反复纠偏后固化成技能和定时任务
  audience: 刚上手想把宽泛聊天改成稳定跑通具体活计的Bot新手
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/dangerously-good-at-grok-bot.md
sourcePath: content/use-cases/dangerously-good-at-grok-bot.md
author:
  name: GrokBot.dev contributors
  url: https://github.com/ZeroPointRepo/GrokBotDev
  role: curator
license: CC-BY-4.0
attribution:
  by: GrokBot.dev contributors
  repo: ZeroPointRepo/GrokBotDev
  license: CC BY 4.0
  licenseUrl: https://creativecommons.org/licenses/by/4.0/
fetchedAt: 2026-11-21T06:44:43Z
changes: 只收「## Prompt」下代码块里的提示词原文，一字未改；原页面的设置步骤和点评没有收；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:917ca124b3786a437158724f6a9b6e2d402bc057bd6ef16f56add43966a1b5bd
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
firstTask: 我只想从纪要里提取有主的待办。样例第1句：小唐周四整理访谈笔记。第2句：下次再聊定价。请把这件事写成五格简报草稿：目标、来源、限制、交付格式、等我确认的位置。只拿这两句试跑一次，给待办标句号编号就停，不保存技能，不开定时。
expect: 五格简报后只有一条待办，标明小唐、周四、整理访谈笔记及来源第1句。
extra:
  promptBlock: true
  provenance: curator
  inspiredBy:
    name: heyrobinai
    url: https://x.com/heyrobinai
  setupMinutes: 10
  difficulty: beginner
  autonomy: readonly
  schedule: none
  category: personal
  subcategory: learning
  replicability: Read Robin Delta's full guide (linked from the source) for the beginner→pro path and all 21 bot builds. The starter prompt below is a Curator distillation of his five-part task brief and training loop to get your first bot working — the depth is in the article.
  status: live
  setup: |-
    1. Read Robin Delta's guide, "How to Get Dangerously Good at Grok Bot (Beginner to Pro)" (linked from the source post) — it runs beginner → intermediate → pro, with the install decisions, the prompting framework, and 21 bot builds worth stealing.
    2. **Beginner:** create ONE bot with one narrow job — a short name, one primary job, and a description of how it works. Start narrower than feels necessary so it builds clean context instead of becoming another chat window.
    3. Brief it with his **five-part task brief**: outcome, sources, constraints, deliverable, review point. Do the first run on an attached document — no login, easy to inspect.
    4. **Intermediate:** run the training loop — brief → observe → correct → schedule → deliver. The correction step matters most: tighten the output on real runs, then save the working method as a skill.
    5. **Pro:** schedule routines and split work across specialist bots. Keep approval gates on anything that sends, posts, or spends.
  note: 试跑结果须附链接或页码并明写没做到的事
---

Be my Grok Bot coach and help me set up my first real worker using the five-part task brief.

First, ask me for ONE narrow job — not a catch-all assistant. Then help me write it as a brief that answers exactly five things:

1. Outcome: what must be finished.
2. Sources: which files, sites, apps, or conversations matter.
3. Constraints: what you must avoid, or ask me before doing.
4. Deliverable: what you return, and in what format.
5. Review point: where you stop and wait for me.

Run it once on a small, safe input — ideally an attached document, so there is no login. Show the result with evidence (links or page references), and tell me plainly what you could not do.

Then help me CORRECT it. I will tell you what to keep, cut, rank, shorten, or reformat; you turn that into a lasting instruction and run it again. Repeat until the output is easy to act on. Only then help me save the method as a skill and schedule it as a routine.

Rules: start narrower than feels necessary, never invent a result, always cite your sources, and always stop at the review point before anything that sends, posts, pays, or connects an account.