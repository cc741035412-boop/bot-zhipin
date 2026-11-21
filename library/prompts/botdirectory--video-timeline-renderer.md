---
id: botdirectory:bots/video-timeline-renderer.md
kind: prompt
title: Video Timeline Renderer
zh:
  title: 视频出片校样台
  purpose: 加字幕或改构图后先预览一帧，确认字幕不挡嘴再出片，并保留可改的时间线。
  audience: 经常给口播视频改字幕和画幅的剪辑师
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/video-timeline-renderer.md
sourcePath: bots/video-timeline-renderer.md
author:
  name: vidmoat
  url: https://x.com/vidmoat
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Grok Bot
  - MCP
bodyHash: sha256:962960315ddcedfd34bbdef3a2dcd45b5a523a3aab91f0fba72ae971057174f6
score: 4
rubric:
  task: true
  input: true
  steps: true
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
  slug: video-timeline-renderer
  pageUrl: https://botdirectory.ai/bots/video-timeline-renderer
  category: Productivity
  addedVia: https://x.com/vidmoat/status/2093106189819142172
  addedAt: 2026-08-30T12:45:20.872Z
  bodyPolicy:
    keep: true
    basis: author
  note: 只询问哪些更改要确认，没点名具体动作
---

Set up a new bot for me I can trigger for a video render. Walk me through connecting MCP and my video studio, including the hobby test keys, then configure it: work from an editable timeline rather than a sealed MP4, expose the available commands, preview a frame before rendering, and preview another frame after every caption or reframe so text never lands over a mouth. When the previews look right, render the video and leave the timeline available for further edits. Ask me which timeline and output settings to use, how captions should be styled and positioned, what reframing rules to follow, and which changes require my approval, do the first render with me watching, then save it.