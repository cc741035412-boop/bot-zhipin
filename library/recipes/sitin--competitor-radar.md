---
id: sitin:examples/competitor-radar.md
kind: recipe
title: 竞品雷达 routine
zh:
  title: 竞品页面变化简报
  purpose: 每天对比竞品页面的新旧快照，有实质变化才推送摘要。
  audience: 同时跟踪三到十个竞品的产品经理
source: sit-in/awesome-grokbot-playbooks
sourceUrl: https://github.com/sit-in/awesome-grokbot-playbooks/blob/a0984780ce733b750366fa23999e0a32d90dc44b/examples/competitor-radar.md
sourcePath: examples/competitor-radar.md
author:
  name: sitin
  url: https://github.com/sit-in
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:d5e376234d75b5245241934b12a9df13f9f7bdf75805982fb988393aebd26768
score: 4
rubric:
  task: true
  input: true
  steps: true
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
  summary: 每天定时扫一遍竞品动态，只推送"有变化"的部分，没变化就不打扰。
  suitableFor: 需要盯 3–10 个竞品、但没时间每天手动看的人
  verifiedAt: 待验证（本文为虚构示例草稿）
  verifyLevel: 待验证
  cost: 低
  note: 仅限公开页面，未限定只读或点名动作审批
---

# 竞品雷达 routine

> 每天定时扫一遍竞品动态，只推送"有变化"的部分，没变化就不打扰。

- **适合**：需要盯 3–10 个竞品、但没时间每天手动看的人
- **验证日期**：待验证（本文为虚构示例草稿）
- **验证级别**：待验证
- **成本量级**：低

## 场景

手动刷竞品官网、更新日志、社媒很费时间，而且容易漏。
雷达 routine 把"看一遍"变成定时任务，只在有变化时给出摘要。

## 输入

- 竞品清单：名称 + 公开页面（官网更新日志、定价页、官方社媒账号）
- 上一次运行的快照文件（首次运行为空）
- 一个定时器：cron / launchd / GitHub Actions 任选

## 步骤

1. 定时触发（建议每天 1 次，别太频繁）
2. 抓取每个竞品的公开页面，存成当天快照
3. 与上一次快照对比，只保留有差异的部分
4. 把差异交给 bot 写摘要；没有差异就直接结束，不推送
5. 摘要推送到你常看的地方（邮件 / IM / 笔记），快照覆盖为最新

## Prompt

```text
以下是竞品 {{竞品名}} 页面今天和上次的差异片段。
用不超过 3 条要点说明发生了什么变化，每条标注类型：
定价 / 功能 / 文案 / 其他。
如果差异只是日期、排版、无意义改动，回复"无实质变化"。
不要推测没有出现在差异里的信息。
```

## 产出

```text
竞品雷达 · {{日期}}
- 竞品 A [定价] 入门档月费上调，新增年付折扣
- 竞品 B [功能] 更新日志新增"团队空间"
其余 4 个竞品：无实质变化
```

## 坑

- 页面里的时间戳、推荐位每天都会变，先在对比前过滤掉，否则天天"有变化"
- 只抓公开页面，遵守对方 robots 与服务条款，频率保持克制
- 摘要只基于差异片段，别让 bot 自由发挥，否则会编出不存在的更新