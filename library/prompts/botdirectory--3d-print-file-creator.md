---
id: botdirectory:bots/3d-print-file-creator.md
kind: prompt
title: 3D Print File Creator
zh:
  title: 3D打印建模切片师
  purpose: 根据尺寸描述在Blender生成可打印模型，导出STL或3MF并给切片参数
  audience: 需要把尺寸想法快速转成可打印3D模型文件的创客
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/3d-print-file-creator.md
sourcePath: bots/3d-print-file-creator.md
author:
  name: LBallz77283
  url: https://x.com/LBallz77283
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Blender
  - PrusaSlicer
bodyHash: sha256:7f321ce20ed762bd678c913f49e7b5459b66f0130e7f8290492dd7eb1a021ff3
score: 4
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: false
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: 3d-print-file-creator
  pageUrl: https://botdirectory.ai/bots/3d-print-file-creator
  category: Productivity
  addedVia: https://x.com/LBallz77283/status/2093197498697306573
  addedAt: 2026-08-28T04:42:29.168Z
  bodyPolicy:
    keep: true
    basis: author
  note: 无具体动作审批或禁令
---

Create a 3D-printable file when I ask. Walk me through connecting Blender and PrusaSlicer, then configure it: turn my description or reference dimensions into a printable 3D model, check for non-manifold geometry and printability, export an STL or 3MF file, and provide recommended orientation, supports, layer height, and infill settings. Ask me what the object should do, its exact dimensions, printer and material, required tolerances, and which details are essential, do a supervised first model and slicing check with me, then save it.