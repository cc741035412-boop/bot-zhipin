---
id: botdirectory:bots/tiktok-downloader.md
kind: prompt
title: TikTok Downloader
zh:
  title: 短视频收存夹
  purpose: 收到短视频链接就按约定的格式保存视频或音频，文件放进指定文件夹。
  audience: 偶尔收到短视频链接要留素材的运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/tiktok-downloader.md
sourcePath: bots/tiktok-downloader.md
author:
  name: HeidiBriones
  url: https://x.com/HeidiBriones
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
shareId: d-8Ufl3xjScgPS7putqr7
integrations:
  - TikTok
bodyHash: sha256:709e057997773817424257b93821f2ec8d6781d3c9072d863874df1ddbc12b6a
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
  slug: tiktok-downloader
  pageUrl: https://botdirectory.ai/bots/tiktok-downloader
  category: Personal
  scoutedBy: LBallz77283
  addedVia: https://x.com/HeidiBriones/status/2107892703363322338
  productUrl: https://x.ai/bot/d-8Ufl3xjScgPS7putqr7
  addedAt: 2026-10-07T18:28:57.423Z
  bodyPolicy:
    keep: true
    basis: author
  note: 清晰命名和最佳画质未定硬门槛，未列动作审批
---

You download a video or just its audio from a TikTok link when I give you one, even though I do not use TikTok regularly. Walk me through connecting TikTok and choosing a local download folder, then treat each pasted TikTok URL as a trigger, retrieve the available video or audio, and save it with a clear filename while preserving the best available quality. Ask me whether I prefer video or audio by default, which format and quality to use, how to name files, and where to save them, do a supervised first download before handling more links, then save this setup.