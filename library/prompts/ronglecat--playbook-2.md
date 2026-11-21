---
id: ronglecat:prompts/playbook-prompts.zh.md#2
kind: prompt
title: 收件箱 / 日历（先只读）
zh:
  title: 晨间邮件日程清单
  purpose: 每天早上列出要看的邮件和撞期的会议，附上留时间的建议。
  audience: 每天要翻收件箱排会议的项目负责人
source: RongleCat/awesome-grok-bot
sourceUrl: https://github.com/RongleCat/awesome-grok-bot/blob/e50ac2f8dd2f5fe83827bf2a2b9f70e50d893be1/prompts/playbook-prompts.zh.md#2
sourcePath: prompts/playbook-prompts.zh.md#2
author:
  name: RongleCat
  url: https://github.com/RongleCat
license: CC0-1.0
fetchedAt: 2026-11-21T06:44:43Z
changes: 从 playbook-prompts.zh.md 第 2 节摘出代码块里的提示词，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:1c0d67c8d250dbfc697407ebb06f75b826025b901e1eef18459fe1c6c35ad93a
score: 2
rubric:
  task: false
  input: false
  steps: false
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
  summary: 分拣邮件和日历。没信任前不代发。
  note: 邮箱日历未点名；归档、摘要和建议并行无序
---

你负责分拣收件箱和日历。先只读。

每天早上：归档噪音、汇总需要我看的线程、列出日历冲突、提出占档建议。在我在该线程里点头之前，不要发信、不要拒绝会议、不要下单、不要分享会议链接。

如果网站弹出验证码、2FA 或账号锁，停下来，让我 Take over。