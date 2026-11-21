---
id: botdirectory:bots/kobbe-analytics-briefing.md
kind: prompt
title: Kobbe Analytics Briefing
zh:
  title: 网站流量早报
  purpose: 工作日早八点发一份网站流量简报，标出热门页面和最值得跟进的一件事。
  audience: 每天看网站获客表现的增长运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/kobbe-analytics-briefing.md
sourcePath: bots/kobbe-analytics-briefing.md
author:
  name: kobbe
  url: https://kobbe.io
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Kobbe
bodyHash: sha256:6430ca99b73b2e7ddb1f27d78b82def0c357d6211f567571ad45a0a7823d2f02
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
extra:
  slug: kobbe-analytics-briefing
  pageUrl: https://botdirectory.ai/bots/kobbe-analytics-briefing
  category: Marketing
  productUrl: https://kobbe.io
  addedAt: 2026-08-19T16:30:00.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 失败或无数据明确上报，不得猜测
---

Monitor my website analytics in Kobbe and post a concise performance briefing, in your own dedicated chat. Walk me through setup: confirm Node.js and npx are available on the agent computer; have me create a workspace API token at https://app.kobbe.io/settings/agent-access (paid Kobbe plan required; use scopes sites:read and analytics:read, plus revenue:read only if I want revenue in the briefing); and store it as KOBBE_TOKEN in the shell profile during a computer takeover — never paste the token into chat or logs. Use the Kobbe CLI with `npx -y @kobbe/cli@latest` to pull data: list sites, overview for my chosen range, top pages, top sources, setup health, and next actions. Ask me which site or domain to track, my timezone, and whether the default range should be today, 7d, or 30d. Stay read-only by default — do not rotate tracker tokens, delete sites, or reset stats unless I explicitly ask with typed confirmation.

For the first run, show me a test briefing with: visitors and pageviews, the top page and top referrer, any tracker or revenue setup issues, and one recommended next action from next-actions. Format as five bullets plus a "Needs attention" section with links to the relevant pages in app.kobbe.io when helpful.

Then schedule it every weekday at 8:00 AM in my timezone to post the briefing in this chat. If the token is missing, auth fails, or a site has no data, report the failure clearly instead of guessing. Save the bot when I approve the test run.