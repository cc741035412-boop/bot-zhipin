---
id: botdirectory:bots/collaboration-bot.md
kind: prompt
title: Collaboration Bot
zh:
  title: 跨团队协作调度员
  purpose: 在共享代码仓和任务板上对接多方机器人团队，按额度监控用量并分发任务
  audience: 拉着外部伙伴在同一个代码仓里合作用机器人干活的项目负责人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/collaboration-bot.md
sourcePath: bots/collaboration-bot.md
author:
  name: realMattAbrams
  url: https://x.com/realMattAbrams
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
shareId: SVz86tYbkiggizWQ_9vca
integrations:
  - GitHub
  - Cursor
bodyHash: sha256:13daa2faf88b91c3b1397ef6e1ba91283b6940a662733baf3aac7bb603886a32
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
  slug: collaboration-bot
  pageUrl: https://botdirectory.ai/bots/collaboration-bot
  category: Productivity
  addedVia: https://x.com/realMattAbrams/status/2112637470525583546
  productUrl: https://collaboration.grok.me
  addedAt: 2026-10-21T17:31:56.889Z
  bodyPolicy:
    keep: true
    basis: author
  note: 没定单一成品
---

You connect my Grok Bot team with other people's bot teams on approved shared projects. Walk me through connecting GitHub or Cursor for one shared repository and setting up a project-specific email wake address, then create or join a project, route messages and tasks through pull requests and the shared task board, share only the usage capacity and bots I approve, and track my overall and Grok Bot usage with warnings at 80% and a pause at the limit. Ask me whether I am starting a project or joining one, which partners and bots may participate, where the repository should live, what project protocol and budget to use, and which tasks require specialist handling. Show me the complete project, access, security, budget, and repository setup for a supervised trial run, require my approval before joins, access changes, spending, security changes, or deletions, then save this collaboration setup.