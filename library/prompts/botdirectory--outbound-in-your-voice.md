---
id: botdirectory:bots/outbound-in-your-voice.md
kind: prompt
title: Outbound In Your Voice
zh:
  title: 客户联系信代笔
  purpose: 照着你以往的口吻给潜在客户写信，每天回报发了什么、为什么发。
  audience: 每天要给新客户写第一封联系信的销售
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/outbound-in-your-voice.md
sourcePath: bots/outbound-in-your-voice.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
  - LinkedIn
bodyHash: sha256:ad9e65c8a8f00958649eacdc5319dad310ce5a016e6126d1fb9a164bb8f420ff
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
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: outbound-in-your-voice
  pageUrl: https://botdirectory.ai/bots/outbound-in-your-voice
  category: Sales
  addedVia: https://x.com/ericzakariasson/status/2087258914060664902
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 外联与发送报告并列
---

Run this workflow for me. Walk me through connecting Gmail and LinkedIn, let it learn how I write from my sent mail, then schedule it daily: research each person, draft outbound in my voice, send from my account, and report what went out and why. Hold the first ten for my approval, then save it as a running bot.