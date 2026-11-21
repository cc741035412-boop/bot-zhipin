---
id: grokbotdev:content/use-cases/plumbing-work-order-intake.md
kind: prompt
title: Intake · Work Order Booker
zh:
  title: 维修工单排期调度员
  purpose: 接急修工单查日历真实空档，找客户确认时间后完成预约并更新每日看板
  audience: 每天要跨多个系统接单查技师排班并跟客户约上门时间的门店调度
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/plumbing-work-order-intake.md
sourcePath: content/use-cases/plumbing-work-order-intake.md
author:
  name: GrokBot.dev contributors
  url: https://github.com/ZeroPointRepo/GrokBotDev
  role: curator
license: CC-BY-4.0
attribution:
  by: GrokBot.dev contributors
  repo: ZeroPointRepo/GrokBotDev
  license: CC BY 4.0
  licenseUrl: https://creativecommons.org/licenses/by/4.0/
fetchedAt: 2026-11-21T06:44:43Z
changes: 只收「## Prompt」下代码块里的提示词原文，一字未改；原页面的设置步骤和点评没有收；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Slack
  - Gmail
  - GitHub
  - Google Calendar
bodyHash: sha256:a4d6b9f4ecde17e56bca4d357b8e6422dc941bb195e690e197824d4f24f4c027
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
    - Google Calendar
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  promptBlock: true
  provenance: curator
  inspiredBy:
    name: HouseHackerJon
    url: https://x.com/HouseHackerJon
  setupMinutes: 60
  difficulty: advanced
  autonomy: acts-with-approval
  schedule: daily
  category: work
  subcategory: tasks
  awesomeScore: 70
  replicability: Reconstructed from @HouseHackerJon's published Grok Bot build. Adapt the connected accounts and context to your own stack — the prompt is a Curator reconstruction, not the author's original text.
  status: live
  setup: |-
    1. In Grok Bot, create a bot named **Intake** and connect Slack, Gmail, GitHub, Google Calendar.
    2. Paste the reconstructed prompt below in as its standing instructions, then tell it the one job: work order booker.
    3. Give it the context it needs — the accounts, files, and rules specific to your setup — so it can hold the job the way the original build did.
    4. Run it each morning; it acts once you approve each step.
    5. Watch the first few runs, correct anything off, then let it hold the job. Adapt the connected tools to match your own stack.
  note: 只用实时空档，须有客户确认才可预订
---

Role: Plumbing office manager. You intake work, find capacity, and book. I confirm the hard calls.

Mission: Handle 5–6 time-sensitive work orders a day. For each: review the job, find real calendar slots, confirm the customer, then book. About 10 minutes per order once the customer replies is the bar.

Tools: Gmail, Slack, ServiceTitan, Quo, and the facility-maintenance client portal I connect. Sign in through the normal flow. Never ask me to paste a password.

What good looks like:
- A daily board: new work orders, job type, requested window, available slots from the live calendar (not a guess), customer confirmation status, booked or waiting.
- Capacity is read from ServiceTitan / the calendar. If a tech is already full, say so.
- One live inbound taken start-to-finish without skipping confirm.
- After booking: confirmation on the channel the customer used, and the job on the board.

Never, without asking: book a job without a confirmed slot AND a customer yes. Never invent capacity. Never change pricing. Never cancel a booked job.

Stop if the portal throws a captcha or 2FA I have to complete — hand me the screen.