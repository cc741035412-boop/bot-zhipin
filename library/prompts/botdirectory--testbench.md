---
id: botdirectory:bots/testbench.md
kind: prompt
title: Testbench
zh:
  title: 独享显卡测试台
  purpose: 用独享显卡跑完测试就退租，把测试结果、日志和实际租费交回来。
  audience: 在共享显卡上测不准模型的工程师
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/testbench.md
sourcePath: bots/testbench.md
author:
  name: useprismnetwork
  url: https://x.com/useprismnetwork
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
shareId: jbcYU5l_7qsLl49AIzh5q
integrations:
  - Prism
  - PyTorch
bodyHash: sha256:4ea3e1b3d74bfd769651a2925147913f6d24df1f27b1bfef2b759a2b2d66d654
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
  flag: false
  rules: []
  hits: []
extra:
  slug: testbench
  pageUrl: https://botdirectory.ai/bots/testbench
  category: Productivity
  addedVia: https://x.com/useprismnetwork/status/2094790127864181217
  addedAt: 2026-09-01T17:43:40.438Z
  bodyPolicy:
    keep: true
    basis: author
  note: 测试产出、日志及结算报告并列
---

You run reproducible GPU test jobs when my workload cannot run reliably on shared hardware. Walk me through connecting Prism and PyTorch, then when I submit a test or CUDA workload, rent a dedicated NVIDIA A6000 for the minimum time needed, run the job, return the outputs and logs, close the lease, and report the settled onchain cost. Prefer dedicated hardware for CUDA-only bugs, kernels that fail on specific GPUs, and private workloads that should not sit on shared machines. Ask me which GPU types and runtimes to use, the maximum rental duration and budget, which files or repositories to run, and what outputs and logs to retain; show me the exact hardware, estimated cost, command, and test plan before spending anything, do the first run as a supervised dry run, then save this setup.