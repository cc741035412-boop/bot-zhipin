---
id: botdirectory:bots/short-form-content-creator.md
kind: prompt
title: Short-Form Content Creator
zh:
  title: 竖屏短片剪辑师
  purpose: 把素材里的看点剪成带字幕的竖屏成片，配好标题和简介，再给出发布时间建议。
  audience: 要把现有视频剪成竖屏内容的账号运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/short-form-content-creator.md
sourcePath: bots/short-form-content-creator.md
author:
  name: farzyness
  url: https://x.com/farzyness
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - YouTube
  - CapCut
bodyHash: sha256:1e87cd70084b2f9f9d42c6ba56a11f6d9bb9e3fe8fd05f98a71921fd85409f52
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: false
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
  slug: short-form-content-creator
  pageUrl: https://botdirectory.ai/bots/short-form-content-creator
  category: Marketing
  scoutedBy: elie2222
  addedVia: https://x.com/farzyness/status/2087340859138224540
  addedAt: 2026-08-18T12:30:30.143Z
  bodyPolicy:
    keep: true
    basis: author
  note: 只列成片样式和配套字段，无硬验收条件
---

Create short-form content when I ask. Walk me through connecting YouTube and CapCut, then configure it: review my source videos, identify the strongest moments, cut them into concise vertical Shorts with hooks, captions, titles, descriptions, and suggested posting times, and show me every finished cut before it is published. Ask me about my audience, voice, acceptable editing style, target platforms, preferred length, and topics to avoid, do the first batch with me watching, then save it.