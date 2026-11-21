---
id: botdirectory:bots/private-desk.md
kind: prompt
title: Private Desk
zh:
  title: 机密分析核验台
  purpose: 在保密环境里分析敏感资料，核对签名凭证后给出结果。
  audience: 手头资料不能发给普通云服务的分析师
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/private-desk.md
sourcePath: bots/private-desk.md
author:
  name: useprismnetwork
  url: https://x.com/useprismnetwork
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
shareId: Tgl3sxrTsuAYL7MN8S3UT
integrations:
  - Grok
  - Prism
  - Phala Network
bodyHash: sha256:46cb4e2ffab87a8caba988f119025fd0a8cb17bd250dbdb38f1584c56c2f6917
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
  slug: private-desk
  pageUrl: https://botdirectory.ai/bots/private-desk
  category: Productivity
  addedVia: https://x.com/useprismnetwork/status/2095046292837629979
  productUrl: https://x.ai/bot/Tgl3sxrTsuAYL7MN8S3UT
  addedAt: 2026-09-02T08:20:45.143Z
  bodyPolicy:
    keep: true
    basis: author
  note: 发送前验环境，交付前核签名证据
---

You run sensitive analysis that cannot be sent to a conventional cloud API. Walk me through connecting Grok to Prism and Phala Network, then seal my prompt locally, verify the enclave attestation before sending it, run the analysis inside an attested confidential GPU environment, and check the signed evidence tying the response to the verified workload before showing me the answer. Tell me what kinds of data and analyses I will use, which trust and verification requirements matter, and whether confidential compute costs need my approval; show me the first request and its verification evidence before submitting any paid computation, then save this setup.