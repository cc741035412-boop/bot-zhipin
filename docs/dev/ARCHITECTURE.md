# 架构

## 一句话

`bots/` 里一个 Bot 一个文件夹 → 构建时读成静态网站（VitePress）→ 线上只有一个点击计数后端（Pages Functions + D1）。

## 目录

| 路径 | 是什么 | 谁会改 |
|---|---|---|
| `bots/<slug>/` | Bot 本体和卡片信息 | 投稿者 |
| `bots/_template/` | 投稿模板 | 维护者 |
| `schema/bot.schema.json` | bot.yaml 的 JSON Schema，**分类、权限、额度的枚举唯一真源** | 维护者 |
| `scripts/lib/load-bots.mjs` | 读取 bots/ 的共享代码（只读不校验） | 维护者，改了影响校验器和网站 |
| `scripts/validate.mjs` + `scripts/lib/validate/` | `npm run validate` | 维护者 |
| `scripts/sync-assets.mjs` | 构建前把截图、头像复制到 `site/public/bot-assets/`，并生成 `site/public/api-data/slugs.json` | 维护者 |
| `site/` | VitePress 站点根目录；`site/.vitepress/meta.mjs` 放站名、仓库地址、安装提示词、默认台词 | 维护者 |
| `site/.vitepress/theme/vendor/bloub/` | 第三方 MIT 头像引擎，**不要改** | 只能整体升级 |
| `functions/api/` | 点击计数接口 | 维护者 |
| `migrations/` | D1 表结构 | 维护者 |
| `tests/unit/` | vitest 单元测试；`tests/fixtures/` 校验器样例；`tests/e2e/` Playwright 真浏览器 | 维护者 |
| `docs/dev/` | 维护者文档 | 维护者 |

## 数据流

```
bots/*/bot.yaml, *.md, screenshots/
   │  scripts/lib/load-bots.mjs
   ├──────────────► scripts/validate.mjs（PR 时在 CI 里跑）
   └──────────────► site/（VitePress 数据加载器 + 动态路由 /bots/<slug>）──► site/.vitepress/dist/
                                                                          │
浏览器 ── GET /api/stats、POST /api/click ──► functions/api/* ──► D1（DB） │
                                     └─ 读 /api-data/slugs.json（ASSETS）─┘
```

## 构建与部署

- 本地：`npm run dev`（只有页面）、`npm run dev:full`（页面 + 计数接口 + 本地 D1）
- PR：GitHub Actions `.github/workflows/ci.yml`，跑 validate、test、build，不带密钥
- 上线：Cloudflare Pages 的 Git 集成，main 有新提交就自动构建部署。构建命令 `npm run build`，输出 `site/.vitepress/dist`，绑定以 `wrangler.toml` 为准
- **不要**在构建产物里放 `_worker.js`：有它时 Pages 会忽略 `functions/`

## 约定

- 面向用户的文案一律简体中文。
- 页面路径：首页 `/`，详情页 `/bots/<slug>`。
- 图片引用：`/bot-assets/<slug>/<文件名>`。
- 不复制原站（fork 来源）的任何文字、图片和组件代码。
