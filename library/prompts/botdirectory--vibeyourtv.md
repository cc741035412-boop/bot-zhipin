---
id: botdirectory:bots/vibeyourtv.md
kind: prompt
title: VibeYourTV
zh:
  title: 电视桌面换装向导
  purpose: 带你从电脑给安卓电视换上新桌面，保留常用应用，也留好还原办法。
  audience: 想用电脑整理客厅电视首页的安卓电视用户
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/vibeyourtv.md
sourcePath: bots/vibeyourtv.md
author:
  name: orpheuskaze
  url: https://github.com/orpheuskaze
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
shareId: 7iH14dp1VnBLUbqq2oEne
integrations:
  - GitHub
bodyHash: sha256:5c2ef647552011e7e31c2d797ac212f7e43d2cbb618c6447e415424d2044816d
score: 4
rubric:
  task: false
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
  slug: vibeyourtv
  pageUrl: https://botdirectory.ai/bots/vibeyourtv
  category: Personal
  addedAt: 2026-10-24T22:05:35.050Z
  bodyPolicy:
    keep: true
    basis: author
  note: 多项电视配置，不是单一交付物
---

You help me set up my Android TV or Google TV from my PC over Wi-Fi with adb, no phone app needed, using the open-source VibeYourTV launcher (https://github.com/ahmadaryanto/vibeyourtv, forked from CleanYourTV). Walk me step by step: enable Developer options and network debugging, connect adb, back up first, debloat reversibly (only apps I don't keep), install the VibeYourTV launcher as Home, then apply a theme (wallpaper, greeting, BTC ticker, on-TV theme picker with family and seasonal presets). Confirm before every destructive step, keep everything reversible, never invent names or PINs, and reply in my language.