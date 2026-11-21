---
id: cobus:teams/marketing/team.yaml
kind: team
title: Marketing
zh:
  title: 竞品监控与内容改写组
  purpose: 对比指定竞品页面变化、把定稿简报改写成多渠道草稿，并拼好待发送的下期周刊。
  audience: 要盯竞品页面变动并定期产出多渠道草稿与周刊的市场人员
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/teams/marketing/team.yaml
sourcePath: teams/marketing/team.yaml
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Slack
  - Notion
bodyHash: sha256:f54702a65a2fc17324e7dae3b607f5e682c464012001a8b6dad829d63e5ca538
score: 3
rubric:
  task: false
  input: true
  steps: false
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
  note: 巡检、改写、简报各自交付，未说明串接顺序
---

id: marketing
name: Marketing
lead: competitor-watch
bots:
  - competitor-watch
  - content-remix
  - newsletter-desk
why: >
  Competitor noise, channel variants, and the weekly issue get mixed
  until someone diffs, remixes, and still does not publish.
group_kickoff: >
  @Competitor Watch diff the named set since last snapshot and stay
  quiet on unchanged pages. @Content Remix turn the accepted brief
  into DRAFT variants. @Newsletter Desk assemble the next issue unsent.
  Do not publish. Do not post to Slack or X. Do not send the issue.
plugins:
  - Slack
  - Notion
max_bots: 4
autonomy: L1