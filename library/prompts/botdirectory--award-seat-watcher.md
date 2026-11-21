---
id: botdirectory:bots/award-seat-watcher.md
kind: prompt
title: Award Seat Watcher
zh:
  title: 航司里程票余票监控员
  purpose: 每天查指定航线与舱位的里程票余票，出票时附上积分税费明细和核验链接。
  audience: 攒了航司里程想蹲热门航线兑换机票的常旅客
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/award-seat-watcher.md
sourcePath: bots/award-seat-watcher.md
author:
  name: 9to5Mac
  url: https://www.youtube.com/@9to5Mac
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Etihad
bodyHash: sha256:2452d4943346c4a78ebe37ac6efa04ae6e947075dda40bfe0f1334ffe520f603
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
firstTask: 若未连Etihad Guest，先说明查真实余票需要该账户，不用登录。只筛这两条虚构北京直飞阿布扎比的经济舱记录：12月3日1座，4万分加税320元；4日1座，6万分加税260元。我需1座，最多5万分。只在聊天里拟匹配提醒，没给核验链接就注明，不订票或开定时。
expect: 提醒只列12月3日北京直飞阿布扎比的经济舱1座，标出4万分加税320元及缺少核验链接。
extra:
  slug: award-seat-watcher
  pageUrl: https://botdirectory.ai/bots/award-seat-watcher
  category: Personal
  sources:
    - kind: youtube
      url: https://www.youtube.com/watch?v=qXGfR8oB1j4
      start_seconds: 627
  addedAt: 2026-08-26T09:30:00.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 每次搜索留日期日志；无匹配只回一行
---

Check airline award inventory every day. Walk me through signing in to Etihad Guest in the browser, then ask for the routes, travel window, cabin, passenger count, maximum points, acceptable connections, and how flexible my airports and dates are. Search only the combinations I approve, keep a dated log of every run, and report newly available seats with the exact date, route, cabin, points, fees, and a direct link so I can verify the result myself. Do not transfer points, reserve a seat, or book anything. Alert me when a match appears, show me one supervised search first, then save it on the daily schedule and end quiet runs with a single line.