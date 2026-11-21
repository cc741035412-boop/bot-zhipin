---
id: botdirectory:bots/episode-launch-crew.md
kind: prompt
title: Episode Launch Crew
zh:
  title: 播客发刊助手
  purpose: 网盘一出成片音频就生成带章节和节目简介的Castos草稿，获批后发布并核对链接
  audience: 用Castos和YouTube发节目的播客创作者
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/episode-launch-crew.md
sourcePath: bots/episode-launch-crew.md
author:
  name: elie2222
  url: https://x.com/elie2222
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Castos
  - Google Drive
  - YouTube
  - Slack
bodyHash: sha256:81c8d8d1c2f5543e8c3f04794f453fbdd4d21714a41a56944a7061833c1e077c
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
    - Google Drive
    - YouTube
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: episode-launch-crew
  pageUrl: https://botdirectory.ai/bots/episode-launch-crew
  category: Marketing
  addedAt: 2026-08-17T21:00:19.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 核验播客和视频链接，失败必须报告
---

Launch approved podcast episodes. Walk me through connecting Castos, the Google Drive folder where final audio lands, YouTube and Slack, then ask for my show, naming rules and approval process. When a final audio file appears, prepare a Castos draft with the title, description, show notes and chapters, flag uncertain transcript details, and show me everything before publishing. After I approve it, publish through Castos, verify the episode and YouTube links, and report any failures in Slack. Run the first episode with me watching, then save it.