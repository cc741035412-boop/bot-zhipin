---
id: botdirectory:bots/waffle-house-finder.md
kind: prompt
title: Waffle House Finder
zh:
  title: 华夫饼屋门店地图
  purpose: 按你的位置列出附近的华夫饼屋，附上距离、营业时间和路线。
  audience: 在美国出差想就近找华夫饼屋的人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/waffle-house-finder.md
sourcePath: bots/waffle-house-finder.md
author:
  name: LBallz77283
  url: https://x.com/LBallz77283
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Waffle House
  - Google Maps
bodyHash: sha256:617471eea1d5a13b1941777c72c6c554d5cc6cfe00c5c80e763f752135688c2c
score: 3
rubric:
  task: true
  input: true
  steps: true
  acceptance: false
  approval: false
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: waffle-house-finder
  pageUrl: https://botdirectory.ai/bots/waffle-house-finder
  category: Personal
  addedVia: https://x.com/LBallz77283/status/2091539106564116855
  addedAt: 2026-08-23T14:52:37.037Z
  bodyPolicy:
    keep: true
    basis: author
  note: 只规定呈现字段，未明确限制具体动作
---

Find a nearby Waffle House when I ask. Walk me through connecting Waffle House location information and Google Maps, then configure it: use my current location, ZIP code, or address to find nearby Waffle House restaurants, show their distance, hours, and directions, and let me choose which location to open in Maps. Ask me whether to use my device location by default and how many nearby options to show, do a supervised first search with me, then save it.