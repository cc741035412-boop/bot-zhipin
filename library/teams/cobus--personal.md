---
id: cobus:teams/personal/team.yaml
kind: team
title: Personal
zh:
  title: 个人收件箱与日程守护组
  purpose: 分拣昨日以来的邮件并拟好回复草稿、为专注时段起草拒会信，同时列出闲置订阅。
  audience: 邮件和会议邀请扎堆、还想定期清理闲置扣费订阅的职场人
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/teams/personal/team.yaml
sourcePath: teams/personal/team.yaml
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
  - Google Calendar
  - Slack
bodyHash: sha256:e7cc4d1e1b5bfcf84b2f5408d435840c84cb84e256d1dacd3b966cd3da7489bc
score: 2
rubric:
  task: false
  input: true
  steps: false
  acceptance: false
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
  note: 邮件、日历、订阅并列，无流程或验收硬标准
---

id: personal
name: Personal
lead: inbox-triage
bots:
  - inbox-triage
  - calendar-defender
  - subscription-audit
why: >
  Inbox zero fails when mail, meetings, and unused subs are one Bot
  that is tempted to send, decline, and unsubscribe.
group_kickoff: >
  @Inbox Triage bucket mail since yesterday and draft unsent replies.
  @Calendar Defender protect deep-work blocks with decline drafts.
  @Subscription Audit list unused subscriptions for approval.
  Do not send. Do not delete. Do not change meetings. Do not
  unsubscribe.
plugins:
  - Gmail
  - Google Calendar
  - Slack
max_bots: 4
autonomy: L1