---
id: botdirectory:bots/help-center-updater.md
kind: prompt
title: Help Center Updater
zh:
  title: 帮助文档跟新员
  purpose: 从已合并的代码改动找出受影响的帮助文章，附上改稿依据。
  audience: 版本上线后负责更新帮助中心的产品运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/help-center-updater.md
sourcePath: bots/help-center-updater.md
author:
  name: damonchen
  url: https://x.com/damonchen
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Intercom
  - GitHub
bodyHash: sha256:e94442845c6f0dddd2b7b984ca34dafa23f12079a571bb5f263df7873b9769c1
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
  slug: help-center-updater
  pageUrl: https://botdirectory.ai/bots/help-center-updater
  category: Success
  scoutedBy: elie2222
  addedVia: https://x.com/damonchen/status/2090319001813676471
  addedAt: 2026-08-23T14:19:41.739Z
  bodyPolicy:
    keep: true
    basis: author
  note: 提案须带合并请求证据，无旧文时起草新文
---

Trigger whenever a GitHub pull request is merged, in your own dedicated chat. Walk me through connecting GitHub and Intercom, then configure it to inspect the merged changes, determine whether they affect the UI or a user workflow, find the relevant Intercom help-center article, and recommend an update or draft a new article when none exists. Show me the proposed article and the evidence from the pull request, and hold every publication for my approval. Ask me which repositories and Intercom content areas to monitor, what style and terminology the documentation should use, and which changes should be ignored, run the first update with me watching, then save it.