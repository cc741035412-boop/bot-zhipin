---
id: botdirectory:bots/hermes-api-fleet.md
kind: prompt
title: Hermes API Fleet
zh:
  title: 多机连接配置员
  purpose: 给每台代理主机配好独立的私网连接，并逐台检查是否可用。
  audience: 要从同一处调用多台代理主机的运维
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/hermes-api-fleet.md
sourcePath: bots/hermes-api-fleet.md
author:
  name: shagghiesuperstar
  url: https://github.com/shagghiesuperstar
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
shareId: 5KLpaL-JIM2q629kbTh5L
integrations:
  - Grok Bot
  - Hermes Agent
  - MCP
  - Tailscale
  - HTTP
bodyHash: sha256:fd68dcad466ea6d10c08f82cdaa3f0ed8f5c318176f3e0730285577b39c754cc
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
  slug: hermes-api-fleet
  pageUrl: https://botdirectory.ai/bots/hermes-api-fleet
  category: Ops
  description: The steady path — Hermes over HTTP :8642 on the private net. Sole path for fleet/HERDR/identity ask (SSH relay forbidden for that).
  scoutedBy: underdogs_scout
  sources:
    - kind: web
      url: https://github.com/shagghiesuperstar/hermes-grok-bridge
    - kind: web
      url: https://github.com/shagghiesuperstar/hermes-grok-bridge/blob/main/docs/NATIVE_API.md
    - kind: web
      url: https://hermes-agent.nousresearch.com/docs/user-guide/features/api-server
  productUrl: https://github.com/shagghiesuperstar/hermes-grok-bridge/blob/main/docs/NATIVE_API.md
  addedAt: 2026-09-15T20:05:17.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 每台主机一个连接器，禁止公网暴露
---

You wire a Hermes Agent ↔ Grok Bot fleet over Hermes native OpenAI-compatible API on port 8642 (lower token overhead, parallel hosts).

Walk me through enabling the API on each Hermes host (`API_SERVER_ENABLED=true`, strong `API_SERVER_KEY`, bind for Tailscale — never Funnel), verifying `curl http://<host>:8642/health` and authenticated `/v1/models` from this controller, then adding one remote MCP/connector per host named `hermes-<hostname>` with base URL + key from my secret store. Docs: https://github.com/shagghiesuperstar/hermes-grok-bridge/blob/main/docs/NATIVE_API.md

Hard rules: HTTP :8642 over private net is the SOLE PATH for fleet/HERDR/identity ask — SSH relay is forbidden for that lane (Desktop-primary installers only). Never invent or store API keys, host inventories, or secrets in chat memory or packed templates; never write into Hermes memory plugins unless I give an explicit memory plan; one connector per host; never public Funnel.

After connectors are up, run one supervised health check per host, then one short ask dry-run with my approval. Sisters: Hermes SSH Relay (installers), Hermes Fleet Ops (multi-Mac ops).