---
id: cobus:skills/draft-sql/SKILL.md
kind: skill
title: Draft SQL
zh:
  title: 数据库查询草稿编写器
  purpose: 依据代码库表结构文件写出查询语句草稿，附带语句作用说明与锁表风险提示。
  audience: 要查线上业务数据但得先对照表结构审阅语句的研发与数据分析师
source: cobusgreyling/grok-bot-templates
sourceUrl: https://github.com/cobusgreyling/grok-bot-templates/blob/4f3f28b4e6578cd227ff7f4b78ec91d15fd091b5/skills/draft-sql/SKILL.md
sourcePath: skills/draft-sql/SKILL.md
author:
  name: Cobus Greyling
  url: https://github.com/cobusgreyling
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:f2f45ca5b28bc42015c9837747b78e8d02600e4b5ec67b1c663888453487d6b3
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
firstTask: 只看样例表 orders：每行是一笔订单，channel 表示订单来源。请写一条按渠道统计订单数的只读 SQL 草稿，用一句话解释怎么计数，再提醒我全表统计可能带来什么负载。不连库，不运行查询，不设定时。
expect: 草稿按 channel 分组，用 COUNT(*) 统计每组行数，并提示全表统计的负载风险。
extra:
  whenToUse: |
    The owner needs SQL explained or written from a schema in the repo, as a draft only — never executed as a write against a live database.
  note: 草稿里每列都须见于已读模式文件
---

# Draft SQL

Paste this into Grok Bot after a successful run:

> Save the process we just used as a skill called “Draft SQL”.

A useful skill states the six fields from [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations).

## 1. When to use it

The owner needs SQL explained or written from a schema in the repo, as a draft only — never executed as a write against a live database.


## 2. Required inputs and access

- Schema source (migration files, schema.rb, SQL dump, or attached DDL)
- The question or the change they want expressed in SQL
- Rule that live writes are forbidden

## 3. Sequence of work

1. Read the named schema. Quote tables and columns you will use. If a table is missing, stop.
2. Prefer a SELECT that answers the question. Label destructive SQL as DRAFT — DO NOT RUN.
3. Explain what the statement does, what it locks, and what it can destroy.
4. Never execute INSERT, UPDATE, DELETE, DDL, or TRUNCATE against a live or production database.

## 4. How to validate the result

Every column exists in the schema you read. Writes are labeled unrun. No connection string or password appears in the draft.


## 5. What to return

Draft SQL, explanation, risk notes, and an action log of schema files read.


## 6. What requires approval

Do not run writes against a live database. Do not change production data. Even a production SELECT waits for an explicit ask.


Type `/` in the composer to reference a saved skill. If it does not appear, open **Settings → Plugins → Yours** and enable it for this Bot.