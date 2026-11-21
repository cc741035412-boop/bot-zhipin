---
id: botdirectory:bots/note-mastery-reviewer.md
kind: prompt
title: Note Mastery Reviewer
zh:
  title: 笔记复习排期员
  purpose: 按笔记文件出题，逐份给出掌握程度评分，再按分数排出下次复习时间。
  audience: 考前想知道哪些笔记还没记牢的学员
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/note-mastery-reviewer.md
sourcePath: bots/note-mastery-reviewer.md
author:
  name: rvaniaaaa
  url: https://x.com/rvaniaaaa
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Personal notes repository
bodyHash: sha256:13bce68f4b72b8a7be73a4a0a90d33d299cfcfccbf54f8f18a01ff18486ca814
score: 3
rubric:
  task: false
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
  slug: note-mastery-reviewer
  pageUrl: https://botdirectory.ai/bots/note-mastery-reviewer
  category: Productivity
  scoutedBy: dublisto
  addedVia: https://x.com/rvaniaaaa/status/2090512486738845784
  addedAt: 2026-08-23T14:33:54.884Z
  bodyPolicy:
    keep: true
    basis: author
  note: 知识库、测验和复习排期并列；无动作审批
---

Handle a study review when I ask. Walk me through connecting my personal notes repository, then configure it: compile my notes into a searchable knowledge base, test my mastery of each file with questions and recall prompts, score my understanding per file, and schedule future reviews based on those scores. Ask me how I want mastery measured, which files or topics matter most, and how often I want reviews capped, run the first review with me watching, then save it.