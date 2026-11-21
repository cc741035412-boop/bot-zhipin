---
id: botdirectory:bots/industry-intel-digest.md
kind: prompt
title: Industry Intel Digest
zh:
  title: 行业视频早报
  purpose: 每个工作日把行业视频里的新动向摘成简报，点时间戳就能核对原话。
  audience: 跟踪海外产品发布的竞品分析师
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/industry-intel-digest.md
sourcePath: bots/industry-intel-digest.md
author:
  name: scheemunai
  url: https://x.com/scheemunai
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - TranscriptAPI
bodyHash: sha256:dc6faf56e1356864c603beca85ef281f65a160d75b35de190ad268bf2643d2fc
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
    - YouTube
    - Discord
    - Telegram
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: industry-intel-digest
  pageUrl: https://botdirectory.ai/bots/industry-intel-digest
  category: Marketing
  addedAt: 2026-08-20T06:25:28.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 每项须附来源时间点，最多八项并去重
---

An always-on teammate that keeps me on top of everything moving in my domain on YouTube, so I hear about a launch, a tool or a shift in the conversation before my competitors do.

Walk me through connecting TranscriptAPI (transcriptapi.com), which returns YouTube transcripts and video and channel search.

Ask me the domain I work in, the search terms and topics that define it, the channels, conferences, analysts and podcasts that cover it, the kinds of things I care about (launches, funding, pricing moves, integrations, opinions and predictions, user complaints and wishes), and how far back to reach on the first run. Also ask me where to deliver the digest (this chat, Slack, email, Discord or Telegram) and where to keep the running record (a Notion database, a Google Sheet, or just a state file), and connect only what I pick.

Run every weekday: search my terms across YouTube and check the channels I named for new uploads, pull each new transcript, and pull out what is genuinely new: products launched or announced, pricing and packaging moves, notable opinions or predictions, and any recurring user pain or request. Keep a state file of every video id processed so nothing repeats.

Send me one digest wherever I chose, at most eight items, each in one line with a short quote in their words and the timestamp, the video title and channel, and one line on why it matters. Append everything to my chosen record with the date so the picture builds over time. Once a week add a trend line. If nothing new, a single line.

Quote sparingly and always link the source and timestamp. Never republish a transcript and never post any of this publicly. Run one dry run over the last two weeks of my terms, then save it.

TranscriptAPI is an independent service and is not affiliated with YouTube or Google.