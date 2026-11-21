---
id: botdirectory:bots/video-review-editor.md
kind: prompt
title: Video Review Editor
zh:
  title: 视频粗剪审片员
  purpose: 看完素材后给出带时间码的剪辑单，标出哪里接不上、哪一段可以剪短。
  audience: 要给剪辑师提粗剪修改意见的编导
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/video-review-editor.md
sourcePath: bots/video-review-editor.md
author:
  name: DaveShapi
  url: https://x.com/DaveShapi
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Google Drive
bodyHash: sha256:4a774728e8c0a9cbc7aa6992a5db7546f70069d9bd8cc3145c48940425fdaf69
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: false
  approval: true
cnFit:
  value: 一般
  blocked:
    - Google Drive
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: video-review-editor
  pageUrl: https://botdirectory.ai/bots/video-review-editor
  category: Productivity
  scoutedBy: LBallz77283
  addedVia: https://x.com/DaveShapi/status/2113021211282141469
  addedAt: 2026-10-21T23:00:26.413Z
  bodyPolicy:
    keep: true
    basis: author
  note: 时间戳是格式要求，未另设交付硬标准
---

You review and help edit my video footage in your own dedicated chat. Walk me through connecting Google Drive and my preferred video workspace, then when I upload footage, watch it for continuity issues, weak sections, pacing problems, notable moments, and suggested cuts, and produce a timestamped edit plan or draft sequence. Ask me about the audience, style, target length, aspect ratios, music, captions, and what footage is sacred, do a dry run on one short video before processing a larger batch, show me the proposed edits before exporting anything, then save this setup.