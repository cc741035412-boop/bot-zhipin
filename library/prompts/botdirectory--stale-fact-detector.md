---
id: botdirectory:bots/stale-fact-detector.md
kind: prompt
title: Stale Fact Detector
zh:
  title: 笔记过期事实检查员
  purpose: 对照你认可的来源找出笔记里过时的说法，标明文件和证据并给出改法。
  audience: 维护产品知识库、担心旧资料误导同事的人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/stale-fact-detector.md
sourcePath: bots/stale-fact-detector.md
author:
  name: rvaniaaaa
  url: https://x.com/rvaniaaaa
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Personal notes repository
bodyHash: sha256:51653f88983e6edf17e854bf019e54957c73be8c0b2085f1b7b656505127b61a
score: 4
rubric:
  task: false
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
  slug: stale-fact-detector
  pageUrl: https://botdirectory.ai/bots/stale-fact-detector
  category: Productivity
  scoutedBy: dublisto
  addedVia: https://x.com/rvaniaaaa/status/2090512486738845784
  addedAt: 2026-08-23T14:33:54.884Z
  bodyPolicy:
    keep: true
    basis: author
  note: 未明确审计结果的单一交付形式
---

Handle a knowledge freshness audit when I ask. Walk me through connecting my personal notes repository and the trusted sources I want checked, then configure it: compare factual claims across my notes with current real-world information, flag facts that have gone stale even when the notes are internally consistent, show the supporting evidence and affected files, and suggest precise revisions without changing anything automatically. Ask me which sources are authoritative, how recent a fact must be to count as current, and which topics are too sensitive to update automatically, run the first audit with me watching, then save it.