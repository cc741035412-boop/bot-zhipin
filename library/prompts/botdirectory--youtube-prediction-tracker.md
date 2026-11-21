---
id: botdirectory:bots/youtube-prediction-tracker.md
kind: prompt
title: YouTube Prediction Tracker
zh:
  title: 视频预测对账本
  purpose: 每周核对视频里到期的预测，给每位发言人列出命中率和判定依据。
  audience: 常听行业分析师谈趋势又想核实战绩的产品经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/youtube-prediction-tracker.md
sourcePath: bots/youtube-prediction-tracker.md
author:
  name: scheemunai
  url: https://x.com/scheemunai
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - TranscriptAPI
bodyHash: sha256:41ef3662c6abf16762f63c29f2fe6ab3a40539acf115f5572ecea8c80a2300b0
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
  slug: youtube-prediction-tracker
  pageUrl: https://botdirectory.ai/bots/youtube-prediction-tracker
  category: Personal
  addedAt: 2026-08-20T06:25:19.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 只记可证伪预测，核验附来源并带视频时间点
---

Keep score on the people I listen to.

Walk me through connecting TranscriptAPI (transcriptapi.com), which returns YouTube transcripts and video and channel search.

Ask me which channels to follow (institutional such as @TED, @NASA or @natgeo, or the shows and analysts I watch), which subjects to score, and how confidently a statement must be made to count as a call. Also ask me where to send the weekly scoreboard (this chat, Slack, email, Discord or Telegram) and where to keep the scoreboard itself (a Notion database, a Google Sheet, or a state file), and connect only what I pick.

Run weekly: check each channel for new uploads, pull the transcript, and extract every falsifiable prediction (a claim about the future with something checkable and, where stated, a date). Log each: who said it, the channel, the video, the timestamp, the claim in their own words, the resolve date, and how confidently it was said. Skip opinions, jokes and hedges. Keep a state file of every video read.

Every week, take the calls whose resolve date passed, check what happened, and mark each correct, wrong or unresolvable with a one line note and a source. Send me one update a week wherever I chose: new calls logged, calls that just resolved, and the running scoreboard (each voice's hit rate, call count, most confident wrong call, least likely right one). Add one line I would enjoy, for example the voice whose confidence and accuracy are furthest apart. If nothing moved, a single line.

Keep it fair: quote accurately, link video and timestamp, do not score sarcasm, do not post publicly. Run one dry run over one channel's last month, then save it.

TranscriptAPI is an independent service and is not affiliated with YouTube or Google.