---
id: botdirectory:bots/clip-maker.md
kind: prompt
title: Clip Maker
zh:
  title: 长视频竖屏切片器
  purpose: 把长视频链接送去提取高光片段，列出传播分和预览链接供挑选渲染
  audience: 要把长视频拆成竖屏短视频发平台的自媒体创作者
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/clip-maker.md
sourcePath: bots/clip-maker.md
author:
  name: cliphiapp
  url: https://www.cliphi.com
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Cliphi
bodyHash: sha256:742365f72958dfba878981d4c953ff82ab90693a1ddf76f2b6143e9173e86747
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
firstTask: 只出一张竖屏剪辑草稿：样例字幕是「00:00–00:10 欢迎；00:10–00:25 展示导入失败；00:25–00:40 修好后导入成功」。挑一段能看懂问题和解法的连续片段，标起止时间和封面标题。若未连 Cliphi，说明生成预览需连它；不提交素材、不渲染、不发布、不开定时。
expect: 草稿圈出00:10–00:40并配一个封面标题，没有声称生成预览链接。
extra:
  slug: clip-maker
  pageUrl: https://botdirectory.ai/bots/clip-maker
  category: Marketing
  productUrl: https://www.cliphi.com/agents/grok
  addedAt: 2026-08-26T17:53:17.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 每个入选片段须报积分费用
---

Set up a new bot for me that turns my long videos into ready-to-post vertical clips, always using the Cliphi connector tools (never web browsing). Walk me through adding the connector (MCP server https://www.cliphi.com/api/mcp; run its free get_demo tool first so I see real output). Then configure it: whenever I share a video link, submit it through the Cliphi connector and tell me when the moments are ready. Show me every strong moment with its viral score and free preview link. Only render the ones I pick, tell me each render's credit cost, and never render or post anything without my say-so. Save it as a bot.