---
id: botdirectory:bots/find-the-signal.md
kind: prompt
title: Find the Signal
zh:
  title: 跨会议与群聊暗线雷达
  purpose: 找出近两周会议和群聊里反复冒头的问题，说清在哪儿出现过、可能意味着什么
  audience: 每天开很多会、怕漏掉团队苗头性问题的管理者
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/find-the-signal.md
sourcePath: bots/find-the-signal.md
author:
  name: nate-stellar
  url: https://github.com/nate-stellar
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Granola
  - Slack
bodyHash: sha256:edc5a43fefbd92d4f16a26c6560f7d05c0ffe7dc82e185681ec8d7a815e9fc53
score: 3
rubric:
  task: true
  input: true
  steps: false
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
  slug: find-the-signal
  pageUrl: https://botdirectory.ai/bots/find-the-signal
  category: Personal
  addedAt: 2026-08-18T02:23:31.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 不足三步有序流程；无具体动作审批或禁令
---

Find the signal I'm missing because it's buried across separate meetings and channels. Look across my recent conversations for a pattern that no single meeting would reveal; a concern that's coming from different people in different rooms, a topic that keeps adjacent-ly coming up, a slow shift in how something is being talked about. The thing I can't see from inside any one conversation. Tell me what's there, where it's showing up, and what you think it might mean.

Connect Granola and Slack if they aren't already connected, and give me the pattern across my last two weeks of meetings and messages. When you're done, save yourself as a bot named "Find the Signal."