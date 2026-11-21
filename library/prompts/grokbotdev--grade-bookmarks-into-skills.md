---
id: grokbotdev:content/use-cases/grade-bookmarks-into-skills.md
kind: prompt
title: Bookmark Grader · Skill Library
zh:
  title: 收藏夹分级筛查器
  purpose: 把近30天收藏链接逐条提炼出一句话观点和可复用机制，按高中噪音三档打分过滤
  audience: 常在浏览器或社交平台收藏好文却很少回头整理复用的人
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/grade-bookmarks-into-skills.md
sourcePath: content/use-cases/grade-bookmarks-into-skills.md
author:
  name: Ryan_Staley1
  url: https://x.com/Ryan_Staley1
license: CC-BY-4.0
attribution:
  by: GrokBot.dev contributors
  repo: ZeroPointRepo/GrokBotDev
  license: CC BY 4.0
  licenseUrl: https://creativecommons.org/licenses/by/4.0/
fetchedAt: 2026-11-21T06:44:43Z
changes: 只收「## Prompt」下代码块里的提示词原文，一字未改；原页面的设置步骤和点评没有收；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:c5adddf0491c17034bb9071f432e3e5c072d93d4b3e168a7b52d678380d1b24a
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: false
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  promptBlock: true
  provenance: author
  setupMinutes: 10
  difficulty: beginner
  autonomy: readonly
  schedule: none
  category: personal
  subcategory: learning
  awesomeScore: 76
  replicability: "Ryan shared his exact prompt (below). To adapt: point it at your own bookmarks or a saved-links export, keep the 'name the mechanism in one sentence or it's noise' filter, and — his move — turn the keepers into named skills you can trigger by voice."
  status: live
  setup: |-
    1. Give the bot access to your bookmarks (or paste/export your last 30 days of saved links).
    2. Run Ryan's prompt below: for each bookmark it returns a one-line thesis, the link, a grade (high / medium / noise), and the **mechanism you can steal** — explicitly no tool lists.
    3. The filter is the point: **if you can't name the mechanism in one sentence, it's noise** — so most of the pile gets graded out. Ryan kept about a third of 140.
    4. Take the keepers and turn each into a named **skill with a trigger you can say out loud**, so the useful mechanism is one voice command away. Ryan ended with 10.
    5. Re-run it monthly so your library stays a library, not a pile.
  note: 一句说不清机制即噪声；未设具体审批
---

Pull my last 30 days of bookmarks. For each one: one-line thesis, link, grade (high / medium / noise), and the mechanism I can steal. Do not list tools. If I cannot name the mechanism in one sentence, it is noise.