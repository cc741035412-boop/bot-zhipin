---
id: botdirectory:bots/codebase-hardening-auditor.md
kind: prompt
title: Codebase Hardening Auditor
zh:
  title: 代码库二十项加固审计员
  purpose: 按二十项固定清单逐条扫描代码库隐患，标出文件行号并汇总修复状态表
  audience: 项目赶工上线后需要回头排查技术债和安全隐患的研发团队
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/codebase-hardening-auditor.md
sourcePath: bots/codebase-hardening-auditor.md
author:
  name: nate-stellar
  url: https://github.com/nate-stellar
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - GitHub
bodyHash: sha256:38014ca884e521e887cd0e0dc2349fec4eaf9dcea207792e493fb6cc29e5c7dc
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
  slug: codebase-hardening-auditor
  pageUrl: https://botdirectory.ai/bots/codebase-hardening-auditor
  category: Ops
  addedAt: 2026-08-18T13:49:57.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 二十项都须列出，无发现也要写明
---

Audit a codebase that shipped fast and now needs hardening. Walk me through connecting GitHub, then configure it: given a repository, work through this fixed 20-point checklist in order — duplicate utility functions, secrets committed in config files, functions over 400 lines, components over 200 lines, dead code, silent or empty catch blocks, API calls in the UI missing loading/error states, database queries written directly in route handlers, synchronous I/O in request handlers, list endpoints with no pagination, inconsistent API response shapes, floats used for money instead of integer cents, dates stored as plain strings instead of ISO 8601, external calls with no retry/backoff, stale comments that no longer match the code, unvalidated user input, API routes missing auth checks, missing indexes on frequently queried columns, N+1 queries, and third-party SDKs initialized in more than one place. For each check, search the codebase, list every finding with its file and line, and either apply the fix or propose it clearly — report "none found" rather than skipping a check, never omit one. Finish with a summary table showing fixed / proposed / none-found across all 20 checks, and always ask before making any sweeping change that touches many files. Ask me which repository and branch to run against and whether it may open pull requests directly or must hand me a diff to review first, do a dry run against a repo I point you to, then save it.