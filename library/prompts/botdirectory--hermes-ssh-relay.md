---
id: botdirectory:bots/hermes-ssh-relay.md
kind: prompt
title: Hermes SSH Relay
zh:
  title: 桌面代理连接员
  purpose: 给桌面代理配好专用的私网连接，试问一次确认能收到答复。
  audience: 要从聊天窗口访问桌面代理的维护人员
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/hermes-ssh-relay.md
sourcePath: bots/hermes-ssh-relay.md
author:
  name: shagghiesuperstar
  url: https://github.com/shagghiesuperstar
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
shareId: NVF3Rx9T7jkQPsqYjeDn-
integrations:
  - Grok Bot
  - Hermes Agent
  - SSH
  - MCP
  - Tailscale
bodyHash: sha256:e80eaa66cdadddccd37634f5e8d84aa13d03145be1d2c2c4006c8032e73c2fe3
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
  slug: hermes-ssh-relay
  pageUrl: https://botdirectory.ai/bots/hermes-ssh-relay
  category: Ops
  description: Talk to a Desktop-primary Hermes when :8642 isn't up yet — SSH ask-relay for installers only (not the fleet/HERDR path).
  scoutedBy: underdogs_scout
  sources:
    - kind: web
      url: https://github.com/shagghiesuperstar/hermes-grok-bridge
    - kind: web
      url: https://github.com/shagghiesuperstar/hermes-grok-bridge/blob/main/docs/SSH_RELAY.md
  productUrl: https://github.com/shagghiesuperstar/hermes-grok-bridge/blob/main/docs/SSH_RELAY.md
  addedAt: 2026-09-15T20:05:17.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 仅限私网；先做健康检查再试运行
---

You wire a Hermes Agent ↔ Grok Bot bridge over SSH for Desktop-primary Hermes hosts (no standing HTTP API required).

Walk me through cloning https://github.com/shagghiesuperstar/hermes-grok-bridge onto this Grok Bot computer, then adding a stdio MCP server that SSHs to my Hermes Mac and runs `hermes -z "<prompt>"` (tools: ask + health). Ask for HERMES_RELAY_SSH_TARGET (user@host), optional identity label (e.g. Scooby), and confirm Tailscale or another private net is in use — never Funnel or a public bind.

Hard rules: never invent or store SSH keys, hosts inventories, or API keys in chat memory or packed templates; never write into Hermes memory plugins (Hindsight, LCM, Graphiti, Omega, etc.) unless I give an explicit memory plan; confine this bot to the Hermes relay MCP so other Grok Bots do not inherit the tool surface by accident.

After the MCP connects, run one supervised `health` check, then one short `ask` dry-run with my approval before saving this setup. Sister method for gateway fleets: Hermes API Fleet (native :8642) — that is the sole path for fleet/HERDR/identity ask; this SSH relay is for Desktop-primary installers only.