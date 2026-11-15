# 点击计数接口约定

前端（`site/`）和后端（`functions/`）按这份约定各自实现，谁改约定谁同步改这份文档。

## 部署形态

- Cloudflare Pages Functions：`functions/api/click.ts` → `POST /api/click`，`functions/api/stats.ts` → `GET /api/stats`
- 数据库：D1，绑定名 `DB`（见 `wrangler.toml`），表结构在 `migrations/`
- 环境变量：`IP_SALT`（必填，线上是加密变量，本地在 `.dev.vars`）；`ALLOW_TEST_IP`（只在本地 `.dev.vars` 里设成 `1`，线上不设）
- 本地完整运行：`npm run dev:full`（构建 → 本地 D1 建表 → `wrangler pages dev`，端口 8788）

## 合法 slug 清单

构建时 `scripts/sync-assets.mjs` 生成 `site/public/api-data/slugs.json`，内容是 bot.yaml 可解析、slug 合法且与文件夹名相同的 Bot slug 数组（含外部收录，与网站路由一致），会进入构建产物，线上路径 `/api-data/slugs.json`。
后端用 `context.env.ASSETS.fetch(new URL('/api-data/slugs.json', request.url))` 读取，不在清单里的 slug 一律 404。可以在模块作用域缓存，单元测试里 mock `ASSETS`。

## POST /api/click

请求：只接受 `Content-Type: application/json`（允许 `; charset=utf-8` 等参数），body 不超过 1 KB。带 `Origin` 时必须与请求 URL 的 origin 完全相同；`Sec-Fetch-Site: cross-site` 一律拒绝。无 Origin 的非浏览器请求仍可使用，不返回跨域授权头：

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
| 403 | `{"ok":false,"error":"forbidden"}` | Origin 与请求 origin 不同（包括 `null`），或 Sec-Fetch-Site 为 cross-site |
| 415 | `{"ok":false,"error":"unsupported_media_type"}` | Content-Type 缺失或媒体类型不是 application/json |
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
- 只存加盐哈希，不存原始 IP：`ip_hash = hex(HMAC-SHA256(key = IP_SALT, message = normalizeIp(ip) + "|" + slug))`。没有 `IP_SALT` 时直接返回 500，绝不存未加盐的值。
- IPv4 原值不变。IPv6 在哈希前展开 `::`、统一为小写四位十六进制组，再取前四组（/64），序列化为 `xxxx:xxxx:xxxx:xxxx::/64`；同 /64 的不同接口地址共享 24 小时去重窗口，不同 /64 独立。IPv4 映射地址（如 `::ffff:1.2.3.4`、等价十六进制写法）转换为 `1.2.3.4`，与该 IPv4 共桶。非法 IPv6 回退为 `0.0.0.0`。
- IP 来源：`CF-Connecting-IP` 请求头（Cloudflare 会覆盖，客户端伪造不了）。只有 `env.ALLOW_TEST_IP === "1"` 时才额外接受 `X-Test-IP`（本地测试模拟不同 IP 用）。两者都没有时按 `0.0.0.0` 处理。
- 热度只是按钮点击数，不是导入成功数（导入发生在 Grok Bot App 里，拿不到）。

## 前端怎么用

- 首页挂载时请求一次 `/api/stats`。失败（比如纯 `vitepress dev` 没有后端）时：热度显示「热度 —」，若用户还没手动选过排序，默认切到「最新」。
- 点按钮时用 `fetch('/api/click', { method: 'POST', keepalive: true, ... })` 发出去，**不等结果**、不阻塞打开链接或复制。收到 200 后把这个 Bot 的热度改成返回的 `heat`。
- 点击后**数字马上更新，排序不动**；下次进入页面或切换排序时才重排，避免卡片在鼠标底下跳走。
- 排序：「热门」按 heat 降序，平手按 addedAt 降序，再平手按 name；「最新」按 addedAt 降序，平手按 name。

## 后端实现细节与本地验证

### 输入与响应

- 1 KB 指 **1024 字节**，边界值可接受；先检查 `Content-Length`，再累计实际读取的请求体字节数（UTF-8），不信任客户端声明。没有该头、声明偏小或分块传输也受限；读取超限立即取消后续读取，返回 400。
- body 必须是 JSON 对象；slug 长度 2–40，匹配 `^[a-z0-9]+(-[a-z0-9]+)*$`。额外字段不参与计数。
- 本地显式开启 `ALLOW_TEST_IP === "1"` 时，非空 `X-Test-IP` 优先于 `CF-Connecting-IP`；否则不读取测试头。空头值按缺失处理。
- `slugs.json` 必须是合法 slug 的 JSON 数组；模块作用域按 ASSETS 绑定和请求 origin 缓存成功结果 60 秒。HTTP 失败、读取失败、JSON/结构错误均返回通用 500，不缓存失败，也不回退到已过期的清单。
- `GET /api/stats` 为每个出现的 Bot 同时返回 `import`、`prompt` 两个数字，未计入过的按钮为 0；从未点击的 Bot 仍不出现。读库失败返回 `500 {"ok":false,"error":"server_error"}`。
- 两个接口的成功及错误响应都带统一 JSON Content-Type 和 `no-store`。click 非 POST 返回 `Allow: POST`，stats 非 GET 返回 `Allow: GET`，包括 OPTIONS 和 HEAD；HEAD 在 HTTP 传输层不发送响应体。
- POST 先检查媒体类型（415）、再检查来源（403），拒绝时不读取 body、IP 或 slug 清单、不记录点击。通过请求头检查后，缺失或空 `IP_SALT` 时优先返回 500，不读取 IP、不计算哈希、不记录点击。数据库/资源读取错误的内部详情不写日志、不返回客户端。

### 去重、清理与故障边界

- `last_at` 是服务器毫秒时间戳；24 小时为 `86400000` 毫秒，恰好到达窗口边界即可再次计入。客户端不能指定时间；核心 `recordClick` 接收可注入的 `now`，供单元测试验证边界。
- 去重用单条条件 UPSERT，只有 `meta.changes === 1` 的请求执行计数 UPSERT。真实本地 D1 实测：首次插入为 1，冲突且 WHERE 不成立为 0，到期更新为 1；窗口内的重复不修改 `last_at`。
- 每次 API 请求独立以 1/100 概率通过 `context.waitUntil` 删除 `last_at < now - 86400000` 的去重行；恰好位于边界的行不删除，历史 `click_counts` 不清理。清理是尽力而为，失败不影响接口响应。
- 去重更新与计数累加按约定分两条语句执行，**不是同一事务**：若第二步失败或中途执行中断，去重时间可能已经生效但没有累加成功。接口遇到数据库错误返回 500，窗口内重试不保证补计；后续若要求故障下也严格一致，需要另行设计和确认。并发响应的 heat 是各自查询时的快照，不保证所有请求读到相同值。
- 盐轮换会改变已有 IP 的哈希，旧窗口无法继续匹配；应把盐作为稳定的部署密钥管理。线上不要设置 `ALLOW_TEST_IP`。

### 运行测试

- `npm test`：`tests/unit/api.test.mjs` 使用 `getPlatformProxy({ persist: false, remoteBindings: false })` 提供的真实本地 D1，配置放在临时目录，不读取开发者的 `.dev.vars`，不用手写数据库替身。ASSETS 在单元测试中 mock；验证时间边界、20 请求并发、D1 changes 语义及错误路径。
- `bash scripts/accept-click.sh`：复制源码到 `mktemp -d`，生成一次性盐，构建示例 Bot、迁移本地 D1、启动真正的 Pages Functions，以 HTTP 验证响应后查库；不修改现有本地数据库或变量文件。
- 默认端口 8790 / inspector 9330，可用 `PORT=8792 INSPECTOR_PORT=9332 bash scripts/accept-click.sh` 覆盖。占用端口时直接失败，不清理其他进程；退出时核对 PID/命令，只清理本次启动的独立进程组。
- 响应头探测使用已计入过的测试地址，不增加额外计数。成功清理临时副本并以 `ACCEPT-CLICK OK` 结束；失败保留临时日志路径，但移除一次性 `.dev.vars`。
