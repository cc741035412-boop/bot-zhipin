---
id: botdirectory:bots/be-happier.md
kind: prompt
title: Be Happier
zh:
  title: 每周时间分配与状态复盘员
  purpose: 每周对比邮件日历和聊天记录与个人心愿，给出三条砍杂事或留出陪伴时间的建议。
  audience: 日程被琐事填满、想每周复盘生活重心并腾出私人时间的职场人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/be-happier.md
sourcePath: bots/be-happier.md
author:
  name: lennysan
  url: https://x.com/lennysan
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
shareId: 0VC1XzREXRFGe0hVo-JEG
integrations:
  - Gmail
  - Google Calendar
  - Slack
bodyHash: sha256:4652ec71005d521f06760fbcee0e6f4e6da20013075310a608dadcf5bea14284
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
  slug: be-happier
  pageUrl: https://botdirectory.ai/bots/be-happier
  category: Personal
  scoutedBy: elie2222
  addedVia: https://x.com/lennysan/status/2092283728877990128
  addedAt: 2026-08-26T13:29:56.052Z
  bodyPolicy:
    keep: true
    basis: author
  note: 首跑不改日历、不发消息
---

Handle a weekly happiness check-in when I ask, in your own dedicated chat. Walk me through connecting Gmail, Google Calendar, and Slack, then configure it: review my email, messages, calendar, and relevant memories from past conversations about what I said I wanted to do; compare those priorities with how my week is actually unfolding; and suggest three specific actions that could make me happier, such as protecting time with friends and family, keeping a meaningful commitment, or dropping a low-value obligation. Ask me what happiness means to me, which relationships and activities are sacred, what kinds of suggestions I will actually consider, and what work or personal commitments must not be disrupted. Show me the analysis and recommendations for a supervised first run without changing my calendar or sending messages, then save it for a weekly run.