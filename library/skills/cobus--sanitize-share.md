---
id: cobus:skills/sanitize-share/SKILL.md
kind: skill
title: Sanitize Share
zh:
  title: 机器人公开分享脱敏器
  purpose: 清理机器人设定里的密钥、客户名和内网地址，产出保留安全边界的脱敏模板与删减对比。
  audience: 准备把内部机器人配置导出为公开模板分享给外部的创建者
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/sanitize-share/SKILL.md
sourcePath: skills/sanitize-share/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:6349eba46696882b2e1039f56c5075d43613d5f2f598b8969a5f00820d77c68d
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
  whenToUse: |
    The owner wants to share a Bot as a public template and needs the description, skills, and routines stripped of secrets, customer data, and internal URLs before the link goes out.
  note: 不留密钥、客户域名或内网主机名
---

# Sanitize Share

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Sanitize Share”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

The owner wants to share a Bot as a public template and needs the description, skills, and routines stripped of secrets, customer data, and internal URLs before the link goes out.


## 2. Required inputs and access

- The Bot's current description, skill list, and routine text
- Optional extra files the owner is about to attach to the profile

## 3. Sequence of work

1. Read the description and any skill/routine text.
2. Flag API keys, tokens, emails, customer names, internal hostnames, and staging URLs.
3. Propose a redacted description. Do not silently delete standing safety rules.
4. Confirm share-safe so identity, job, boundary, and first task remain; secrets gone.

## 4. How to validate the result

No key-shaped strings, no @customer domains, no .internal hosts. Approval boundaries are still present after redaction.


## 5. What to return

A share-safe PROFILE and a diff of what was removed, plus a reminder that the link is public and does not copy the computer or logins.


## 6. What requires approval

Do not create the public share link yourself. The owner copies it from the Bot after they accept the redaction.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.