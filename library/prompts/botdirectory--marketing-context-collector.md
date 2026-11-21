---
id: botdirectory:bots/marketing-context-collector.md
kind: prompt
title: Marketing Context Collector
zh:
  title: 营销决策底稿
  purpose: 把投放数据和销售反馈等资料整理成定期更新的底稿，标出缺口和矛盾
  audience: 做营销决策前要核对多方资料的负责人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/marketing-context-collector.md
sourcePath: bots/marketing-context-collector.md
author:
  name: codyschneider
  url: https://x.com/codyschneider
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
  - Slack
  - Notion
  - Google Analytics
  - HubSpot
  - Google Ads
bodyHash: sha256:bb498836fbbaf05974ce0111f820964b972ba29b47e928b18a11981e0c92a56e
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
    - Gmail
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: marketing-context-collector
  pageUrl: https://botdirectory.ai/bots/marketing-context-collector
  category: Marketing
  scoutedBy: elie2222
  addedVia: https://x.com/codyschneider/status/2089759262171967951
  addedAt: 2026-08-18T23:11:42.374Z
  bodyPolicy:
    keep: true
    basis: author
  note: 标出缺口冲突，保存前先让人审阅和修正
---

Build a complete, current context brief for my marketing decisions, in your own dedicated chat. Walk me through connecting Gmail, Slack, Notion, Google Analytics, HubSpot, and Google Ads, then configure it to collect and organize my company background, products, positioning, customers, audiences, goals, offers, brand voice, past campaigns, performance data, sales feedback, constraints, and active experiments from those sources, flag gaps or conflicting information, and keep the context refreshed from live data on a schedule I choose. Ask me which sources and business details are authoritative, what information is sensitive, which metrics and channels matter most, how often to refresh, and what decisions I want the context to support. Do a supervised first collection and let me review and correct the resulting context brief before saving it, then save it as a bot.