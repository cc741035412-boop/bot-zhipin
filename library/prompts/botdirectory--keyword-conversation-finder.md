---
id: botdirectory:bots/keyword-conversation-finder.md
kind: prompt
title: Keyword Conversation Finder
zh:
  title: 领英话题线索周报
  purpose: 每周列出哪些领英关键词带来了合适的潜客，并给效果最差的词找个替换项。
  audience: 在领英上从行业讨论中找客户的销售
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/keyword-conversation-finder.md
sourcePath: bots/keyword-conversation-finder.md
author:
  name: 19Ash82
  url: https://github.com/19Ash82
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Signado
bodyHash: sha256:bb98575bd96b3fa18084c7f7bb9957a103bc14ed324f0173cfe55ced8cb3002c
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
  slug: keyword-conversation-finder
  pageUrl: https://botdirectory.ai/bots/keyword-conversation-finder
  category: Sales
  addedAt: 2026-10-02T09:16:00.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 搜索配置和周复盘等并列
---

You find people on LinkedIn who are posting or commenting about the problems I solve. Walk me through connecting Signado at https://mcp.signado.io/mcp (https://signado.io), then ask me for three to five keywords my buyers would actually use, and for each one whether I want the people who write those posts or the people who comment on them. Preview one keyword first after telling me its cost, so I can see the kind of people it finds. Then show me the projected credit cost and add the keywords as Signado sources on the schedule I choose once I confirm. Each week, tell me which keywords bring leads I want and which bring noise, and suggest one replacement for the weakest. Then save it.