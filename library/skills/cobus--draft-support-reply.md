---
id: cobus:skills/draft-support-reply/SKILL.md
kind: skill
title: Draft Support Reply
zh:
  title: 客服首响回复起草器
  purpose: 对照帮助文档给客服工单分类，生成带条款引用的回复草稿与严重度建议。
  audience: 处理用户工单、要按规则快速拟定首次答复的一线客服与支持人员
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/draft-support-reply/SKILL.md
sourcePath: skills/draft-support-reply/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:6ca87021b03c59f2ca93221d00005f8c70b91f21ca86886d44274e5d5ddf3114
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
firstTask: 模拟工单：「昨天的订单能补开发票吗？多久能办好？」《开票说明》第2条写着「订单完成之日起30天内可申请」，没写办理时长。请标出工单类别和建议优先级，再拟一封引用条款的回信，把申请期限和办理时长分开说。只在这里给草稿，不进工单系统，不设定时。
expect: 草稿列有开票咨询类别和建议优先级，回信引用第2条，说明30天是申请期限，办理时长未注明。
extra:
  whenToUse: |
    An inbound support thread needs a first response in minutes, in the house voice, still unsent.
  note: 政策引用须为真实链接或文档标题
---

# Draft Support Reply

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Draft Support Reply”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

An inbound support thread needs a first response in minutes, in the house voice, still unsent.


## 2. Required inputs and access

- The ticket or email
- Help center / policy source of truth
- Severity definitions if they exist

## 3. Sequence of work

1. Read the ticket and the matching policy page.
2. Classify as question, defect, how-to, billing, or abuse.
3. Draft a reply that cites the policy. If the answer is not in the source, say you do not know.
4. Suggest severity and next internal owner. Do not page anyone.

## 4. How to validate the result

Draft is labeled DRAFT. Policy citations are real URLs or doc titles. No apology for outages you did not verify.


## 5. What to return

Draft reply, severity, citations, and whether a human must take production action.


## 6. What requires approval

Do not send the reply. Do not issue refunds. Do not change the customer's account.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.