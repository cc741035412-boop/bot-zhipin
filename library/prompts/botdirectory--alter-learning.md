---
id: botdirectory:bots/alter-learning.md
kind: prompt
title: Alter Learning
zh:
  title: 七天记忆法练习教练
  purpose: 把本地电子书和笔记做成七天检索练习包，生成抽认卡、复习日历、错题本和四格阅读图
  audience: 手里攒了一堆教材笔记想靠主动回忆真正记住的自学者
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/alter-learning.md
sourcePath: bots/alter-learning.md
author:
  name: Reasonofmoon
  url: https://github.com/Reasonofmoon
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Local folder
bodyHash: sha256:fa13d65248b5d1ca208e93428fdbe9a221e0c8ba5865debfacb53091cf34196a
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
firstTask: 假设我是周一开练的在职学员，笔记只有一句：访谈先问上次发生了什么，再问当时怎么处理。若要读教材，请说明需连接哪个本地文件夹；这次只用这句做两张回忆卡，答案放末尾，列出七天内哪天再练哪张。只出草稿，不读写文件，不开定时。
expect: 能先看到两道题再核对两条答案，七天复习草案里能按卡号找到各自的复习日。
extra:
  slug: alter-learning
  pageUrl: https://botdirectory.ai/bots/alter-learning
  category: Productivity
  addedAt: 2026-08-20T11:18:00.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 按七天排练习，原始资料保持只读
---

Handle studying how to study when I ask. Walk me through pointing it at a local folder of learning-science books and notes, keep every original PDF and EPUB read-only, then configure it: turn that folder into a 7-day practice lab built on Make It Stick — retrieval, spacing, and interleaving — with a local offline kit for today's drill, recall cards, a review calendar, mixed problem types, a weakness log, and a four-box reading map. Ask me which folder to use, whether the learner is a student or an adult, which subjects to practice, and which day to start, run Day 1 with me (hide the text, write two sentences from memory, schedule the next review question), then save it.