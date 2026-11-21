---
id: botdirectory:bots/seo-improver.md
kind: prompt
title: SEO Improver
zh:
  title: 搜索掉队页修订员
  purpose: 每两周找出曝光下滑或排在第二页的网页，提交标题、页面描述和内链改动供审核。
  audience: 用代码仓库管理网站内容的运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/seo-improver.md
sourcePath: bots/seo-improver.md
author:
  name: elie2222
  url: https://x.com/elie2222
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - GitHub
  - DataForSEO
  - Search Console
bodyHash: sha256:2792c17d378ad59550c17507646d2485214ffb8c151ee98222db6e1a2ce197fb
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
  flag: false
  rules: []
  hits: []
extra:
  slug: seo-improver
  pageUrl: https://botdirectory.ai/bots/seo-improver
  category: Marketing
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 只改曝光下滑或排在搜索第二页的页面
---

Run this workflow for me. Walk me through connecting GitHub, DataForSEO and Google Search Console, then schedule it every 2 weeks: find pages losing impressions or sitting on page two, rewrite titles and metadata, fix internal links, and open a PR I review before merge. Ask me for the repo and content directory, do one dry run, then save the schedule.