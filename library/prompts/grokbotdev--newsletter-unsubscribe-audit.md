---
id: grokbotdev:content/use-cases/newsletter-unsubscribe-audit.md
kind: prompt
title: Detox · Newsletter Unsubscriber
zh:
  title: 订阅邮件体检官
  purpose: 扫半年邮件生成保留与退订两栏网页供勾选，确认后分批退订并实时更新进度表
  audience: 订阅了一堆周刊从不点开、想集中清理又怕误删重要通知的人
source: ZeroPointRepo/GrokBotDev
sourceUrl: https://github.com/ZeroPointRepo/GrokBotDev/blob/48fec858f3968e12cb149ad205fe4ff059d8f2d1/content/use-cases/newsletter-unsubscribe-audit.md
sourcePath: content/use-cases/newsletter-unsubscribe-audit.md
author:
  name: scheemunai
  url: https://x.com/scheemunai
license: CC-BY-4.0
attribution:
  by: GrokBot.dev contributors
  repo: ZeroPointRepo/GrokBotDev
  license: CC BY 4.0
  licenseUrl: https://creativecommons.org/licenses/by/4.0/
fetchedAt: 2026-11-21T06:44:43Z
changes: 只收「## Prompt」下代码块里的提示词原文，一字未改；原页面的设置步骤和点评没有收；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
bodyHash: sha256:46782171a6cab7a9bc53210aac50a47047c545aab1c88a3fd3bc6e9e720ec30d
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
  promptBlock: true
  provenance: author
  setupMinutes: 10
  difficulty: beginner
  autonomy: acts-with-approval
  schedule: adhoc
  category: work
  subcategory: email
  awesomeScore: 86
  replicability: "Paste the prompt as-is - it works on whatever email your bot can read. The review gate is structural: the bot builds the HTML list and stops until you decide. Transactional email is fenced off, and anything that demands a login or looks like a trap gets flagged, not clicked."
  status: live
  setup: |-
    Plenty of people have pointed a bot at a messy inbox and posted the body count - [6,000 emails and 40 lists](/use-cases/inbox-delete-unsub/), [150,000 junk emails](/use-cases/junk-purge-150k/). This is the careful version: a method with a review gate in the middle, so nothing you actually wanted disappears. First run: 76 newsletter signups gone, across multiple inboxes, after a 90-second review.

    1. **Connect your email** (Gmail or whatever your bot reads) and paste the prompt below.
    2. **Phase 1 - the audit.** The bot sweeps your recent mail, identifies every recurring newsletter and marketing sender, and builds a **simple HTML review page**: two sections - *consider keeping* vs *certainly unsubscribe* - each sender with frequency, whether you ever open it, and one line of reasoning. Transactional mail (receipts, security alerts, invoices) is excluded and untouchable.
    3. **You decide.** Skim the page, tell the bot what to keep. That's the whole human step.
    4. **Phase 2 - the slow purge.** The bot works through the approved list in the browser, a few senders at a time, using each sender's official unsubscribe link - and keeps a **dedicated progress file** (sender, method, status, date, notes) so you can check the state at any moment. Anything that fails or demands a login gets flagged to you, never forced.
    5. A week later it re-checks: senders that still arrive get one retry, then a flag.
  note: 排除交易邮件，每位发件人的进度单列
---

You are my newsletter Detox bot. Your job: get me off the mailing lists I don't want, without touching anything that matters. Work in two phases with a hard stop between them.

PHASE 1 - AUDIT (do this now, change nothing):
1. Go through my email from the last 6 months. Identify every recurring newsletter and marketing sender - use the List-Unsubscribe header, sender frequency, and content type to spot them.
2. EXCLUDE transactional mail entirely: receipts, invoices, security alerts, account notices, anything from services I actively use to operate. Those are untouchable and don't belong on the list.
3. Build a simple HTML review page at /workspace/detox/review.html with two sections:
   - CONSIDER KEEPING: newsletters I actually open or reply to, or that look genuinely useful.
   - CERTAINLY UNSUBSCRIBE: everything I never open, duplicates, cold marketing, and list spam.
   For each sender show: name, address, how often it mails me, roughly when I last opened one, and your one-line reason for the placement.
4. Share the page with me and STOP. Do not unsubscribe from anything until I've reviewed the list and told you my decisions.

PHASE 2 - EXECUTE (only after my go-ahead):
5. Work through the approved list SLOWLY - a handful of senders per session, not all at once. For each: use the official unsubscribe link (List-Unsubscribe or the link in the email footer) in the browser and complete the flow.
6. Keep a progress file at /workspace/detox/progress.md - one line per sender: name, method used, status (pending / done / failed / needs-me), date, and any notes. Update it after every attempt so I can check progress anytime.
7. Hard rules: never enter passwords or payment details to unsubscribe; never reply to emails to unsubscribe; if a flow demands a login, looks broken, or looks like a trap, mark it needs-me and move on. Never delete emails - this job is unsubscribing only.
8. After a week, re-check: if a sender I unsubscribed from still shows up, retry once, then flag it to me.

Start Phase 1 now.