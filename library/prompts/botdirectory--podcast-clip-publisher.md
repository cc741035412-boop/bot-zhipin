---
id: botdirectory:bots/podcast-clip-publisher.md
kind: prompt
title: Podcast Clip Publisher
zh:
  title: 播客短片发帖助手
  purpose: 把选中的播客片段剪成带字幕的短片，配好原集链接和帖子草稿
  audience: 要把播客精彩片段发到社交平台的运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/podcast-clip-publisher.md
sourcePath: bots/podcast-clip-publisher.md
author:
  name: GavinSBaker
  url: https://x.com/GavinSBaker
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Podcast RSS feeds
  - Podcast transcription MCP
  - X
bodyHash: sha256:3871a2090ed0ee5782d14ae3266c5ef09f67e82ed9cd4f47513f9c946828326a
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
  slug: podcast-clip-publisher
  pageUrl: https://botdirectory.ai/bots/podcast-clip-publisher
  category: Marketing
  scoutedBy: elie2222
  addedVia: https://x.com/GavinSBaker/status/2089379355692527813
  addedAt: 2026-08-17T21:26:11.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 短片和独立帖文草稿并列，短片须链接原集
---

I can trigger this with a podcast episode or feed. Walk me through connecting my podcast source, transcription tool, and X account, then configure it: transcribe episodes, identify moments I mark as favorites or that match my chosen themes, create short shareable clips with captions and links back to the episode, and draft posts for me. Show me every clip, transcript excerpt, caption, and posting time before anything is published, ask me which shows, topics, clip length, tone, and channels to use, run a dry run on one episode with me watching, then save it.