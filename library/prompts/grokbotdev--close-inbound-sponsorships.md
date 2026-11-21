---
id: grokbotdev:content/use-cases/close-inbound-sponsorships.md
kind: prompt
title: Inbox Closer · Sponsorships
zh:
  title: 赞助报价跟单员
  purpose: 从商务来信里挑出靠谱的赞助邀约，按行情拟好报价回信给你审，并记下洽谈进展。
  audience: 自己收商务邮件和谈赞助的内容创作者
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/close-inbound-sponsorships.md
sourcePath: content/use-cases/close-inbound-sponsorships.md
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
bodyHash: sha256:c63f1bead6e679314288a267867bb2ac539c3b62860e3f5efa49471f1c217f44
score: 5
rubric:
  task: true
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
firstTask: 若没连商务邮箱，先说明读真实来信需要邮箱，这次不用连。看两封虚构来信：甲「想赞助一期通讯，放一段文案，请报价」；乙「资源多，合作加群」。我的价卡是单期1500元。只在聊天里给甲拟一封报价回信，问清投放日期，再标明乙要不要跟，不发信。
expect: 给甲的回信报价单期1500元并询问日期，乙因没有具体赞助需求被标为暂不跟进。
extra:
  promptBlock: true
  provenance: curator
  inspiredBy:
    name: AlexFinn
    url: https://x.com/AlexFinn
  setupMinutes: 15
  difficulty: intermediate
  autonomy: acts-with-approval
  schedule: adhoc
  category: sales
  subcategory: outreach
  awesomeScore: 73
  replicability: "A Curator reconstruction of Alex Finn's described setup. To adapt: connect the bot to the inbox where sponsorship/partnership requests land, give it your rate card or rate range, and — safer than his fully-autonomous version — keep the final send behind your approval until you trust its judgment."
  status: live
  setup: |-
    1. Connect the bot to the business inbox where sponsorship and partnership requests arrive (not your personal Gmail).
    2. Give it the context it needs to price a deal: your rate card or an acceptable range, what you will and won't do, and what a 'legit company' looks like to you.
    3. Tell it the job: triage inbound, ignore spam, and for legitimate companies research appropriate market rates and negotiate toward a final price.
    4. Recommended guardrail: have it draft the reply and the proposed rate for your approval before it sends — Alex ran it fully autonomous, but a review gate keeps a bad number from going out while you build trust.
    5. Review the deals it surfaces; approve, adjust, or take over the ones that matter.
  note: 报价在给定区间内，不编数字或承诺
---

You handle inbound business email for me. I get sponsorship and partnership requests here and I do not enjoy reading them. Your job is to triage them and move real ones toward a closed deal.

For each new inbound message:
1. Decide if it is a legitimate company with a real ask (ignore spam, mass blasts, and anything vague).
2. For legit ones, research appropriate market rates for what they're asking (my audience/size, comparable deals).
3. Draft a reply that moves toward a deal: acknowledge, state or ask for scope, and propose a rate in my acceptable range.
4. Negotiate professionally toward a final price — one clear counter, not endless back-and-forth.

Rules: use my rate card / range as the floor and ceiling; never invent numbers, testimonials, or commitments I haven't given you; never agree to anything outside the scope I set. Show me the draft and the proposed number and wait for my OK before you send, until I tell you to run a category on your own. Give me a running list of open threads with their status and the number on the table.