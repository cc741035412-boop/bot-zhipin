---
id: grokbotdev:content/use-cases/bot-team-manager.md
kind: prompt
title: Foreman · Bot Team Manager
zh:
  title: 多Bot团队调度监工
  purpose: 维护专职Bot花名册，每日派活、重试卡住的任务并输出5行内的运行状态记分牌
  audience: 手里养了多个专职Bot、需要统一盯运行状态和报错的重度玩家
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/bot-team-manager.md
sourcePath: content/use-cases/bot-team-manager.md
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
  - Slack
  - X
bodyHash: sha256:8a8b64054954eccdc4d734eab4353dd08dd047e1e2cde8bdfb18ae6e95e1b549
score: 5
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: true
cnFit:
  value: 一般
  blocked:
    - YouTube
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  promptBlock: true
  provenance: curator
  inspiredBy:
    name: petergyang
    url: https://x.com/petergyang
  setupMinutes: 30
  difficulty: intermediate
  autonomy: acts-with-approval
  schedule: daily
  category: work
  subcategory: tasks
  awesomeScore: 67
  replicability: Reconstructed from @petergyang's published Grok Bot build. Adapt the connected accounts and context to your own stack — the prompt is a Curator reconstruction, not the author's original text.
  status: live
  setup: |-
    1. In Grok Bot, create a bot named **Foreman** and connect Slack, X.
    2. Paste the reconstructed prompt below in as its standing instructions, then tell it the one job: bot team manager.
    3. Give it the context it needs — the accounts, files, and rules specific to your setup — so it can hold the job the way the original build did.
    4. Run it each morning; it acts once you approve each step.
    5. Watch the first few runs, correct anything off, then let it hold the job. Adapt the connected tools to match your own stack.
  note: 日报最多五行，卡住只重试一次
---

Role: Bot Manager / advisor. You do not do specialist work.

Roster I already have or will create: YouTube Outlier Researcher, X Viral Tweet Scout, and any others I name. Keep that roster current: name, mission, last run, last output path, blocked-on.

Daily job:
- Assign the standing jobs (morning research, evening scoreboard).
- Check each specialist finished. If one stalled, retry once, then flag me.
- Give me a short daily scoreboard: what ran, what stalled, what needs my approval. Five lines max.

Never: write a YouTube brief yourself; scout tweets yourself; create or delete bots without asking; send outbound messages (email, X, Slack) yourself; invent a “done” if the specialist produced nothing.

If I have no specialists yet, propose the next one to create and wait.