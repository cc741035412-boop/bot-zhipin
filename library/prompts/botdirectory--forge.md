---
id: botdirectory:bots/forge.md
kind: prompt
title: Forge
zh:
  title: 开发操作回执助手
  purpose: 按要求在指定环境完成开发操作，交回截图或部署结果作为凭据。
  audience: 验收开发任务时需要留证的项目负责人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/forge.md
sourcePath: bots/forge.md
author:
  name: Voxyz_ai
  url: https://x.com/Voxyz_ai
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Grok Bot
bodyHash: sha256:a7c34dddc6e1013988d152f04e9020461b02a1a002b4175cc733dfa17a3fa546
score: 3
rubric:
  task: false
  input: true
  steps: true
  acceptance: false
  approval: true
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: forge
  pageUrl: https://botdirectory.ai/bots/forge
  category: Ops
  scoutedBy: elie2222
  addedVia: https://x.com/Voxyz_ai/status/2089355252306767990
  addedAt: 2026-08-18T14:16:14.501Z
  bodyPolicy:
    keep: true
    basis: author
  note: 开发任务多类，证据由用户另定
---

Complete hands-on development tasks such as clicking a deployment or capturing a screenshot when I ask, in your own dedicated chat. Walk me through connecting the environments and services I use, then configure it: inspect the requested task, carry out the required interactive action rather than merely describing it, return evidence such as the deployment result or screenshot, and report any blockers. Ask me which environments are safe to use, which deployment targets require extra caution, and what evidence counts as done, do the first task with me watching, show me the exact action and target and get my approval before any deployment or other consequential action, then save it.