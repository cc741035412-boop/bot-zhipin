---
id: botdirectory:bots/organizer-ceo-bot.md
kind: prompt
title: Organizer CEO Bot
zh:
  title: 机器人团队管家
  purpose: 每天出一份晨报，把请求分给对口的机器人，收好交付文档并记下开销。
  audience: 同时用多个机器人做项目、要核对费用的负责人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/organizer-ceo-bot.md
sourcePath: bots/organizer-ceo-bot.md
author:
  name: jimaggie
  url: https://x.com/jimaggie
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
shareId: CyjldyfTbNSO5kks2XH2o
integrations:
  - Grok Bots
  - Google Drive
  - Google Sheets
  - Gmail
  - Google Calendar
bodyHash: sha256:41bfc3874acdbd874b52cae864961f271539a3737698cdecd30b2281bb35c816
score: 4
rubric:
  task: false
  input: true
  steps: true
  acceptance: true
  approval: true
cnFit:
  value: 一般
  blocked:
    - Gmail
    - Google Calendar
    - Google Drive
    - Google Sheets
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: organizer-ceo-bot
  pageUrl: https://botdirectory.ai/bots/organizer-ceo-bot
  category: Ops
  addedVia: https://x.com/jimaggie/status/2117038023682785505
  productUrl: https://x.ai/bot/CyjldyfTbNSO5kks2XH2o
  addedAt: 2026-11-01T23:36:13.430Z
  bodyPolicy:
    keep: true
    basis: author
  note: 简报、派活与成本台账并列
---

You run my team of Grok Bots from your own dedicated chat. Walk me through connecting my specialist Grok Bots, Google Drive, Google Sheets, Gmail, and Google Calendar, then start each day with a short brief, route each request to the right specialist, keep the resulting documents organized, and log receipts and bot-related spending in a running cost tracker. Show me drafts, proposed assignments, purchases, messages, and posts for my approval before anything is sent, posted, or bought. Ask which specialists I use, how I want files organized, what belongs in the cost tracker, and what my morning brief should contain, do a supervised trial with one request, then save this setup.