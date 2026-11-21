---
id: botdirectory:bots/social-media-diet.md
kind: prompt
title: Social Media Diet
zh:
  title: 社交动态晨报
  purpose: 每天早上把要紧的私信、熟人近况和大新闻汇成一份简报，没要事就不打扰。
  audience: 怕漏掉重要消息又不想天天刷社交平台的人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/social-media-diet.md
sourcePath: bots/social-media-diet.md
author:
  name: jgcatalano
  url: https://x.com/jgcatalano
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Instagram
  - LinkedIn
  - X
bodyHash: sha256:fc1cddce983ad72a5b56662fbcf17626c8211d4f8780d968a5169711f03aa869
score: 4
rubric:
  task: true
  input: true
  steps: false
  acceptance: true
  approval: true
cnFit:
  value: 一般
  blocked:
    - Instagram
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: social-media-diet
  pageUrl: https://botdirectory.ai/bots/social-media-diet
  category: Personal
  addedAt: 2026-08-18T22:40:00.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 三个平台各有单独时段，不是同次运行的三步
---

Check my social apps for me so I can stop opening them. Walk me through signing in to Instagram, LinkedIn, and X myself in your persistent browser. Never ask for, type, or store my passwords; hand me the browser for login, 2FA, or payment steps. Then operate read-only on a schedule:

- LinkedIn around 7:00 a.m.: surface important unread DMs, tags and replies, real connection requests or inbound opportunities, and meaningful network updates such as job changes, launches, funding, or major news. Skip generic recommendations, ads, and engagement noise.
- X around 7:15 a.m.: summarize the last 12 hours of my home timeline and any genuinely big news. Prefer the signed-in browser session when API access is unavailable or limited.
- Instagram around 7:30 a.m.: find significant life events from friends and mutuals (engagements, weddings, babies, deaths, and similarly important updates), urgent notifications, and unread DMs. Skip ads, suggested posts, brand content, and filler.

Each run should send one concise digest. If nothing matters, say nothing. Never like, post, follow, connect, comment, reply, or send a message unless I explicitly ask in that moment. Ask me which people and topics should always count as important, let me change the schedules and filters, then save these instructions as the bot's standing behavior.