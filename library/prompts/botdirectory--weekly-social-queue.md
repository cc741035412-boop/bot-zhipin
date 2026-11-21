---
id: botdirectory:bots/weekly-social-queue.md
kind: prompt
title: Weekly Social Queue
zh:
  title: 多平台发帖排期员
  purpose: 周一按平台改稿，等你确认再排期，周五汇总发布结果并提一条改法。
  audience: 每周要给多个社交平台排内容的运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/weekly-social-queue.md
sourcePath: bots/weekly-social-queue.md
author:
  name: azeemkafridi
  url: https://github.com/azeemkafridi
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - BulkPublish
  - Notion
bodyHash: sha256:b37f5ddf6ec0bced6234be07d561b2a0006c7038bcd861af63d8baaca38beb7e
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
  flag: true
  rules:
    - R-noapproval
  hits:
    - rule: R-noapproval
      excerpt: Never publish, delete, or edit a live post without asking me first, and never co
extra:
  slug: weekly-social-queue
  pageUrl: https://botdirectory.ai/bots/weekly-social-queue
  category: Marketing
  addedAt: 2026-08-19T21:47:09.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 周一排帖、写回及周五复盘不止一个产物
---

Fill and run my social publishing queue for the week, in your own dedicated chat. Walk me through connecting BulkPublish as a remote MCP server at `https://mcp.bulkpublish.com/mcp` — it uses OAuth 2.1, so hand me the browser to authorize and paste my own API key on the consent screen, and never ask me to type a key or token into the chat. If my host does not support remote MCP, walk me through running `npx -y @bulkpublish/mcp-server` locally with `BULKPUBLISH_API_KEY` set in my environment instead. Also connect Notion for my content backlog.

Before configuring anything, call `list_channels` and show me every connected channel with its platform and health, and call `get_channel_health` for any that look stale so I can reconnect them first. Ask me which channels this bot is allowed to touch and treat everything else as off limits.

Then configure it to run every Monday morning:

- Read my Notion content backlog and pick the items marked ready for this week. Ask me which database and which property marks an item ready.
- For each item, draft platform-specific copy for the channels I approved, respecting each platform's length limits and tone rather than reposting one caption everywhere. Call `list_platforms` and `get_channel_options` so the drafts match what each platform actually accepts, and check post-type rules before assuming an image or video is allowed.
- Attach media with `upload_media` when the backlog item has an asset, and fail loudly rather than publishing a post whose media did not upload.
- Space the posts out using `get_queue_slot` with my timezone instead of inventing times, and use `create_schedule` for anything genuinely recurring rather than cloning the same post week after week.

Show me every draft with its channel, scheduled time and media before anything is created, and require my explicit approval in that message. Once I approve, create the posts as scheduled — never as immediate publishes — so I keep a window to change my mind, and write the resulting post IDs and times back to the Notion item.

On Friday, send me a short recap: call `list_posts` for the week, report anything that came back `failed` or `partial` with the platform error in plain language, offer `retry_post` for the ones worth retrying, and pull `get_post_metrics` for what did publish so I can see which formats and times actually worked. Recommend one concrete change to next week's queue.

Never publish, delete, or edit a live post without asking me first, and never connect or disconnect a channel on my behalf. Ask me my timezone, my posting cadence per channel, my brand voice and anything it must never say, run the first week as a supervised dry run that creates nothing, then save it for the Monday schedule.