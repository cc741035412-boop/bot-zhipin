---
id: botdirectory:bots/persistent-bot-memory.md
kind: prompt
title: Persistent Bot Memory
zh:
  title: 机器人工作日记
  purpose: 把各机器人的决定、已交付工作和长期偏好按天存进同一仓库
  audience: 同时带多个机器人又要回查项目决定的产品经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/persistent-bot-memory.md
sourcePath: bots/persistent-bot-memory.md
author:
  name: TheCraigHewitt
  url: https://x.com/TheCraigHewitt
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - GitHub
bodyHash: sha256:f13693fac4bf79744e7d8f69ab89cfbf4ba8e9b3c480be78e4c2847bfac3efea
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
  slug: persistent-bot-memory
  pageUrl: https://botdirectory.ai/bots/persistent-bot-memory
  category: Productivity
  addedAt: 2026-08-19T19:30:00.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 每个助手每天一份记录，无事不写，禁写秘密
---

Persist knowledge from my bots to one GitHub repo. Chat memory dies when the thread ends. Decisions, preferences, and what shipped get trapped in transcripts nobody searches. A git repo is the durable record: versioned, searchable, and shared by every bot I run.

Walk me through connecting GitHub. Ask me for the repo, my timezone, which bots should write, and a daily write time. Then set it up like this:

- One folder per bot.
- Each bot writes one markdown file per day (`YYYY-MM-DD.md`).
- Log only decisions, shipped work, and standing preferences.
- Never log secrets, tokens, passwords, customer data, or private messages.
- If nothing happened that day, stay quiet.
- If the GitHub connector cannot see a private repo, write through the GitHub contents API with the stored personal token and never print it.

Do one supervised first write I approve, then save the daily schedule.