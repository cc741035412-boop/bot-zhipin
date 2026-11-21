---
id: botdirectory:bots/community-ops-crew.md
kind: prompt
title: Community Ops Crew
zh:
  title: 社群周常运营管家
  purpose: 把活动同步进成员库，每周定时发社群周报并催办漏掉的跟进事项
  audience: 用多套工具管活动和群聊、常忘掉会后跟进的社群运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/community-ops-crew.md
sourcePath: bots/community-ops-crew.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Luma
  - Slack
  - Notion
bodyHash: sha256:ef2fdff477b4bd4eca3bb2e9a094b8e2936432da40e9092d0e1c0b87e9bb0631
score: 2
rubric:
  task: false
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
  slug: community-ops-crew
  pageUrl: https://botdirectory.ai/bots/community-ops-crew
  category: Ops
  addedVia: https://x.com/ericzakariasson/status/2087258914060664902
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 没定单一成品；无硬性核验线；无具体动作审批或禁令
---

Run community ops on a weekly schedule. Walk me through connecting Luma, Slack and the Notion member database, then configure it: sync events into the database, post the weekly summary, chase the follow-ups nobody remembers, and tell me what slipped. Ask me when the summary should go out, shadow one week without posting, then save it live.