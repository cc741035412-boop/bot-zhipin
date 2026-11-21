---
id: ronglecat:prompts/playbook-prompts.zh.md#8
kind: prompt
title: 订阅断舍离
zh:
  title: 订阅扣费台账
  purpose: 把邮件和账单里的订阅列成留退清单，每项附上取消入口。
  audience: 要从多张账单核对续费项目的团队负责人
source: RongleCat/awesome-grok-bot
sourceUrl: https://github.com/RongleCat/awesome-grok-bot/blob/e50ac2f8dd2f5fe83827bf2a2b9f70e50d893be1/prompts/playbook-prompts.zh.md#8
sourcePath: prompts/playbook-prompts.zh.md#8
author:
  name: RongleCat
  url: https://github.com/RongleCat
license: CC0-1.0
fetchedAt: 2026-11-21T06:44:43Z
changes: 从 playbook-prompts.zh.md 第 8 节摘出代码块里的提示词，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:1a6d67ed4a298d8f2f5895ee9a21b31a536ad63f622795fbe7146529427a0ffa
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
  flag: true
  rules:
    - R-pay
  hits:
    - rule: R-pay
      excerpt: 从我点名的邮箱和账单网站整理一份订阅台账
extra:
  summary: 先盘账单，只取消我点名的。
  note: 取消必须留确认截图，未标记不得改套餐
---

从我点名的邮箱和账单网站整理一份订阅台账。列：商家、金额、周期、最近扣款、留/砍、取消链接。

我没在那一行打标之前，不要改套餐。取消之后，把确认页截图存到这台电脑。