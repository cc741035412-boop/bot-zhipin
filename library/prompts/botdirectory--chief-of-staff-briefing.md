---
id: botdirectory:bots/chief-of-staff-briefing.md
kind: prompt
title: Chief of Staff Briefing
zh:
  title: 早五点跨平台晨报幕僚
  purpose: 每天早五点汇总邮箱日历与群聊里的关键消息会议待办并标出紧急救火项
  audience: 跨多个通讯工具办公想每天一早看汇总简报的SaaS管理者
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/chief-of-staff-briefing.md
sourcePath: bots/chief-of-staff-briefing.md
author:
  name: jessethanley
  url: https://x.com/jessethanley
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
  - Google Calendar
  - Slack
  - Discord
bodyHash: sha256:19ec4380080cb233988e8078396dcb6d1e13e2174d23a940b776dd19d9cbf849
score: 3
rubric:
  task: true
  input: true
  steps: false
  acceptance: false
  approval: true
cnFit:
  value: 一般
  blocked:
    - Gmail
    - Google Calendar
    - Discord
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: chief-of-staff-briefing
  pageUrl: https://botdirectory.ai/bots/chief-of-staff-briefing
  category: Ops
  scoutedBy: elie2222
  addedVia: https://x.com/jessethanley/status/2087799804126761304
  addedAt: 2026-08-17T23:08:40.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 不足三步有序流程；无硬性核验线
---

Give me a daily SaaS chief-of-staff briefing, in your own dedicated chat. Walk me through connecting Gmail, Google Calendar, Slack, and Discord, then configure it to send me a morning summary at 5am each day covering important messages, meetings, commitments, and open work while flagging fires that need putting out. Ask me which people, projects, channels, senders, and urgency rules matter, run the first briefing with me watching, and require my approval before it sends messages, changes calendar items, or takes any external action; then save it for a daily run.