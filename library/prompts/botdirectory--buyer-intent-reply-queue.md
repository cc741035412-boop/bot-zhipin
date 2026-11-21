---
id: botdirectory:bots/buyer-intent-reply-queue.md
kind: prompt
title: Buyer Intent Reply Queue
zh:
  title: 高意向线索回复草稿队列
  purpose: 每个工作日筛选高分购买意向帖，把前十条原帖链接与回复草稿发到Slack频道
  audience: 靠社媒求助帖找潜在客户并亲自回复的B2B销售与创始人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/buyer-intent-reply-queue.md
sourcePath: bots/buyer-intent-reply-queue.md
author:
  name: alexandr-belogubov
  url: https://github.com/alexandr-belogubov
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - HotMention
  - Slack
bodyHash: sha256:c6262cb115eb4205bfc1d65cfbabe7f1d91c83228258272d549bde8674f621e8
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
  flag: true
  rules:
    - R-credential
  hits:
    - rule: R-credential
      excerpt: https://hotmention.com/api/mcp — I'll paste my API key from Settings → API when
extra:
  slug: buyer-intent-reply-queue
  pageUrl: https://botdirectory.ai/bots/buyer-intent-reply-queue
  category: Marketing
  productUrl: https://hotmention.com/docs/mcp
  addedAt: 2026-08-20T12:33:52.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 最多十条，超量须报省略数且每条附原帖链接
---

Run this workflow for me. Connect HotMention over MCP at
https://hotmention.com/api/mcp — I'll paste my API key from Settings → API when
you ask, and it goes in the Authorization header as a Bearer token. Also connect
Slack and ask me which channel to post in.

First, before scheduling anything, call list_keywords and show me what the
project currently tracks. Walk through them with me: for each keyword, tell me
whether it reads like something a person would actually type when they're stuck
or shopping, or like a phrase nobody writes out loud. Matching is literal, so a
long keyword like "project management software for remote teams" will almost
never appear verbatim in a real post — flag those and suggest shorter, natural
replacements. Use add_keyword for the ones I approve, and tell me if I hit my
plan's keyword limit rather than silently dropping any.

Then run every weekday at 9am my time:

Call search_mentions with score_min 70 and since set to the last 24 hours. Those
are the ones where someone is actively describing a problem I solve, not just
mentioning a topic. For each result, post one Slack message containing:

- the score, the platform, and how long ago it was posted
- the post title, and two lines of what the person actually asked for
- the draft reply HotMention generated, in a code block so I can copy it cleanly
- a direct link to the original post

Sort them highest score first, and if there are more than ten, post the top ten
and say how many you held back.

Do not post anything to any platform yourself. I reply from my own account —
these are real conversations and they should come from a person. Your job ends
at putting a good draft in front of me.

Two things I want you to be honest about rather than papering over. If
search_mentions returns nothing at all for several days running, say so plainly
and suggest we look at the keywords again, because silence usually means the
keywords are wrong rather than that nobody is talking. And once a week, call
get_usage and tell me how much of my lead quota I've used and how many days are
left in the period, so a busy week doesn't quietly cut off scanning halfway
through.

Save this as a bot when I confirm the Slack channel.