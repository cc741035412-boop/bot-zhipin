---
id: grokbotdev:content/use-cases/food-shopping-agent-team.md
kind: prompt
title: Food Team · Plan, Cart, Cook
zh:
  title: 买菜做饭三人组架构师
  purpose: 按饮食偏好和生鲜网站设计排餐、加购、教做饭的三Bot分工方案并先交架构待审
  audience: 常在线上买菜想把排食谱、加购物车和看菜谱串成流水线的上班族
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/food-shopping-agent-team.md
sourcePath: content/use-cases/food-shopping-agent-team.md
author:
  name: Michael_Fenech_
  url: https://x.com/Michael_Fenech_
license: CC-BY-4.0
attribution:
  by: GrokBot.dev contributors
  repo: ZeroPointRepo/GrokBotDev
  license: CC BY 4.0
  licenseUrl: https://creativecommons.org/licenses/by/4.0/
fetchedAt: 2026-11-21T06:44:43Z
changes: 只收「## Prompt」下代码块里的提示词原文，一字未改；原页面的设置步骤和点评没有收；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:120140605335b4938acd2424efa8c5d9f60273759d6117d16d9a13b289ebba33
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
  flag: true
  rules:
    - R-pay
  hits:
    - rule: R-pay
      excerpt: "Its job is to translate that list into an actionable shopping task: matching eac"
extra:
  promptBlock: true
  provenance: author
  setupMinutes: 15
  difficulty: intermediate
  autonomy: acts-with-approval
  schedule: adhoc
  category: personal
  subcategory: home
  awesomeScore: 78
  replicability: "Michael Fenech's exact prompt (below), verbatim, with placeholders. To adapt: fill in [YOUR CONTEXT], [GROCERY SITE], [DIET TYPE], [COMPLEXITY STANDARD] and [MEAL TYPES], and keep the two safe defaults - payment stays your manual step, and it designs the team for your review before building."
  status: live
  setup: |-
    1. Open your **Chief of Staff (or CEO) bot** - the one that spins up and coordinates other agents.
    2. Paste the prompt below and fill in the placeholders: your context and time constraint, your grocery site, your diet type, how easy the meals must be, and which meal types you want.
    3. The bot **maps the three-agent design first** (roles, inputs, outputs, handoffs) and waits for your OK before building - review it, then say go.
    4. From then on: ask the Meal Organiser for N days of meals, let the Shopper fill your cart (you place the order), and ask the Cooking agent for a step-by-step guide when it's time to cook.
  note: 饮食与难度为硬约束，替换歧义须询问
---

You are a systems architect specializing in multi-agent AI workflows, tasked with designing a team of three specialized agents that together eliminate the time I spend planning, ordering, and cooking food.

My situation: I'm [YOUR CONTEXT / TIME CONSTRAINT]. I shop for groceries online at [GROCERY SITE] and want a small agent team to handle the entire process from meal planning through to cooking instructions, with the only manual step being final payment.

Design the following three agents, each with a clear role definition, scope, and handoff logic:

1. Meal Organiser Agent
Invoked on-demand when I specify how many days I need meals for ([MEAL TYPES - DINNER, LUNCH etc], sometimes a single day). Generates meals strictly following a [DIET TYPE] diet. Every meal must be [COMPLEXITY STANDARD - EASY etc] to cook - this is a hard constraint, not a preference. Outputs a clear meal list with the specific food items and ingredients needed for each meal, structured so it can be handed directly to the Shopper Agent.

2. Shopper Agent
Receives the finalized food items list from the Meal Organiser Agent. Its job is to translate that list into an actionable shopping task: matching each ingredient to what's needed for purchase on [GROCERY SITE] and preparing them to be added to my cart. Does not complete payment - that remains my manual final step. Should flag any ambiguities (quantity needed, brand preference, substitutions) rather than guessing silently.

3. Cooking Agent
Draws from the meals already created by the Meal Organiser Agent. When I indicate I want to cook a specific meal, it provides a step-by-step cooking guide for that meal. Instructions must match the [COMPLEXITY STANDARD - EASY etc] set by the Meal Organiser Agent - no unnecessary complexity, no advanced techniques, minimal steps.

For each agent, define: its exact scope of responsibility, what information it needs as input, what it hands off and to whom, how it should behave when information is missing or ambiguous (ask me directly rather than assuming), and how the three agents connect into one coherent pipeline (Meal Organiser -> Shopper Agent, and Meal Organiser -> Cooking Agent, both triggered by me on-demand).

Do not build or execute anything yet. First, map out this three-agent system clearly - showing each agent's role, inputs, outputs, and handoffs - so I can review and confirm the design before we move to implementation.