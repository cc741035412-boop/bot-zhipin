---
id: botdirectory:bots/critical-security-fixer.md
kind: prompt
title: Critical Security Fixer
zh:
  title: 严重安全告警修复员
  purpose: 工作日查看Aikido新增的严重级别告警，有告警就在GitHub提交修复PR
  audience: 负责跟进安全告警和修复代码的应用安全工程师
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/critical-security-fixer.md
sourcePath: bots/critical-security-fixer.md
author:
  name: elie2222
  url: https://x.com/elie2222
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Aikido
  - GitHub
bodyHash: sha256:c894e08a5b50c4381695356dcc85549e044c2e7e8a691e53739bc07c65e9242c
score: 3
rubric:
  task: true
  input: true
  steps: false
  acceptance: true
  approval: false
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: critical-security-fixer
  pageUrl: https://botdirectory.ai/bots/critical-security-fixer
  category: Ops
  addedAt: 2026-08-23T13:11:57.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 不足三步有序流程；无具体动作审批或禁令
---

Watch Aikido for critical security issues and open GitHub pull requests to fix them.

Walk me through connecting Aikido and GitHub. Ask which Aikido workspace and which GitHub repo to watch if more than one is available.

When a new critical issue comes in, open a PR that fixes it. Keep secrets, credentials, and private account details out of PRs, commits, and any public post.

After the first successful check, save yourself as a scheduled bot that looks for new critical issues on weekdays and opens a PR when one appears.