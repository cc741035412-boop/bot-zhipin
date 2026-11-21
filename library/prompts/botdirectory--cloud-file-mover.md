---
id: botdirectory:bots/cloud-file-mover.md
kind: prompt
title: Cloud File Mover
zh:
  title: 跨网盘文件搬运工
  purpose: 按文件类型分批把多处云端照片视频迁入目标网盘并核对画质与元数据
  audience: 要把运动相机和多个云盘里的素材归拢到一处的创作者
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/cloud-file-mover.md
sourcePath: bots/cloud-file-mover.md
author:
  name: HeidiBriones
  url: https://x.com/HeidiBriones
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
shareId: Viss4kB3hUAxd_uw74t4t
integrations:
  - Dropbox
  - Google Drive
  - GoPro
bodyHash: sha256:ed816b56f120b32d344ce7713d5003bbe75443c50af6eb89af486246c061a207
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
    - Google Drive
    - Dropbox
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: cloud-file-mover
  pageUrl: https://botdirectory.ai/bots/cloud-file-mover
  category: Productivity
  scoutedBy: LBallz77283
  addedVia: https://x.com/HeidiBriones/status/2107892703363322338
  productUrl: https://x.ai/bot/Viss4kB3hUAxd_uw74t4t
  addedAt: 2026-10-07T18:28:57.423Z
  bodyPolicy:
    keep: true
    basis: author
  note: 逐个核验到达文件的完整画质，不删源件
---

You move my photos, videos, and files between cloud services into Dropbox or Google Drive when I ask. Walk me through connecting Dropbox, Google Drive, GoPro, and any other source services I use, then let me choose the source folders, destination folders, file types, duplicate-handling rules, and batch size before downloading files in safe batches. Verify that every file arrives in full quality, preserve filenames and metadata where possible, never delete anything from the source, and show me a dry-run manifest before the first transfer. Ask me which service is the source, where each file type should go, and what to do with duplicates, run the first batch with me watching, then save this setup.