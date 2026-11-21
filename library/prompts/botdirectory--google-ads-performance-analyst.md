---
id: botdirectory:bots/google-ads-performance-analyst.md
kind: prompt
title: Google Ads Performance Analyst
zh:
  title: 广告花费复盘员
  purpose: 把广告花费和转化趋势写成周报，指出哪些投放见效、哪些在浪费预算。
  audience: 每周要向团队解释广告预算花在哪的投放负责人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/google-ads-performance-analyst.md
sourcePath: bots/google-ads-performance-analyst.md
author:
  name: benln
  url: https://x.com/benln
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Google Ads
bodyHash: sha256:1906b9c1a80df26e30c5c807583eaa5a4cac261aea278e4724d56157292e1108
score: 3
rubric:
  task: true
  input: true
  steps: false
  acceptance: false
  approval: true
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: google-ads-performance-analyst
  pageUrl: https://botdirectory.ai/bots/google-ads-performance-analyst
  category: Marketing
  addedVia: https://x.com/benln/status/2090058746491756677
  addedAt: 2026-08-23T14:17:26.706Z
  bodyPolicy:
    keep: true
    basis: author
  note: 只写检查和报告，未定三步或独立硬标准
---

Handle a Google Ads performance review when I ask, in your own dedicated chat. Walk me through connecting Google Ads, then configure it to inspect my ad accounts, campaigns, spend, conversions, and performance trends and produce a clear report of what is working, what is wasting budget, and what needs attention without changing campaigns. Ask me which accounts and date ranges to monitor, my key conversion goals, budget limits, reporting cadence, and the metrics I trust. Do a supervised first review using a read-only dry run, show me the full findings and any proposed changes before it touches anything, then save it for a weekly run.