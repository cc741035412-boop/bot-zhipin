# 交互与视觉规格（v5：设计系统 + Raycast 版式 + Grok 灵动）

累计规格的真源为 2026-11-14 已批准计划及 LB1、LB2、LB3、LB4、LB6、2026-11-15 LB8、LB9 契约，以及 2026-11-15 的 V5-DESIGN 契约；冲突以 V5-DESIGN 为准。v4 把首页和详情页整体换成「Raycast Store 的结构和质感 + Grok Bot 的灵动和颜色」（决策 31）；v5 在这个方向上补一套成体系的设计系统：token 阶梯、基础部件、中性的界面（决策 36）。活体头像、真脸、互动行为（LB1–LB3、LB6）不变。验收容差由批次目录 `verify/` 的脚本定义。

**v5 分批落地**：第一批是设计系统（§0、§1、§1b）、导航条和首屏（§2.1、§2.2）、首页区块和卡片（§2.3–§2.5、§3）、详情页（§9）、404 和空状态（§10），本文这些小节写的就是现在的实现。岗位分组、小队、专题、详情页两栏、Bot 介绍加厚留给第二批（V5-DESIGN §4.2–§6），做的时候再改写对应小节。

**界面上不放解释性的句子**（用户 2026-11-15 定，决策 37）：区块只有标题和数据，没有说明、提示、引导语；功能靠设计表达，按钮一律「图标 + 动词」，卡片整张可点进详情。详见 §0 第 6 条。

实测的 Raycast Store 规格只用来对齐结构、尺寸和质感；不复制它的代码、图标、文案和红色光束背景。

## 0. 原则

1. **界面是中性的，颜色只来自 Bot**：页面是一家干净、有层次的商店（细边、内高光、玻璃、大留白）。按钮、标签、筛选、边框都是黑白灰；彩色只出现在 Bot 身体、砖底的柔光、悬停时透出来的 Bot 色、按钮的淡染。这样彩色才显眼。首屏是一墙五颜六色、会动的吉祥物和砖墙背后的三团色光。货架保持官方色，不给灰色 Bot 换色（决策 30）。深色是主打。
   - **每个数都落在阶梯上**：字号、间距、圆角只用 §1 的取值。任意两个相邻元素的间距都要说得出是阶梯上的哪一档。
   - **先让人看懂它干什么**：信息比装饰重要，卡片和详情页宁可多一行有用的字，不留一块没用的空白。
   - 交付前每页过一遍自检四问：缩到 25% 看层级还清楚吗；灰度下主次分得清吗；和 Raycast 截图并排哪边更像成品；颜色是不是一眼够多（来自 Bot，而不是来自按钮）。
2. **Bot 是活的**：呼吸、眨眼、视线漂移；全卡悬停有反应，首屏砖墙、主推卡也能互动。变形只作短暂彩蛋，常驻反应优先保留自身轮廓。
3. **真脸**：读取官方公开的颜色和形状名；复用 MIT bloub 或原创轮廓，不复制 x.ai 路径、眼睛坐标或代码。
4. **文字背后是纯色**：所有装饰光效（极光、砖里的柔光、卡片悬停层、详情页光晕）都放在独立的装饰元素或伪元素里，文字的祖先元素自己不放 `background-image`。名字、介绍、作者、热度、标签、筛选、排序、计数、按钮文字在两个主题下对比度都 ≥ 4.5。
5. **可用性底线不降**：键盘、触摸、读屏、焦点、对比度、减少动效全部保留；全页只开一个气泡，气泡不压头像和按钮。字体不联网，新增 token 统一 `--bz-`。按钮高 36px（触摸 44px）；触摸目标 ≥ 44px；320–1440 任何宽度不横向滚动。
6. **界面上不放解释性的句子，功能靠动线和直觉表达**（决策 37）。
   - 不显示：副标题、区块说明、页尾引导语、额度和权限后面的说明句、来源说明、「暂无……」这类空提示、404 的说明句。没有内容的区块整块不渲染。
   - 照常显示：Bot 自己的内容（名字、一句话介绍、导入前准备、台词）；属性数据（额度、要不要连账号、会不会自己跑、热度、计数）；状态反馈（已复制、筛选为空的一句话）；`/submit` 的全部文字和流程（含投稿预览里「还缺什么」的提示）。
   - 有用的解释（额度档位、每项权限的含义）放 `title` 悬停提示和读屏文本（`.bz-sr-only`），不直接显示。
   - 按钮一律「图标 + 动词」（`BzIcon`）：导入、一键导入（`arrow-up-right`）、我要投稿（`plus`）、返回货架（`arrow-left`）、复制安装提示词（`copy`，复制后变 `check`）。每个按钮不靠旁边的句子也要看得懂。
   - 列表卡和主推卡整张可点进详情（§3.2）。主次靠位置和样式区分：一屏只有一个实心主按钮。
   - 要加界面文案，先问用户。

## 1. 设计 token 与配色

浅色写在 `:root`，深色写在 `.dark`；主题跟随系统（`appearance: true`）。**深色是主打**，浅色用同一套结构换一组暖色 token。颜色混合一律用 `color-mix(in srgb, …)`。

| token | 浅色 | 深色 |
|---|---|---|
| `--bz-page` / `--vp-c-bg` | `#f6f5f1` | `#07080a` |
| `--bz-card` / `--bz-paper` | `#ffffff` | `#0c0d0f`（气泡、搜索框、面板、键帽等需要实底的地方用） |
| `--bz-eye` | `#16161b` | `#16161b`（恒定，不随主题切换） |
| `--bz-ink` | `#141418` | `#ffffff` |
| `--bz-ink-hover` | `#2c2c33` | `#e4e4e7` |
| `--bz-text-2` | `#4a4a52` | `#9c9c9d` |
| `--bz-text-3` | `#62626b` | `#8b8c8f`（Raycast 的 `#6a6b6c` 对比度不够，不用） |
| `--bz-border` | `#e6e2d9` | `rgba(255,255,255,.08)` |
| `--bz-hairline`（细边） | `rgba(20,20,24,.08)` | `rgba(255,255,255,.06)` |
| `--bz-highlight`（内高光） | `inset 0 1px 0 rgba(255,255,255,.7)` | `inset 0 1px 0 rgba(255,255,255,.05)` |
| `--bz-glass`（玻璃底） | `rgba(255,255,255,.7)` | `rgba(255,255,255,.04)` |
| `--bz-surface-soft` | `#efede7` | `#17181b` |
| `--bz-flame` | `#f97316` | `#fb923c` |
| `--bz-success`（保留） | `#16a34a` | `#4ade80` |
| `--bz-quota-low/mid/high`（保留） | `#15803d` / `#b45309` / `#b91c1c` | `#4ade80` / `#fbbf24` / `#f87171` |

- `--bz-radius-card` 现在是 `--bz-r-card`（12px）的别名。`--bz-shadow-card`、`--bz-shadow-float` 只给浮层用（搜索面板、手机菜单、弹窗）；**卡片不用投影**，靠细边 + 内高光分层。气泡保留漫画式的硬投影。
- `--bz-shadow-hover` 为 Bot 染色阴影（保留给 /submit），颜色用 `color-mix(in srgb, var(--bz-bot-color) 55%, transparent)`。
- `--bz-ease-spring: cubic-bezier(.34,1.56,.64,1)`；旧 `--bz-ease-pop` 继续可用。
- `--bz-font-display: ui-rounded, "SF Pro Rounded", "PingFang SC", "HarmonyOS Sans SC", "Microsoft YaHei", system-ui, sans-serif`：**只用于**站名、各级标题、卡片上的 Bot 名、气泡台词。`--bz-font-text: system-ui, -apple-system, "PingFang SC", "HarmonyOS Sans SC", "Microsoft YaHei", sans-serif`：其余全部（正文、按钮、标签、筛选、元信息）；VitePress 的 `--vp-font-family-base` 也指向它。按钮和标签不再用圆体。不加载网络字体或外部样式。
- 兼容 /submit：不得删除或改名 `--bz-ink`、`--bz-ink-hover`、`--bz-paper`、`--bz-card`、`--bz-border`、`--bz-text-2`、`--bz-text-3`、`--bz-surface-soft`、`--bz-success`、`--bz-quota-*`、`--bz-radius-card`、`--bz-shadow-hover`、`--bz-font-display`、`--bz-ease-spring`、`--bz-ease-pop`。额度背景仍用同色 12% 混合。
- 只在 `theme/styles/` 内部使用的派生量（`--bz-card-bg`、`--bz-tile-*`、`--bz-hero-tile-*`、`--bz-nav-*`、`--bz-seg-*`、`--bz-hover-*`、`--bz-aurora-opacity`、`--bz-featured-glow`、`--bz-btn-fill*`、`--bz-btn-edge*`、`--bz-glow-*`、`--bz-hero-*`）不算对外 token，可以随视觉调整。
- Grok 调色板：橙 `#ff6a13`、紫 `#8b5cf6`、青绿 `#14b8a6`、琥珀 `#f5a623`、棕 `#9a6a3a`、粉 `#ff2e93`、薄荷绿 `#34d399`、蓝 `#3b82f6`、玫红 `#f43f5e`。

`theme/color.ts` 是纯函数配色层：

| 接口 | 规则 |
|---|---|
| `contrast(a, b)` | WCAG 对比度 |
| `darkSwap(hex)` | 相对亮度 L < 0.04 时换 `#f1efe9`，否则原色；返回小写 |
| `buttonColors(hex)` | fg 从 `#ffffff`、`#141418` 选对比度较高者；仍 < 4.5 时，白字的 bg 每次向黑混 4%，深字的 bg 每次向白混 4%，直到 ≥ 4.5；返回小写 hex `{ bg, fg }` |
| `botPalette(hex)` | 返回 `--bz-bot-light`、`--bz-bot-dark`、`--bz-btn-bg-light`、`--bz-btn-fg-light`、`--bz-btn-bg-dark`、`--bz-btn-fg-dark`；dark 按 darkSwap 后的颜色计算 |

列表卡 article、主推卡、详情页根节点和头部、每块 Hero 砖、404 页均加 `bz-bot-scope` 并绑定 `botPalette`。CSS 将 `--bz-bot-color` 指向 light 或 dark 组，不用 JS 监听主题；同一个范围里还会把次级按钮的底和边（`--bz-btn-fill`、`--bz-btn-edge` 及悬停值）换成染了这只 Bot 颜色的版本。`--bz-btn-bg`、`--bz-btn-fg`（Bot 色实底按钮）v5 不再使用，变量留着。货架颜色来自 `avatarColor(slug)`，自定义头像用中性灰 `#8a8a93`；Hero 颜色来自 `HERO_MASCOTS`，不读取货架数据。

**眼睛**：所有活体用恒定深色眼睛 `--bz-eye`。唯一例外是官方色近乎纯黑的 Bot（`darkSwap` 会换色的那些，L < 0.04）：浅色主题下身体是黑的，黑眼睛看不见，`DefaultAvatar` 给它加 `bz-live-ink` 类，CSS 把 `--bz-eye` 换成奶白 `#f1efe9`；深色主题下身体已换成奶白，眼睛照旧是深色（决策 32）。

分类映射唯一位于 `theme/color.ts` 的 `CATEGORY_COLORS`：调研紫 `#8b5cf6`、定义橙 `#ff6a13`、评审粉 `#ff2e93`、AI 评测青绿 `#14b8a6`、学习琥珀 `#f5a623`、求职棕 `#9a6a3a`、日常薄荷绿 `#34d399`、基础设施蓝 `#3b82f6`。分类名来自现有 Bot 数据，schema 仍是合法枚举真源；单测验证映射完整覆盖枚举。`categoryStyle(category)` 仅提供 `--bz-category-color`，分类标签和筛选胶囊的小圆点共用；未知分类回退中性灰。分类的**顺序**由 `theme/enums.data.mjs`（构建时 `loadEnums()`）给到浏览器，不在页面代码里另写一份。

### 1.1 v5 阶梯（写在 `theme/styles/tokens.css` 最前面）

**字号（只许用这 8 档）**

| token | 字号 | 行高 | 字重 | 用在哪 |
|---|---|---|---|---|
| `--bz-fs-display` | `clamp(44px, 5.6vw, 72px)` | 1.05 | 700 | 首屏站名 |
| `--bz-fs-h1` | 32px（<680px 28px） | 1.15 | 700 | 详情页、小队页的名字，404 标题 |
| `--bz-fs-h2` | 24px（<680px 22px） | 1.25 | 650 | 首页各区块标题 |
| `--bz-fs-h3` | 20px（<680px 18px） | 1.3 | 600 | 详情页区块标题、岗位组头 |
| `--bz-fs-title` | 16px | 1.35 | 600 | 卡片上的 Bot 名、小标题、导航条站名 |
| `--bz-fs-body` | 15px | 1.6 | 400 | 正文、介绍（`.shelf-page` 的默认字号） |
| `--bz-fs-sm` | 13px | 1.5 | 400（强调 500） | 元信息、说明、小号按钮、分段控件 |
| `--bz-fs-xs` | 12px | 1.3 | 600 | 标签、键帽、计数 |

行高有同名的 `--bz-lh-*`。唯一例外是 14px（`--bz-fs-btn`）：只给按钮文字和气泡台词。中英文混排的标题加 `letter-spacing: -0.01em`（首屏站名 −0.02em）。新写的界面可以直接挂工具类 `.bz-h1`、`.bz-h2`、`.bz-h3`、`.bz-title`、`.bz-body`、`.bz-sm`、`.bz-xs`（字号、行高、字重一次给齐，前四个带圆体），颜色用 `.bz-muted`（`--bz-text-2`）、`.bz-faint`（`--bz-text-3`）。

**间距**：4、8、12、16、24、32、48、64、96，对应 `--bz-sp-1` … `--bz-sp-9`。首页区块之间用 `--bz-sp-section`（96，<680px 64）；区块标题到内容 24；标题到它的说明 4；网格间距 16；列表卡内边距 20×24；面板内边距 24。按钮左右 14、图标和文字间距 6 是部件自己的数，不算破例。

**圆角（三档）**：`--bz-r-control: 8px`（按钮、筛选、输入、标签、键帽）；`--bz-r-card: 12px`（卡片、搜索框、面板、气泡）；`--bz-r-panel: 16px`（导航条、弹层、小队大卡、详情页舞台面板）。两个例外：头像砖用比例圆角 `--bz-r-tile: 24%`；分段控件是唯一的胶囊（`--bz-r-pill`）。其他地方不许出现 999px。圆点、圆头像这类正圆不算。

**颜色角色**（深色 / 浅色）

| token | 深色 | 浅色 | 用在哪 |
|---|---|---|---|
| `--bz-surface-1` | 透明 | `#ffffff` | 卡片底 |
| `--bz-surface-2` | `rgba(255,255,255,.04)` | `rgba(20,20,24,.03)` | 玻璃、输入、中性标签、头像砖 |
| `--bz-surface-3` | `rgba(255,255,255,.07)` | `rgba(20,20,24,.06)` | 悬停 |
| `--bz-border-strong` | `rgba(255,255,255,.14)` | `rgba(20,20,24,.16)` | 按钮边、搜索框边、虚线框 |
| `--bz-border-hover` | `rgba(255,255,255,.26)` | `rgba(20,20,24,.3)` | 上面这些悬停时 |
| `--bz-primary-bg` / `-hover` / `--bz-primary-fg` | `#ffffff` / `#ebebeb` / `#0b0b0d` | `--bz-ink` / `--bz-ink-hover` / `#ffffff` | 实心按钮 |
| `--bz-source-community` / `--bz-source-author` | `#34d399` / `#ff6a13` | 同左 | 来源标签 |

实底 `--bz-card`（气泡、面板、搜索框）、细边 `--bz-hairline`、字三级 `--bz-ink` / `--bz-text-2` / `--bz-text-3` 沿用上表。Bot 色 `--bz-bot-color` 只出现在：身体、砖底柔光、卡片悬停层、按钮的淡染、列表圆点、连线高亮。

**动效**：`--bz-dur-fast: 120ms`、`--bz-dur: 180ms`、`--bz-dur-slow: 280ms`；`--bz-ease: cubic-bezier(.2,.8,.2,1)`；弹簧沿用 `--bz-ease-spring`。悬停只做淡入和染色，卡片不位移、不缩放。`prefers-reduced-motion: reduce` 时循环动画全部静止。

**层次**：卡片不用投影，靠细边 + 内高光分层；只有浮层（搜索面板、手机菜单、弹窗、气泡）有投影。

### 1.2 样式表怎么分

`theme/styles/` 下七个文件，`theme/index.ts` 按这个顺序引入；改哪一块就只动那一个文件：

| 文件 | 管什么 |
|---|---|
| `tokens.css` | 全部 token、`.bz-bot-scope` 的 Bot 色、活体头像的身体色和眼睛 |
| `base.css` | 页面骨架 `.shelf-page`、文字档位工具类、焦点、图标、§1b 的全部基础部件、头像按钮和跳动、气泡 |
| `nav.css` | 悬浮导航条和手机菜单 |
| `hero.css` | 极光、砖墙、站名、搜索框 |
| `home.css` | 首页区块、主推卡、工具栏、列表卡、页尾 |
| `detail.css` | Bot 详情页 |
| `misc.css` | 手动复制弹窗、空状态、404、投稿预览对卡片和详情的修正 |

## 1b. 基础部件（全站共用，类名固定）

都在 `theme/styles/base.css`。新界面直接用这些类，不要另写一套按钮或标签。

**按钮 `.bz-btn`**：高 36px（触摸设备 44px），左右内边距 14px，圆角 8，14px/600，系统字体，图标 16px、和文字间距 6（按钮是 `inline-flex`，把 `<BzIcon>` 和文字并排放进去就行）。

| 写法 | 样子 | 用在哪 |
|---|---|---|
| `.bz-btn` | 次级，玻璃：底 `--bz-surface-2`、边 `--bz-border-strong`、内高光、字 `--bz-ink`；悬停底 `--bz-surface-3`、边 `--bz-border-hover`。放进 `.bz-bot-scope` 就染上这只 Bot 的颜色：底 Bot 色 10% 混 `--bz-surface-2`、边 Bot 色 34% 混 `--bz-border-strong`，悬停 18% / 60%。字始终是墨色，灰白黑的 Bot 也不会像禁用 | 默认都用它 |
| `.bz-btn.primary` | 实心：深色主题白底 `#ffffff` 配 `#0b0b0d` 字，浅色主题 `--bz-ink` 底配白字；悬停深色压到 `#ebebeb`、浅色换 `--bz-ink-hover`；按下 `scale(.98)` | **一屏最多一个**：详情页的「一键导入」、小队页的「开始组队」 |
| `.bz-btn.ghost` | 无边无底，字 `--bz-text-2`；悬停底 `--bz-surface-3`、字 `--bz-ink` | 「返回货架」「展开其余 N 个」「清除」 |
| `.bz-btn.sm` | 高 32、左右 12、13px；可以和上面三种叠用 | 卡片里的「导入」 |
| `.bz-btn.block` | 撑满一行 | 侧栏、窄卡片 |

状态：`.copied`（字和边变 `--bz-success`）；`aria-disabled="true"` 或 `disabled` 时不透明度 0.45。Bot 色实底按钮全部取消（决策 36）。`.shelf-button` 是 `.bz-btn` 的别名，只留给 /submit 和还没迁移的组件，新代码不要用。

**标签 `.bz-tag`**：高 22、左右 8、圆角 8、12px/600、系统字体。

| 写法 | 样子 |
|---|---|
| `.bz-tag` | 中性款：底 `--bz-surface-2`、字 `--bz-text-2` |
| `.bz-tag.role` | 岗位款：读元素上的 `--bz-category-color`（`color.ts` 的 `categoryStyle(岗位)` 给），底是岗位色 14% 混 `--bz-card`，字是岗位色 40% 混 `--bz-ink`。标签前面那只 12px 的岗位吉祥物第二批再加 |
| `.bz-tag.community` / `.bz-tag.author` | 来源款「社区收录」（薄荷绿 `#34d399`）/「作者投稿」（橙 `#ff6a13`），同样的混法 |
| `.bz-tag.solid` | 实心小标签（墨底），给「队长」这类 |

「官方市场」不做标签，写进作者行：`by Anoop Baliga · 官方市场`。旧类名 `.bot-tag`、`.category-tag` 仍然有效（别名）。

**头像砖 `.bz-tile`**：圆角 24%，底 `--bz-surface-2` + 细边 + 内高光，砖底一团 Bot 色柔光（深色 42%、浅色 30% 混透明，`::before`），不带投影。**Bot 占砖的 68%**：砖的直接子元素（`svg`、`img`、头像按钮）自动是 68%，不用自己写尺寸。尺寸只用 28、40、48、64、72、96、120：加 `.s28` … `.s120`，或者在外层设 `--bz-tile-size`（默认 48）。Bot 色来自最近的 `.bz-bot-scope`。首屏砖墙的砖尺寸跟着视口走，是唯一不在这七档里的。

**图标**：全站一套，`theme/icons.ts`（路径数据）+ `components/BzIcon.vue`：`<BzIcon name="bolt" />`，`size` 默认 16。24 网格，`stroke-width: 1.5`，圆头圆角，`currentColor`，不填充，`aria-hidden`。现有：flame、bolt、shield、clock、plug（要连账号）、plug-off（不用连账号）、users、arrow-up-right、arrow-left、search、plus、check、copy、chevron-right、chevron-down、quote、x。要新图标就往 `icons.ts` 里加一条 path，不要在组件里再写内联 SVG。

**区块标题 `.bz-section-head`**：左对齐。结构是 `<header class="bz-section-head"><div><h2>标题</h2></div><span class="bot-count">共 82 个</span></header>`：`h2` 用 h2 档圆体；右侧可以放计数（12px/600，`--bz-text-3`，tabular-nums）或一个 ghost 按钮，和左边底对齐；到内容 24。**标题下面不放说明**（§0 第 6 条；`.bz-section-head p` 的样式留着，现在没有地方用）。

**分段控件 `.bz-seg`**：胶囊容器 + 滑块，高 40（触摸 44），13px/600。容器里直接放 2–4 个带 `aria-pressed` 的 `<button>`，各项等宽，选中滑块自己跟着 `aria-pressed="true"` 滑过去（`:has()` 算位置，不用再写 `data-sort`）；容器要自己加 `role="group"` 和 `aria-label`。项数多、要横向滑动的（岗位）用 `.bz-seg.free`：各项按文字宽度排，没有滑块，选中项自己亮。每一项的点按范围撑满整条的高度。旧类名 `.sort-controls` 是别名。

**气泡**：样子不变（漫画风：实底、2px 墨色描边、Bot 色硬投影），圆角 12，圆体 14px/700。详见 §3.3。

**焦点**：`focus-visible` 一律 2px `--bz-ink` 外框、偏移 2px。

## 2. 首页布局

内容区最大宽 1140px，左右留白 32px（<680px 时 16px）；`.shelf-page` 自己铺满视口宽，用内边距把内容收进 1140，所以极光这类装饰可以出血到视口边缘而不产生横向滚动（`overflow-x: clip`）。自上而下：悬浮导航条 → 首屏（砖墙、站名、搜索框）→ 「本周主推」→ 「全部 Bot」（工具栏 + 列表）→ 页尾的「我要投稿」。区块之间 96px（<680px 64px）。

### 2.1 悬浮玻璃导航条

VitePress 默认顶栏（`.VPNavBar`）换肤，不另写导航组件，汉堡菜单、主题切换、GitHub 图标照常可用。

- 全宽度固定在顶部（`.VPNav` 在所有宽度 `position: fixed`）；条本身距顶 16px、左右各留 16px、最大宽 1204px、水平居中，圆角 16px。
- 高 64px（<768px 时 56px）。半透明底（深 `rgba(14,15,17,.72)`、浅 `rgba(255,255,255,.74)`）+ `backdrop-filter: blur(18px) saturate(160%)`，`--bz-hairline` 细边 + 内高光 + 一层向下的柔和投影。
- `--vp-nav-height` 设为「16 + 条高 + 8」，正文和 /submit 的粘性预览按它让位；条内部把它改回条高，默认主题的子元素照常排版。
- 左：自绘的小吉祥物（CSS 里一段内联 SVG：橙色圆团 + 两只竖眼，28px，悬停歪一下头）+ 站名，圆体 16px/600。右侧顺序：「我要投稿」、主题开关、GitHub。「我要投稿」是次级小按钮，和 `.bz-btn.sm` 同一套数（高 32px、左右 12px、13px/600、圆角 8px、中性玻璃：`--bz-surface-2` 底 + `--bz-border-strong` 边 + 内高光；悬停底换 `--bz-surface-3`），文字前面一个 16px 的 `plus` 图标（和 `icons.ts` 同一条路径，在 `nav.css` 里用遮罩画，颜色跟着文字走；手机菜单里那一项也带），链到 `/submit`。主题开关和 GitHub 是 32px 的幽灵图标按钮（图标 18px、`--bz-text-2`，悬停底 `--bz-surface-3`、图标变墨色）；默认主题的胶囊开关和分隔线都去掉了。触摸设备这三个都是 44px。
- <768px：右侧收成汉堡；点开后菜单是导航条下面的一块圆角面板（距条 8px、左右 16px、圆角 16px、`--bz-card` 实底、细边、浮层投影），不再铺满全屏。
- 站内没有文档页，滚动后才出现的 `.VPLocalNav`（「回到顶部」条）全站隐藏。

### 2.2 Hero（`.shelf-intro`）

- **极光**（`.hero-aurora`，`aria-hidden`，`.shelf-page` 的第一个子元素，不是文字的祖先）：砖墙背后的三团色光，像舞台背光。不再有斜向光带，不旋转。
  - 橙 `#ff6a13` 在左（中心 28% / 40%），紫 `#8b5cf6` 居中偏上（52% / 20%），青绿 `#14b8a6` 在右（74% / 42%）。每团是 520×360 的椭圆，`blur(90px)`（680–1099px 是 440×300 / 80px，<680px 是 280×200 / 56px）。横向位置按视口宽的百分比算，到 1440 宽为止；再宽就不往外散，光始终在砖墙背后。
  - 这一层从页面顶铺到「砖墙下沿 + 96px」；用椭圆遮罩 `ellipse 58% 62% at 50% 34%` 向四周淡出，**到站名基线以上已经淡到 0**，文字背后是干净的底色。整层不透明度深色 0.5、浅色 0.3。
  - 每团各自缓慢漂移（±24px 以内，18 / 24 / 21 秒单程、`ease-in-out infinite alternate`，也就是 36–48 秒一个来回，只动 `transform`）。`prefers-reduced-motion: reduce` 时静止。
- **砖墙**（`.hero-portraits`，`aria-hidden="true"`，内含 9 个 `.hero-portrait`）：固定使用 `meta.mjs` 的 `HERO_MASCOTS`，与货架数量、排序、自定义头像无关。
  - 9 只：上排 5 只（琥珀 hex、青绿 star、**橙 blob（正中）**、粉 sparkle、蓝 cloud），下排 4 只（玫红 heart、紫 tablet、薄荷绿 teardrop、棕 pebble），下排相对上排错开半格。上下左右和斜向相邻的砖不同色系；单测检查。
  - 所有宽度都显示 9 只，SSR 也是 9 只。砖：≥1100px **124×124**、间距 20；680–1099px 96×96、间距 16；<680px `min(60px, (100vw − 72px) / 5)`、间距 8（320 宽时 5 块一排刚好放下）。圆角一律是砖边长的 24%。
  - 每块砖是 `.bz-tile`：比别处更实的底（深色 `rgba(18,19,22,.72)`、浅色 `rgba(255,255,255,.78)`）+ `--bz-hairline` 细边 + 一道更亮的内高光，底部一团该 Bot 颜色的柔光（`::before`）；Bot 占砖的 68%。Bot 和砖都从光里立出来；墙的两端不再用遮罩压暗，9 只一样亮。
  - 互动：悬停该砖 → 砖上浮 2px、柔光变亮、细边染上 Bot 色，Bot 跳一下并 `wide`；点击 = 戳；首次进站依次 `swirl` 入场（§5）。跳动加在砖里面那层 `.hero-bot` 上，和砖的上浮互不覆盖。
- **标题**：`h1`（站名）圆体 `--bz-fs-display`（`clamp(44px, 5.6vw, 72px)`）/ 700，行高 1.05，字距 −0.02em；视口 1440 时 72px，390 时 44px。砖墙到标题 32px（<680px 24px）。
- **没有副标题**。首屏只有三样：砖墙 → 站名 → 搜索框。站点 tagline（`meta.mjs` 的 `SITE.tagline`）只给页面的 `meta description` 用，界面上不显示。
- **搜索框**（`SearchTrigger`，`<button data-testid="search-trigger">`）：≥680px **476×51、圆角 12**（窄屏撑满）；`--bz-card` 底、1px `--bz-border-strong`、内高光；到站名 32px（<680px 24px）。左边 16px 的放大镜（`BzIcon`）+ 占位字「搜索」（15px，`--bz-text-3`；`meta.mjs` 的 `SHELF_COPY.searchPlaceholder`，搜索面板的输入框用同一个），右边两个键帽「⌘」「K」（24px 高、圆角 8、12px/600；非苹果设备挂载后显示「Ctrl」；<680px 不显示键帽）。读屏名称是「搜索 Bot」。悬停只把描边加深到 `--bz-border-hover`。点击派发 `window.dispatchEvent(new CustomEvent('bz-search-open'))`，由 `SearchPalette` 打开；关闭后焦点回到这个按钮。
- 首屏不放投稿按钮（和导航重复）；`[data-testid="contribute-link"]` 在页尾（§2.5）。

### 2.3 本周主推

`<section class="shelf-section" aria-labelledby="featured-title">`。区块标题只有 `h2`「本周主推」，没有说明。

- **选哪三个**：由编辑定，写在 `meta.mjs` 的 `FEATURED`（slug 数组，按这个顺序排；现在是 `idea-stress-test`、`quota-saver`、`copy-humanizer`）。名单里有 Bot 不在货架上时（比如测试数据），退回热度最高的 3 个（热度相同比上架日期、再比名字；热度没拿到时就是最新 3 个）；这时 Bot 总数 < 3 整个区块不显示。和列表一样只拍快照：进入页面、首次拿到热度各定一次，之后点击不会让卡片跳位。不受分类筛选和排序影响。
- **网格** `.featured-grid`：3 张等宽卡，≥900px 一排、间距 16；<900px 竖排、间距 16。
- **主推卡** `[data-testid="featured-card"]`（带 `data-slug`、class `bz-bot-scope`，**不带** `data-testid="bot-card"`）：圆角 12、细边 + 内高光、内边距 24，深色底色透明、浅色 `--bz-surface-1`；左上常驻一团 Bot 色柔光（`::before`，深色 22%、浅色 16%，不透明度 .7），悬停时更亮、细边染 Bot 色（42%）。**左对齐**，三张等高，底行贴底：
  1. 头行：72px 头像砖（`.featured-tile.bz-tile`，活 Bot 占砖 68%，`aria-hidden`，点它是戳）+ 右边名字（`h3.bot-name > a`，链到详情页，title 档 16px/600 圆体）和作者行（13px `--bz-text-3`：`by 作者 ↗`，后面跟「· 官方市场」或「· 社区收录」）。作者自己投稿的，名字右边一个「作者投稿」标签。
  2. 介绍 `.bot-tagline`（15px/1.6，`--bz-text-2`，固定两行高，多了省略），到头行 16。
  3. 底行 `.featured-foot`：左边分类标签 + 额度（`bolt` +「额度 低/中/高」，「高」用 `--bz-quota-high`）；右边「导入」`[data-testid="featured-import"]`（`.bz-btn.sm`，`arrow-up-right` + 文字，上报和动画逻辑同列表）。
- **整张卡可点进详情**，做法和层级同列表卡（§3.2「整卡可点」）：砖、作者链接、「导入」在链接上面。
- 悬停主推卡：Bot `wide`，不显示气泡；点砖 = 戳（和列表、详情共用同一个 slug 的戳历史）；点「导入」：上报、Bot 播 `comet`、新标签打开。

### 2.4 全部 Bot：标题和工具栏

`<section id="all" class="shelf-section" aria-labelledby="all-title">`。区块标题 `h2`「全部 Bot」，右侧计数 `.bot-count`「共 N 个」（N 是筛选后的数量，12px/600 `--bz-text-3`）；货架为空时不显示计数。

工具栏 `.shelf-toolbar` 只有两样（货架为空时不显示），到列表 24：

- 左：**排序**，分段控件「热门 / 最新」，规格见 §1b「分段控件」（高 40px、触摸 44px、13px/600，选中滑块跟着 `aria-pressed` 滑动）。`role=group`、`aria-label=排序`、按钮 `aria-pressed`，`sort-hot` / `sort-new`。/submit 的预览切换复用同一套并自己覆盖颜色。
- 右：**分类筛选** `.filter-chips`，一排圆角 8 的小按钮 `[data-testid="filter-category"]`（`role=group`、`aria-label=按分类筛选`），靠右对齐：第一个「全部」（小圆点是一圈彩虹），后面是货架上实际出现的分类，按 schema 枚举顺序，每个前面一个该分类颜色的 8px 圆点。高 32px（触摸 44px）、细边、13px/600 `--bz-text-2`；悬停底 `--bz-surface-3`；选中（`aria-pressed="true"`）时描边和底色染上分类色（55% / 14%），文字 `--bz-ink`；「全部」没有分类色，选中时是 `--bz-border-strong` 边 + `--bz-surface-3` 底。单选。
- <1100px：筛选换到第二行，整行自己横向滚动（隐藏滚动条、右端 28px 渐隐），不撑破页面。
- 工具栏里没有搜索框（首屏搜索框和 ⌘K 还在）。键盘顺序：排序 → 筛选 → 第一张卡片。
- 筛选和排序可以叠加。默认热门；stats 失败且用户未手选时改最新。不记住选择。

### 2.5 列表和页尾

- **列表** `.bot-grid`：≥900px **两列**、间距 16（1140 内容宽时每张 562px）；<900px 单列。同一行等高。筛选或首次热度改变顺序时网格淡入 200ms。
- **页尾** `.shelf-footer`（货架为空时不显示）：到列表 96px（<680px 64px），顶上一条 `--bz-hairline` 细线，线下 48px 处居中放一枚「我要投稿」`[data-testid="contribute-link"]`（`.bz-btn`，`plus` 图标 + 文字，链到 `/submit`）。没有引导语。

## 3. 卡片、玻璃砖和气泡

### 3.1 玻璃砖（`.bz-tile`）

首屏砖墙、主推卡、详情舞台、404 共用，规格见 §1b「头像砖」：比例圆角 24%、`--bz-surface-2` 底（首屏更实）+ `--bz-hairline` 细边 + 内高光，不带投影；`::before` 在砖底画一团 Bot 色的径向柔光（浅色 30%、深色 42% 混透明），所在卡片悬停时变亮。Bot 占砖的 68%。砖是静止的，没有漂移动画；砖里只放 Bot，不放文字。

**列表卡不用方砖**：像 Grok Bot 的列表那样，Bot 直接放大、身体填满头像框。`.avatar-stage` 在列表卡里只是一个 52×52 的格子（没有边、没有底、没有内高光、没有柔光），里面的头像按钮是 44×44。

### 3.2 列表卡（`[data-testid="bot-card"]`）

紧凑的三行，总高约 188px（同一行等高）。

| 区域 | 规格 |
|---|---|
| 外壳 `.bot-card` | 保留 `data-slug`、`bz-bot-scope`。圆角 **12**，`--bz-hairline` 细边 + 内高光，不带投影；深色底色透明，浅色 `--bz-surface-1`。article 是容器查询的容器，版式网格在里面的 `.bot-card-body`：三列 `52px / 1fr / auto`，三行，间距 12，内边距 20×24 |
| 第一行 | 左：52 的格子里一只 44 的 Bot（头像按钮 `[data-testid=avatar]`，不用方砖）。中：名字 `h3.bot-name > a[data-testid="detail-link"]`（title 档 16px/600 圆体）；作者自己投稿的，名字右边一个「作者投稿」标签（橙）。名字下面是**作者行** `.bot-byline`（13px `--bz-text-3`，只占一行）：`author-link`「by 作者 ↗」，后面跟**来源**「· 官方市场」或「· 社区收录」；作者名太长就省略，来源始终留着。**右上角**：「导入」`btn-import`（`.bz-btn.sm`，`arrow-up-right` + 文字） |
| 第二行 | 介绍 `.bot-tagline`（15px/1.6，`--bz-text-2`），固定两行高（48px），多了省略；气泡也落在这一格 |
| 第三行 | 左 `.bot-stats`（**属性**，13px `--bz-text-3`，图标 16，项间距 16，tabular-nums）：分类标签 → 额度（`bolt` +「额度 低/中/高」，「高」用 `--bz-quota-high`）→ 门槛（`plug` +「要连账号」或 `plug-off` +「不用连账号」）→「会自己跑」（`clock`，有才显示）→ 热度（`flame` + 数字，大于 0 才显示，「热度」两个字只给读屏）。门槛和「会自己跑」在组件里从 `bot.permissions` 现算：含「外部账号」或「浏览器 Cookie」算要连账号，含「定时自动运行」算会自己跑。右：「复制安装提示词」`btn-prompt`（`.bz-btn.ghost.sm`，`copy` + 文字；外部收录没有这个按钮） |
| 窄卡片 | 卡片自己窄于 400px 时（手机、/submit 预览；用 `@container`，不看视口）：内边距 20px，「导入」挪到第四行，和「复制安装提示词」并排，各自撑开、高 44；窄于 320px 各占一行 |
| 悬停 | 仅 `@media (hover:hover)`。卡片 `::after` 是一层绝对定位的渐变：左上角 `color-mix(in srgb, var(--bz-bot-color) 18%, transparent)` 的径向光，叠在自上而下的柔光上；默认 `opacity: 0`，150ms `ease-in-out` 淡入到 1；细边同时染上 Bot 色（45%）。**卡片本身不位移、不缩放。** 内容在这层之上（`z-index`）。触摸点开气泡或键盘聚焦头像时这层也亮起来 |
| 标签 | 见 §1b「标签」：系统字体 12px/600，高 22px，左右 8px，圆角 8px；分类色、来源色 14% 混卡片底，文字为该色 40% 混 `--bz-ink`，两主题对比度均 ≥4.5。来源标签只有「作者投稿」一种；「官方市场」「社区收录」写在作者行里，不做标签 |
| 热度 | 列表卡上大于 0 才显示，火苗是 `--bz-flame`；没有热度不占位。详情页始终显示：加载「热度 …」，失败「热度 —」，title 为「热度暂时获取不到」 |
| 按钮 | 见 §1b「按钮」。卡片上都是小号：「导入」是 Bot 色淡染的玻璃，「复制安装提示词」是幽灵款。复制成功：图标换成 `check`、文字换成「已复制」、字和边变 `--bz-success`，1.8 秒后恢复 |

**整卡可点**（列表卡和主推卡一样）：

- 名字那个链接有一个 `::after`，绝对定位、`inset: 0`，铺满整张卡（列表卡铺满 `.bot-card-body`，主推卡铺满 `.featured-card`）。鼠标在卡上任何地方都是手型，点下去进详情。
- DOM 里**仍然只有这一个**指向详情的链接：键盘顺序和读屏文本不变，焦点框画在名字上。
- 层级（由下到上）：卡片底和悬停光晕 → 介绍、属性这些静态内容 → 整卡链接的 `::after`（`z-index: 0`）→ 头像格子 / 主推卡的砖、作者链接、按钮（`position: relative; z-index: 1`）→ 气泡（`z-index: 2`，不接指针事件，点气泡等于点卡片）。所以点头像是戳、点作者去作者主页、点「导入」开模板页、点「复制安装提示词」是复制，都不会误进详情。
- 全卡悬停的反应（Bot 变 `wide`、光晕、气泡）挂在 article 的 `pointerenter` / `pointerleave` 上，链接铺满以后照旧。悬停的反馈是整张卡的光晕，名字不加下划线。
- /submit 的投稿预览复用同一张卡：整卡点下去是切到「详情页」预览（和点名字一样），不跳走。

保留 `.bot-tag`、`.bot-tagline`、`.avatar-stage` 等现有类名和全部 data-testid。DOM 顺序（也是键盘顺序）：头像 → 名字 → 作者 → 导入 → 复制。

### 3.3 气泡几何与跳动

- **位置**：气泡在卡片里面，**盖在介绍那一块上**：绝对定位在 `.bot-tagline` 同一个网格格子里（左上对齐），不占高度，长了就往下盖住第三行；悬停时介绍 120ms 淡出，气泡出现在同一位置，尖角朝上指向头像（尖角中心在头像正下方，距气泡左边 26px）。气泡完全在卡片内，不压头像、不压「导入」。
- **样子**（漫画风保留）：`--bz-card` 实底、2px `--bz-ink` 描边、圆角 **12px**，硬投影 `3px 3px 0 var(--bz-bot-color)`；圆体 14px/700/1.45，内边距 8px 14px；宽度随文字，最小 68px、最大撑满介绍那一格；最多两行，line-clamp:2、text-wrap:balance 防孤字。尖角为 12px 方块，仅右、下 2px 描边：卡片里转 225° 朝上，详情页转 45° 朝下。
- **弹出**：opacity 0→1 180ms；位移 −5px→0、scale .94→1 280ms 弹簧缓动，原点在尖角处；收起 opacity 120ms，位移和缩放倒放。
- **跳动**：头像按钮原点脚底，560ms、每段弹性缓动；0/24/54/80/100% 的 translateY 0/2/−10/0/0px 与 scale (1,1)/(1.07,.92)/(.96,1.05)/(1.02,.98)/(1,1)。逐帧检查头像下沿到气泡上沿始终 ≥13px（放得下约 11px 的尖角）。悬停和键盘说话重新触发；鼠标/触摸戳只播 Bot 变身、不叠加按钮位移，连续点击保持稳定命中。
- 每卡 `data-testid=pitch-bubble`，`data-open="true|false"`；全页最多开一个。有 pitch 用 pitch，没有则 DEFAULT_PITCHES 随机且不连续重复；戳时改用 §5 专用台词。
- 头像按钮 `aria-label="听听{名字}的自荐"`；打开时 aria-describedby 指向独立的 `bz-sr-only` 全文元素。视觉 tooltip 设 aria-hidden、不用 aria-live；气泡 `data-text` 从打开起就是全文，内部唯一一个 span 用于逐字层，`[data-testid=typing]` 用 i 容器及三个 i 点、aria-hidden，避免逐字播报。初次加载不自动开气泡。
- `BotAvatar` 的 DOM：外层 `.avatar-root`（在卡片里 `display: contents`，让头像格子和气泡各自落进卡片网格；在详情页是气泡的定位容器）→ `.avatar-stage.bz-tile` > `button.bot-avatar`，以及并列的 `p.pitch-bubble`、`p.bz-sr-only`。
- focus-visible：全站一律 2px `--bz-ink` 外框、偏移 2px（头像按钮偏移 3px）。

## 4. 活体头像与接口

常驻动作由引擎 liveliness 提供：呼吸、自然眨眼、视线漂移。所有 LiveBot 初始化及减少动效重置时，均在 `new BotEngine` 第四参数传 `EXPRESSION_BY_ID.get('attentif')`，正脸竖胶囊眼，不再用默认往右上的 neutre。临时表情与鼠标跟随保持原行为。渲染方式参考 jeremy-prt/bloub `BloubBot.vue`（MIT，b4bb3c1），保留 mask 挖眼及粒子、圆环前后层次，不修改 vendor。

视口为 ±112，静止身体最长边占头像框 ≥80%；根 SVG `overflow: visible`，特效可画出框外。mask 和填色画布仍为上游 ±158，避免变身时身体被裁小。粒子深度雾混 `--bz-card`（回退 `--vp-c-bg`），与恒定深色眼睛解耦，浅色不发黑、深色仍自然隐入背景。头像放进玻璃砖后（§3）特效仍可画出砖外；逐帧检查跳动时头像不碰气泡（§3），并检查 Hero、详情和特效无横滚/裁切。

### 视线跟随与生命周期

`theme/live/gaze.ts` 的 `lookAt(dx, dy)`：

```text
nx = clamp(dx / 480, -1, 1)
ny = clamp(dy / 360, -1, 1)
yaw = nx * 16°
pitch = 10° - ny * 13°
Look = { yaw, pitch, mix: 1, spin: 0, wander: 0 }
```

16/13/10 来自 bloub `ui/gaze.ts` 的 YAW_MAX/PITCH_MAX/PITCH（MIT），不带上游面板专用 -TURN 或 spin 偏移。非有限输入当 0。全局仅一个 passive pointermove，touch 忽略；可见 Bot 在鼠标更新时以自己的中心计算，宽高为 0 跳过。鼠标 4 秒不动、离开文档（relatedTarget 为空）或窗口失焦时 `setLook(null, t, 0.6)`，0.6 秒回落并恢复漂移。

`theme/live/clock.ts`：`register(client): () => void`，client 含 el 和 tick(t)，t 单位秒。全站一个 rAF、一个 IntersectionObserver。仅可见 client tick；全离屏、document.hidden 或 reduce 时停止调度，不空转，不用 setInterval。离屏 500ms 内 data-running=false，隐藏后立即 false，恢复时 true。

SSR 不访问 window/document/matchMedia；输出 `sample(0)` 静态首帧，挂载后接管。mask id 用 Vue useId，不用随机数，不能有 hydration 警告。

### LiveBot DOM 与事件

`components/LiveBot.vue` 根元素就是 svg，不加外包层：class=bz-live、viewBox="-112 -112 224 224"、overflow:visible、aria-hidden=true。SSR 和客户端首帧都由相同 attentif 引擎 `sample(0)` 生成。

| 标记 / props | 含义 |
|---|---|
| `data-testid="live-bot"` | 活体根 SVG |
| `data-state="idle|…"` | 当前引擎状态 |
| `data-running="true|false"` | 当前是否被 tick |
| `data-follow="pointer|rest"` | 指针跟随或自身视线 |
| `data-shape` / shapeId | 原样输出形状 id |
| `data-part="body"` | 身体垫底 path，带 d，填 `var(--bz-eye, #16161b)`；眼睛是深色（唯一例外：官方色近乎纯黑的 Bot 在浅色主题下换成奶白，见 §1） |
| `data-part="fill"` | mask 内身体填色 rect；DefaultAvatar 传入 `var(--bz-bot-body)` |
| rest | 基础状态，默认 idle；卡片/主推/Hero 悬停 wide、空货架 sleep、404 thinking |
| `data-part="eye"` | mask 内两眼 path；transform 直接用引擎 matrix(...)，opacity 用 alpha |
| `data-part="dot|arc|notif"` | 粒子 / 圆环 / 通知点 |
| radii / color | number[] 或 null（圆）；color 接受 CSS 变量，身体用 style fill，不用 fill 属性 |
| outline / size | 可选描边色；有值沿身体画 1.5px、non-scaling-stroke；SVG width/height 默认 96，外层 CSS 决定显示尺寸 |

在根 SVG 派发 `bz-play` 自定义事件，`detail = { state: StateId, hold?: number }`。不在 STATE_BY_ID 的状态或 reduce 时忽略；否则 setState(state,t)，持续 `hold ?? 状态 duration` 秒（共享时钟）后回 rest；`hold: Infinity` 一直保持，NaN/-Infinity 回退 duration，负数归零。新事件打断旧事件。`live/playback.ts` 管理播放期限，rest 改变不打断有限临时动作；离开可释放 wide/Infinity。减少动效恢复静态 idle，重新启用动效回当前 rest。LB3 通过此接口及组件局部引用接反应，不为每个头像另起时钟。

## 5. 互动行为

| 触发 | 反应 |
|---|---|
| 鼠标进入整张列表卡片（不再只限头像） | wide 睁大眼 + 跳一下；卡片淡入 Bot 色光晕、介绍淡出；气泡先显示「…」打字点 350ms，再按 28ms/字逐字打出（读屏区一开始就有全文） |
| 离开卡片 | 立即关闭气泡（120ms 淡出）、介绍回来，基础状态改 idle；进行中的戳/按钮临时动作不被打断 |
| 鼠标进入主推卡 | wide + 左上柔光变亮；不跳、不出气泡 |
| Tab 到头像 / Enter / 空格 / Esc / 失焦 | Tab 说一句；Enter/空格换一句并重新跳；Esc 关闭；失焦关闭 |
| 点击或点按头像（「戳」） | 从 wink, burst, orbit, play, comet, egg, hexagon, thinking 随机选一个，不与上次重复；按引擎 duration 播完回 rest，换戳台词且不连续重复；滚动 3 秒内第 5 次触发 alert，说「别戳啦！」并清零计数。卡片/精选/详情按 slug 共享历史；Hero 使用独立的 `mascot:<key>` 历史，不污染货架 |
| 点卡片上头像、作者、按钮以外的任何地方（列表卡、主推卡） | 进这个 Bot 的详情页（整卡可点，§3.2） |
| 点「导入」（列表、主推）或「一键导入」（详情） | 该卡 Bot 播 comet（「嗖」一下），新标签打开模板页 |
| 复制成功 | wink |
| 30 秒没有任何输入（减少动效时不触发） | data-running=true 的 Bot 依次进入 sleep，整波次错开 0–800ms；一个全局超时器管理整波 |
| 睡着后有任何输入 | 取消待睡队列，所有 sleep Bot 立即 exclaim，按 2 秒 duration 回 rest |
| 第一次进站（每个会话一次） | Hero 的 9 只 Bot 按上排、下排的顺序依次 swirl 入场，间隔 120ms |
| Hero 里的 Bot | 悬停：砖上浮 2px、柔光变亮，Bot 跳一下 + wide；点击 = 戳；仍然 aria-hidden |
| 点首屏搜索框、按 ⌘K / Ctrl+K、「/」 | 打开搜索命令面板（`SearchPalette`）；关闭后焦点回到原处 |
| 点分类筛选按钮 | 列表只留这个分类，计数跟着变，网格淡入 200ms；主推不变 |
| 空货架 / 筛选无结果 | 一只睡着的 Bot（96px），rest=sleep，无灰度滤镜 |
| 404 页 | not-found Layout 插槽；120px 头像砖里的 Bot 先 exclaim、再常驻 rest=thinking；「这一页走丢了」+ href=/「回货架看看」，没有说明句（版式见 §10） |
| 触摸 | 点按 = 戳 + 气泡显示 4 秒；点别处关闭；不跟随视线 |

戳台词：「哎，痒！」「再戳我就变形了」「好啦好啦，我在呢」「你找我呀？」。全部新增文案在 meta.mjs。

`live/reactions.ts` 仅挂一组 capture/passive 全局输入监听：pointermove、pointerdown、keydown、wheel、scroll、touchstart。URL 的 `?bz-idle=<毫秒>` 仅在客户端首次注册时读取一次，只接受 200–600000 的整数；默认代码值 `30_000`。若演示短阈值遇到未播完的戳/惊醒/入场，整波睡眠每秒检查一次、等临时动作完成后再睡，避免打断反馈；不增加每只 Bot 的计时循环。最后一个 Bot 卸载清理监听和计时器。

Hero 首次首页挂载在 sessionStorage 记 `bz-hero-entered`；仅会动的头像依次入场，间隔 120ms；存储不可用则退化为当前文档一次。卸载取消待入场计时器，减少动效不记标记、不播放。悬停在 `.hero-portrait` 上跳一次（动画加在里面的 `.hero-bot` 上），离开释放 wide；戳不弹气泡、不进入 Tab 顺序。

气泡打字消费共享时钟，完成、关闭或失去全页唯一所有权时注销；减少动效时立即显示全文（包括中途切换）。卡片/详情以 provide/inject 把动作按钮接到自身头像，复制失败不 wink。

输入按每次事件 pointerType 判断，不存全局「触摸过」标记；鼠标点击不依赖浏览器是否赋焦点。全页单气泡、触摸再次点按换一句保留；鼠标转触摸时释放旧视线，后续鼠标仍能跟随。导入仍正常新标签打开、点击正常上报，动画不阻塞业务；复制成功按钮显示对勾图标 +「已复制」，文字和边框 success 色，1.8 秒恢复，唯一读屏播报区播报「已复制安装提示词」。失败按 §8。

## 6. 官方真脸

维护者用 `scripts/sync-faces.mjs` 读取 bots/*/bot.yaml 的 templateUrl，从 x.ai 模板 HTML 的 Next.js 转义数据中，在 addHref 后提取 color、shape。只取公开颜色和形状名，不复制形状路径、眼睛坐标或代码。构建不联网；`faces.json` 静态 import，不在运行时 fetch。

`site/.vitepress/data/faces.json` 格式（键字母排序、两空格缩进、结尾换行）：

```json
{
  "memory-keeper": { "color": "#777777", "shape": "hex", "fetchedAt": "2026-11-14" }
}
```

每条恰好 color（小写 #rrggbb）、shape（非空字符串）、fetchedAt（YYYY-MM-DD）。抓取失败保留旧条目，没有旧条目则不写，给带 slug 的中文警告。UA 为 Mozilla/5.0，单页超时 25 秒；跳过 _template、无 templateUrl 和 REPLACE-ME。`--check [--file 路径]` 离线校验，失败退出 1，报文件/位置/问题/改法。

### 25 个形状

固定顺序：blob, pebble, bean, egg, squircle, tablet, capsule, cylinder, hex, gem, crystal, wedge, shield, dome, arch, cloud, teardrop, leaf, square, sparkle, clover, flower, heart, house, star。

| 官方 id | 轮廓来源 |
|---|---|
| blob | bloub cercle |
| pebble | galet |
| squircle、square | squircle |
| tablet、capsule | capsule |
| hex | hexagone |
| cloud | nuage |
| teardrop | goutte |
| egg | PROFILES.egg，转普通数组并缓存 |
| bean、cylinder、gem、crystal、wedge、shield、dome、arch、leaf、sparkle、clover、flower、heart、house、star | theme/shapes-extra.ts 的 15 种原创径向轮廓 |

`shapeRadii` 未知 id 返回 null，同 id 返回同数组；SHAPES 映射必须返回原 radii 对象（眼位修正按对象查表），不能复制。原创轮廓用 shape.ts 工具模块加载时计算缓存；64 点、全有限数、最大半径 0.95–1.2、最小 >0.3；除两对别名外，任意两形状逐点最大差 >0.02。心形有凹口、星形五角、四瓣草、花六瓣、房子有屋顶，拱门和穹顶可区分。

`theme/face.ts`：`botFace(slug)` 委托 `resolveFace(slug, entry)`，返回 `{slug, shape, radii, color, source}`。已知官方形状 source=official；未知形状用 seed 轮廓 + 官方色，source=seed；无数据时原 avatarSeed 算法、SHAPES/COLORS 选择不变，shape 为 seed:<id>，fixtures 不变。

`DefaultAvatar` 使用 botFace(slug) 的 radii/shape/color。`faceColors(hex)` 返回 light/dark/outline：light 原色小写；dark 委托 color.ts 的 darkSwap（仅一份深色换奶白规则）；L>0.85 时 outline='rgba(0,0,0,.12)'，否则 null。根属性与动画帧更新隔离，不逐帧覆盖主题变量。根 SVG 内联 `--bz-bot-light` / `--bz-bot-dark`，有描边再内联 `--bz-bot-outline`；`--bz-bot-body` 由 CSS 切换，描边仅浅色显示。**待集成确认的差异**：计划写浅色描边 1px，LB1 明定 outline 渲染 1.5px；本文接口按 LB1 记录，不将两者声称一致。

## 7. 排序、筛选、搜索入口与外链

- 排序和筛选的样子见 §2.4。热门按 heat、addedAt 降序，再按 name；最新按 addedAt 降序，再按 name。
- 首次热度改变顺序时网格（和主推）淡入 200ms；之后点击只改数字，不重排，切换排序或刷新才重排。热度不是导入成功数。
- 搜索入口只有首屏搜索框一个按钮（外加快捷键），派发 `bz-search-open`。搜索面板本身（⌘K / Ctrl+K、「/」、键盘操作、读屏播报）由 `SearchPalette.vue` 负责，规格见 LB9 契约；面板颜色全部引用 `--bz-*` token，条目里的小 Bot 身体约 32px。输入框占位字「搜索」（和首屏同一个 `SHELF_COPY.searchPlaceholder`）；一次最多列 8 条，多出来的只写「还有 N 个」；底部的键帽提示（↑↓ 选择、↵ 打开、esc 关闭）保留。
- 新标签链接有读屏文本「（在新标签页打开）」及 `rel="noopener noreferrer"`。「导入」「一键导入」是按钮，图标用 `BzIcon` 的 `arrow-up-right`（放在文字前面）；作者、技能源码、定时任务这些文字链接沿用后面一个 12px 的「↗」（`ExternalHint`，aria-hidden）。「我要投稿」是站内链接（`/submit`），不带这些。

## 8. 手动复制对话框

原生 dialog，data-testid=prompt-fallback。标题「复制没成功，请手动复制」，说明「全选下面的文字，复制后发给你的 Grok Bot」。只读 textarea 内容等于安装提示词，打开自动全选聚焦；「关闭」按钮、Esc、点遮罩均可关，关闭后焦点回复制按钮。

## 9. 详情页

同一套 token 和质感；内容宽 800px，单栏。界面上不放解释性的句子：额度档位和权限的含义在 `title` 和读屏文本里，来源只写在作者那一项里。

- **返回**：顶部「← 返回货架」是幽灵小按钮（`.bz-btn.ghost.sm`，`arrow-left` + 文字），往左收 12px，让箭头和正文左边缘对齐。
- **头部**（`.detail-header`，上方留 64px 给气泡）：≥768px 左右布局、间距 32，窄屏上下布局。左边一块 **120×120** 的头像砖舞台（<768px 96）里一只活 Bot（占砖 68%）；舞台后面垫一团 Bot 色柔光（头部的 `::before`，16%）。右边自上而下：
  - 名字 `h1`（h1 档 32px/700 圆体；预览里是 `h2`）。
  - 介绍（16px/1.5，`--bz-text-2`）。
  - 一行元信息 `.bot-meta`（13px `--bz-text-3`，项间距 16）：分类标签 → 「作者投稿」标签（不是外部收录才有）→ 作者和来源（`author-link`「by 作者 ↗」+「· 官方市场」或「· 社区收录」，和列表卡同一套规则）→「上架 日期」→ 热度（`flame` +「热度 N」）。
  - 「改编自 <原 Bot 名>」（`data-testid=forked-from`，链原详情页；有才显示）。
  - 按钮（到上面 24，高 44）：「一键导入」`btn-import`（`.bz-btn.primary`，`arrow-up-right` + 文字，**这一屏唯一的实心主按钮**）；不是外部收录的，旁边一枚「复制安装提示词」`btn-prompt`（`.bz-btn`，`copy` + 文字，复制后变 `check` +「已复制」）。窄屏两个按钮撑满。
- **气泡**在头像上方：左边和砖对齐、往右长，尖角朝下探进砖里指着 Bot（尖角中心距气泡左边 60px）；不会盖住「返回货架」，也不压到名字。头像也支持说话、跳动和戳。
- **区块**（`section`）：不套卡片，标题 + 内容；块与块之间 48px，中间一条 `--bz-hairline` 细线（头部到第一条细线 48）。标题圆体 h3 档 20px/600，到内容 12；正文 15px/1.6 `--bz-text-2`。顺序和 data-testid：
  1. **导入前准备**（`section-prereq`）：`prerequisites` 列表，每条前面一个 4px 的小圆点。
  2. **额度消耗**（`section-quota`）：`[data-testid="quota-meter"]`，一条**三格强度条**加一个字。三格各 20×6、圆角 2、间隔 3；「低」亮 1 格、「中」亮 2 格、「高」亮 3 格；没亮的格子是 `--bz-border-strong`，亮的是 `--bz-ink`，只有「高」把格子和字都换成 `--bz-quota-high`。右边一个字「低 / 中 / 高」（15px/600）。档位的含义（「偶尔用一下，几乎不占额度」这类，`bot-summary.mjs` 的 `quotaCopy`）不直接显示：在这一行的 `title` 里，另有一份 `.bz-sr-only` 给读屏。
  3. **会用到的权限**（`section-permissions`）：**一排标签**（中性款 `.bz-tag`，间距 8，放不下换行）。每项的含义（`permissionCopy`）同样在标签的 `title` 和 `.bz-sr-only` 里。一项都没有时写「不需要额外权限」。
  4. 不是外部收录的 Bot 还有下面四块，**没有内容的整块不渲染**（没有「暂无……」的空提示）：
     - **截图**（`section-screenshots`）：≥768px 两列，16:10，圆角 12、细边，lazy，点开是新标签里的原图。
     - **技能**（`section-skills`）：每条一块圆角 12 的小卡（等宽技能名、一句说明、「查看源码 ↗」）。
     - **定时任务**（`section-routines`，有 `routines.md` 才有）：只有一个链接「查看定时任务 ↗」，没有说明句。
     - **设计说明**（`section-design`）：`vp-doc`、最大宽度 720px；里面的小标题 16px/15px，比区块标题低一级。
- 外部收录只有前三块。**页面底部没有来源说明**：来源已经写在头部的作者那一项里。
- /submit 的「投稿预览」复用 `BotCard` 和 `BotDetail`（`preview` 注入）。预览容器只有 380px 左右宽：卡片靠容器查询自动用窄卡片版式；详情头部上下布局。预览里链接不跳走、不请求热度、数据不完整也不报错；按钮是禁用的，下面一行「上架后可用」。**预览里缺内容的提示照旧显示**（「截图 1（待放入）」「暂无截图。」「暂无技能说明。」「暂无设计说明。」「上架后可查看源码」「上架后可查看」）：这是投稿流程的一部分，告诉投稿者还缺什么。`styles/misc.css`、`home.css`、`detail.css` 里各有一小段专门把 `submit.css` 里针对旧版式的偏移归零。

## 10. 空状态与出错

空状态只有一只 Bot、一句话（状态反馈）和一个按钮，没有解释。

| 情况 | 表现 |
|---|---|
| 无 Bot | 虚线框（`1px dashed var(--bz-border-strong)`、圆角 12、上下内边距 48）里居中：96px sleep Bot +「货架上还没有 Bot」（16px/600）+「做第一个投稿的人」（次级按钮，前面一个 `plus` 图标）；data-testid=empty-state；不显示主推、工具栏、计数和页尾 |
| 筛选无结果 | 同样式：96px sleep Bot +「这个分类下暂时没有 Bot」+「看看全部」按钮；data-testid=empty-filter（筛选项只列货架上有的分类，正常不会出现） |
| 搜索无结果 | 搜索面板里一只睡着的 Bot +「没找到，换个词试试」（货架为空时是「货架上还没有 Bot」） |
| 404 | 上下各留 96px，内容居中：120px 头像砖（`.bz-tile.s120`，砖背后一小团这只 Bot 颜色的光）里的 Bot 先 exclaim、再循环 thinking → 小字「404」（12px/600，`--bz-text-3`，`aria-hidden`）→「这一页走丢了」（h1 档 32px）→「← 回货架看看」（次级按钮，染这只 Bot 的颜色，前面一个 `arrow-left` 图标，到标题 32）。只有标题和返回按钮，没有说明句 |
| 详情页某块没内容 | 整块不渲染（截图、技能、定时任务、设计说明）；投稿预览例外，见 §9 |
| 热度失败 | 详情页「热度 —」，列表卡不显示热度；未手选时切最新，不弹错误；主推保持原样 |
| 自定义头像失败 | 回退该 slug 默认头像 |
| 截图失败 | 同尺寸占位块和「图片加载失败」 |

## 11. 减少动效与深色模式

`prefers-reduced-motion: reduce` 下保持 SSR 静态帧；无 rAF、跟随、变身、睡醒、入场、跳动、砖上浮、网格淡入、极光流动、排序滑块过渡，页面上没有任何在跑的 CSS 动画；气泡仍能开关，去位移缩放，只保留 120ms 透明度淡入淡出（覆盖 VitePress 全局 0s 规则）。

主题跟随系统，也可以用导航条上的开关切换；按 §1 token 切换，Bot 颜色、按钮色与柔光按 darkSwap 规则适配。浅深主题都验对比度，切换不用 JS 监听。

## 12. 验收要点

验收脚本在批次目录 `/Users/Admin/Documents/pi-prompts/2026-11-14-bot-zhipin-living/verify/`，不是仓库内目录。实现线跑 npm run check、隔离端口全部 e2e，vendor diff 为空、不越 scope、产物无 _worker.js。

1. **LB1**：idle 眼睛隔 1.5 秒不同；左右 ±300px 的眼睛平均 x 差 ≥10、上下 y 差 ≥6；rAF ≤75 次/秒；离屏 500ms 内暂停，隐藏停钟；reduce 首帧不变；SSR 有 body path、无 hydration 警告。burst 300ms 内生效、有粒子，2.6±0.6 秒回 idle 且双眼存在。
2. **LB2**：真脸数据与 25 轮廓合法、fixtures 不变；暗色换色对卡片底 ≥3:1；真实构建带官方色。
3. **LB3**：全卡进入 300ms 内 wide，typing 先出现，350+28×字数+300ms 内全文；离开 200ms 内关气泡、600ms 内 idle。键盘、触摸、单开回归通过；戳 200ms 内进集合、状态时长+0.6 秒内回 idle，连戳 alert；导入 200ms 内 comet 且正常上报/开页；复制 wink；30 秒睡眠、输入 300ms 内 exclaim、2.5 秒内 idle；会话首次有 swirl、刷新不重播。Hero、空货架、404 与真实脸接线通过。
4. **LB6**：黑眼睛、attentif 首帧、身体占比 ≥80%、SVG 特效外溢；八类标签浅深对比度 ≥4.5、外部标签中性。（招牌只数和大小以本文件 §2.2 为准，LB6 的 7/5 只断言已被 LB8 取代。）
5. **LB9**：搜索面板的打开方式、键盘、焦点、对比度（`verify/lb9-search.spec.mjs`）。
6. **LB8**（`verify/lb8-raycast.spec.mjs`）：v4 的验收。里面和 v5 冲突的数（砖圆角 28、h1 80px、卡片圆角 16、头像 56、详情头像 160、按钮 ≥40、Bot 色实底按钮、斜向极光）已被 v5 取代，以本文和仓库 `tests/e2e/` 为准；其余（导航条、砖墙 9 块、搜索框、筛选排序、横向不滚动、减少动效、对比度）仍然有效。
7. **目视**：`verify/out/LB8/` 的截图和 Raycast 实测截图并排看：深色版是干净有质感的商店，同时一眼看得出是 Grok Bot 的世界；浅色版同样干净；手机版不挤。
8. **发布边界**：LB8 仅在 feat/raycast-look 提交，不推送、不开 PR；实际检查结果以交付说明为准。

## 13. 标签页图标（favicon）

浏览器标签页上的小图标是一只 Bot：每次打开随机一只，开着的时候隔几秒变成另一只，眼睛跟着鼠标看。代码在 `theme/live/favicon.ts`，决策见 DECISIONS 第 33 条。

**长相**

- 和页面里的 Bot 同一个引擎出帧：纯色身体 + 两只深色竖胶囊眼睛（`#16161b`），正对前方。
- 镜头贴着身体外框，四边各留 6%，身体较长的一边占图标的 88%。坐标取整。
- 眼睛比页面里的大一号（宽 0.27、高 0.5，页面是 0.21 / 0.44），眼距 18°：缩到 16px 还看得出是两只眼。
- 颜色 7 种，就是招牌吉祥物那一套（`meta.mjs` 的 `HERO_MASCOTS`）。不取货架 Bot 的官方色，灰、黑、白在标签栏上看不清。
- 形状 18 种：blob、pebble、bean、egg、squircle、tablet、hex、gem、shield、dome、arch、cloud、leaf、clover、flower、heart、house、star。其余 7 种缩到 16px 后和别的撞脸或眼睛挤在一起，不用。
- 每次变化，形状和颜色都必须和上一只不同。
- 眼睛按身体轮廓裁切：看向边缘时，出了身体的部分不画。

**节奏**

| 时机 | 行为 |
|---|---|
| 脚本加载完 | 立刻换成一只随机 Bot（不带过渡）。页面自带的静态图标 `<link>` 被移走，只留一个带 `data-bz-favicon` 的 |
| 之后每隔 4–7 秒（随机） | 变成另一只。过渡 520ms，约 60ms 一帧：形状渐变，颜色沿色相环走近的一边过渡（不经过灰色），正中间闭一下眼 |
| 两次变身之间 | 眨一次眼（3 帧，共约 165ms），时间点在这段停留的 35%–65% 处随机 |
| 鼠标在页面里移动 | 眼睛跟着看。页面不知道图标在屏幕上的位置，所以按视口算：以视口中线为界，鼠标在左看左、在右看右（各 24°）；在上半看上（10°）、下半看下（16°）。视口分成 9 × 5 格，一格一档，同一格里挪动不换图；换图间隔不小于 60ms。变身和眨眼时视线保持 |
| 鼠标停住 4 秒、移出窗口、窗口失焦 | 视线回正。触摸不触发跟随 |
| 标签页在后台 | 照样换，但一步到位，不放过渡帧，不眨眼。浏览器会给后台定时器降频（Chrome 在后台 5 分钟后降到每分钟一次），变化会随之变慢 |
| 过渡中途切到后台 | 立刻落到新 Bot 的静止帧 |
| 站内跳转 | 图标元素不换，节奏不重置；中途冒出来的静态图标 `<link>` 会被再次移走 |
| `prefers-reduced-motion: reduce` | 打开时随机一只，之后不再变、不眨眼、不跟鼠标；关掉这个系统设置后恢复 |

停留期间图标是一张静止的图，不写 DOM；图没变就不重复赋值。

**DOM 约定**

`head > link[rel="icon"][data-bz-favicon]`：`href` 是 `data:image/svg+xml,` 开头的地址，`data-shape`、`data-color` 标注当前（过渡中则是目标）这只 Bot，`data-follow` 是 `pointer`（正跟着鼠标）或 `rest`。

**静态兜底**

`site/public/` 下三个文件，在 `config.mts` 的 `head` 里声明，给没有脚本、不支持 SVG 图标或不跟随运行时换图的环境用：`favicon.svg`、`favicon.ico`（32×32）、`apple-touch-icon.png`（180×180，深色底 `#141418`）。画的都是招牌正中那只橙色圆团（`FAVICON_DEFAULT`）。改了画法后运行 `npm run gen:favicon` 重新生成并提交，单测会检查 `favicon.svg` 有没有跟上。

**验收**

- `tests/unit/favicon.test.mjs`：名单、随机、每种形状的取景和眼睛位置、视线映射和上限、眨眼、过渡节奏、静态文件。
- `tests/e2e/favicon.spec.mjs`：真浏览器里随机、定时变化、过渡帧、视线跟随与回正、后台、减少动效、站内跳转。
- 无头浏览器没有标签栏。改了长相后要把图标按 16px（1 倍和 2 倍像素）画出来，放在浅色、深色标签栏底色上目视；还要在真实浏览器里开着页面看一眼标签页。
- 没在 Safari 上实测。Safari 对 SVG 图标和运行时换图的支持历来不完整，预期它显示静态图标。
