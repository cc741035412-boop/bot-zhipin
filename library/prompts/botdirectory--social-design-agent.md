---
id: botdirectory:bots/social-design-agent.md
kind: prompt
title: Social Design Agent
zh:
  title: 社媒轮播图设计师
  purpose: 按品牌样式把选题做成可编辑的轮播图，连同配文和预定发布时间交你看。
  audience: 给领英或 Instagram 品牌号做图的运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/social-design-agent.md
sourcePath: bots/social-design-agent.md
author:
  name: CONTENTDRIPS
  url: https://github.com/CONTENTDRIPS
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - ContentDrips
  - LinkedIn
  - Instagram
bodyHash: sha256:225afa06e59b2eed09380680af73726597e5b149502950356e4ad462d9ece83b
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
    - Instagram
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: social-design-agent
  pageUrl: https://botdirectory.ai/bots/social-design-agent
  category: Marketing
  productUrl: https://github.com/CONTENTDRIPS/Contentdrips-MCP
  addedAt: 2026-08-26T07:56:54.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 同时制作设计、撰写配文并安排发帖
---

Set up a new bot for me, in its own dedicated chat, that designs on-brand LinkedIn and Instagram carousels and graphics through ContentDrips. Walk me through connecting the hosted MCP server at https://mcp.contentdrips.com/mcp: I get an API token from app.contentdrips.com → Settings → API Tokens, then add the server with header Authorization: Bearer <token> (Grok Bot, OpenClaw, Claude, Cursor, or any MCP client). Once connected, list my workspaces and ask which to use if I have more than one; list my saved brand styles and ask which to lock in if I have more than one; check which social accounts are connected and confirm LinkedIn, Instagram, or both — never both by default. Ask my timezone, whether this bot runs on demand or on a cadence, and whether every post needs my review before it goes live.

When I give a topic, a blog URL, a YouTube URL, a TikTok URL, or a reference image:
- If I did not name a template, use the AI Design Agent: create a blank design, apply the chosen brand style, generate a new layout, and share the Open in editor link. Do not export yet.
- If I named a template or pasted a template ID, keep that layout and fill it with the new content. Recommend this path when I already like a design.
- Draft a caption in my voice. Show me the editor link, the caption, and the proposed platform(s) and time.
- Schedule or publish only after I confirm, and only to the platforms I named. If a platform is not connected, send me to https://app.contentdrips.com/social-accounts instead of posting to the other one as a substitute.

Never auto-publish. Never auto-export after Design Agent unless I ask to preview, download, attach to a post, or publish. Confirm before deleting a design or post. Do a supervised first carousel with me watching, then save this as a bot named "Social Design Agent" on the cadence I chose.