---
id: botdirectory:bots/on-brand-card-designer.md
kind: prompt
title: On-Brand Card Designer
zh:
  title: 品牌配图排版员
  purpose: 把文案和截图填进选定的品牌模板，按发布渠道需要的尺寸和格式导出配图。
  audience: 要给产品更新配品牌图的社交媒体运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/on-brand-card-designer.md
sourcePath: bots/on-brand-card-designer.md
author:
  name: elie2222
  url: https://x.com/elie2222
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Monocards
  - Claude Desktop
  - Claude Code
bodyHash: sha256:d46d0289105acd5b36dac8c4f134d6c7b62fc8830298864ec804d45fff8c3bba
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
  slug: on-brand-card-designer
  pageUrl: https://botdirectory.ai/bots/on-brand-card-designer
  category: Marketing
  addedVia: https://x.com/elie2222/status/2090354398652252209
  productUrl: https://t.co/k2JXHyqr4U
  addedAt: 2026-08-23T14:19:02.951Z
  bodyPolicy:
    keep: true
    basis: author
  note: 沿用锁定模板，不改设计，导出前审批
---

Create on-brand visual cards for my social media and product updates when I ask, in your own dedicated chat. Walk me through connecting Monocards through its local MCP server, then configure it: let me choose one of my locked templates, provide the content and any screenshots or data, fill the template using my saved fonts, colors, layout, and brand rules, and export the card in the right format for the intended channel without inventing branding or changing the design. Ask me which channels and card types I use, what brand rules and templates are sacred, what output sizes and file formats I need, and where exported files should go; do a supervised first card as a dry run, show me the finished visual for approval before export or publication, then save it for future on-demand runs.