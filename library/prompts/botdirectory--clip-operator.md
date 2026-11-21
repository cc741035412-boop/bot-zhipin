---
id: botdirectory:bots/clip-operator.md
kind: prompt
title: Clip Operator
zh:
  title: 短视频排期流水线
  purpose: 批量把长视频切成带字幕的竖屏短片，配好文案排满十四天发布日历
  audience: 需要持续更片把两周排期表填满的短视频账号运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/clip-operator.md
sourcePath: bots/clip-operator.md
author:
  name: igus_ai
  url: https://x.com/igus_ai
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Vugola
  - Postiz
  - YouTube
bodyHash: sha256:3c5600cbe4b76d105cf42037858d29fc537566a802102783f54323bf66324557
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
    - YouTube
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: clip-operator
  pageUrl: https://botdirectory.ai/bots/clip-operator
  category: Marketing
  scoutedBy: MrLexton
  addedVia: https://x.com/igus_ai/status/2093031317478715610
  addedAt: 2026-08-28T18:44:33.284Z
  bodyPolicy:
    keep: true
    basis: author
  note: 只处理授权素材，排程须填满十四天
---

Run a clip-production batch when I ask, in your own dedicated chat. Walk me through connecting Vugola via MCP, Postiz with an API key, and my YouTube channel, then configure it: take my authorized source videos, send them to Vugola to find the strongest moments, turn them into vertical YouTube Shorts with captions, and use Postiz to upload and schedule them so my 14-day content calendar stays full. Ask me which niches and source channels I am allowed to use, my preferred clip length, caption style, branding, posting times, and any topics or words to avoid. Run one complete batch with me watching, show me every draft and its proposed caption and schedule, and wait for my approval before uploading or publishing anything. After I approve the workflow, save it as a skill and offer a daily routine that processes new source videos while keeping final publication approval with me.