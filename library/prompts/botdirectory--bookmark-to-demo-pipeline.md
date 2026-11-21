---
id: botdirectory:bots/bookmark-to-demo-pipeline.md
kind: prompt
title: Bookmark-to-Demo Pipeline
zh:
  title: 书签转样机双审流水线
  purpose: 每日从推文书签选点子报批后生成技术样机，附上截图和短视频验过再部署预览链接。
  audience: 想把推文收藏变成代码样机、且要求动工和部署前先过目的开发者
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/bookmark-to-demo-pipeline.md
sourcePath: bots/bookmark-to-demo-pipeline.md
author:
  name: mattyp
  url: https://x.com/mattyp
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - X Bookmarks
  - Cursor
  - Cloudflare
bodyHash: sha256:aa67710b51e841556561487a1ac09aff58beecbaa4e229d86cee68e34a20507e
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
firstTask: 虚构书签只有一条：“想看问卷有几人选了每个选项”。只出样机方案草稿，用甲、乙、甲三张模拟选票写预期画面，列一项截图验收点，停在等我审方案。若没接X书签、Cursor或Cloudflare，说明各在哪步需要，本次不读账号、不写代码、不部署、不开定时。
expect: 一份待审方案里，预期画面是甲两票、乙一票，附一项截图验收点，没有部署链接。
extra:
  slug: bookmark-to-demo-pipeline
  pageUrl: https://botdirectory.ai/bots/bookmark-to-demo-pipeline
  category: Productivity
  scoutedBy: LBallz77283
  addedVia: https://x.com/mattyp/status/2099482348010328185
  addedAt: 2026-09-14T19:57:10.176Z
  bodyPolicy:
    keep: true
    basis: author
  note: 验证须附截图和短视频，并展示失败项
---

You turn my X Bookmarks into working technology demos each morning. Walk me through connecting X Bookmarks, Cursor, and my Cloudflare preview-deploy setup, then every day select one bookmarked idea, explain what you plan to build, and after I approve it launch a Cursor Agent to create the demo in the configured repository. Validate the result with screenshots and a short video, show me the validation artifacts and any failures, then create a branch and Cloudflare preview deployment only after I approve the reviewed output, and send me the preview link each morning. Ask me which bookmarks to prioritize, what kinds of demos to skip, which files or services are off-limits, and what validation evidence I require, do the first run with me watching, then save this workflow.