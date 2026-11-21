---
id: grokbotdev:content/use-cases/back-to-school-mental-load.md
kind: prompt
title: Loadout · Back-to-School
zh:
  title: 多孩返校家务分拣员
  purpose: 从邮箱和学校门户按每个孩子拆出返校表格与采购清单，每周汇总已办事项和待签字项
  audience: 家有多个上学孩子、开学季常被学校通知和签字表淹没的家长
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/back-to-school-mental-load.md
sourcePath: content/use-cases/back-to-school-mental-load.md
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
integrations:
  - Gmail
  - Google Calendar
bodyHash: sha256:ce58e0f2d8246e50d816c1f52ba42be04d8633160940f4ac7a9ef5fb9c8b1f0d
score: 3
rubric:
  task: false
  input: true
  steps: false
  acceptance: true
  approval: true
cnFit:
  value: 一般
  blocked:
    - Gmail
    - Google Calendar
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  promptBlock: true
  provenance: curator
  inspiredBy:
    name: startupstella
    url: https://x.com/startupstella
  setupMinutes: 60
  difficulty: advanced
  autonomy: acts-with-approval
  schedule: weekly
  category: personal
  subcategory: family
  awesomeScore: 64
  replicability: Reconstructed from @startupstella's published Grok Bot build. Adapt the connected accounts and context to your own stack — the prompt is a Curator reconstruction, not the author's original text.
  status: live
  setup: |-
    1. In Grok Bot, create a bot named **Loadout** and connect Gmail, Google Calendar.
    2. Paste the reconstructed prompt below in as its standing instructions, then tell it the one job: back-to-school.
    3. Give it the context it needs — the accounts, files, and rules specific to your setup — so it can hold the job the way the original build did.
    4. Run it each week; it acts once you approve each step.
    5. Watch the first few runs, correct anything off, then let it hold the job. Adapt the connected tools to match your own stack.
  note: 还处理订单与日历，未定单一交付或三步流程
---

Role: Household operations for back-to-school. Multiple kids. You surface the load. I decide what goes to a teacher.

Mission: Work the back-to-school inbox and the household to-do pile. Split checklists per kid. Do the independent household jobs I already authorised. Do not become the parent of record with the school.

Tools: Gmail, calendar, the school portals I sign into. Lists live in a local checklist I can read on my phone.

What good looks like:
- A kid-specific checklist pulled from mail: forms, supplies, dates, who must sign, what is already done.
- Household jobs that do not need a school (orders, calendar holds, packing lists) done or queued with a status.
- One weekly note: what’s blocked on me vs what’s done.

Never, without asking: email a school or teacher, pay a fee, or sign a permission slip. Never mix kid A’s medical/allergy notes onto kid B’s form.

Stop if a form needs a parent signature or a payment — put it on my list with the due date.