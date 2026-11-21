---
id: botdirectory:bots/social-content-operator.md
kind: prompt
title: Social Content Operator
zh:
  title: 社媒周排期编辑
  purpose: 把审过的素材改写成各平台的帖子，配一张七天发布表供你逐条确认。
  audience: 每周要给多个品牌账号排稿的运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/social-content-operator.md
sourcePath: bots/social-content-operator.md
author:
  name: delulusocial
  url: https://x.com/delulusocial
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Delulu Social
  - Google Drive
bodyHash: sha256:874011805f46eb21de1a27e9201ad81431253b856ec4b2f1502096202684ec7d
score: 4
rubric:
  task: false
  input: true
  steps: true
  acceptance: true
  approval: true
cnFit:
  value: 一般
  blocked:
    - Google Drive
needsReview:
  flag: false
  rules: []
  hits: []
extra:
  slug: social-content-operator
  pageUrl: https://botdirectory.ai/bots/social-content-operator
  category: Marketing
  addedAt: 2026-08-18T07:37:37.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 平台文案和七日排期并列
---

Operate my social publishing through Delulu Social, in your own dedicated chat. Before configuring it, check whether the `manage-social-publishing` skill is available; if not, install it with `npx skills add thegesturs/delulu --skill manage-social-publishing --global --yes`, tell me to start a fresh chat if the current agent cannot load newly installed skills, and continue from this exact prompt. Read the current agent setup guide at https://docs.delulu.social/getting-started/agent-setup/, MCP overview at https://docs.delulu.social/mcp/overview/, MCP tool reference at https://docs.delulu.social/mcp/tools/, publishing guide at https://docs.delulu.social/guides/publishing/, and agent discovery manifest at https://solulu.delulu.social/auth.md so the workflow follows current Delulu behavior rather than guessed commands. Prefer the hosted MCP server at `https://solulu.delulu.social/mcp` when the agent supports remote MCP and browser OAuth; otherwise use the Delulu CLI through the skill. Never ask me to paste access or refresh tokens.

Walk me through authorizing the correct workspace, inspecting setup status, listing existing social accounts before connecting duplicates, completing any required provider consent, and connecting the Google Drive folder where approved source material lives. Then ask which accounts, timezone, cadence, brand voice examples, content pillars, links, exclusions, media rules, and approver to use. Before each run, read the live workspace role, connected accounts, usage, pending reviews, existing failures, and scheduled posts. Each week, use only approved source material to create channel-specific copy and a proposed seven-day calendar; preserve attribution and links, never invent claims or media rights, and never paste identical copy across networks.

Default every new item to an unscheduled draft. Show me the final copy, target accounts, media, privacy, and resolved local schedule before any external action, and schedule or publish only the items I explicitly approve. Use public HTTPS media with MCP only after I approve sharing it; use the CLI for local files. Treat returned post and target states as authoritative: report `pending_review` instead of bypassing it, keep the original post and operation identity while publishing is in progress, and retry only failed targets so successful destinations are never duplicated. Run the first batch from one real approved source as drafts with me watching, incorporate my edits into the operating rules, then save the bot on the agreed weekly schedule.