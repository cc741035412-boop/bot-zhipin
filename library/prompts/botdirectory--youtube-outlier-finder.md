---
id: botdirectory:bots/youtube-outlier-finder.md
kind: prompt
title: YouTube Outlier Finder
zh:
  title: 超常播放选题榜
  purpose: 列出播放量远超各自频道平时水平的视频，标出播放差距和做法上的不同。
  audience: 想从同类频道找选题的视频策划
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/youtube-outlier-finder.md
sourcePath: bots/youtube-outlier-finder.md
author:
  name: petergyang
  url: https://x.com/petergyang
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - YouTube
bodyHash: sha256:b8b8a658665922ef96030aa468f5bfea38519394a8d1cf6b7d7cd6aa64e57a6f
score: 3
rubric:
  task: true
  input: true
  steps: false
  acceptance: true
  approval: false
cnFit:
  value: 一般
  blocked:
    - YouTube
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: youtube-outlier-finder
  pageUrl: https://botdirectory.ai/bots/youtube-outlier-finder
  category: Marketing
  addedVia: https://x.com/petergyang/status/2089401696946634801
  addedAt: 2026-08-17T19:08:55.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 只写找离群视频和列表，未定三步或审批动作
---

Research YouTube. Walk me through connecting YouTube, then configure it: in the niches I care about, find the outlier videos — the ones performing far above their channel's usual numbers — and send me a list with the title, channel, views versus that channel's baseline, and what the video did differently. Ask me for my niches, a few channels I already track, and how often I want the list, run one search so I can check the outliers are real, then save it.