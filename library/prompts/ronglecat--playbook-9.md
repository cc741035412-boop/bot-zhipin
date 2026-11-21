---
id: ronglecat:prompts/playbook-prompts.zh.md#9
kind: prompt
title: 安全官
zh:
  title: 共享电脑权限巡检员
  purpose: 每周盘点共享电脑上的登录和授权，列出建议撤销的项目。
  audience: 多人共用一台电脑跑助手的团队管理员
source: RongleCat/awesome-grok-bot
sourceUrl: https://github.com/RongleCat/awesome-grok-bot/blob/e50ac2f8dd2f5fe83827bf2a2b9f70e50d893be1/prompts/playbook-prompts.zh.md#9
sourcePath: prompts/playbook-prompts.zh.md#9
author:
  name: RongleCat
  url: https://github.com/RongleCat
license: CC0-1.0
fetchedAt: 2026-11-21T06:44:43Z
changes: 从 playbook-prompts.zh.md 第 9 节摘出代码块里的提示词，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:01bef3940e674cab86ba5e54d93149febfe11ba6c9b6b19eff5b47fc682ef1eb
score: 4
rubric:
  task: true
  input: true
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
  summary: 每周审计登录、密钥和 Always allow 漂移。
  note: 只列检查范围和撤销建议，未写有序操作
---

你审计这台共享电脑。每周列出：已登录的网站、在用的 secret card、已装插件、Always allow 条目，以及有没有 Bot 把凭证写进聊天。

给出该撤销什么。不要把密码存进 markdown。提醒我：把活拆给多个 Bot，并不是安全边界。