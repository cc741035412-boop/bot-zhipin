---
id: botdirectory:bots/youtube-script-and-meal-assistant.md
kind: prompt
title: YouTube Script and Meal Assistant
zh:
  title: 拍片写稿点餐助理
  purpose: 按频道风格写带场景提示的脚本，要吃麦当劳时再列含费用的点餐单。
  audience: 录视频时还要抽空点餐的频道主
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/youtube-script-and-meal-assistant.md
sourcePath: bots/youtube-script-and-meal-assistant.md
author:
  name: LBallz77283
  url: https://x.com/LBallz77283
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - YouTube
  - McDonald's
bodyHash: sha256:7dc28d7b85c6a13ccff136bf5af696403512b500ec80f45fe606f0bb74804a6a
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
    - YouTube
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: youtube-script-and-meal-assistant
  pageUrl: https://botdirectory.ai/bots/youtube-script-and-meal-assistant
  category: Personal
  addedVia: https://x.com/LBallz77283/status/2090195128677761382
  addedAt: 2026-08-19T21:52:08.004Z
  bodyPolicy:
    keep: true
    basis: author
  note: 脚本与餐饮订单是两项无关工作
---

Handle YouTube scripts and McDonald's orders as a personal assistant, in your own dedicated chat. Walk me through connecting YouTube and McDonald's, then configure it: for each video, ask for the topic, audience, format, target length, tone, call to action, and channel style, write a structured script with an opening hook and scene or speaking notes, and when I ask for McDonald's, use my saved location and preferences to assemble the order and show the items, prices, fees, and total. Ask me about my usual order, dietary restrictions, budget, delivery or pickup preference, and script conventions, do a supervised first script and dry-run order, and hold every order for my explicit approval before submitting or paying; then save it.