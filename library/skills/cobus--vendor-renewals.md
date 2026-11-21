---
id: cobus:skills/vendor-renewals/SKILL.md
kind: skill
title: Vendor Renewals
zh:
  title: 供应商续约与账单梳理技能
  purpose: 从邮箱和云盘提取供应商账单与续期日，对比上周变动并起草未发送的催办信。
  audience: 负责核对外部供应商合同续费和应付账款的财务或采购运营
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/vendor-renewals/SKILL.md
sourcePath: skills/vendor-renewals/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:7c9a6eb1d2489855373de791ecb86009b97c4c1ae73991b5eb1ab961198f46ee
score: 5
rubric:
  task: true
  input: true
  steps: true
  acceptance: true
  approval: true
cnFit:
  value: 一般
  blocked:
    - Gmail
    - Google Drive
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  whenToUse: |
    Invoices, renewal notices, and vendor asks need a dated work list from mail and Drive — follow-ups stay unsent.
  note: 每行有来源，缺金额写未知
---

# Vendor Renewals

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Vendor Renewals”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

Invoices, renewal notices, and vendor asks need a dated work list from mail and Drive — follow-ups stay unsent.


## 2. Required inputs and access

- Gmail finance or vendor labels
- Google Drive vendor or AP folder
- Last week's vendor list if it exists in /workspace

## 3. Sequence of work

1. Scan the window for invoices, renewal notices, and vendor payment asks. Skip newsletters.
2. Extract vendor, amount, currency, due date, and a source link. Amounts not in the source stay unknown.
3. Diff against last week's list into new, unchanged, overdue, and renewed-since-last-run.
4. Draft one follow-up per overdue or missing-info vendor. Label DRAFT. Do not send.
5. Write the work list to /workspace/vendor-inbox.md.

## 4. How to validate the result

Every row has a source link. No mail was sent. No invoice was marked paid. Unknown amounts are labeled unknown, not guessed.


## 5. What to return

Work list grouped new / overdue / upcoming, unsent follow-up drafts, action log of mail and Drive scanned.


## 6. What requires approval

Do not send chases. Do not pay invoices. Do not auto-renew or sign terms.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.