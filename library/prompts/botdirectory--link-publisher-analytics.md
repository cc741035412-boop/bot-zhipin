---
id: botdirectory:bots/link-publisher-analytics.md
kind: prompt
title: Link Publisher & Analytics
zh:
  title: 短链成效小报
  purpose: 把推广网址换成短链，发布后用简报列出点击量、峰值日期和主要来源。
  audience: 给多个渠道发推广链接的活动运营
source: elie222/botdirectory.ai
sourceUrl: https://github.com/elie222/botdirectory.ai/blob/447d18f1b6b70a7fa3ade8676bf28d1f8540c124/bots/link-publisher-analytics.md
sourcePath: bots/link-publisher-analytics.md
author:
  name: citedy
  url: https://lnkgo.app
license: MIT
fetchedAt: 2026-11-21T06:44:43Z
changes: 去掉 frontmatter（字段并入本文件头），正文一字未改；本站另加了中文标题、用途、适合谁、评分、国内适配和安全标记，不是原作者写的
integrations:
  - Lnkgo
  - X
bodyHash: sha256:b25604086c261923848235ed27eddb2b4ea7d87fd8bfef1e06a9296d9aa8edd2
score: 3
rubric:
  task: false
  input: true
  steps: true
  acceptance: true
  approval: false
cnFit:
  value: 好
  blocked: []
needsReview:
  flag: true
  rules:
    - R-upload
  hits:
    - rule: R-upload
      excerpt: Create a tracked short link with `POST https://api.lnkgo.app/v1/links` using `Au
extra:
  slug: link-publisher-analytics
  pageUrl: https://botdirectory.ai/bots/link-publisher-analytics
  category: Marketing
  productUrl: https://lnkgo.app
  addedAt: 2026-08-20T22:05:47.000Z
  bodyPolicy:
    keep: true
    basis: author
  note: 短链加分析双交付；等上线才查数据非审批
---

Set up a new bot for me. Walk me through getting a free Lnkgo API key: open https://lnkgo.app, follow the quickstart (or run `npx --yes lnkgo init --email <my-email>` and verify the email code), then store `LNKGO_API_KEY` securely. Confirm the key with `GET https://api.lnkgo.app/health`.

When I give you a long URL, optional slug, and tags (for example campaign or channel):
1. Create a tracked short link with `POST https://api.lnkgo.app/v1/links` using `Authorization: Bearer $LNKGO_API_KEY`, `Content-Type: application/json`, and a fresh UUID `Idempotency-Key` header.
2. Reply with the `short_url` only — ready to paste into a post, thread, or newsletter.
3. After I say the link is live, fetch `GET https://api.lnkgo.app/v1/links/{link_id}/analytics` and report total clicks, the last few days of trend, and referrers. Report traffic KPIs, not just that content was posted.

If I paste an X post draft, swap raw URLs for Lnkgo short links before I publish. On a schedule I choose (daily or weekly), pull analytics for active campaign links and send a short digest: clicks, best day, top referrer.

Ask me once for default tags and whether to use lnkgo.app or a verified custom domain. Do one dry run with a test URL, then save this workflow as a bot.