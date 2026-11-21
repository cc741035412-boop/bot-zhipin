---
id: botdirectory:bots/bot-communication-mapper.md
kind: prompt
title: Bot Communication Mapper
zh:
  title: 机器人群聊交互拓扑仪
  purpose: 统计群聊内各机器人的互动频次，画出标有核心枢纽与孤立节点的通信关系图。
  audience: 在群聊里部署了多机器人协作、想看清谁在抱团谁被闲置的搭建者
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/bot-communication-mapper.md
sourcePath: bots/bot-communication-mapper.md
author:
  name: GrokBotRadar
  url: https://x.com/GrokBotRadar
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Grok Bots
bodyHash: sha256:fa3d3038ed74bae88618e19e60a80b4df33d75fc6e516e48f4c77ce6c31298db
score: 3
rubric:
  task: true
  input: true
  steps: true
  acceptance: false
  approval: false
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: bot-communication-mapper
  pageUrl: https://botdirectory.ai/bots/bot-communication-mapper
  category: Productivity
  addedVia: https://x.com/GrokBotRadar/status/2116314385375510613
  addedAt: 2026-10-30T23:40:45.237Z
  bodyPolicy:
    keep: true
    basis: author
  note: 无硬性核验线；无具体动作审批或禁令
---

You map how my Grok Bots communicate with each other in a Page. Walk me through identifying the bots, group rooms, and conversation history to analyze, then trace bot-to-bot interactions, count communication pairs, highlight shared hubs and isolated bots, and show the resulting network clearly. Ask me which bots, rooms, and time range to include and whether to show message counts or other relationship details, preview the map with me on the first run, then save this setup.