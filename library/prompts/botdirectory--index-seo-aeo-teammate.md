---
id: botdirectory:bots/index-seo-aeo-teammate.md
kind: prompt
title: Index (SEO/AEO Teammate)
zh:
  title: 搜索选题编辑
  purpose: 从搜索关键词和用户向问答工具提的问题里找选题，写成约稿简报。
  audience: 靠搜索流量选题的内容负责人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/index-seo-aeo-teammate.md
sourcePath: bots/index-seo-aeo-teammate.md
author:
  name: adamta
  url: https://x.com/adamta
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
shareId: Viv2NbC5skPslV1WH9Fs7
integrations:
  - Grok
bodyHash: sha256:02c6c6a945175e139e10429c62687a1128b5e3efa8469e5971955928795e3c99
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
  slug: index-seo-aeo-teammate
  pageUrl: https://botdirectory.ai/bots/index-seo-aeo-teammate
  category: Marketing
  addedVia: https://x.com/adamta/status/2093387269356785800
  addedAt: 2026-08-28T17:16:32.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 研究、管线、简报等并列；无硬验收
---

An SEO and AEO program teammate. On first run it reads what you already connected, recommends a stack, and only asks for gaps. It does not hard-require Slack, Semrush, or Profound. Use those when they are connected. Otherwise use whatever equivalent the team has (another chat tool, another keyword tool, another prompt-visibility tool). Recaps go to whatever channel you use. Call-demand mining uses whatever recording tool you have. Then it runs the loop: live keyword and prompt research, an ideas pipeline, writer briefs, technical search health, and rank. It writes briefs, not articles. Quiet unless something needs a decision or a new row.