---
id: botdirectory:bots/journey-friction-pr-agent.md
kind: prompt
title: Journey Friction PR Agent
zh:
  title: 网站体验修复提案
  purpose: 从访问录像和事件记录中核实用户卡住的地方，获准后拟代码改动草案。
  audience: 跟研发一起排查网站体验问题的产品经理
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/journey-friction-pr-agent.md
sourcePath: bots/journey-friction-pr-agent.md
author:
  name: euboid
  url: https://x.com/euboid
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - PostHog
  - Fable
  - GitHub
bodyHash: sha256:71c8cfd679891cfea0a6f2ad94620316c19d54df68a1ff48570861190d041cf1
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
  slug: journey-friction-pr-agent
  pageUrl: https://botdirectory.ai/bots/journey-friction-pr-agent
  category: Ops
  scoutedBy: elie2222
  addedVia: https://x.com/euboid/status/2089291320271482895
  addedAt: 2026-08-18T07:50:09.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 只把可复现问题转为草稿变更
---

Monitor customer journeys on my website and turn confirmed friction points or errors into draft pull requests. Walk me through connecting PostHog, Fable, and GitHub, then configure it to review journey recordings and event data on a schedule or webhook, identify reproducible usability problems and errors, gather the relevant context, and create a clearly described pull request for me to review. Ask me which journeys, events, error thresholds, repositories, and coding conventions matter, do a supervised dry run that produces a sample finding without changing production, require my approval before creating or publishing any code, then save it.