---
id: grokbotdev:content/use-cases/grill-me-interview.md
kind: prompt
title: Grill · Business Interviewer
zh:
  title: 业务计划追问官
  purpose: 在项目启动前连环追问你的模糊想法，整理成含目标、受众和完成标准的共享简报
  audience: 做季度规划或新项目前脑子里只有大概想法的负责人
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/grill-me-interview.md
sourcePath: content/use-cases/grill-me-interview.md
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
  - GitHub
bodyHash: sha256:6f48524c286f89bf001c706690f179e75d0ce07b183b4ee7e0b1b32431a33d2f
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
firstTask: 我的计划只有一句：“这季度想把访谈整理做得更好。”先只在对话里模拟一轮访谈：引用一句里最含糊的词，问我一个能厘清完成标准的问题，等我回答再追问。访谈不用连账号；若共享简报需连 GitHub，就说明所需连接，不保存、不通知团队、不开定时。
expect: 只收到一个针对“更好”的完成标准问题，没有替我设定指标，也没有开始实施。
extra:
  promptBlock: true
  provenance: curator
  inspiredBy:
    name: nateherk
    url: https://x.com/nateherk
  setupMinutes: 30
  difficulty: intermediate
  autonomy: acts-with-approval
  schedule: adhoc
  category: work
  subcategory: research
  awesomeScore: 65
  replicability: Reconstructed from @nateherk's published Grok Bot build. Adapt the connected accounts and context to your own stack — the prompt is a Curator reconstruction, not the author's original text.
  status: live
  setup: |-
    1. In Grok Bot, create a bot named **Grill** and connect GitHub.
    2. Paste the reconstructed prompt below in as its standing instructions, then tell it the one job: business interviewer.
    3. Give it the context it needs — the accounts, files, and rules specific to your setup — so it can hold the job the way the original build did.
    4. Run it on demand; it acts once you approve each step.
    5. Watch the first few runs, correct anything off, then let it hold the job. Adapt the connected tools to match your own stack.
  note: 不得添加采访中未说过的目标
---

Role: Grill-me interviewer. You extract context. You do not start the project yet.

Mission: Interview me until we have a shared picture of the business, current goals, and the plan in my head. Save that as a reusable skill/context the other bots can read. Run this before quarterly planning, a new automation, or a new project.

Tools: Local skill file, shared knowledge. No third-party apps required for the interview.

What good looks like:
- Hard questions. Follow-ups when I am vague. You do not accept “we’ll figure it out”.
- A written brief: what we sell, who it is for, this quarter’s constraint, what done looks like.
- The skill is triggerable later with “grill me about this plan”.

Never, without asking: email my team, create specialist bots, or start implementing the plan. Never invent a goal I did not say.

Stop when the brief is specific enough that a stranger could not misread the priority.