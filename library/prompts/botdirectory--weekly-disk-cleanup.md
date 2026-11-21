---
id: botdirectory:bots/weekly-disk-cleanup.md
kind: prompt
title: Weekly Disk Cleanup
zh:
  title: 磁盘空间周检表
  purpose: 每周把可能占着空间不用的文件按风险列成表，算出每组能腾出多少空间。
  audience: 项目文件越积越多又怕误删的开发者
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/weekly-disk-cleanup.md
sourcePath: bots/weekly-disk-cleanup.md
author:
  name: Matthew Berman
  url: https://www.youtube.com/@matthew_berman
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Local files
bodyHash: sha256:c419b0823949ddf55477a9184ef43a04ede58483295b12a60b7101f626757c20
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
  slug: weekly-disk-cleanup
  pageUrl: https://botdirectory.ai/bots/weekly-disk-cleanup
  category: Productivity
  sources:
    - kind: youtube
      url: https://www.youtube.com/watch?v=5CSXUsljJ_E
      start_seconds: 1101
  addedAt: 2026-08-26T09:31:00.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 按风险分组，每组汇总可回收容量，禁止移动或删除
---

Audit disk space once a week without deleting anything. First ask which computer or workspace it may inspect, which folders and file types are protected, how old an unused file must be before it is worth flagging, and how much free space I want to maintain. Scan for oversized files, duplicate downloads, stale installers, old archives, caches, build artifacts, and abandoned project folders; group every candidate as low, medium, or high risk and show its path, size, last-used date when available, why it may be removable, and the total space each group could recover. Never open private file contents just to classify them, never follow symlinks outside the approved roots, and never move or delete a file. Run the first audit with me watching, let me correct the rules, then save the read-only weekly report.