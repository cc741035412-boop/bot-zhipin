# 架构

## 一句话

`bots/` 里一个 Bot 一个文件夹 → 构建时读成静态网站（VitePress）→ 线上后端只有两块：点击计数，和网站投稿（Pages Functions + D1）。

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
| `site/.vitepress/theme/live/` | 单 rAF 时钟 clock.ts、视线 gaze.ts、帧与反应接线；离屏/隐藏/减少动效暂停 | 维护者 |
| `site/.vitepress/theme/components/LiveBot.vue` | SSR sample(0) + 客户端活体 SVG；bz-play 事件入口 | 维护者 |
| `site/.vitepress/theme/face.ts` | 官方形状映射、botFace / resolveFace、faceColors 和 seed 回退 | 维护者 |
| `site/.vitepress/theme/shapes-extra.ts` | 15 种原创径向轮廓，不复制 x.ai 路径 | 维护者 |
| `site/.vitepress/theme/color.ts` | contrast、darkSwap、buttonColors、botPalette 纯函数配色 | 维护者 |
| `site/.vitepress/theme/style.css` | 全站视觉：token、悬浮导航条换肤、Hero、精选、工具栏、列表卡、气泡、详情页、响应式和减少动效；分节见文件内注释 | 维护者 |
| `site/.vitepress/theme/enums.data.mjs` | 构建时用 `loadEnums()` 读 schema，把分类枚举（含顺序）给到浏览器；首页分类筛选用 | 维护者 |
| `site/.vitepress/theme/components/BotShelf.vue` | 首页：极光、砖墙、标题、搜索入口、精选、排序 + 分类筛选、列表、空状态 | 维护者 |
| `site/.vitepress/theme/components/HeroPortrait.vue` | 砖墙里的一块玻璃砖 + 一只吉祥物（数据在 `meta.mjs` 的 `HERO_MASCOTS`） | 维护者 |
| `site/.vitepress/theme/components/FeaturedCard.vue` | 精选大卡：活 Bot、名字、介绍、作者、热度、导入；不带气泡 | 维护者 |
| `site/.vitepress/theme/components/SearchTrigger.vue` | 长得像输入框的按钮（首屏和工具栏各一个），只负责派发 `bz-search-open` | 维护者 |
| `site/.vitepress/theme/components/SearchPalette.vue` + `theme/search.ts` | 搜索命令面板和它的匹配、排序规则；挂在 Layout 的 `layout-bottom` 插槽，全站可用 | 维护者 |
| `site/.vitepress/theme/components/BotCard.vue`、`BotAvatar.vue`、`BotActions.vue` | 列表卡：article 是容器查询的容器，里面的 `.bot-card-body` 是版式网格；头像外层在卡片里 `display: contents`，玻璃砖和气泡各占一格。/submit 的投稿预览复用这几个组件 | 维护者 |
| `site/.vitepress/theme/components/BotDetail.vue` | 详情页：玻璃砖舞台 + 信息，下面各区块是细边玻璃卡；同样被投稿预览复用 | 维护者 |
| `site/.vitepress/data/faces.json` | slug → color / shape / fetchedAt 的离线真脸数据，静态 import | 维护者 |
| `scripts/sync-faces.mjs` | 手动抓 x.ai 模板页；--check 离线校验 | 维护者 |
| `functions/api/` | 点击计数接口 | 维护者 |
| `migrations/` | D1 表结构 | 维护者 |
| `tests/unit/` | vitest 单元测试；`tests/fixtures/` 校验器样例；`tests/e2e/` Playwright 真浏览器 | 维护者 |
| `docs/dev/` | 维护者文档 | 维护者 |

## 数据流

```
x.ai 模板页 →（维护者跑 sync-faces）→ site/.vitepress/data/faces.json → 构建

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
- **构建不联网**：真脸抓取是维护者独立操作，npm run build 不调用 sync-faces；页面静态导入 faces.json，不在运行时拉脸数据。抓取失败保留旧条目并警告，无数据用原 seed 算法。
- 活体/真脸/彩色模块的接口与状态标记见 INTERACTION（现为 v4）；版式和视觉规格也在那里，改样式前先读。
- **导航条不另写组件**：悬浮玻璃导航条是给 VitePress 默认顶栏（`.VPNavBar`）换肤，汉堡菜单、主题开关、社交链接都是默认主题的。默认主题的 scoped 样式特异性高，覆盖规则统一写成 `.Layout .VPNav …` 前缀；背景色通过 `--vp-nav-bg-color` 变量给，不和它的 `:not()` 选择器拼特异性。
- **文字的祖先不放背景图**：极光、柔光、悬停层都在独立元素或伪元素里，这样对比度可以按纯色底算（验收脚本会沿祖先链检查）。
- **版式跟着容器走**：列表卡用 `@container` 按卡片自身宽度切换宽/窄版式，所以同一张卡放进 /submit 的窄预览栏不用另写样式。
- 页面路径：首页 `/`，详情页 `/bots/<slug>`。
- 图片引用：`/bot-assets/<slug>/<文件名>`。
- 不复制原站（fork 来源）的任何文字、图片和组件代码。

## Issue 表单投稿（S2）

```text
AI 的本地 Bot 目录
  └─ scripts/make-submission-link.mjs（临时副本校验）
       └─ 预填 Issue 链接（过长时给明文投稿包）
            └─ 学员登录 GitHub → 拖真实截图 → 勾 CC BY 4.0 → 提交
                 └─ .github/workflows/submission.yml（默认分支的可信代码）
                      ├─ 不通过：编辑/新发一条中文诊断评论
                      └─ 通过：submission/issue-<号>，默认分支之上的一个提交
                           └─ 创建/更新 PR → workflow_dispatch 派发 ci.yml
                                └─ validate-and-build → 人工批准 → 合并上线
```

### 代码分层

- `scripts/submission/bundle.mjs`：纯文本容器 `pack({ slug, files, screenshots })` / `unpack(text)`；`files` 的键是完整的 `bots/<slug>/...` 相对路径。`encode(text)` / `decode(token)` 在明文与 `BZB1:` + base64url(gzip) 之间转换，保留文本原有换行和中文。每个文本段尾多一个容器换行；正文不能使用独占一行的 `=== ... ===` 保留分隔符。
- `scripts/make-submission-link.mjs`：读取文本和截图名，缺图时从 DESIGN 的本地图片引用推导顺序。先在临时目录叠加默认 bots 数据进行 `validateBots` 校验，缺图时仅在副本放占位图，结束删除副本。截图、头像二进制均不进包；头像会提示省略，改用网站默认头像。支持位置参数和 `--dir`。URL 长度超过 7500 就输出不含 bundle 的表单链接与完整明文。
- `scripts/submission/issue.mjs`：固定字段解析（不把代码围栏内的标题当表单标题）、授权与作者校验、slug 占用/addedAt 检查、提交及 PR 元数据生成，均为纯函数。
- `scripts/submission/screenshots.mjs`：Markdown / HTML 图片提取、受限下载；按文件头决定扩展名，生成文件计划并修正对应的简单本地 Markdown 图片引用。多出来的图片使用 `screenshot-<序号>.<ext>`；缺少已声明的图片或命名冲突会报错，不静默覆盖。
- `scripts/submission/from-issue.mjs`：注入适配器的流程编排。校验器及单 slug 范围检查均成功之前，不建分支、不创建 PR。
- `scripts/submission/adapters.mjs`：默认分支签出目录的文件系统操作、`validateBots`、git / gh 参数数组适配器。测试替换命令和 fetch，不联系 GitHub。
- `scripts/submission/errors.mjs`：统一中文「文件 / 位置 / 问题 / 改法」诊断，脱敏、代码块隔离和长度限制。只编辑 `github-actions[bot]` 发布且带 `<!-- bot-zhipin-submission -->` 的评论，不信任人类复制的标记。

### 工作流与发布

`submission.yml` 只处理带「投稿」标签、仍然 open 的 opened / edited / reopened 事件；同一个 Issue 的旧运行会被取消。签出仓库默认分支（完整历史），只安装生产依赖，Issue 正文、作者 login/id、编号都通过 env 传给 Node，不插入 shell。新增仅写一个 Bot 目录；更新需作者一致且原 addedAt 不变，才清空旧目录后重写。校验覆盖整个 bots 集合，可发现重复模板链接等跨 Bot 问题；范围检查覆盖删除、修改和未跟踪文件，并比普通贡献者规则更严格：只许本次 slug。

分支固定为 `submission/issue-<号>`，每次从本次签出的默认分支提交重建一个提交并 force push；只覆盖工作流独占分支。作者使用 Issue login 与 `<id>+<login>@users.noreply.github.com`，提交者使用 Actions bot，不改 git config。PR 绑定来源 Issue 并含 `Closes #<号>`；自动化只勾选能证实的校验/授权项，截图真实性、隐私和模板页匿名可访问仍需维护者复核。

GITHUB_TOKEN 创建的 PR 不会触发普通 PR 事件，因此显式执行 `gh workflow run ci.yml --repo <本仓库> --ref submission/issue-<号>`。CI 的 `validate-and-build` 跑在该分支 head 上，保留只读权限和两层历史；手动派发按 CONTRIBUTOR 严格检查范围。错误评论可随 Issue 编辑重试更新；发布后派发失败也不会误报成功，但先前已创建的分支/PR 可能保留，下次运行复用。

### 安全与运维边界

- 解包只接受同一个合法 slug 下的普通相对路径，拒绝绝对路径、反斜杠、`..`、隐藏段、大小写重名和文件/目录冲突；每段最长 255 字符、全路径最长 1024。文本扩展名白名单为 `.yaml .yml .md .txt .json`，不执行任何投稿内容。
- 最多 30 个文件（含截图），单文本最多 100KB、文本总量最多 400KB；gzip 输出由 zlib 的 `maxOutputLength` 硬限 512KB。只接收有效 UTF-8，不接受 NUL。写入前检查目录树，拒绝符号链接/特殊文件；运行开始要求干净签出目录。
- 初始截图地址必须在 `https://github.com/user-attachments/assets/`，每一跳在请求前检查 HTTPS 和主机（`github.com` 或 `*.githubusercontent.com`），最多五次重定向；不发送身份凭据。整张图片含重定向/读流共 20 秒，按声明和实际流量双重限制 2MB，并验证文件头，不能靠改后缀伪装。
- 写权限只供可信默认分支脚本建立受限 Bot 提交/PR/评论及派发 CI；无需用户令牌。仍依赖人工批准和分支保护，不自动合并。图片头校验不能证明截图真实性、无隐私或完整可解码，自动校验不是内容审核。
- 上线前维护者需确认「投稿」标签已存在、Actions 允许创建 PR，且这两个工作流已在默认分支；本任务不创建标签或操作真实 GitHub。新增标签本身不触发处理，之后需编辑或重新打开 Issue。
- 本轮按契约保留 CI 原有 concurrency 配置：手动派发没有 PR number，多个不同分支的手动 CI 仍可能互相取消；联调需验证并安排必要的重派发，后续单独调整分组。Issue 的原生正文/URL 限制也可能比包格式更小，特别大的明文包需先缩减内容。
- 校验失败不更新已有 PR，所以旧 PR 可能仍存在；维护者合并前要核对 Issue 最新评论与最新 head 的检查。并发不同 Issue 使用同一 slug 也需在审核/合并阶段复核，默认分支上已被他人占用时下一次处理会拒绝覆盖。

验证：`tests/unit/submission.test.mjs` 在临时目录测试完整链路，网络和 git/gh 都是假适配器；真实 GitHub 的预填、附件 CDN、令牌权限和保护分支检查关联仍需维护者联调。

## 网站直投（S3）

接口、cookie、回执、限流、错误码以 [`SUBMIT.md`](SUBMIT.md) 为准；页面状态和文案以 [`INTERACTION-SUBMIT.md`](INTERACTION-SUBMIT.md) 为准。

```text
AI：make-submission-link → https://bot-zhipin.pages.dev/submit#BZB1:…
 /submit（浏览器）：解包 → 预览卡片和详情页 → 校验内核即时报错
   → 用 GitHub 登录（/api/auth/*，零 scope OAuth App，取完身份即撤销令牌）
   → 截图逐张上传（/api/submit/screenshot → GitHub blob，返回签名回执）
   → 提交（/api/submit：服务端重新校验和密钥扫描 → 改写 author.github、addedAt
        → GitHub App 在 submission/web-<id>-<slug> 建单提交 → 建或更新 PR → 开启自动合并）
 pull_request CI（validate-and-build）→ 维护者 Approve → 自动合并
 push main → announce-live：等 build.json 到达本次合并提交 → 评论「已上线」→ 删投稿分支
```

### 代码分层

| 位置 | 职责 |
|---|---|
| `scripts/lib/bot-model.mjs`、`scripts/lib/validate/core.mjs` 等纯内核 | 不读盘、不依赖 node，CLI、浏览器、Function 共用；`load-bots.mjs` 和 `validate/index.mjs` 是 Node 适配器 |
| `scripts/lib/validate/generated/bot-schema.mjs` | Ajv standalone 预编译结果（`npm run gen:schema` 生成，提交进仓库） |
| `scripts/lib/submit-fields.mjs` | `applyServerFields`：只改写 author 和 addedAt 两段原文 |
| `scripts/sync-assets.mjs` | 构建时另生成 `/api-data/submit-context.json`（已上架索引、模板原文、说明文案、限额）和 `/api-data/build.json` |
| `site/.vitepress/theme/submit/` | 投稿页的浏览器端逻辑；`site/submit.md` 和 `Submit*.vue` 是界面 |
| `functions/api/auth/*` | 登录、回调、me、退出 |
| `functions/api/submit/*` | 截图上传、提交、状态 |
| `functions/_lib/github.ts` | 只暴露固定的几个 GitHub 操作，内部检查 URL 白名单和分支名，不导出通用请求方法 |
| `.github/workflows/announce-live.yml` | 上线通知 |

### 安全边界

- 投稿始终是数据：Markdown 用 `html:false` 渲染，外链图片只显示成链接，预览里没通过 schema 的字段不进任何链接。
- 校验和密钥扫描在任何 GitHub 写操作之前完成；tree 只放 `bots/<slug>/`，mode 只有 100644 和 040000。
- 会话 cookie `__Host-bz_s`：HttpOnly、Secure、SameSite=Strict，2 小时；写接口校验同源，只收 JSON 或图片类型，不发 CORS 头。
- D1 限流：按人、按 IP、全站三层；每人同时最多 3 个未合并的网站投稿 PR。
- 规则集：保留推送后旧批准作废、要求代码所有者批准；App 不在绕过名单。
