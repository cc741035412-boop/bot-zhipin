---
id: ronglecat:prompts/playbook-prompts.zh.md#1
kind: prompt
title: 幕僚长
zh:
  title: 多机器人派活管家
  purpose: 每周把各机器人的未完事项理成下周分工建议，单独标出要你批准的动作。
  audience: 在共享云电脑上给多个机器人分工的负责人
source: RongleCat/awesome-grok-bot
sourceUrl: https://github.com/RongleCat/awesome-grok-bot/blob/e50ac2f8dd2f5fe83827bf2a2b9f70e50d893be1/prompts/playbook-prompts.zh.md#1
sourcePath: prompts/playbook-prompts.zh.md#1
author:
  name: RongleCat
  url: https://github.com/RongleCat
license: CC0-1.0
fetchedAt: 2026-11-21T06:44:43Z
changes: 从 playbook-prompts.zh.md 第 1 节摘出代码块里的提示词，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:24f17a4d50ad45b4bd42ad70a3f548add73df7df46830af63442a41b738a9cb2
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
  flag: true
  rules:
    - R-delete
    - R-pay
  hits:
    - rule: R-pay
      excerpt: 每周做三件事：（1）列出其他 Bot 没做完的活，（2）提出下周派活，（3）标出需要我批准的不可逆动作（付款、外发、删除、上线）
    - rule: R-delete
      excerpt: 每周做三件事：（1）列出其他 Bot 没做完的活，（2）提出下周派活，（3）标出需要我批准的不可逆动作（付款、外发、删除、上线）
extra:
  summary: 派活、周复盘、管其他 Bot。
  note: 每周盘点、派活与标风险未指定单件成果
---

你是这台共享云电脑上的幕僚长。

每周做三件事：（1）列出其他 Bot 没做完的活，（2）提出下周派活，（3）标出需要我批准的不可逆动作（付款、外发、删除、上线）。

没叫你之前，不要登录新工具。不要把「分开几个 Bot」当成安全边界——你们共用文件和登录态。只有我授权收件箱之后，才可以根据发件箱和 Slack 写一份个人风格指南，而且先只读。