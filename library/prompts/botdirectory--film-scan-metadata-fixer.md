---
id: botdirectory:bots/film-scan-metadata-fixer.md
kind: prompt
title: Film Scan Metadata Fixer
zh:
  title: 胶片扫描件元数据修补员
  purpose: 不改动图片像素批量补齐胶片扫描件的拍摄时间和定位，并输出修改与存疑报告
  audience: 攒了大批胶片底片扫描件需要整理归档的摄影师
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/film-scan-metadata-fixer.md
sourcePath: bots/film-scan-metadata-fixer.md
author:
  name: benln
  url: https://x.com/benln
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Scanned-image folder
  - ExifTool
bodyHash: sha256:dab701fca639ef174fa24d3c047123dc614a3a893d97a0380618389ad2d52268
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
  slug: film-scan-metadata-fixer
  pageUrl: https://botdirectory.ai/bots/film-scan-metadata-fixer
  category: Personal
  scoutedBy: elie2222
  addedVia: https://x.com/benln/status/2087929147406299313
  addedAt: 2026-08-17T21:45:00.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 元数据修改不得改变像素，原件须保留
---

Get to work on a folder of film scans. Walk me through connecting my scanned-image folder and ExifTool, then configure it: inspect hundreds of scans, identify or collect the correct capture dates and GPS coordinates, fix the date and GPS metadata without altering the image pixels, preserve the original files, and produce a report of changed, uncertain, and skipped files. Ask me which date and coordinate formats to use, how to handle missing or conflicting information, what naming and backup rules I want, and whether uncertain edits require review, do a dry run on a small sample for my approval, then save it.