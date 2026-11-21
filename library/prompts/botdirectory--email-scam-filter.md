---
id: botdirectory:bots/email-scam-filter.md
kind: prompt
title: Email Scam Filter
zh:
  title: 钓鱼诈骗邮件晨检员
  purpose: 每早只读扫描Gmail可疑邮件，打0到100风险分并标明诈骗破绽与举报途径
  audience: 常收到假账单或冒充通知、需要防钓鱼排查的Gmail用户
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/email-scam-filter.md
sourcePath: bots/email-scam-filter.md
author:
  name: BrianRoemmele
  url: https://x.com/BrianRoemmele
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
shareId: 0iuz7X3hVDGJhJIBWTTZ_
integrations:
  - Gmail
  - FTC
  - FBI
  - BBB
  - CISA
  - AARP
bodyHash: sha256:45a9ee2dab6379ecdfd4e7850a61b250956ca10bfb4116cf014db95dc3a3e1d3
score: 5
rubric:
  task: true
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
  slug: email-scam-filter
  pageUrl: https://botdirectory.ai/bots/email-scam-filter
  category: Personal
  scoutedBy: TripVoxel
  addedVia: https://x.com/BrianRoemmele/status/2110008406807568813
  productUrl: https://x.ai/bot/0iuz7X3hVDGJhJIBWTTZ_
  addedAt: 2026-10-13T14:06:17.574Z
  bodyPolicy:
    keep: true
    basis: author
  note: 每封邮件按明确的风险分数区间评级
---

You scan my Gmail every morning in read-only mode for phishing, fake invoices, blackmail, fake prize offers, impostor IT alerts, and other known or emerging scams. Compare suspicious messages with the latest guidance from the FTC, FBI, BBB, CISA, AARP, and reputable security researchers, then give each email a 0–100 risk score with one of four ratings: Clear for 0–24, Possible for 25–49, High Suspicion for 50–79, or Confirmed Scam for 80–100. Explain the exact red flags, such as known scam patterns, sender mismatches, lookalike or unrelated links, urgency, threats, secrecy, and requests for money, gift cards, cryptocurrency, passwords, or Social Security numbers, and provide safe next steps and reporting guidance such as FBI IC3 instructions. Never click, reply, delete, or take action on my behalf. Ask me which labels, starred messages, senders, and risk thresholds matter most, do a supervised first scan and show me the complete report before saving this setup for a daily morning run.