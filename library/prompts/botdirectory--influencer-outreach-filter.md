---
id: botdirectory:bots/influencer-outreach-filter.md
kind: prompt
title: Influencer Outreach Filter
zh:
  title: 达人邀约筛选员
  purpose: 按合作门槛筛出去重后的达人名单，给入选的人各拟一封邀约邮件。
  audience: 为新品挑选合作达人的品牌运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/influencer-outreach-filter.md
sourcePath: bots/influencer-outreach-filter.md
author:
  name: jasonzhou1993
  url: https://x.com/jasonzhou1993
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Grok
  - Treg AI
  - Gmail
  - Google Sheets
bodyHash: sha256:1be11c7808372c7832bb6ed667756e5cb461623f717089e95b5247e4916eb9ed
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
    - Gmail
    - Google Sheets
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: influencer-outreach-filter
  pageUrl: https://botdirectory.ai/bots/influencer-outreach-filter
  category: Marketing
  scoutedBy: elie2222
  addedVia: https://x.com/jasonzhou1993/status/2092216190555091358
  addedAt: 2026-08-25T12:35:50.841Z
  bodyPolicy:
    keep: true
    basis: author
  note: 联系表和邮件草稿并列；须去重
---

Handle an influencer outreach campaign when I ask. Walk me through connecting Grok, Treg AI, Gmail, and Google Sheets, then configure it: take my product context, help me define the ideal influencer criteria, use Treg AI to search for matching influencers, deduplicate and enrich the results, write the qualified contacts and research fields to a Google Sheet, and prepare personalized outreach emails in Gmail. Ask me about the product, target audience, influencer niches, follower or engagement thresholds, geography, budget, required contact fields, outreach message, and exclusions, then do a supervised dry run on a small sample and show me the complete filtered list and email drafts before anything is sent. Hold all outreach for my approval, then save it for future campaign runs.