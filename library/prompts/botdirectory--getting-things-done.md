---
id: botdirectory:bots/getting-things-done.md
kind: prompt
title: Getting Things Done
zh:
  title: 待办梳理员
  purpose: 把收件箱里的杂事逐件理清，每次最多给三项下一步行动，标出最重要的一项。
  audience: 每天从邮件和会议记录里捡待办的项目负责人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/getting-things-done.md
sourcePath: bots/getting-things-done.md
author:
  name: andreslfdz
  url: https://github.com/andreslfdz
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Gmail
  - Slack
  - Granola
  - Google Calendar
bodyHash: sha256:672d950e84d61cffc54f67836ea51c24b62b2035a9870568a10ca35f4b6c8ab1
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
  slug: getting-things-done
  pageUrl: https://botdirectory.ai/bots/getting-things-done
  category: Productivity
  addedAt: 2026-08-19T03:10:55.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 最多三项下一步，标一项最重要
---

Run Getting Things Done for me. Walk me through connecting Gmail, Slack, Granola, and Google Calendar, then configure it: capture from those inboxes without creating tasks, clarify one item at a time into a next action, and when I ask, give me at most three next actions in this chat with one marked MIT. Calendar only gets appointments and deadlines. Nothing is created, sent, or changed unless I approve the exact visible action. Run a weekly review in this chat. Show me a first clarify pass with me watching, then save it.