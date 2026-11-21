---
id: majiayu:packs/team-release-brief.md
kind: team
title: "Team Bot recipe: release brief / 团队发布简报"
zh:
  title: 发布简报核稿员
  purpose: 按发布凭据写一份内部简报，把已上线的改动和还没测的部分分开。
  audience: 发版前要和审核同事核对上线状态的产品经理
source: majiayu000/awesome-grok-bot
sourceUrl: https://github.com/majiayu000/awesome-grok-bot/blob/34ae6ed87f6d1af227c29fa41795014fd9db35d7/packs/team-release-brief.md
sourcePath: packs/team-release-brief.md
author:
  name: majiayu000
  url: https://github.com/majiayu000
license: CC0-1.0
fetchedAt: 2026-11-21T06:44:43Z
changes: 原文件全文收录，一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
bodyHash: sha256:6634eaae2f61a942cd7fa6e201e9c52daa621261d62e3aa04b2c1674b805c973
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
firstTask: 版本协调员，请先给审核同事拟一份内部简报。只看三条模拟记录：合并单写「标签筛选已合并」，上线台账写「仍在候发」，验收单写「平板未测」。每项结论旁标明依据，末尾留一个待核实的问题。草稿只放在这里，不接团队频道，不转交，不设定时。
expect: 草稿分别引用三条记录，写清已合并但尚未上线、平板未测，末尾有一个核实问题。
extra:
  note: 每个主张保留来源，合并和实际发布不可混写
---

# Team Bot recipe: release brief / 团队发布简报

A small shared workflow for a release coordinator and a reviewer. This is an original setup recipe, not an import link or a tested deployment.

给发布负责人和审核者共用的一份简报工作流。这是原创配置配方，不是一键导入链接，也没有宣称已完成团队实测。

## Requirements / 前提

- Team Bots require a **Team or Enterprise** plan. An Ultra plan's meeting access alone does not establish Team Bot access.
- Start with one Team Bot shared with two designated members. Slack or Microsoft Teams is optional; connect only the channel used for this workflow.
- First run uses the fictional notes below. Later, supply release notes or explicitly authorized repository links.

Team Bot 需要 **Team 或 Enterprise** 套餐。先建一个 Bot，分享给发布负责人和审核者；Slack / Microsoft Teams 按需接入。首测使用下方虚构材料，随后才换成获准访问的发布记录。

## Standing instructions / 常驻说明

```text
You prepare a release brief from material supplied in this conversation.
For every claim, retain its source link or quote the supplied note.
Separate shipped changes, known limitations, and decisions awaiting a human.
A merged PR is not proof of a published package or a live deployment.
If sources disagree, show the disagreement and ask the release owner.
Return a draft here. Publishing, sending messages, changing tickets, and
creating schedules require a separate instruction from the release owner.
```

中文版本：

```text
你根据本对话提供的材料整理发布简报，每项事实保留来源链接或对应原始记录。
分开写已经交付的改动、已知限制、等人决定的问题。
PR 合并不代表包已发布或服务已上线。来源冲突就列出冲突，交发布负责人判断。
先在本对话交草稿。对外发布、发消息、改工单、设置定时均等发布负责人另行指示。
```

## First run / 首测

Paste this fictional evidence:

```text
Project: CSV Desk, version 0.2
Merged: PR 12 adds CSV-to-Markdown output.
Release: the package has not been published.
Check: one UTF-8 sample converted; Windows has not been tested.
Decision: release owner has not approved a date.
Create a 100-word internal release brief. No external actions.
```

Have the second member ask: “Is 0.2 available to install, and does it support Windows?” The expected answer is that neither is established by the supplied evidence. Ask the Bot to revise the brief after the owner provides a new release receipt; the revision should update that fact without erasing the remaining platform limitation.

让第二位成员问“0.2 已经能安装了吗，Windows 能用吗？”预期回答是材料均不足以证明。随后给出一条新的发布回执，让 Bot 只更新对应事实，保留尚未验证的平台限制。

## Acceptance / 验收

- Both designated members can use the same Bot in the intended conversation.
- The brief cites supplied evidence and distinguishes merge, release, and platform testing.
- The reviewer can correct a fact and the next answer reflects that correction.
- No message, issue, release, or routine is created by this draft-only task.

Record the plan, app version, sharing scope, test date, and visible results before calling this workflow tested. Do not test permission isolation with real confidential data.

Official basis, checked 2026-11-16: [Grok Bot 1.0](https://x.ai/news/grok-bot-1-0) describes Team Bot sharing with specific people/groups and Slack/Teams use. The workflow and sample above are our proposal, not a claim from xAI. Team Bots existed before 1.0; that release improved sharing and management.