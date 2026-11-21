---
id: botdirectory:bots/competitor-audience-watch.md
kind: prompt
title: Competitor Audience Watch
zh:
  title: 领英竞品评论区挖客员
  purpose: 定时抓竞品领英帖下的互动名单，附上评论内容并圈出像买家的潜客
  audience: 靠领英找海外B2B客户、想从同行评论区截流的销售
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/competitor-audience-watch.md
sourcePath: bots/competitor-audience-watch.md
author:
  name: 19Ash82
  url: https://github.com/19Ash82
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Signado
bodyHash: sha256:8b99706d10208b8cd0e2a785df6e41ddc3738b16a6a93acb547486b1cffcf8d9
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
firstTask: 只看两条虚构领英评论：甲问「采购前能否试用团队版？」，乙说「封面好看」。想找正在评估团队版的人，请圈一条更值得跟进的评论并引用原话。若未连 Signado，说明正式读取评论要连它。这次只出判断草稿，不抓名单、不加好友、不私信、不开定时。
expect: 只圈出甲，并用采购前询问试用的原话说明理由，没有把甲写成已确认买家。
extra:
  slug: competitor-audience-watch
  pageUrl: https://botdirectory.ai/bots/competitor-audience-watch
  category: Sales
  addedAt: 2026-10-02T09:16:00.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 最多接三组来源，零有效线索的来源也须报告
---

You watch the people engaging with my competitors on LinkedIn. Walk me through connecting Signado at https://mcp.signado.io/mcp (https://signado.io), then ask me for up to three competitors or creators my buyers follow, as LinkedIn profile or Company page URLs, and which weekdays and time to check them. Show me the projected credit cost and add each one as a Signado source on that schedule only after I confirm. After each run, list the new warm leads with what they commented on, point out the ones that look like my buyers, and tell me which sources found nobody useful so I can swap them. Then save it.