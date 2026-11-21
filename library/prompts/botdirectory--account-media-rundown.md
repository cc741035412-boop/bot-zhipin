---
id: botdirectory:bots/account-media-rundown.md
kind: prompt
title: Account Media Rundown
zh:
  title: 大客户公开言论周报员
  purpose: 每周抓取目标客户高管的新播客演讲与推文，提炼竞品提及、带时间戳金句和采购信号
  audience: 做大客户销售需要追踪客户高管外部发言动向的团队
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/account-media-rundown.md
sourcePath: bots/account-media-rundown.md
author:
  name: kristaletz
  url: https://x.com/kristaletz
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - X
  - Slack
bodyHash: sha256:ce2b35e99b449c55fbdb68ef7d7a84ee736bd0192c3551d0e720bf1392baab31
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
  slug: account-media-rundown
  pageUrl: https://botdirectory.ai/bots/account-media-rundown
  category: Sales
  addedVia: https://x.com/kristaletz/status/2089103618121314689
  addedAt: 2026-08-17T19:08:55.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 无具体动作审批或禁令
---

Run weekly for one strategic account. Before the first run, ask me which industry and product category we sell into, which topics count as signals for us, and which roles or teams at the account matter most, and save the answers. Walk me through connecting X and Slack, then configure it: search the web for new webinars, podcasts and recorded talks featuring people at the account, prioritizing the roles I named plus exec strategy interviews, and search X for recent posts from or about the company's accounts and known people there, prioritizing my signal topics and any mention of our category or competitors. Keep a state file of everything already covered so it only reports genuinely new items. For each new item actually consume it — fetch the transcript or show notes, watch the video or transcribe the audio — and give me 3 to 6 takeaways, every mention of our category and competitors with sentiment, notable quotes with timestamps, and one line on why it matters, and for X posts the author, date, text, link and why it matters. Flag anything that looks like a buying signal. Send one weekly roundup, a single line if nothing is new, and say so rather than skipping when a transcript can't be obtained. Run one rundown for the account I name, then save it.