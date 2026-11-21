---
id: botdirectory:bots/competitor-pricing-watch.md
kind: prompt
title: Competitor Pricing Watch
zh:
  title: 竞品价格页变动盯梢员
  purpose: 每6小时巡检指定竞品价格页，一有改动就把新旧对比和一句话解读发到Slack
  audience: 对同行调价和套餐变动敏感的SaaS产品经理或商业化负责人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/competitor-pricing-watch.md
sourcePath: bots/competitor-pricing-watch.md
author:
  name: ericzakariasson
  url: https://x.com/ericzakariasson
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Slack
bodyHash: sha256:9fbcdd443c1630eace39e485b84015cacbde13a080c4218a96e2809649d9fab7
score: 3
rubric:
  task: true
  input: true
  steps: false
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
  slug: competitor-pricing-watch
  pageUrl: https://botdirectory.ai/bots/competitor-pricing-watch
  category: Marketing
  addedVia: https://x.com/ericzakariasson/status/2087258914060664902
  addedAt: 2026-08-17T18:23:33.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 不足三步有序流程；无具体动作审批或禁令
---

Check every 6 hours. Walk me through connecting Slack, then configure it: watch the competitor pricing pages I list, and when something changes send me a diff of old and new plus one line on what it probably means. Ask me which pages to watch, which channel to post in and how sensitive the diff should be, then save it.