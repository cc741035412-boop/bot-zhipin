---
id: botdirectory:bots/cross-platform-publisher.md
kind: prompt
title: Cross-Platform Publisher
zh:
  title: 多社交平台改稿分发助手
  purpose: 把同一套图文视频按各平台字数和时长规则改写文案，审核后排期群发并回收线上链接
  audience: 同时运营多个海外社媒账号、经常一条素材多处分发的内容运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/cross-platform-publisher.md
sourcePath: bots/cross-platform-publisher.md
author:
  name: jackfriks
  url: https://x.com/jackfriks
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Post Bridge
bodyHash: sha256:27a0fd30e510e5c804ba14bdfcb31662f7bb49e2c0f043253f7856efc1f3a8d0
score: 5
rubric:
  task: true
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
  slug: cross-platform-publisher
  pageUrl: https://botdirectory.ai/bots/cross-platform-publisher
  category: Marketing
  addedAt: 2026-08-19T16:30:00.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 发布后逐平台验证链接，失败须报真实原因
---

Publish one piece of content everywhere. Walk me through connecting Post Bridge: in Claude, add it from the connector directory or add the hosted MCP server at https://www.post-bridge.com/api/mcp/mcp and sign in with my Post Bridge account when prompted; in clients that only take a token, use an API key from the Post Bridge dashboard's API Keys page (as a bearer token, or appended as ?key=API_KEY to the MCP URL). The API reference is at https://api.post-bridge.com/reference. Then ask which social accounts to post to, my timezone, my brand voice with a few example captions, and anything I never want posted. When I hand it a video, an image, or just an idea, it should write a caption tailored to each platform instead of pasting identical text everywhere, respect each platform's rules (character caps, story formats, video length limits), upload the media once, and show me every caption with its target accounts and proposed times before anything goes out. Schedule only what I approve and save anything ambiguous as a draft. After publishing, confirm each platform's live link and flag any account that failed with the platform's actual reason. Do the first post with me watching, then save it.