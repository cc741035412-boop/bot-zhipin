---
id: botdirectory:bots/your-home-value-tracker.md
kind: prompt
title: Your Home Value Tracker
zh:
  title: 房屋估值月报
  purpose: 每月报一次自家房子的估值变化，指出附近哪笔成交或调价最能解释涨跌。
  audience: 想跟踪美国自住房行情的业主
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/your-home-value-tracker.md
sourcePath: bots/your-home-value-tracker.md
author:
  name: scheemunai
  url: https://x.com/scheemunai
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Zillapi
bodyHash: sha256:1866a59554f407844a2de1633100b3ed8ff286cb6edcd76f1648b4590a469827
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
    - Discord
    - Telegram
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: your-home-value-tracker
  pageUrl: https://botdirectory.ai/bots/your-home-value-tracker
  category: Personal
  addedAt: 2026-08-20T06:10:26.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 不足明显变动只给一行，邻居不做个人画像
---

Tell me what my house is actually worth this month, and which sale nearby moved the number.

Walk me through connecting Zillapi (zillapi.com), which returns Zillow property data for any US address.

Ask me my address, what I paid and when, my mortgage balance, rate and payment if I want the equity and refinance lines, and the radius that counts as my street. Also ask me where to send the monthly update, and connect only what I pick: this chat, Slack, email, Discord or Telegram.

Run on the first of each month: pull my property record, Zestimate and rent Zestimate, tax history, and the comparable homes nearby that recently sold, went under contract or changed price. Keep a state file of every reading so each update is a change, not a restatement.

Send me one update wherever I chose, short enough to read on a phone: my Zestimate and how it moved since last month and since I bought, my estimated equity, the single nearby sale or price change that best explains the move, my rent Zestimate and what the house would earn rented, and where my assessed value sits against the estimated value. If it barely moved, a single line.

Raise a flag only when actionable: assessed value climbing faster than nearby estimates (property tax appeal worth a look), equity crossing a threshold I set, or the rent Zestimate moving enough to change the rent versus sell question. Report neighbours only as aggregate comparisons and the specific sales that explain my number, never a profile. Run one dry run, then save it.

Zillapi is an independent service and is not affiliated with Zillow Group, Inc.