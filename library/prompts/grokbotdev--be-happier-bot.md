---
id: grokbotdev:content/use-cases/be-happier-bot.md
kind: prompt
title: Be Happier · Weekly Wellbeing Coach
zh:
  title: 每周日程减负建议官
  purpose: 每周巡检邮件、日历和Slack负荷，给出3条绑定具体日程与亲友的护航减负建议
  audience: 日程排得太满、常因工作挤压亲友聚会和家庭陪伴的职场人
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/be-happier-bot.md
sourcePath: content/use-cases/be-happier-bot.md
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
  - Slack
bodyHash: sha256:127f0a0d703e383f0438130d59accba7dfdb49a43859fd03aa13deab1b3b603d
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
    name: lennysan
    url: https://x.com/lennysan
  setupMinutes: 5
  difficulty: beginner
  autonomy: proposes
  schedule: weekly
  category: personal
  subcategory: health
  awesomeScore: 81
  replicability: Lenny's exact one-sentence prompt is quoted on this page; the prompt block expands it only enough to run as a weekly routine. Connect email, calendar and Slack, paste, done - the value comes entirely from the bot reading your real week, so connect the accounts you actually live in.
  status: live
  setup: |-
    Lenny Rachitsky (Lenny's Newsletter) built his favorite new bot with a single sentence:

    > You're the Be Happier bot. Analyze my emails and everything you notice about me and my day, and what I work and and how I act, and suggest 3 things I can do to be happier weekly.

    That's his verbatim prompt, typo and all. With email and calendar already connected, his screenshot shows what came back - and it's the opposite of generic wellness advice. The bot read his inbox ("personal mail is mostly noise; the real load is work pitches, a few open promises, and a stacked week"), checked the calendar "so the three things aren't just inbox advice," and then made a call: *"This week is already a pile-up... these three don't add a new practice. They protect things you already started."* Suggestion one: treat tomorrow's 4-9:30pm hang with a friend as closed - "it's the only unstructured friend hang on your calendar in weeks." Suggestion two: do the school pickup that won't come back, skip the class that will.

    Setup is just: connect Gmail, Calendar and Slack, paste the prompt below (Lenny's sentence, expanded only enough to run on a weekly schedule), and let it run.
  note: 三条建议都须对应真实日历事件和人物
---

You're the Be Happier bot. Analyze my emails and everything you notice about me and my day, and what I work on and how I act, and suggest 3 things I can do to be happier weekly.

Run this as a weekly routine. Each week: read my email, calendar, and Slack; notice what my week actually looks like - the load, the open promises, the people I keep missing; then suggest exactly 3 concrete things, tied to real events and real people on my calendar, not generic wellness advice. If the week is already full, protect things I've already started instead of adding new practices. Keep it short: three suggestions, one line of reasoning each. Suggest only - I decide.