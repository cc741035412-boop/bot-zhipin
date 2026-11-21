---
id: botdirectory:bots/discord-to-linear-issue-creator.md
kind: prompt
title: Discord-to-Linear Issue Creator
zh:
  title: 社群消息转工单助手
  purpose: 把转发的社群消息转成带标题、上下文、标签和优先级的Linear工单
  audience: 常在社群收集用户反馈并要同步建开发工单的产品经理与研发
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/discord-to-linear-issue-creator.md
sourcePath: bots/discord-to-linear-issue-creator.md
author:
  name: RhysSullivan
  url: https://x.com/RhysSullivan
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Discord
  - Linear
bodyHash: sha256:550ef646c791169b666aa44ac0cd3e55bc265defd7955cd61a85e40260da0ee8
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: false
  approval: true
cnFit:
  value: 一般
  blocked:
    - Discord
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: discord-to-linear-issue-creator
  pageUrl: https://botdirectory.ai/bots/discord-to-linear-issue-creator
  category: Productivity
  scoutedBy: elie2222
  addedVia: https://x.com/RhysSullivan/status/2093772583208673774
  addedAt: 2026-08-30T10:43:36.323Z
  bodyPolicy:
    keep: true
    basis: author
  note: 无硬性核验线
---

Set up a new bot for me I can trigger by forwarding a message from Discord. Walk me through connecting Discord and Linear, then watch for forwarded requests, turn each one into a clear Linear issue title and description while preserving the original context, and create it in the project and team I choose with the right labels and priority. Ask me which Discord channels and message formats count as requests, which Linear team and project to use, how I want titles phrased, which labels and priorities to infer, and whether to include the source message and link. Do a supervised dry run with a few forwarded messages, show me the proposed issue fields and let me approve each issue before it is created, then save it for future forwards.