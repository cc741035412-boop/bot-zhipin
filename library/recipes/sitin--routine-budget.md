---
id: sitin:examples/routine-budget.md
kind: recipe
title: Routine 额度体检
zh:
  title: 定时任务用量盘点表
  purpose: 按预计用量给每条定时任务列去留或降频建议，排出恢复运行的顺序。
  audience: 定时任务太多且周额度快用完的团队负责人
source: sit-in/awesome-grokbot-playbooks
sourceUrl: https://github.com/sit-in/awesome-grokbot-playbooks/blob/a0984780ce733b750366fa23999e0a32d90dc44b/examples/routine-budget.md
sourcePath: examples/routine-budget.md
author:
  name: sitin
  url: https://github.com/sit-in
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:aa8f8df89f55f95b9d3f84c69da5232d8c4d87c79290569d94cd221f5edbb739
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
  summary: 一周额度快烧光时，用一份可复用的检查单 + 首席 Bot prompt，先止血再排优先级，避免「边烧边猜」。
  suitableFor: 开了很多 Routine / 多 Bot，经常临近用量上限，或醒来发现一堆过期审批的人
  verifiedAt: 待验证（2026-10-18 初稿，合成自公开玩法信号；文中 Routine 名与样例均为虚构）
  verifyLevel: 待验证
  cost: 低（主要省的是额度浪费，不额外要求付费技能）
  note: 分级表之外还交止血顺序并执行额度治理
---

# Routine 额度体检

> 一周额度快烧光时，用一份可复用的检查单 + 首席 Bot prompt，先止血再排优先级，避免「边烧边猜」。

- **适合**：开了很多 Routine / 多 Bot，经常临近用量上限，或醒来发现一堆过期审批的人
- **验证日期**：待验证（2026-10-18 初稿，合成自公开玩法信号；文中 Routine 名与样例均为虚构）
- **验证级别**：待验证
- **成本量级**：低（主要省的是额度浪费，不额外要求付费技能）

## 场景

常见症状：最快的那条 Routine 在聊天 Bot 里狂跑；非工作时段也在刷；上下文越积越长；测试时开着 on-demand；主动建议类能力「自己找事做」。结果是额度暴涨，却说不清哪条在烧。

本配方不做「装一个第三方 Budget 技能就完事」，而是：**先暂停 → 盘点 → 分级 → 再逐个打开**，把额度护栏写进日常作战室。

## 输入

- 当前账号下的 Bot 列表、Routine 列表（名称 + 大致频率即可，勿贴真实账单截图进公开仓）
- 本周大概还剩多少额度档位（高/中/低三档口头描述即可，**不要写具体金额或百分比进公开配方产出**）
- 哪些 Bot 是「聊天主 Bot」、哪些是「纯雷达 / 纯写稿」
- （可选）是否装了第三方额度类市场技能——只用只读、有人工闸门时再考虑

## 步骤

1. **急停**：先 pause 掉全部非关键 Routine（尤其 24/7、半小时级、主动找事类）。先止血，再归因。
2. **挪窝**：把高频雷达 / 摘要 Routine 从「聊天主 Bot」挪到专用轻量 Bot，聊天 Bot 只做人审与发帖闸门。
3. **清上下文**：对明显膨胀的会话，新开一个干净会话接着做；长 prompt 里改成「指到 skill / 文件，无新则静默」，禁止无增量也长篇汇报。
4. **排班**：只在工作日白天窗口跑（例如本地时区 9–19）；临近额度重置日前，停掉可缓跑的 Routine。
5. **分级**：用下面 Prompt 让首席 Bot 给每条 Routine 打 KEEP / SLOW / EVENT / CHANGE / RETIRE（先估用量，**先不改配置**，等人确认）。
6. **逐个开**：按 KEEP → SLOW → EVENT 顺序重新 enable；每开一条观察一轮再开下一条。CHANGE 类先改触发条件；RETIRE 直接删或归档。
7. **周审**：每周固定一次「额度体检」复盘（可挂 `weekly-review` 配方），把红黄绿结果写回任务板。

## Prompt

首席 Bot（额度体检，只读建议）：

```text
你是 {{产品名}} 的首席助理，本轮只做 Routine 额度体检，不要改任何配置、不要发帖、不要花钱。

输入：我粘贴的 Bot/Routine 清单（名称、频率、触发方式、是否在聊天 Bot 上）。

对每条 Routine 输出一行表格：
- 名称
- 建议标签：KEEP / SLOW / EVENT / CHANGE / RETIRE
- 理由（一句）
- 预估相对烧量：高 / 中 / 低（不要编造具体美元或百分比）
- 若 SLOW：建议频率或时段
- 若 EVENT：改成什么事件触发更合适
- 若 CHANGE：改哪一类触发/窗口
- 若 RETIRE：可否归档

规则：
1. 无可靠信息就标 [需人工]，不要猜。
2. 24/7、半小时级、主动建议、长上下文聊天 Bot 上的雷达，默认倾向 SLOW 或 RETIRE。
3. 只读第三方市场技能可以提一句「可选」，不要当成必装。
4. 最后给 5 步止血顺序（先停什么、再开什么），用我自己的话，短句。
```

急停确认（给人看的 checklist，可贴任务板）：

```text
额度急停自检：
[ ] 全部非关键 Routine 已 pause
[ ] 最快那条已从聊天主 Bot 挪走或关掉
[ ] 测试用 on-demand 已关
[ ] 无增量静默规则已写进高频 prompt
[ ] 工作日白天窗口已设
[ ] 首席 Bot 分级表已出，等人确认后再逐个 enable
```

## 产出

虚构示例：

```text
额度体检 · {{日期}}
| Routine | 标签 | 烧量 | 下一步 |
| 竞品半小时刷 | SLOW | 高 | 改每日 1 次 · 专用雷达 Bot |
| 周更摘要 | KEEP | 低 | 维持 |
| 主动建议 | RETIRE | 高 | pause 并观察一周 |
止血顺序：1 pause 全部 → 2 挪雷达出聊天 Bot → 3 清会话 → 4 开 KEEP → 5 再开 SLOW
```

## 坑

- 只装第三方 Budget / Meter 技能但不 pause，账单照样跑；技能描述须写清「非官方、只读、要闸门」
- 「无变化也汇报」会悄悄烧额度；高频 Routine 必须静默
- 发帖类 Routine 把静默时段写进 prompt 本体：动手前再看一次时钟，过了截止就跳过本轮，并限定每轮最多发几条
- 在聊天主 Bot 上挂重雷达，上下文和工具调用叠在一起，最难归因
- 分级表是建议不是执行；enable 仍要人点，避免 Bot 自己改自己的 schedule
- 公开配方与 PR 里不要贴真实账单、具体美元、账号截图

---

提交前自查：无 key / token / cookie，无营收数字，无内部路径，无可识别个人信息。