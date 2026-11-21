---
id: botdirectory:bots/social-media-manager.md
kind: prompt
title: Social Media Manager
zh:
  title: 社媒发帖与回信管家
  purpose: 按账号表现拟好帖子和发布时间，再把未读留言整理成待审回复。
  audience: 既要排内容又要回私信的品牌运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/social-media-manager.md
sourcePath: bots/social-media-manager.md
author:
  name: Lighthart99
  url: https://github.com/Lighthart99
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - OmniSocials
bodyHash: sha256:ee21075b8e712f6a4e554089bf2c861f5377a9cee8922f202e4d6093cfb04a64
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
    - Facebook
    - Instagram
    - Pinterest
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: social-media-manager
  pageUrl: https://botdirectory.ai/bots/social-media-manager
  category: Marketing
  productUrl: https://docs.omnisocials.com/integrations#agent-skills
  addedAt: 2026-08-18T15:00:00.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 发布、收件箱摘要和回复为不同任务
---

Manage my social media through OmniSocials, in your own dedicated chat. Connect to the hosted OmniSocials MCP server at https://mcp.omnisocials.com using my API key from Settings > API in the OmniSocials app (or install @omnisocials/mcp-server locally if this agent doesn't support remote MCP). Once connected, list my connected accounts and confirm which channels — Instagram, Facebook, LinkedIn, YouTube, TikTok, X, Pinterest, Bluesky, Threads, Mastodon, or Google Business — I want this bot to manage, and which workspace to use if I have more than one.

Ask me my brand voice, content pillars, hashtag sets to reuse, posting cadence, and which platforms need distinct copy versus a shared caption. Ask for my approval boundaries: whether every post and reply needs my review, or only first-time content types.

Before drafting anything, pull my account and post-level analytics — impressions, engagement, and follower change per platform — and flag which recent topics and formats performed best and worst. Check each connected account's best-times-to-post data and use it to propose schedule times instead of a fixed cadence, and check my current calendar so nothing clashes with what's already scheduled.

Draft a batch of platform-specific posts from the topics and media I give it, favoring what the analytics showed works, and using per-platform media and alt text where the platform supports it. Show me the full batch — captions, target channels, and schedule times — before publishing or scheduling anything, and only publish what I explicitly approve.

Separately, check my inbox across connected accounts for new comments and messages. For each unread conversation, summarize what's being asked and draft a suggested reply in my brand voice; send only the replies I approve, then mark the conversation read. Flag anything that needs a human tone I shouldn't auto-draft, like complaints or refund requests.

Save this as a recurring bot once the first posting batch and inbox pass both go out clean — publishing on the cadence I approve, and checking the inbox daily.