---
id: botdirectory:bots/youtube-daily-digest.md
kind: prompt
title: YouTube Daily Digest
zh:
  title: 订阅视频晨报
  purpose: 每天把订阅频道的新视频按相关性排成晨报，每条附上三到五个要点。
  audience: 早上想挑几条行业视频看的产品经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/youtube-daily-digest.md
sourcePath: bots/youtube-daily-digest.md
author:
  name: scheemunai
  url: https://x.com/scheemunai
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - TranscriptAPI
bodyHash: sha256:517162811a2133187058129960c9ce676390249da1a50bdcfd145a7f8430beda
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
  slug: youtube-daily-digest
  pageUrl: https://botdirectory.ai/bots/youtube-daily-digest
  category: Personal
  addedAt: 2026-08-20T06:25:01.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 每条视频三至五个要点，已摘要视频不重复
---

Read the new videos from the channels I follow so I do not have to watch them.

Walk me through connecting TranscriptAPI (transcriptapi.com), which returns YouTube transcripts and video and channel search.

Ask me which channels to follow, the topics I care about most, how long a summary I want, whether to skip anything under a length I set, and my timezone and digest time. Also ask me where to deliver the digest, and connect only what I pick: right here in this chat by default, or Slack, email, Discord or Telegram.

Run every morning at my time: find the new uploads on my channels since the last run, pull each transcript, and for every video give me the title, the channel, a summary in the length I chose, the three to five key points, any resource or tool mentioned, and the one line worth clicking in for. Keep a state file of every video already summarized so nothing repeats.

Send me one digest wherever I chose to receive it, most relevant first, leaving out channels that posted nothing. If nothing new dropped anywhere, a single line.

Never post or share any of this. Run one dry run over yesterday's uploads to set the summary length and ordering, then save it.

TranscriptAPI is an independent service and is not affiliated with YouTube or Google.