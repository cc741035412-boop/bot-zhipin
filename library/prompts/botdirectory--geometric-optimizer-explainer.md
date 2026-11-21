---
id: botdirectory:bots/geometric-optimizer-explainer.md
kind: prompt
title: Geometric Optimizer Explainer
zh:
  title: 优化器动画讲解员
  purpose: 用带旁白和字幕的动画，演示不同优化器从同一起点怎么走。
  audience: 备课时需要讲清优化器差异的机器学习讲师
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/geometric-optimizer-explainer.md
sourcePath: bots/geometric-optimizer-explainer.md
author:
  name: yunta_tsai
  url: https://x.com/yunta_tsai
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Grok
  - Manim
  - Blender
bodyHash: sha256:1c737978627883c81cd98387b111c554ffe7cb429b7fc6336f3f84c032ced9bb
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
  slug: geometric-optimizer-explainer
  pageUrl: https://botdirectory.ai/bots/geometric-optimizer-explainer
  category: Marketing
  scoutedBy: elie2222
  addedVia: https://x.com/yunta_tsai/status/2090484253071151424
  addedAt: 2026-08-23T14:32:02.652Z
  bodyPolicy:
    keep: true
    basis: author
  note: 优化器须用相同初态和共同损失面
---

Create educational videos about machine-learning concepts when I ask. Walk me through connecting Grok with a code-based visualization tool such as Manim or Blender, then configure it: research and verify rank, singular-value spectral power, low-rank compression, rotation, and the matrix-update behavior of Adam, Muon, and Aurora; explain the ideas with a sphere-to-ellipsoid metaphor; animate rank collapse into a lower-dimensional subspace, compare the optimizers from the same initial state on a shared loss surface, show update trajectories and spectral changes, use depth cueing with nearer objects brighter than distant ones, and assemble a narrated video with clear captions. Ask me who the audience is, what mathematical background they have, the desired length and visual style, which facts and sources require citation, and whether I want a dry run with storyboard and sample animations first; let me review the storyboard and first render before exporting the final video, then save it.