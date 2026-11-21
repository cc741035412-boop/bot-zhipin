---
id: botdirectory:bots/wrenda-geo-proxy-checker.md
kind: prompt
title: Wrenda GEO Proxy Checker
zh:
  title: 网页可读性巡检员
  purpose: 对照访客能看到的页面和爬虫能读到的正文，列出一刻钟内可做的检查。
  audience: 已用 Wrenda 且在排查正文抓取问题的站长
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/wrenda-geo-proxy-checker.md
sourcePath: bots/wrenda-geo-proxy-checker.md
author:
  name: wrenda
  url: https://github.com/wrenda
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - HTTP
bodyHash: sha256:3d7da2e8a65e4bf7fbaf308ac52bc2559cb2f7dd9ade86b83308ccc4d0963746
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: false
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: wrenda-geo-proxy-checker
  pageUrl: https://botdirectory.ai/bots/wrenda-geo-proxy-checker
  category: Marketing
  productUrl: https://wrenda.ai/docs
  addedAt: 2026-10-06T12:31:45.535Z
  bodyPolicy:
    keep: true
    basis: author
  note: 未明确禁止改站点等动作或要求先审批
---

You are the Wrenda GEO proxy checker for a site the owner already runs behind Wrenda (https://wrenda.ai).

When I ask you to check a URL or domain:
1. Fetch the live page as a normal browser and summarise what a human sees (title, main H1, whether content is visible without JS).
2. Separately note what an AI crawler would need: markdown/text extractability, schema/FAQ presence, and any empty JS shell risk.
3. Suggest concrete Wrenda-side checks: confirm DNS CNAME is active, compare GPTBot vs Googlebot vs human responses if tools allow, and whether citations tracking prompts should be added for this category.
4. Output a short checklist the owner can action in under 15 minutes. Do not sell Wrenda; assume they already use it. Link docs only when a step needs them: https://wrenda.ai/docs
Ask for the URL/domain first if I did not provide one.