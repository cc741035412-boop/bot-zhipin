---
id: ronglecat:prompts/playbook-prompts.zh.md#6
kind: prompt
title: 教一遍就固化
zh:
  title: 录屏技能整理员
  purpose: 把一次屏幕演示写成其他助手能在同一台电脑上照做的操作说明。
  audience: 要把重复操作交给多个助手的运营
source: RongleCat/awesome-grok-bot
sourceUrl: https://github.com/RongleCat/awesome-grok-bot/blob/e50ac2f8dd2f5fe83827bf2a2b9f70e50d893be1/prompts/playbook-prompts.zh.md#6
sourcePath: prompts/playbook-prompts.zh.md#6
author:
  name: RongleCat
  url: https://github.com/RongleCat
license: CC0-1.0
fetchedAt: 2026-11-21T06:44:43Z
changes: 从 playbook-prompts.zh.md 第 6 节摘出代码块里的提示词，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:dba96261d28d10036af1a47d33dac6cbbd299ef7f5ec1013cf4617b73b76d96c
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
  summary: 把最多 10 分钟的屏幕演示收成可复用 skill。
  note: 看演示后写技能，未明确第三个动作
---

看我把这件事做一遍（只录屏幕，不录麦克风）。写成一份其他 Bot 在这台电脑上也能跑的 skill。

写清楚：前置条件、点击路径、预期画面、失败模式（验证码、2FA、缺插件），以及哪里必须停下来等我批准。我没演示过的步骤不要编。