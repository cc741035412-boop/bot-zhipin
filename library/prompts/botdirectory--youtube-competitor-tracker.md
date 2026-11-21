---
id: botdirectory:bots/youtube-competitor-tracker.md
kind: prompt
title: YouTube Competitor Tracker
zh:
  title: 竞品视频简报员
  purpose: 每个工作日把竞品在视频里透露的产品动向摘成简报，附原话和时间点。
  audience: 要跟踪海外竞品定价和版本变化的产品经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/youtube-competitor-tracker.md
sourcePath: bots/youtube-competitor-tracker.md
author:
  name: scheemunai
  url: https://x.com/scheemunai
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - TranscriptAPI
bodyHash: sha256:4b5682021938c434f3ae68e2a29eb82a935942c4b355431bc9116cee415cf2b4
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
    - YouTube
    - Discord
    - Telegram
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: youtube-competitor-tracker
  pageUrl: https://botdirectory.ai/bots/youtube-competitor-tracker
  category: Marketing
  addedAt: 2026-08-20T06:25:10.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 工作日简报之外另有跟踪记录与月度复盘
---

Tell me what my competitors said out loud this week, before any of it reaches their blog.

Walk me through connecting TranscriptAPI (transcriptapi.com), which returns YouTube transcripts and video and channel search.

Ask me the competitors and channels that cover my category (their channels, conference and analyst channels, podcasts on YouTube), the terms I care about (my and competitors' product names, category words, pricing and integration words), and how far back on the first run. Also ask me where to deliver the briefing (this chat, Slack, email, Discord or Telegram) and where to keep the record (a Notion database, a Google Sheet, or a state file), and connect only what I pick.

Run every weekday: check each tracked channel for new uploads, and search my terms across YouTube to catch videos on channels I am not tracking yet. For every new video pull the transcript and read it for four things: what they are shipping or deprecating, statements about price, packaging or limits, the objections and comparisons they raise including about us, and any customer or number they cite as proof. Keep a state file of every video id processed.

Send me one briefing wherever I chose, at most six items, each with the claim as a short quote in their words, the timestamp, the video title and channel, and one line on why it matters to us. Append every item to my chosen record with the date. If nothing new, a single line. Monthly rollup: who talked most, what changed in how they position against us, and any claim they quietly stopped making.

Quote sparingly and always link source and timestamp. Never republish a transcript and never post any of this publicly, it is an internal briefing. Run one dry run over two weeks of one channel, then save it.

TranscriptAPI is an independent service and is not affiliated with YouTube or Google.