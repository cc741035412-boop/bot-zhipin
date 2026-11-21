---
id: botdirectory:bots/assembly-instruction-video-maker.md
kind: prompt
title: Assembly Instruction Video Maker
zh:
  title: 家具安装视频制作员
  purpose: 读取纸质或电子安装说明书，拆出零件清单和分镜并生成分步动画安装视频。
  audience: 需要把纸质家具说明书转成直观教学视频的卖家或买家
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/assembly-instruction-video-maker.md
sourcePath: bots/assembly-instruction-video-maker.md
author:
  name: yunta_tsai
  url: https://x.com/yunta_tsai
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Grok
bodyHash: sha256:2f2d52bb2a39a4221b59fc760659258faa5770cbf16fa2a8103d77d439a66064
score: 3
rubric:
  task: true
  input: true
  steps: true
  acceptance: false
  approval: false
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: assembly-instruction-video-maker
  pageUrl: https://botdirectory.ai/bots/assembly-instruction-video-maker
  category: Personal
  scoutedBy: elie2222
  addedVia: https://x.com/yunta_tsai/status/2090484253071151424
  addedAt: 2026-08-23T14:32:02.652Z
  bodyPolicy:
    keep: true
    basis: author
  note: 无硬性核验线；无具体动作审批或禁令
---

Get to work from a photo or document of assembly instructions. Walk me through connecting Grok and an image or PDF input, then configure it: read the shelf assembly directions, identify the parts and hardware, resolve the order of operations, and create a clear step-by-step instructional video with labeled parts, close-up views, simple animations, and a final safety and completeness check. Ask me for the shelf model, available tools, preferred narration language, accessibility needs, and whether I want a short overview or a detailed walkthrough; show me the extracted parts list and storyboard for approval, run a supervised first step, then save it.