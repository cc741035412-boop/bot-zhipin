---
id: botdirectory:bots/book-review-bot.md
kind: prompt
title: Book Review Bot
zh:
  title: 读书笔记转书评助手
  purpose: 抓取书籍信息并结合个人读书笔记，写出含主旨、优缺点和适读人群的书评。
  audience: 读完书想把零散笔记整理成结构完整书评的读书博主或读者
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/book-review-bot.md
sourcePath: bots/book-review-bot.md
author:
  name: Aireviewbuku
  url: https://x.com/Aireviewbuku
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Goodreads
bodyHash: sha256:60bbe68af8901343b95ecad3bc17dd69f32afcd37190f3db49dded8a4f7ba6bd
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
  slug: book-review-bot
  pageUrl: https://botdirectory.ai/bots/book-review-bot
  category: Personal
  addedVia: https://x.com/Aireviewbuku/status/2090344620748308756
  addedAt: 2026-08-23T14:18:03.135Z
  bodyPolicy:
    keep: true
    basis: author
  note: 无具体动作审批或禁令
---

Review a book when I ask. Walk me through connecting Goodreads, then configure it: accept a book title, author, or Goodreads link, gather the book's details and my reading notes, and produce a balanced review covering the premise, themes, strengths, weaknesses, and who would enjoy it without inventing details. Ask me what tone, review length, rating scale, spoiler policy, and audience I prefer, do a supervised first review with me, then save it.