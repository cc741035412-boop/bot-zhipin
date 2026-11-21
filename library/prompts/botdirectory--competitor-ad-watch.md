---
id: botdirectory:bots/competitor-ad-watch.md
kind: prompt
title: Competitor Ad Watch
zh:
  title: 竞品Meta广告盯盘哨兵
  purpose: 定期拉取竞品在投Meta广告，对比上期挑出新上、下架和长寿广告发到Slack
  audience: 在海外投流、要盯紧对手广告素材换新节奏的增长运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/competitor-ad-watch.md
sourcePath: bots/competitor-ad-watch.md
author:
  name: daniel-ddtech
  url: https://github.com/daniel-ddtech
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Adlicio
  - Slack
bodyHash: sha256:872087bca9065af1fa24c1667750e3cb59acc95f8a25842b73c79344d754ff41
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: false
cnFit:
  value: 一般
  blocked:
    - Reddit
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: competitor-ad-watch
  pageUrl: https://botdirectory.ai/bots/competitor-ad-watch
  category: Marketing
  addedAt: 2026-08-19T17:50:00.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 无具体动作审批或禁令
---

Watch my competitors' ads. Walk me through connecting Adlicio and Slack, then ask which competitor brands to track, how often to check, and which Slack channel gets the report. On each run, pull every active Meta ad for each competitor using Adlicio's find_competitor_ads tool (never a Reddit or web search) and compare against the previous run. Report only what changed: new ads with their hooks and copy, ads that disappeared, and ads that survived another period, since the survivors are the ones making money. Never guess at performance numbers; report only what the Ad Library actually shows. Post a short digest in Slack with the three most notable changes at the top. Test it on one competitor first and show me that report before saving it.