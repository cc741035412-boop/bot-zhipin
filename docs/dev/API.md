# 点击计数接口约定

前端（`site/`）和后端（`functions/`）按这份约定各自实现，谁改约定谁同步改这份文档。

## 部署形态

- Cloudflare Pages Functions：`functions/api/click.ts` → `POST /api/click`，`functions/api/stats.ts` → `GET /api/stats`
- 数据库：D1，绑定名 `DB`（见 `wrangler.toml`），表结构在 `migrations/`
- 环境变量：`IP_SALT`（必填，线上是加密变量，本地在 `.dev.vars`）；`ALLOW_TEST_IP`（只在本地 `.dev.vars` 里设成 `1`，线上不设）
- 本地完整运行：`npm run dev:full`（构建 → 本地 D1 建表 → `wrangler pages dev`，端口 8788）

## 合法 slug 清单

构建时 `scripts/sync-assets.mjs` 生成 `site/public/api-data/slugs.json`，内容是全部 Bot 的 slug 数组（含外部收录），会进入构建产物，线上路径 `/api-data/slugs.json`。
后端用 `context.env.ASSETS.fetch(new URL('/api-data/slugs.json', request.url))` 读取，不在清单里的 slug 一律 404。可以在模块作用域缓存，单元测试里 mock `ASSETS`。

## POST /api/click

请求：`Content-Type: application/json`，body 不超过 1 KB：

```json
{ "slug": "my-bot", "kind": "import" }
```

- `kind`：`"import"`（一键导入）或 `"prompt"`（复制安装提示词）

响应（全部带 `Cache-Control: no-store`，`Content-Type: application/json; charset=utf-8`）：

| 状态 | body | 什么时候 |
|---|---|---|
| 200 | `{"ok":true,"counted":true,"heat":12}` | 计入了这次点击；`heat` 是这个 Bot 计入后的总热度 |
| 200 | `{"ok":true,"counted":false,"heat":11}` | 24 小时内这个 IP 已经给这个 Bot 计过一次，这次不算 |
| 400 | `{"ok":false,"error":"bad_request"}` | body 不是 JSON、太大、slug 格式不对、kind 不是两者之一 |
| 404 | `{"ok":false,"error":"unknown_slug"}` | slug 不在 slugs.json 里 |
| 405 | `{"ok":false,"error":"method_not_allowed"}` | 不是 POST（带 `Allow: POST`） |
| 500 | `{"ok":false,"error":"server_error"}` | 数据库出错，或没配置 `IP_SALT` |

## GET /api/stats

```json
{ "ok": true, "heat": { "my-bot": 12, "other-bot": 3 }, "byKind": { "my-bot": { "import": 9, "prompt": 3 } } }
```

- 没被点过的 Bot 不出现在里面，前端按 0 处理
- MVP 不做缓存：`Cache-Control: no-store`

## 计数规则（产品定稿，改动先问）

- **热度 = 去重后的点击次数**。同一个 IP 对同一个 Bot，24 小时内只算一次，**不分是哪个按钮**。
- 24 小时是滚动窗口，从上一次「被计入」的时间算起；窗口内的重复点击不计入，也不刷新窗口。
- 被计入的那次点击按它的 `kind` 记到 `byKind` 里。
- 只存加盐哈希，不存原始 IP：`ip_hash = hex(HMAC-SHA256(key = IP_SALT, message = ip + "|" + slug))`。没有 `IP_SALT` 时直接返回 500，绝不存未加盐的值。
- IP 来源：`CF-Connecting-IP` 请求头（Cloudflare 会覆盖，客户端伪造不了）。只有 `env.ALLOW_TEST_IP === "1"` 时才额外接受 `X-Test-IP`（本地测试模拟不同 IP 用）。两者都没有时按 `0.0.0.0` 处理。
- 热度只是按钮点击数，不是导入成功数（导入发生在 Grok Bot App 里，拿不到）。

## 前端怎么用

- 首页挂载时请求一次 `/api/stats`。失败（比如纯 `vitepress dev` 没有后端）时：热度显示「热度 —」，若用户还没手动选过排序，默认切到「最新」。
- 点按钮时用 `fetch('/api/click', { method: 'POST', keepalive: true, ... })` 发出去，**不等结果**、不阻塞打开链接或复制。收到 200 后把这个 Bot 的热度改成返回的 `heat`。
- 点击后**数字马上更新，排序不动**；下次进入页面或切换排序时才重排，避免卡片在鼠标底下跳走。
- 排序：「热门」按 heat 降序，平手按 addedAt 降序，再平手按 name；「最新」按 addedAt 降序，平手按 name。
