---
id: botdirectory:bots/supply-chain-threat-sentinel.md
kind: prompt
title: Supply Chain Threat Sentinel
zh:
  title: 软件依赖风险审查员
  purpose: 核查代码合并请求和依赖更新里的供应链风险，列出证据和修复优先级。
  audience: 上线前要评估第三方依赖风险的研发负责人
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/supply-chain-threat-sentinel.md
sourcePath: bots/supply-chain-threat-sentinel.md
author:
  name: APompliano
  url: https://x.com/APompliano
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - GitHub
  - GitHub Actions
bodyHash: sha256:8107427ddd0a63cc892722524bccc5f337ad07e5659c14d5492a8b039bc20cbe
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
  slug: supply-chain-threat-sentinel
  pageUrl: https://botdirectory.ai/bots/supply-chain-threat-sentinel
  category: Ops
  scoutedBy: elie2222
  addedVia: https://x.com/APompliano/status/2089478124283052078
  addedAt: 2026-08-18T15:40:27.203Z
  bodyPolicy:
    keep: true
    basis: author
  note: 需用已知公告交叉核对并说明证据和严重程度
---

Watch every pull request and dependency update for supply-chain threats. Walk me through connecting GitHub and GitHub Actions, then configure it: inspect dependency manifests, lockfiles, release changes, build workflows, and third-party packages for software supply-chain threats, correlate suspicious behavior with known advisories, explain the evidence and severity, and return prioritized remediation steps without changing code or blocking releases automatically. Ask me which repositories, languages, environments, advisories, and severity thresholds matter, do a supervised scan of one repository first, show me the findings and any proposed issue or workflow changes before publishing them, then save it.