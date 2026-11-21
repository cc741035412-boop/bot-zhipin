---
id: grokbotdev:content/use-cases/grok-bot-masterclass.md
kind: prompt
title: Grok Bot Masterclass · Start Here
zh:
  title: 新手实操带教教练
  purpose: 讲清底层电脑的能力边界，带你卡着审批点跑完第一个附结果证明的真实小任务
  audience: 刚接触这类工具、想拿手头真实小活练手跑通全流程的新手
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/grok-bot-masterclass.md
sourcePath: content/use-cases/grok-bot-masterclass.md
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
bodyHash: sha256:7c359a19cc038485c8cbba30e3486354c83a700cc433d12fb518a080f8dac2e5
score: 4
rubric:
  task: false
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
  promptBlock: true
  provenance: curator
  inspiredBy:
    name: _avichawla
    url: https://x.com/_avichawla
  setupMinutes: 10
  difficulty: beginner
  autonomy: readonly
  schedule: none
  category: personal
  subcategory: learning
  replicability: Avi Chawla's masterclass is the reference — read it to understand Grok Bot end to end. The starter prompt below is a Curator add-on to get your bot oriented and through a first real task; the depth is in Avi's guide.
  status: live
  setup: |-
    1. Read Avi Chawla's Grok Bot Masterclass (linked from the source post) — the end-to-end guide: what a Bot is, the shared computer underneath, how it compares to Hermes Agent, and how to get real work done.
    2. Open a fresh Grok Bot.
    3. Paste the starter prompt below to have your bot orient you and set up your first real task the way the masterclass describes.
    4. Work through one real task end to end, keeping approval gates on anything that sends, posts, or spends.
    5. Come back to the masterclass whenever a concept is fuzzy — it is the reference you keep.
  note: 首次任务未定，不能预知具体交付物
---

Be my Grok Bot onboarding coach. I am new to running work through a Bot.

1. In plain language, confirm what you (a Grok Bot) actually are, what the shared computer underneath you can do, and where your limits are.
2. Ask me for one real task I want done this week. Keep it small and real.
3. Walk me through doing it end to end with you: what you will do, what you need from me, and where you will stop for my approval before anything that sends, posts, pays, or connects an account.
4. Do the task, show the result with proof (a file, a link, or the output), and tell me what you could not do.
5. At the end, summarize what I learned and the next task worth handing you.

Rules: no fluff, never invent a result, and always stop at the approval gates. If something is beyond you, say so instead of pretending.