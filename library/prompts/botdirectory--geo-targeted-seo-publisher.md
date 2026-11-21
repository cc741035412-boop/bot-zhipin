---
id: botdirectory:bots/geo-targeted-seo-publisher.md
kind: prompt
title: Geo-Targeted SEO Publisher
zh:
  title: 本地搜索文章编辑
  purpose: 按指定城市和关键词写好文章，连同拟提交的网站改动一起送审。
  audience: 给不同城市的门店做搜索内容的运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/geo-targeted-seo-publisher.md
sourcePath: bots/geo-targeted-seo-publisher.md
author:
  name: coreyganim
  url: https://x.com/coreyganim
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - GitHub
bodyHash: sha256:e22447667f4cbf5d2bc9f7dc12bdffcdeddb7177cb730f6da6338293fd099cda
score: 4
rubric:
  task: true
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
  slug: geo-targeted-seo-publisher
  pageUrl: https://botdirectory.ai/bots/geo-targeted-seo-publisher
  category: Marketing
  scoutedBy: elie2222
  addedVia: https://x.com/coreyganim/status/2092284619991482842
  addedAt: 2026-08-26T11:52:45.401Z
  bodyPolicy:
    keep: true
    basis: author
  note: 编辑验收规则未写实
---

Handle a new local SEO article when I ask. Walk me through connecting GitHub and my site's publishing workflow, then configure it to research and draft a geo-targeted article for the location and topic I provide, apply my SEO and editorial rules, commit the approved article to the appropriate GitHub repository, and publish it through the configured workflow. Ask me which locations, services, keywords, tone, article format, repository, and publishing rules to use, do the first article as a dry run, show me the complete article and proposed Git changes before they are committed or published, then save it.