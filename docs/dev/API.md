# 点击计数、头像转发与作者页兜底约定

前端（`site/`）和后端（`functions/`）按这份约定各自实现，谁改约定谁同步改这份文档。

## 部署形态

- Cloudflare Pages Functions：`functions/api/click.ts` → `POST /api/click`，`functions/api/stats.ts` → `GET /api/stats`
- 同一部署中，`functions/api/avatar/[login].ts` 转发 `GET /api/avatar/<login>` 的头像，`functions/authors/[login].ts` 为 `GET /authors/<login>` 兜底；两者共用 `/api-data/authors.json`。
- 数据库：D1，绑定名 `DB`（见 `wrangler.toml`），表结构在 `migrations/`
- 环境变量：`IP_SALT`（必填，线上是加密变量，本地在 `.dev.vars`）；`ALLOW_TEST_IP`（只在本地 `.dev.vars` 里设成 `1`，线上不设）
- 本地完整运行：`npm run dev:full`（构建 → 本地 D1 建表 → `wrangler pages dev`，端口 8788）

### 0004 迁移与上线顺序

**线上要先迁移再合并代码。** 由维护者手动应用 `migrations/0004_click_kinds.sql`，确认成功后再合并触发部署。否则新按钮写入时会被旧表的 CHECK 拒绝。SQLite 不能直接改 CHECK，0004 用四种 kind 的约束重建 `click_counts`，复制全部旧行，再替换原表；保留 `(slug, kind)` 主键和 `WITHOUT ROWID`。不改 `click_dedupe`、其他表或 `IP_SALT`，已经生效的窗口无需重算。

## 路由清单

构建时 `scripts/sync-assets.mjs` 生成与站点路由一致的清单：`/api-data/slugs.json` 列 Bot（含外部收录），`/api-data/squad-slugs.json` 列小队，`/api-data/authors.json` 列公开 Bot 和小队的作者登录名；另有 `prompt-slugs.json`、`skill-slugs.json` 给 Prompt、Skill 页兜底，不在本文范围。点击接口根据下表只用 `ASSETS.fetch` 读本次点击对应的清单，不查另一份兜底。同一个 slug 可以既是 Bot 又是小队。

## POST /api/click

请求：只接受 `Content-Type: application/json`（允许 `; charset=utf-8` 等参数），body 不超过 1 KB。带 `Origin` 时必须与请求 URL 的 origin 完全相同；`Sec-Fetch-Site: cross-site` 一律拒绝。无 Origin 的非浏览器请求仍可使用，不返回跨域授权头：

```json
{ "slug": "my-bot", "kind": "import" }
```

| `kind` | 点击动作 | `slug` 必须在 | 24 小时窗口 | 计入 Bot 热度 |
|---|---|---|---|---|
| `import` | 一键导入 | `/api-data/slugs.json` | 与 `prompt` 共用 | 是 |
| `prompt` | 复制安装提示词 | `/api-data/slugs.json` | 与 `import` 共用 | 是 |
| `starter` | 复制一条 Bot 开场白 | `/api-data/slugs.json` | 开场白独立，同一 Bot 的各条开场白共用 | 否 |
| `kickoff` | 复制小队口令 | `/api-data/squad-slugs.json` | 小队口令独立 | 否 |

响应（全部带 `Cache-Control: no-store`，`Content-Type: application/json; charset=utf-8`）：

| 状态 | body | 什么时候 |
|---|---|---|
| 200 | `{"ok":true,"counted":true,"heat":12}` | 计入了这次点击；前三种返回这个 Bot 此时的热度，`kickoff` 固定返回 `heat: 0`（即使有同名 Bot） |
| 200 | `{"ok":true,"counted":false,"heat":11}` | 这个 IP 和 slug 的对应窗口内已计过一次，热度返回规则不变 |
| 400 | `{"ok":false,"error":"bad_request"}` | body 不是合法 JSON 对象、太大、slug 格式不对或 kind 不在上表 |
| 403 | `{"ok":false,"error":"forbidden"}` | Origin 与请求 origin 不同（包括 `null`），或 Sec-Fetch-Site 为 cross-site |
| 415 | `{"ok":false,"error":"unsupported_media_type"}` | Content-Type 缺失或媒体类型不是 application/json |
| 404 | `{"ok":false,"error":"unknown_slug"}` | slug 不在该 kind 的清单里 |
| 405 | `{"ok":false,"error":"method_not_allowed"}` | 不是 POST（带 `Allow: POST`） |
| 500 | `{"ok":false,"error":"server_error"}` | 数据库或清单读取出错，或没配置 `IP_SALT` |

## 头像转发 `/api/avatar/<login>`

国内浏览器经常无法连接 GitHub 头像服务，因此由本站边缘节点代取 256 像素头像。只接受 GET；先检查 GitHub 登录名，再按小写查 `/api-data/authors.json`（公开 Bot 和公开小队的 GitHub 作者并集，内存缓存 60 秒）。不在白名单内，即使已有图片缓存也不会返回，更不会请求 GitHub。

| 状态 | 含义 |
|---|---|
| 200 | 原始图片和上游 Content-Type；缓存键为当前 origin 下不带查询串的小写头像 URL。`Cache-Control: public, max-age=86400, stale-while-revalidate=604800` |
| 404 | 登录名非法或不在白名单 |
| 500 | 无法读取或解析白名单 |
| 502 | 上游请求失败、超过 5 秒、非 200、非 JPEG/PNG/GIF/WebP，声明长度为 0、实际正文为空，或声明/实际长度超过 1 MiB |
| 405 | 非 GET；`Allow: GET`，JSON 正文 `{"ok":false,"error":"method_not_allowed"}` |

404、500、502 均为空正文。所有错误响应均为 `no-store`、`nosniff`，不写入边缘缓存。

## 作者页兜底 `/authors/<login>`

GET 请求先去掉末尾的 `.html`，再用小写登录名查作者白名单：

- 在名单内但登录名含大写：返回 308，跳到 `/authors/<小写登录名>`，保留原查询串。
- 不在名单内：直接返回站点的 404 页面，不跳转、不缓存。
- 在名单内且已经小写（含小写名加 `.html`），或清单不可读：调用 `next()`，交由静态层处理。

## GET /api/stats

```json
{
  "ok": true,
  "heat": { "my-bot": 12, "new-bot": 0 },
  "byKind": {
    "my-bot": { "import": 9, "prompt": 3, "starter": 5 },
    "new-bot": { "import": 0, "prompt": 0, "starter": 1 }
  },
  "squads": { "my-squad": { "kickoff": 4 } }
}
```

- 有 `import`、`prompt` 或 `starter` 任一计数行的 Bot 同时出现在 `heat` 和 `byKind`；三种按钮都返回数字，缺的补 0。只有开场白的 Bot 热度为 0，没有这三种记录的 Bot 不出现，前端按 0 处理。
- 有 `kickoff` 行的小队单列在 `squads`，不混入同名 Bot 的统计。没有记录时三个映射都是 `{}`。
- MVP 不做缓存：`Cache-Control: no-store`

## 计数规则（产品定稿，改动先问）

- **Bot 热度 = 去重后的 `import + prompt`**。这两个按钮共用一个窗口，先点哪个就记在哪个 `kind` 下。`starter`、`kickoff` 各自单独计数，不占用其他窗口，也不影响任何 Bot 的热度或排序。
- 每个窗口都从这个 IP 对该 slug 上一次「被计入」的时间滚动算 24 小时；窗口内重复不计，也不刷新时间。恰好到边界可以再计。
- 只存 `ip_hash = hex(HMAC-SHA256(key = IP_SALT, message))`，不存原始 IP。`import/prompt` 的消息仍是 `normalizeIp(ip) + "|" + slug`（与迁移前逐字节相同）；`starter/kickoff` 用 `normalizeIp(ip) + "|" + slug + "|" + kind`。没有盐直接返回 500。
- IPv4 原值不变。IPv6 在哈希前展开 `::`、统一为小写四位十六进制组，再取前四组（/64），序列化为 `xxxx:xxxx:xxxx:xxxx::/64`；同 /64 的不同接口地址共享 24 小时去重窗口，不同 /64 独立。IPv4 映射地址（如 `::ffff:1.2.3.4`、等价十六进制写法）转换为 `1.2.3.4`，与该 IPv4 共桶。非法 IPv6 回退为 `0.0.0.0`。
- IP 来源：`CF-Connecting-IP` 请求头（Cloudflare 会覆盖，客户端伪造不了）。只有 `env.ALLOW_TEST_IP === "1"` 时才额外接受 `X-Test-IP`（本地测试模拟不同 IP 用）。两者都没有时按 `0.0.0.0` 处理。
- 热度只是按钮点击数，不是导入成功数（导入发生在 Grok Bot App 里，拿不到）。

## 前端怎么用

- 首页和非预览 Bot 详情页挂载时请求 `/api/stats`，只读 `heat`。接口失败（比如纯 `vitepress dev` 没有后端）时，详情页仍显示「热度 —」，列表卡不显示热度，不强制切换排序。
- 点按钮时用 `fetch('/api/click', { method: 'POST', keepalive: true, ... })` 发出去，**不等结果**、不阻塞跳转或复制。开场白和口令统计的是点击：成功写入剪贴板或退回选中文字都上报；投稿预览和小队的「试一句」不上报。
- **只有 `import/prompt` 的成功响应更新热度数字**，不立即重排。`starter/kickoff` 的响应不更新热度状态。下次进入页面或切换排序时，「最热」仍按热度降序，平手按上架日期降序，再按显示名。

## 后端实现细节与本地验证

### 输入与响应

- 1 KB 指 **1024 字节**，边界值可接受；先检查 `Content-Length`，再累计实际读取的请求体字节数（UTF-8），不信任客户端声明。没有该头、声明偏小或分块传输也受限；读取超限立即取消后续读取，返回 400。
- body 必须是 JSON 对象；slug 长度 2–40，匹配 `^[a-z0-9]+(-[a-z0-9]+)*$`。额外字段不参与计数。
- 本地显式开启 `ALLOW_TEST_IP === "1"` 时，非空 `X-Test-IP` 优先于 `CF-Connecting-IP`；否则不读取测试头。空头值按缺失处理。
- 用于点击计数的两份清单都必须是合法 slug 的 JSON 数组；模块作用域按 ASSETS 绑定、请求 origin 和清单路径缓存成功结果 60 秒。HTTP 失败、读取失败、JSON/结构错误均返回通用 500，不缓存失败，也不回退到已过期的清单。
- `GET /api/stats` 用 `Object.create(null)` 建 `heat`、`byKind`、`squads` 三个映射，以支持 `constructor` 等合法 slug。读库失败返回 `500 {"ok":false,"error":"server_error"}`。
- 两个接口的成功及错误响应都带统一 JSON Content-Type 和 `no-store`。click 非 POST 返回 `Allow: POST`，stats 非 GET 返回 `Allow: GET`，包括 OPTIONS 和 HEAD；HEAD 在 HTTP 传输层不发送响应体。
- POST 先检查媒体类型（415）、再检查来源（403），拒绝时不读取 body、IP 或 slug 清单、不记录点击。通过请求头检查后，缺失或空 `IP_SALT` 时优先返回 500，不读取 IP、不计算哈希、不记录点击。盐有效后先校验 body（400），再按 kind 查清单（不在清单内为 404）。数据库/资源读取错误的内部详情不写日志、不返回客户端。

### 去重、清理与故障边界

- `last_at` 是服务器毫秒时间戳；24 小时为 `86400000` 毫秒，恰好到达窗口边界即可再次计入。客户端不能指定时间；核心 `recordClick` 接收可注入的 `now`，供单元测试验证边界。
- 去重用单条条件 UPSERT，只有 `meta.changes === 1` 的请求执行计数 UPSERT。真实本地 D1 实测：首次插入为 1，冲突且 WHERE 不成立为 0，到期更新为 1；窗口内的重复不修改 `last_at`。
- 每次 API 请求独立以 1/100 概率通过 `context.waitUntil` 删除 `last_at < now - 86400000` 的去重行；恰好位于边界的行不删除，历史 `click_counts` 不清理。清理是尽力而为，失败不影响接口响应。
- 去重更新与计数累加按约定分两条语句执行，**不是同一事务**：若第二步失败或中途执行中断，去重时间可能已经生效但没有累加成功。接口遇到数据库错误返回 500，窗口内重试不保证补计；后续若要求故障下也严格一致，需要另行设计和确认。并发响应的 heat 是各自查询时的快照，不保证所有请求读到相同值。
- 盐轮换会改变已有 IP 的哈希，旧窗口无法继续匹配；应把盐作为稳定的部署密钥管理。线上不要设置 `ALLOW_TEST_IP`。

### 运行测试

- `npm test`：`tests/unit/api.test.mjs` 使用 `getPlatformProxy({ persist: false, remoteBindings: false })` 提供的真实本地 D1，配置放在临时目录，不读取开发者的 `.dev.vars`，不用手写数据库替身。按文件名顺序应用 `migrations/*.sql`。ASSETS 在单元测试中 mock；验证旧库升级、三种窗口、时间边界、同名 Bot/小队、20 请求并发、D1 changes 语义及错误路径。
- `bash scripts/accept-click.sh`：复制源码到 `mktemp -d`，生成一次性盐，构建示例 Bot 和小队、迁移本地 D1、启动真正的 Pages Functions，以 HTTP 验证响应后查库；不修改现有本地数据库或变量文件。
- 默认端口 8790 / inspector 9330，可用 `PORT=8795 INSPECTOR_PORT=9335 bash scripts/accept-click.sh` 覆盖。占用端口时直接失败，不清理其他进程；退出时核对 PID/命令，只清理本次启动的独立进程组。
- 响应头探测使用已计入过的测试地址，不增加额外计数。成功清理临时副本并以 `ACCEPT-CLICK OK` 结束；失败保留临时日志路径，但移除一次性 `.dev.vars`。
