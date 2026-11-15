# 交互与视觉规格（v4：Raycast 版式 + Grok 灵动）

累计规格的真源为 2026-11-14 已批准计划及 LB1、LB2、LB3、LB4、LB6、2026-11-15 LB8、LB9 契约；冲突以 LB8 为准。v4 把首页和详情页整体换成「Raycast Store 的结构和质感 + Grok Bot 的灵动和颜色」：深色主打、悬浮玻璃导航条、会动的彩色 Bot 砖墙、精选大卡、两列细边卡片、岗位筛选和搜索入口（决策 31）。活体头像、真脸、互动行为（LB1–LB3、LB6）不变。验收容差由批次目录 `verify/` 的脚本定义。

实测的 Raycast Store 规格只用来对齐结构、尺寸和质感；不复制它的代码、图标、文案和红色光束背景。

## 0. 原则

1. **商店的骨架，Bot 的颜色**：页面是一家干净、有层次的商店（细边、内高光、玻璃、大留白）；颜色来自 Bot 自己。首屏是一墙五颜六色、会动的吉祥物和缓慢流动的极光；每个 Bot 的官方色透到它的卡片上（按钮、砖里的柔光、悬停光晕、描边）。货架保持官方色，不给灰色 Bot 换色（决策 30）。
2. **Bot 是活的**：呼吸、眨眼、视线漂移；全卡悬停有反应，Hero、精选也能互动。变形只作短暂彩蛋，常驻反应优先保留自身轮廓。
3. **真脸**：读取官方公开的颜色和形状名；复用 MIT bloub 或原创轮廓，不复制 x.ai 路径、眼睛坐标或代码。
4. **文字背后是纯色**：所有装饰光效（极光、砖里的柔光、卡片悬停层、详情页光晕）都放在独立的装饰元素或伪元素里，文字的祖先元素自己不放 `background-image`。名字、介绍、作者、热度、标签、筛选、排序、计数、按钮文字、副标题在两个主题下对比度都 ≥ 4.5。
5. **可用性底线不降**：键盘、触摸、读屏、焦点、对比度、减少动效全部保留；全页只开一个气泡，气泡不压头像和按钮。字体不联网，新增 token 统一 `--bz-`。按钮高 ≥ 40px（触摸 ≥ 44px）；320–1440 任何宽度不横向滚动。

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

- `--bz-radius-card: 16px`。`--bz-shadow-card`：浅色是柔和两层投影；深色卡片靠细边和内高光分层，卡片自身不带投影。
- `--bz-shadow-hover` 为 Bot 染色阴影（保留给 /submit），颜色用 `color-mix(in srgb, var(--bz-bot-color) 55%, transparent)`。
- `--bz-ease-spring: cubic-bezier(.34,1.56,.64,1)`；旧 `--bz-ease-pop` 继续可用。
- `--bz-font-display: ui-rounded, "SF Pro Rounded", "PingFang SC", "HarmonyOS Sans SC", "Microsoft YaHei", system-ui, sans-serif`。用于站名、各级标题、卡片名字、按钮、筛选胶囊、标签、气泡、排序控件；正文沿用系统字体。不加载网络字体或外部样式。
- 兼容 /submit：不得删除或改名 `--bz-ink`、`--bz-ink-hover`、`--bz-paper`、`--bz-card`、`--bz-border`、`--bz-text-2`、`--bz-text-3`、`--bz-surface-soft`、`--bz-success`、`--bz-quota-*`、`--bz-radius-card`、`--bz-shadow-hover`、`--bz-font-display`、`--bz-ease-spring`、`--bz-ease-pop`。额度背景仍用同色 12% 混合。
- 只在 `style.css` 内部使用的派生量（`--bz-card-bg`、`--bz-tile-*`、`--bz-nav-*`、`--bz-seg-*`、`--bz-hover-*`、`--bz-aurora-opacity`、`--bz-featured-glow`）不算对外 token，可以随视觉调整。
- Grok 调色板：橙 `#ff6a13`、紫 `#8b5cf6`、青绿 `#14b8a6`、琥珀 `#f5a623`、棕 `#9a6a3a`、粉 `#ff2e93`、薄荷绿 `#34d399`、蓝 `#3b82f6`、玫红 `#f43f5e`。

`theme/color.ts` 是纯函数配色层：

| 接口 | 规则 |
|---|---|
| `contrast(a, b)` | WCAG 对比度 |
| `darkSwap(hex)` | 相对亮度 L < 0.04 时换 `#f1efe9`，否则原色；返回小写 |
| `buttonColors(hex)` | fg 从 `#ffffff`、`#141418` 选对比度较高者；仍 < 4.5 时，白字的 bg 每次向黑混 4%，深字的 bg 每次向白混 4%，直到 ≥ 4.5；返回小写 hex `{ bg, fg }` |
| `botPalette(hex)` | 返回 `--bz-bot-light`、`--bz-bot-dark`、`--bz-btn-bg-light`、`--bz-btn-fg-light`、`--bz-btn-bg-dark`、`--bz-btn-fg-dark`；dark 按 darkSwap 后的颜色计算 |

列表卡 article、精选卡、详情页根节点和头部、每块 Hero 砖、404 页均加 `bz-bot-scope` 并绑定 `botPalette`。CSS 将 `--bz-bot-color`、`--bz-btn-bg`、`--bz-btn-fg` 指向 light 或 dark 组，不用 JS 监听主题。货架颜色来自 `avatarColor(slug)`，自定义头像用中性灰 `#8a8a93`；Hero 颜色来自 `HERO_MASCOTS`，不读取货架数据。

**眼睛**：所有活体用恒定深色眼睛 `--bz-eye`。唯一例外是官方色近乎纯黑的 Bot（`darkSwap` 会换色的那些，L < 0.04）：浅色主题下身体是黑的，黑眼睛看不见，`DefaultAvatar` 给它加 `bz-live-ink` 类，CSS 把 `--bz-eye` 换成奶白 `#f1efe9`；深色主题下身体已换成奶白，眼睛照旧是深色（决策 32）。

岗位映射唯一位于 `theme/color.ts` 的 `CATEGORY_MASCOTS`（`CATEGORY_COLORS` 由它派生）：产品橙 `#ff6a13` blob、市场粉 `#ff2e93` sparkle、销售青绿 `#14b8a6` star、内容紫 `#8b5cf6` tablet、运营琥珀 `#f5a623` hex、管家蓝 `#3b82f6` cloud、个人薄荷绿 `#34d399` teardrop，每只和招牌砖墙里对应那只同色同形（决策 33）。岗位名来自现有 Bot 数据，schema 仍是合法枚举真源；单测验证映射完整覆盖枚举。`categoryStyle(category)` 仅提供 `--bz-category-color`，岗位标签和筛选胶囊的小圆点共用；未知岗位回退中性灰。岗位的**顺序**由 `theme/enums.data.mjs`（构建时 `loadEnums()`）给到浏览器，不在页面代码里另写一份。

## 2. 首页布局

内容区最大宽 1140px，左右留白 32px（<680px 时 16px）；`.shelf-page` 自己铺满视口宽，用内边距把内容收进 1140，所以极光这类装饰可以出血到视口边缘而不产生横向滚动（`overflow-x: clip`）。自上而下：悬浮导航条 → Hero → 区标题「逛逛货架」→ 精选 → 工具栏 → 列表。

### 2.1 悬浮玻璃导航条

VitePress 默认顶栏（`.VPNavBar`）换肤，不另写导航组件，汉堡菜单、主题切换、GitHub 图标照常可用。

- 全宽度固定在顶部（`.VPNav` 在所有宽度 `position: fixed`）；条本身距顶 16px、左右各留 16px、最大宽 1204px、水平居中，圆角 16px。
- 高 64px（<768px 时 56px）。半透明底（深 `rgba(14,15,17,.72)`、浅 `rgba(255,255,255,.74)`）+ `backdrop-filter: blur(18px) saturate(160%)`，`--bz-hairline` 细边 + 内高光 + 一层向下的柔和投影。
- `--vp-nav-height` 设为「16 + 条高 + 8」，正文和 /submit 的粘性预览按它让位；条内部把它改回条高，默认主题的子元素照常排版。
- 左：自绘的小吉祥物（CSS 里一段内联 SVG：橙色圆团 + 两只竖眼，悬停歪一下头）+ 站名，圆体 17px/700。右：「我要投稿」是一枚墨色实心小圆角按钮（高 36px、圆角 10px，链到 `/submit`），然后是主题开关和 GitHub。
- <768px：右侧收成汉堡；点开后菜单是导航条下面的一块圆角面板（距条 8px、左右 16px、圆角 16px、`--bz-card` 实底、细边），不再铺满全屏。
- 站内没有文档页，滚动后才出现的 `.VPLocalNav`（「回到顶部」条）全站隐藏。

### 2.2 Hero（`.shelf-intro`）

- **极光**（`.hero-aurora`，`aria-hidden`，`.shelf-page` 的第一个子元素，不是文字的祖先）：四道同向的斜光带（橙、紫、青绿、粉；`rotate(-30deg)`，各约 1000×130px，`blur(46px)`），整体用椭圆遮罩向四周淡出，从导航条后面一直铺到标题附近。每道光带沿自己的方向来回流动（21–31 秒一个来回，`ease-in-out infinite alternate`，只动 `transform`）。整体不透明度深色 0.62、浅色 0.42。`prefers-reduced-motion: reduce` 时静止。
- **砖墙**（`.hero-portraits`，`aria-hidden="true"`，内含 9 个 `.hero-portrait`）：固定使用 `meta.mjs` 的 `HERO_MASCOTS`，与货架数量、排序、自定义头像无关。
  - 9 只：上排 5 只（琥珀 hex、青绿 star、**橙 blob（正中）**、粉 sparkle、蓝 cloud），下排 4 只（玫红 heart、紫 tablet、薄荷绿 teardrop、棕 pebble），下排相对上排错开半格。上下左右和斜向相邻的砖不同色系；单测检查。
  - 所有宽度都显示 9 只，SSR 也是 9 只。砖：≥1100px **124×124、圆角 28**、间距 20；680–1099px 96×96、圆角 22、间距 16；<680px `min(60px, (100vw − 72px) / 5)`、圆角 14、间距 8（320 宽时 5 块一排刚好放下）。
  - 每块砖是 `.bz-tile`：半透明底 + `--bz-hairline` 细边 + 内高光，底部一团该 Bot 颜色的柔光（`::before`）；Bot 占砖的 60%。墙的左右两端用横向遮罩渐隐（两端 30%，中间 50% 宽度全亮）。
  - 互动：悬停该砖 → 砖上浮 2px、柔光变亮、细边染上 Bot 色，Bot 跳一下并 `wide`；点击 = 戳；首次进站依次 `swirl` 入场（§5）。跳动加在砖里面那层 `.hero-bot` 上，和砖的上浮互不覆盖。
- **标题**：`h1`（站名）圆体 `clamp(44px, 5.6vw, 80px)` / 700，行高 1.08，字距 −0.02em；视口 1440 时正好 80px，390 时 44px。在砖墙下面。
- **副标题**（`.hero-sub`，站点 tagline）：20px（<680px 18px）/ 1.5，`--bz-text-2`，最大 30em。按「：，」拆成短句，每句是不拆行的 `inline-block`：换行只落在标点后面。
- **搜索框**（`SearchTrigger`，`<button data-testid="search-trigger">`）：≥680px **476×51、圆角 12**（窄屏撑满）；`--bz-card` 底、1px `--bz-border`、内高光；左边放大镜 + 占位字「搜 Bot：名字、岗位、作者…」（15px，`--bz-text-3`），右边两个键帽「⌘」「K」（非苹果设备挂载后显示「Ctrl」；<680px 不显示键帽）。悬停时描边染橙并加一圈 4px 的淡橙外晕。点击派发 `window.dispatchEvent(new CustomEvent('bz-search-open'))`，由 `SearchPalette` 打开；关闭后焦点回到这个按钮。
- **投稿入口**（`[data-testid="contribute-link"]`）：搜索框下面的小玻璃胶囊「＋ 我要投稿」，`--bz-glass` 底、细边、内高光，高 40px（触摸 44px），圆体 14/600，`--bz-text-2`，悬停上浮 2px、文字变墨色；链 `CONTRIBUTE_URL`。

### 2.3 区标题和精选

- 区标题 `h2`「逛逛货架」圆体 40px/600 居中（<680px 28px），下面一行 16px `--bz-text-2` 的说明。Hero 到区标题间距 128px（<680px 88px）。
- **精选**：小标题 `h3`「精选」20px/600 + 说明「热度最高的三位」15px `--bz-text-2`，左对齐。
  - 取热度最高的 3 个 Bot（热度相同比上架日期、再比名字）；热度没拿到或失败时就是最新 3 个。和列表一样只拍快照：进入页面、首次拿到热度各定一次，之后点击不会让卡片跳位。Bot 总数 < 3 时整个精选区不显示。不受岗位筛选和排序影响。
  - 3 张等宽卡 `[data-testid="featured-card"]`（带 `data-slug`、class `bz-bot-scope`，**不带** `data-testid="bot-card"`）：≥900px 一排、间距 32（900–1099px 间距 20）；<900px 竖排、间距 16。
  - 卡：圆角 16、细边 + 内高光、内边距 32，深色底色透明、浅色 `--bz-card`；顶部常驻一团 Bot 色柔光（`::before`），悬停时更亮、细边染 Bot 色。内容居中：96px 玻璃砖（圆角 22）里一只 66px 的活 Bot → 名字（`h4 > a`，链到详情页，20px/600）→ 两行介绍（`.bot-tagline`，15px/1.6，`--bz-text-2`）→ 作者链接 + 热度（13px，`--bz-text-3`）→ 按钮 `[data-testid="featured-import"]`「一键导入」（Bot 色实底，和列表按钮同一套配色与上报逻辑）。
  - 悬停精选卡：Bot `wide`，不显示气泡；点砖 = 戳（和列表、详情共用同一个 slug 的戳历史）；点「一键导入」：上报、Bot 播 `comet`、新标签打开。

### 2.4 工具栏（`.shelf-toolbar`）

货架为空时不显示。精选到工具栏间距 96px（<680px 64px）。

- 左：**排序**，胶囊分段控件「热门 / 最新」。容器高 48px（触摸 52px）、圆角 999px、`--bz-glass` 底 + 细边 + 内高光、内边距 3px；一块选中滑块（`::after`，深色 `rgba(255,255,255,.1)`、浅色白底带细投影）用 spring 在 280ms 内滑到选中项；选中文字 `--bz-ink`，未选 `--bz-text-2`。`role=group`、`aria-label=排序`、按钮 `aria-pressed`，`sort-hot` / `sort-new` 不变。/submit 的预览切换复用这套位置规则并自己覆盖颜色。
- 中：**岗位筛选**，一排小胶囊按钮 `[data-testid="filter-category"]`（`role=group`、`aria-label=按岗位筛选`）：第一个「全部」（小圆点是一圈彩虹），后面是货架上实际出现的岗位，按 schema 枚举顺序，每个前面一个该岗位颜色的 8px 圆点。高 36px（触摸 44px）、细边、13px/600 `--bz-text-2`；选中（`aria-pressed="true"`）时描边和底色染上岗位色（55% / 14%），文字 `--bz-ink`。单选；放不下时这一排自己横向滚动（隐藏滚动条、右端 28px 渐隐），不撑破页面。
- 右：**计数** `.bot-count`「共 N 个 Bot」（N 是筛选后的数量，13px `--bz-text-3`）和**小搜索框** `<button data-testid="search-trigger-toolbar">`（280×43，同首屏样式，同样派发 `bz-search-open`）。
- <1100px：换成两行，第一行排序、计数、搜索框（240px；<900px 只剩 44px 的放大镜方块），第二行整行是岗位筛选。键盘顺序始终是 排序 → 筛选 → 搜索 → 第一张卡片。
- 筛选和排序可以叠加。默认热门；stats 失败且用户未手选时改最新。不记住选择。

### 2.5 列表（`.bot-grid`）

≥900px **两列**、间距 24（1140 内容宽时每张 558px）；<900px 单列、间距 16。同一行等高。筛选或首次热度改变顺序时网格淡入 200ms。

## 3. 卡片、玻璃砖和气泡

### 3.1 玻璃砖（`.bz-tile`）

Hero、精选、列表头像、详情舞台、404 共用：`--bz-glass`（Hero 上是更实一点的半透明底）+ `--bz-hairline` 细边 + 内高光 + 一层向下的投影；`::before` 在砖底画一团 Bot 色的径向柔光（浅色 30%、深色 38% 混透明），所在卡片悬停时变亮。砖是静止的，没有漂移动画；砖里只放 Bot，不放文字。

### 3.2 列表卡（`[data-testid="bot-card"]`）

| 区域 | 规格 |
|---|---|
| 外壳 `.bot-card` | 保留 `data-slug`、`bz-bot-scope`。圆角 **16**，`--bz-hairline` 细边 + 内高光；深色底色透明，浅色 `--bz-card` + 柔和投影。article 是容器查询的容器，版式网格在里面的 `.bot-card-body`（内边距 28px，间距 16px） |
| 第一行 | 左：64px 玻璃砖 `.avatar-stage`（圆角 16）里放头像按钮 `[data-testid=avatar]` **56×56**。中：名字 `h2 > a[data-testid="detail-link"]`（圆体 17px/700，悬停下划线）；名字下面一行 `.bot-meta`：岗位标签 `.bot-tag.category-tag` + 外部收录标签 + `author-link`「by 名字」（13px `--bz-text-3`）。**右上角**：「一键导入」`btn-import`（Bot 色实底，高 40，触摸 44），贴着第一行顶部、和砖垂直居中 |
| 第二行 | 两行介绍 `.bot-tagline`（15px/1.6，`--bz-text-2`，最多两行省略），这一块最少 62px 高；气泡也落在这一格 |
| 第三行 | 左 `.bot-stats`：热度 `heat`（16px 火苗 +「热度 N」）、额度（闪电 +「额度 低/中/高」，图标用 `--bz-quota-*`）、权限（盾牌 +「N 项权限」/「无需权限」；卡片窄于 480px 时不显示）；都是 13px `--bz-text-3`、tabular-nums。右：「复制安装提示词」`btn-prompt`（描边幽灵按钮：透明底、1px Bot 色 45% 混边框色；文案和「已复制 ✓」逻辑不变；外部收录没有这个按钮） |
| 窄卡片 | 卡片自己窄于 400px 时（手机、/submit 预览；用 `@container`，不看视口）：内边距 20px，「一键导入」挪到第四行，和「复制安装提示词」并排，各自撑开；再窄就各占一行 |
| 悬停 | 仅 `@media (hover:hover)`。卡片 `::after` 是一层绝对定位的渐变：左上角 `color-mix(in srgb, var(--bz-bot-color) 20%, transparent)` 的径向光，叠在自上而下的柔光上；默认 `opacity: 0`，150ms `ease-in-out` 淡入到 1；细边同时染上 Bot 色（45%）。**卡片本身不位移、不缩放。** 内容在这层之上（`z-index`）。触摸点开气泡或键盘聚焦头像时这层也亮起来 |
| 岗位标签 | 圆体 12px/600，岗位色 16% 混卡片底，文字为岗位色 40% 混 `--bz-ink`，两主题对比度均 ≥4.5；高 22px，左右 8px，圆角 999px；「外部收录」为中性 `--bz-surface-soft` 底、`--bz-text-2` 字 |
| 热度 | >0 时火苗变 `--bz-flame`，文字不变；加载「热度 …」，失败「热度 —」，title 为「热度暂时获取不到」 |
| 按钮 `.shelf-button` | 圆体 14/600，圆角 999px，高 ≥40px，触摸 ≥44px，左右 18px；`.primary` 用 `--bz-btn-bg` 纯色底、`--bz-btn-fg` 字，不用渐变，悬停只提亮；按下 scale(.96) |

保留 `.bot-tag`、`.bot-tagline`、`.avatar-stage` 等现有类名和全部 data-testid。DOM 顺序（也是键盘顺序）：头像 → 名字 → 作者 → 导入 → 复制。

### 3.3 气泡几何与跳动

- **位置**：气泡在卡片里面，**盖在介绍那一块上**（和 `.bot-tagline` 同一个网格格子，左上对齐）；悬停时介绍 120ms 淡出，气泡出现在同一位置，尖角朝上指向头像（尖角中心在头像正下方，距气泡左边 32px）。气泡完全在卡片内，不压头像、不压「一键导入」。
- **样子**（漫画风保留）：`--bz-card` 实底、2px `--bz-ink` 描边、圆角 14px，硬投影 `3px 3px 0 var(--bz-bot-color)`；圆体 14px/700/1.45，内边距 8px 14px；宽度随文字，最小 68px、最大撑满介绍那一格；最多两行，line-clamp:2、text-wrap:balance 防孤字。尖角为 12px 方块，仅右、下 2px 描边：卡片里转 225° 朝上，详情页转 45° 朝下。
- **弹出**：opacity 0→1 180ms；位移 −5px→0、scale .94→1 280ms 弹簧缓动，原点在尖角处；收起 opacity 120ms，位移和缩放倒放。
- **跳动**：头像按钮原点脚底，560ms、每段弹性缓动；0/24/54/80/100% 的 translateY 0/2/−10/0/0px 与 scale (1,1)/(1.07,.92)/(.96,1.05)/(1.02,.98)/(1,1)。头像可以跳出玻璃砖；逐帧检查头像下沿到气泡上沿始终 ≥13px（放得下约 11px 的尖角）。悬停和键盘说话重新触发；鼠标/触摸戳只播 Bot 变身、不叠加按钮位移，连续点击保持稳定命中。
- 每卡 `data-testid=pitch-bubble`，`data-open="true|false"`；全页最多开一个。有 pitch 用 pitch，没有则 DEFAULT_PITCHES 随机且不连续重复；戳时改用 §5 专用台词。
- 头像按钮 `aria-label="听听{名字}的自荐"`；打开时 aria-describedby 指向独立的 `bz-sr-only` 全文元素。视觉 tooltip 设 aria-hidden、不用 aria-live；气泡 `data-text` 从打开起就是全文，内部唯一一个 span 用于逐字层，`[data-testid=typing]` 用 i 容器及三个 i 点、aria-hidden，避免逐字播报。初次加载不自动开气泡。
- `BotAvatar` 的 DOM：外层 `.avatar-root`（在卡片里 `display: contents`，让砖和气泡各自落进卡片网格；在详情页是气泡的定位容器）→ `.avatar-stage.bz-tile` > `button.bot-avatar`，以及并列的 `p.pitch-bubble`、`p.bz-sr-only`。
- focus-visible：2px 墨色 outline，offset 2px，头像圆形且 offset 3px。

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
| rest | 基础状态，默认 idle；卡片/精选/Hero 悬停 wide、空货架 sleep、404 thinking |
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
| 鼠标进入精选卡 | wide + 顶部柔光变亮；不跳、不出气泡 |
| Tab 到头像 / Enter / 空格 / Esc / 失焦 | Tab 说一句；Enter/空格换一句并重新跳；Esc 关闭；失焦关闭 |
| 点击或点按头像（「戳」） | 从 wink, burst, orbit, play, comet, egg, hexagon, thinking 随机选一个，不与上次重复；按引擎 duration 播完回 rest，换戳台词且不连续重复；滚动 3 秒内第 5 次触发 alert，说「别戳啦！」并清零计数。卡片/精选/详情按 slug 共享历史；Hero 使用独立的 `mascot:<key>` 历史，不污染货架 |
| 点「一键导入」（列表、精选、详情） | 该卡 Bot 播 comet（「嗖」一下） |
| 复制成功 | wink |
| 30 秒没有任何输入（减少动效时不触发） | data-running=true 的 Bot 依次进入 sleep，整波次错开 0–800ms；一个全局超时器管理整波 |
| 睡着后有任何输入 | 取消待睡队列，所有 sleep Bot 立即 exclaim，按 2 秒 duration 回 rest |
| 第一次进站（每个会话一次） | Hero 的 9 只 Bot 按上排、下排的顺序依次 swirl 入场，间隔 120ms |
| Hero 里的 Bot | 悬停：砖上浮 2px、柔光变亮，Bot 跳一下 + wide；点击 = 戳；仍然 aria-hidden |
| 点搜索框（首屏或工具栏）、按 ⌘K / Ctrl+K、「/」 | 打开搜索命令面板（`SearchPalette`）；关闭后焦点回到原处 |
| 点岗位筛选胶囊 | 列表只留这个岗位，计数跟着变，网格淡入 200ms；精选不变 |
| 空货架 / 筛选无结果 | 一只睡着的 Bot（160px / 120px），rest=sleep，无灰度滤镜 |
| 404 页 | not-found Layout 插槽；232px 玻璃砖里一只 168px 的 Bot 先 exclaim、再常驻 rest=thinking；「这一页走丢了」+「这个 Bot 可能已经下架了，或者链接写错了。」+ href=/「回货架看看」 |
| 触摸 | 点按 = 戳 + 气泡显示 4 秒；点别处关闭；不跟随视线 |

戳台词：「哎，痒！」「再戳我就变形了」「好啦好啦，我在呢」「你找我呀？」。全部新增文案在 meta.mjs。

`live/reactions.ts` 仅挂一组 capture/passive 全局输入监听：pointermove、pointerdown、keydown、wheel、scroll、touchstart。URL 的 `?bz-idle=<毫秒>` 仅在客户端首次注册时读取一次，只接受 200–600000 的整数；默认代码值 `30_000`。若演示短阈值遇到未播完的戳/惊醒/入场，整波睡眠每秒检查一次、等临时动作完成后再睡，避免打断反馈；不增加每只 Bot 的计时循环。最后一个 Bot 卸载清理监听和计时器。

Hero 首次首页挂载在 sessionStorage 记 `bz-hero-entered`；仅会动的头像依次入场，间隔 120ms；存储不可用则退化为当前文档一次。卸载取消待入场计时器，减少动效不记标记、不播放。悬停在 `.hero-portrait` 上跳一次（动画加在里面的 `.hero-bot` 上），离开释放 wide；戳不弹气泡、不进入 Tab 顺序。

气泡打字消费共享时钟，完成、关闭或失去全页唯一所有权时注销；减少动效时立即显示全文（包括中途切换）。卡片/详情以 provide/inject 把动作按钮接到自身头像，复制失败不 wink。

输入按每次事件 pointerType 判断，不存全局「触摸过」标记；鼠标点击不依赖浏览器是否赋焦点。全页单气泡、触摸再次点按换一句保留；鼠标转触摸时释放旧视线，后续鼠标仍能跟随。导入仍正常新标签打开、点击正常上报，动画不阻塞业务；复制成功仍显示「已复制 ✓」，文字和边框 success 色，1.8 秒恢复，唯一读屏播报区播报「已复制安装提示词」。失败按 §8。

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
- 首次热度改变顺序时网格（和精选）淡入 200ms；之后点击只改数字，不重排，切换排序或刷新才重排。热度不是导入成功数。
- 搜索入口有两个：首屏搜索框和工具栏小搜索框，都只是按钮，派发 `bz-search-open`。搜索面板本身（⌘K / Ctrl+K、「/」、键盘操作、读屏播报）由 `SearchPalette.vue` 负责，规格见 LB9 契约；面板颜色全部引用 `--bz-*` token，条目里的小 Bot 身体约 32px。
- 新标签链接（导入、作者、技能源码、定时任务）有 12px「↗」（aria-hidden）、读屏「（在新标签页打开）」及 rel="noopener noreferrer"。「我要投稿」是站内链接（`/submit`），不带这些。

## 8. 手动复制对话框

原生 dialog，data-testid=prompt-fallback。标题「复制没成功，请手动复制」，说明「全选下面的文字，复制后发给你的 Grok Bot」。只读 textarea 内容等于安装提示词，打开自动全选聚焦；「关闭」按钮、Esc、点遮罩均可关，关闭后焦点回复制按钮。

## 9. 详情页

- 同一套 token 和质感；内容宽 920px。顶部「← 返回货架」是一枚小玻璃胶囊。
- 头部（`.detail-header`）：≥768px 左右布局，窄屏上下布局（舞台居中）。左边一块 **200×200** 的玻璃砖舞台（圆角 44）里一只 **160px** 的活 Bot（`.detail-header [data-testid="avatar"]` 160×160）；舞台后面垫一团 Bot 色柔光（头部的 `::before`）。右边：名字圆体 40px/700（<768px 30px）、介绍 18px `--bz-text-2`、标签行（岗位、外部收录、作者、上架日期、热度）、「改编自 <原 Bot 名>」（`data-testid=forked-from`，链原详情页）、两个按钮。
- 气泡仍在头像上方：水平居中于舞台，尖角朝下，底边压进舞台 10px；头部上方留 68px，气泡不会盖住「返回货架」。头像也支持说话、跳动和戳。
- 头部下面各区块（`section`）做成细边玻璃卡：`--bz-glass` 底、`--bz-hairline` 细边、内高光、圆角 16、内边距 26px 32px（<768px 22px 20px），区块间距 16px。小标题圆体 20px/600，正文 `--bz-text-2`。顺序和 data-testid 不变：导入前准备列表 → 额度（彩色低/中/高 + 说明）→ 权限（名称标签 + 说明；无则「不需要额外权限」）→ 截图（≥768px 两列，lazy，圆角 12px、1px 边框，新标签原图）→ 技能（等宽技能名、description、查看源码；每条是一块圆角 12 的小卡，描边 Bot 色 30% 混 border）→ 定时任务（有 routines.md 才显示）→ 设计说明（vp-doc、最大宽度 720px；里面的小标题 17px/15px，比区块标题低一级）。
- 外部收录显示「这个 Bot 由原作者在 x.ai 发布，本站只收录链接。」（同样是一条玻璃卡），只显示准备、额度、权限三个内容区块。
- /submit 的「投稿预览」复用 `BotCard` 和 `BotDetail`（`preview` 注入）。预览容器只有 380px 左右宽：卡片靠容器查询自动用窄卡片版式；详情头部上下布局。`style.css` 末尾有一小段专门把 `submit.css` 里针对旧版式的偏移归零。

## 10. 空状态与出错

| 情况 | 表现 |
|---|---|
| 无 Bot | 虚线细边的玻璃块里：160px sleep Bot +「货架上还没有 Bot」+「做第一个投稿的人」；data-testid=empty-state；不显示精选和工具栏 |
| 筛选无结果 | 同样式：120px sleep Bot +「这个岗位下暂时没有 Bot」+「看看全部」按钮；data-testid=empty-filter（筛选项只列货架上有的岗位，正常不会出现） |
| 404 | 232px 玻璃砖里的 Bot exclaim 后循环 thinking，「这一页走丢了」及「回货架看看」（按钮用这只 Bot 的颜色） |
| 热度失败 | 热度 —；未手选时切最新，不弹错误；精选保持最新三位 |
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
6. **LB8**（`verify/lb8-raycast.spec.mjs`）：两主题底色和旧 token 仍在；导航条圆角 16、有 blur、宽 ≤1206、滚动后仍在顶部；砖墙 9 块上 5 下 4、1440 时 124px/圆角 28、390 时 ≤64、颜色够艳且 ≥6 种色相、≥5 种形状；h1 1440 时 80px；搜索框 476×51/圆角 12、点开面板、Esc 后焦点回来；精选 3 张一排（手机竖排）、Bot 活着、悬停 wide、导入 comet；筛选和排序叠加、计数跟着变；1440/1280/1100/900/680/390/320 七宽列表版式（两列/单列、卡宽 558、圆角 16、头像 56、导入在右上角）、30 字气泡 ≤2 行且在卡片内、不压头像和导入按钮、无横滚；悬停 `::after` 从 0 到 1 且卡片不位移；减少动效时没有在跑的动画；两主题文字和按钮对比度 ≥4.5、按钮 ≥36（触摸 ≥44）；详情头像 160；无网络字体。`LB8-check.sh` 在 4198 依次跑 npm run check、仓库全部 e2e、LB1/LB3/LB9/LB8、LB6 的脸和岗位色、真实 bots 构建的截图和录屏、dev-watch。
7. **目视**：`verify/out/LB8/` 的截图和 Raycast 实测截图并排看：深色版是干净有质感的商店，同时一眼看得出是 Grok Bot 的世界；浅色版同样干净；手机版不挤。
8. **发布边界**：LB8 仅在 feat/raycast-look 提交，不推送、不开 PR；实际检查结果以交付说明为准。
