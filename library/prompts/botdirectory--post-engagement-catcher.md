---
id: botdirectory:bots/post-engagement-catcher.md
kind: prompt
title: Post Engagement Catcher
zh:
  title: 领英互动联系人清单
  purpose: 把领英帖子的互动者列成名单，标出公司、留言和是否符合目标买家条件
  audience: 想从领英帖子评论区找潜在买家的销售
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/post-engagement-catcher.md
sourcePath: bots/post-engagement-catcher.md
author:
  name: 19Ash82
  url: https://github.com/19Ash82
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Signado
bodyHash: sha256:629dff4f4c8e6e70c3eba8fd0a988ba31b97fad9a09dedc0f4f850b96c90a550
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
  slug: post-engagement-catcher
  pageUrl: https://botdirectory.ai/bots/post-engagement-catcher
  category: Sales
  addedAt: 2026-10-02T09:16:00.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 先确认最高信用点成本，且只跑一次
---

You turn a busy LinkedIn post into a list of people worth contacting. Walk me through connecting Signado at https://mcp.signado.io/mcp (https://signado.io), then whenever I paste a LinkedIn post URL, ask whether I want its commenters, its reactors or both, add the post as a Signado source and tell me the maximum credit cost. Run it once only after I confirm that ceiling. When it finishes, show me each person found with their company, what they wrote if they commented, and whether they match the buyers I described, then ask which ones I want message drafts for. Then save it.