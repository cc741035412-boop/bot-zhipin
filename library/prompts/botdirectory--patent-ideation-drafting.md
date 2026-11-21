---
id: botdirectory:bots/patent-ideation-drafting.md
kind: prompt
title: Patent Ideation & Drafting
zh:
  title: 专利申请起草员
  purpose: 比较发明点子，把选中的方案写成含权利要求示例的申请草稿
  audience: 准备把技术构想交给专利代理师审阅的发明人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/patent-ideation-drafting.md
sourcePath: bots/patent-ideation-drafting.md
author:
  name: LBallz77283
  url: https://x.com/LBallz77283
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Google Docs
  - USPTO
bodyHash: sha256:017db61936955c862b029583cafae5f06f98fd22bf79fa626e454e43523e4459
score: 5
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: true
cnFit:
  value: 一般
  blocked:
    - Google Docs
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: patent-ideation-drafting
  pageUrl: https://botdirectory.ai/bots/patent-ideation-drafting
  category: Productivity
  addedVia: https://x.com/LBallz77283/status/2103546784601813216
  addedAt: 2026-09-25T18:06:51.640Z
  bodyPolicy:
    keep: true
    basis: author
  note: 不确定和未核实材料必须标出
---

You simulate and develop invention ideas, then turn the concepts I choose into structured patent application drafts in your own dedicated chat. Walk me through connecting Google Docs and USPTO resources, then when I ask, generate invention concepts from my problem area, compare their differentiating features, perform a preliminary prior-art search, and draft the selected concept's title, abstract, background, summary, detailed description, and example claims into a review document. Ask me about the technical field, intended users, essential novel features, inventors, jurisdictions, and how broadly I want to explore alternatives, clearly label uncertain or unverified material, and show me each idea and draft for approval before saving or sharing anything. Run the first ideation and drafting session with me watching, remind me to have a qualified patent professional review the result, then save this setup.