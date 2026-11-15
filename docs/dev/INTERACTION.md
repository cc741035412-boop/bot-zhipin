# 交互与视觉规格（v3：彩色招牌 + Grok 风格正脸）

累计规格的真源为 2026-11-14 已批准计划及 LB1、LB2、LB3、LB4、2026-11-15 LB6 契约；冲突以 LB6 为准。v3 将招牌改为固定品牌吉祥物，货架保留官方配色；所有活体用黑眼睛、正脸和饱满身体。验收容差由批次目录 `verify/` 的脚本定义，不再统一允许任意 ±2px 微调。

## 0. 原则

1. **活泼彩色**：页面圆润、柔和；货架舞台、按钮和阴影随 Bot 官方配色，分类标签按分类配色，招牌用固定彩色吉祥物。用户 2026-11-14 推翻旧视觉决定，2026-11-15 明确品牌色与官方色分工，见决策 19、22。
2. **Bot 是活的**：呼吸、眨眼、视线漂移；全卡悬停有反应，Hero 也能互动。变形只作短暂彩蛋，常驻反应优先保留自身轮廓。
3. **真脸**：读取官方公开的颜色和形状名；复用 MIT bloub 或原创轮廓，不复制 x.ai 路径、眼睛坐标或代码。
4. **可用性底线不降**：键盘、触摸、读屏、焦点、对比度、减少动效全部保留；全页只开一个气泡，气泡不能压头像。字体不联网，新增 token 统一 `--bz-`。

## 1. 设计 token 与配色

浅色写在 `:root`，深色写在 `.dark`。颜色混合一律用 `color-mix(in srgb, …)`。

| token | 浅色 | 深色 |
|---|---|---|
| `--bz-page` / `--vp-c-bg` | `#f6f5f1` | `#0c0c0f` |
| `--bz-card` / `--bz-paper` | `#ffffff` | `#16161b` |
| `--bz-eye` | `#16161b` | `#16161b`（恒定，不随主题切换） |
| `--bz-ink` | `#141418` | `#f4f4f5` |
| `--bz-ink-hover` | `#2c2c33` | `#e4e4e7` |
| `--bz-text-2` | `#4a4a52` | `#c2c2ca` |
| `--bz-text-3` | `#62626b` | `#9d9da8` |
| `--bz-border` | `#ebe8e1` | `#26262d` |
| `--bz-surface-soft` | `#efede7` | `#1f1f25` |
| `--bz-flame` | `#f97316` | `#fb923c` |
| `--bz-success`（保留） | `#16a34a` | `#4ade80` |
| `--bz-quota-low/mid/high`（保留） | `#15803d` / `#b45309` / `#b91c1c` | `#4ade80` / `#fbbf24` / `#f87171` |

- `--bz-radius-card: 28px`；`--bz-shadow-card` 为柔和两层阴影，契约未固定两层的偏移数值。
- `--bz-shadow-hover` 为 Bot 染色阴影，颜色用 `color-mix(in srgb, var(--bz-bot-color) 55%, transparent)`。
- `--bz-ease-spring: cubic-bezier(.34,1.56,.64,1)`；旧 `--bz-ease-pop` 继续可用。
- `--bz-font-display: ui-rounded, "SF Pro Rounded", "PingFang SC", "HarmonyOS Sans SC", "Microsoft YaHei", system-ui, sans-serif`。用于站名、卡片名字、按钮、标签、气泡、排序控件、详情页标题；正文沿用系统字体。不加载网络字体或外部样式。
- 兼容 /submit：不得删除或改名 `--bz-ink`、`--bz-ink-hover`、`--bz-paper`、`--bz-border`、`--bz-text-2`、`--bz-text-3`、`--bz-surface-soft`、`--bz-success`、`--bz-quota-*`、`--bz-radius-card`、`--bz-shadow-hover`、`--bz-ease-pop`。额度背景仍用同色 12% 混合。

`theme/color.ts` 是纯函数配色层：

| 接口 | 规则 |
|---|---|
| `contrast(a, b)` | WCAG 对比度 |
| `darkSwap(hex)` | 相对亮度 L < 0.04 时换 `#f1efe9`，否则原色；返回小写 |
| `buttonColors(hex)` | fg 从 `#ffffff`、`#141418` 选对比度较高者；仍 < 4.5 时，白字的 bg 每次向黑混 4%，深字的 bg 每次向白混 4%，直到 ≥ 4.5；返回小写 hex `{ bg, fg }` |
| `botPalette(hex)` | 返回 `--bz-bot-light`、`--bz-bot-dark`、`--bz-btn-bg-light`、`--bz-btn-fg-light`、`--bz-btn-bg-dark`、`--bz-btn-fg-dark`；dark 按 darkSwap 后的颜色计算 |

卡片 article、详情头部、每个 Hero 头像容器均加 `bz-bot-scope` 并绑定 `botPalette`。CSS 将 `--bz-bot-color`、`--bz-btn-bg`、`--bz-btn-fg` 指向 light 或 dark 组，不用 JS 监听主题。货架颜色来自 `avatarColor(slug)`，自定义头像用中性灰 `#8a8a93`；Hero 颜色来自 `HERO_MASCOTS`，不读取货架数据。

分类映射唯一位于 `theme/color.ts` 的 `CATEGORY_COLORS`：调研紫 `#8b5cf6`、定义橙 `#ff6a13`、评审粉 `#ff2e93`、AI 评测青绿 `#14b8a6`、学习琥珀 `#f5a623`、求职棕 `#9a6a3a`、日常薄荷绿 `#34d399`、基础设施蓝 `#3b82f6`。分类名来自现有 Bot 数据，schema 仍是合法枚举真源；单测验证映射完整覆盖枚举。`categoryStyle(category)` 仅提供 `--bz-category-color`，首页与详情共用；未知分类回退中性灰。

## 2. 首页布局和 Hero

- 容器 max-width 1120px（含内边距），左右 24px（≤680px 时 16px），上 32px、下 96px；Hero 上 32px、下 40px。
- 网格 ≥1100px 三列，680–1099px 两列，<680px 一列且卡片 max-width 520px 居中；间距 20px，窄屏 16px。同一行等高，按钮贴底。
- Hero 固定使用 `meta.mjs` 的 `HERO_MASCOTS`，每只 `{ key, shape, color }`；与货架数量、排序、自定义头像无关，空货架也有招牌。由左至右：琥珀 hex、紫 tablet、青绿 star、**橙 blob（中央）**、粉 sparkle、薄荷绿 teardrop、棕 pebble。7 种颜色/形状交错，色值见配置。
- SSR 始终渲染 7 只，<680px 仅 CSS 隐藏两端，保留中间 5 只；不根据 window 决定首帧。`HeroPortrait` 直接用 `shapeRadii(mascot.shape)` 和 mascot.color 渲染 LiveBot，`data-shape` 保持形状 id，填色 rect 保留 `data-part="fill"`。
- `.hero-portraits` / `.hero-portrait` 保留。按离中心距离 0/1/2/3，盒子宽高为 96/80/68/60px；<680px 乘 0.75，<400px 改乘 0.62（不是叠乘）。底边齐，间距 14px（<680px 为 6px），共用柔和地面阴影。
- h1 为 `clamp(40px,7vw,64px)` / 800，行高 1.1、字距 -0.03em，balance；介绍 17px / 1.7，最大 34em，balance。招牌上半部有橙、紫、青绿、粉四团淡光晕（浅色 14%、深色 20% 混透明），限定在容器宽度内、不拦截点击；文字对比度不得降低到 4.5 以下。
- 「我要投稿」仍为墨色胶囊加小加号，高 ≥40px，触摸 ≥44px，左右 20px；圆体 14/700，悬停上浮 2px；链接 CONTRIBUTE_URL。
- 工具条左侧排序、右侧「共 N 个 Bot」（13px、三级文字色）。Hero 保留 `aria-hidden`，悬停和戳按 §5。

## 3. 卡片、舞台和气泡

| 区域 | 规格 |
|---|---|
| 外壳 `.bot-card` | 纯色 `--bz-card`，1px 边框（深色 `#26262d`），圆角 28px，柔和两层阴影，左右和底部内边距 22px |
| 悬停 | 仅 `@media (hover:hover)`；全卡上浮 4px，染色阴影；220ms 弹簧过渡，450ms 内稳定在 -4px |
| 舞台 `.avatar-stage` | 高 236px，左右抵消 22px，顶角 27px；自身 background-image 上放 2–3 层 radial-gradient，不放伪元素；底色为 Bot 色 10% 混卡片色，深色提高混色比例 |
| 舞台动效 | 光斑 background-position 以 18 秒 ease-in-out infinite alternate 漂移；脚下约 96×14px 椭圆地面阴影不动 |
| 头像 | `[data-testid=avatar]` 按钮 112×112px，距舞台底 22px，居中；眼睛挖空露出恒定 `--bz-eye: #16161b` 的身体垫底层，浅深模式均为黑眼睛；自定义图圆形裁切、object-fit cover、1px 边框 |
| 名字 | h2，21px/700/1.3，字距 -0.01em；详情链接 `detail-link`，悬停下划线 |
| 分类标签 | 圆体 12px/600，分类色 16% 混卡片底，文字为分类色 40% 混 `--bz-ink`，两主题对比度均 ≥4.5；高 22px，左右 8px，圆角 999px；「外部收录」为中性 `--bz-surface-soft` 底、`--bz-text-2` 字 |
| 作者 | 「by 名字」，13px、三级文字色，作者主页新标签 |
| 介绍 | `.bot-tagline`，15px/1.65、二级文字色，最多两行省略，flex:1 |
| 热度 | 16px 火苗 +「热度 N」，13px 三级文字色，tabular-nums；>0 火苗变 `--bz-flame`，文字不变；加载「热度 …」，失败「热度 —」，title 为「热度暂时获取不到」 |
| 按钮 | `.shelf-button` 圆体 14/700，圆角 999px，高 ≥40px，触摸 ≥44px，左右 18px、间隔 10px；窄时各占一行；外部收录只有导入 |
| 导入 `.primary` | `--bz-btn-bg` 纯色底、`--bz-btn-fg` 字，不用渐变 |
| 复制 | 1.5px Bot 色 45% 混边框色的描边，墨色字；悬停染 10% Bot 色；按下两类按钮均 scale(.96) 弹簧回弹 |

名字、介绍、作者、热度、标签、按钮背后必须是纯色；浅深主题文字和按钮对比度均 ≥4.5。保留 `.bot-tag` 等现有类名和全部 data-testid。

### 气泡几何与跳动

- 气泡底到头像顶净距 **≥34px**：`bottom = 22 + 112 + 34 = 168px`。给上移约 10px、纵向拉伸 5%、尖角留余量；逐帧仍须满足尖角下沿距头像上沿 ≥8px，气泡上沿在舞台内。不能只看静止帧。
- 底色卡片色，2px 墨色描边、圆角 16px，硬投影 `3px 3px 0 var(--bz-bot-color)`；圆体 14px/700/1.45，内边距 8px 14px。尖角为旋转 45° 的 12px 方块，仅右、下 2px 描边。
- 水平居中，向上生长；width:max-content，max-width:min(260px, 100% - 32px)；最多两行，line-clamp:2、text-wrap:balance 防孤字。
- 弹出 opacity 0→1 180ms；位移 +6px→0、scale .92→1 280ms 弹簧缓动，原点底部中心；收起 opacity 120ms，位移和缩放倒放。
- 跳动原点脚底，560ms、每段弹性缓动；沿用 0/24/54/80/100% 的 translateY 0/2/-12/0/0px 与 scale (1,1)/(1.07,.92)/(.96,1.05)/(1.02,.98)/(1,1)，同时必须通过新尺寸下的逐帧净距验收。悬停和键盘说话重新触发；鼠标/触摸戳只播 Bot 变身、不叠加按钮位移，连续点击保持稳定命中。
- 每卡 `data-testid=pitch-bubble`，`data-open="true|false"`；全页最多开一个。有 pitch 用 pitch，没有则 DEFAULT_PITCHES 随机且不连续重复；戳时改用 §5 专用台词。
- 头像按钮 `aria-label="听听{名字}的自荐"`；打开时 aria-describedby 指向独立的 `bz-sr-only` 全文元素。视觉 tooltip 设 aria-hidden、不用 aria-live；气泡 `data-text` 从打开起就是全文，内部唯一一个 span 用于逐字层，`[data-testid=typing]` 用 i 容器及三个 i 点、aria-hidden，避免逐字播报。初次加载不自动开气泡。
- focus-visible：2px 墨色 outline，offset 2px，头像圆形且 offset 4px；不挡气泡。

## 4. 活体头像与接口

常驻动作由引擎 liveliness 提供：呼吸、自然眨眼、视线漂移。所有 LiveBot 初始化及减少动效重置时，均在 `new BotEngine` 第四参数传 `EXPRESSION_BY_ID.get('attentif')`，正脸竖胶囊眼，不再用默认往右上的 neutre。临时表情与鼠标跟随保持原行为。渲染方式参考 jeremy-prt/bloub `BloubBot.vue`（MIT，b4bb3c1），保留 mask 挖眼及粒子、圆环前后层次，不修改 vendor。

视口为 ±112，静止身体最长边占头像框 ≥80%；根 SVG `overflow: visible`，特效可画出框外。mask 和填色画布仍为上游 ±158，避免变身时身体被裁小。粒子深度雾混 `--bz-card`（回退 `--vp-c-bg`），与恒定深色眼睛解耦，浅色不发黑、深色仍自然隐入背景。卡片按钮/舞台尺寸与气泡 34px 净距不变，收紧视口后仍逐帧检查尖角净距 ≥8px，并检查 Hero、详情和特效无横滚/裁切。

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
| `data-part="body"` | 身体垫底 path，带 d，填 `var(--bz-eye, #16161b)`；眼睛始终为深色 |
| `data-part="fill"` | mask 内身体填色 rect；DefaultAvatar 传入 `var(--bz-bot-body)` |
| rest | 基础状态，默认 idle；卡片/Hero 悬停 wide、空货架 sleep、404 thinking |
| `data-part="eye"` | mask 内两眼 path；transform 直接用引擎 matrix(...)，opacity 用 alpha |
| `data-part="dot|arc|notif"` | 粒子 / 圆环 / 通知点 |
| radii / color | number[] 或 null（圆）；color 接受 CSS 变量，身体用 style fill，不用 fill 属性 |
| outline / size | 可选描边色；有值沿身体画 1.5px、non-scaling-stroke；SVG width/height 默认 96，外层 CSS 决定显示尺寸 |

在根 SVG 派发 `bz-play` 自定义事件，`detail = { state: StateId, hold?: number }`。不在 STATE_BY_ID 的状态或 reduce 时忽略；否则 setState(state,t)，持续 `hold ?? 状态 duration` 秒（共享时钟）后回 rest；`hold: Infinity` 一直保持，NaN/-Infinity 回退 duration，负数归零。新事件打断旧事件。`live/playback.ts` 管理播放期限，rest 改变不打断有限临时动作；离开可释放 wide/Infinity。减少动效恢复静态 idle，重新启用动效回当前 rest。LB3 通过此接口及组件局部引用接反应，不为每个头像另起时钟。

## 5. 互动行为

| 触发 | 反应 |
|---|---|
| 鼠标进入整张卡片（不再只限头像） | wide 睁大眼 + 跳一下；气泡先显示「…」打字点 350ms，再按 28ms/字逐字打出（读屏区一开始就有全文） |
| 离开卡片 | 立即关闭气泡（120ms 淡出），基础状态改 idle；进行中的戳/按钮临时动作不被打断 |
| Tab 到头像 / Enter / 空格 / Esc / 失焦 | Tab 说一句；Enter/空格换一句并重新跳；Esc 关闭；失焦关闭 |
| 点击或点按头像（「戳」） | 从 wink, burst, orbit, play, comet, egg, hexagon, thinking 随机选一个，不与上次重复；按引擎 duration 播完回 rest，换戳台词且不连续重复；滚动 3 秒内第 5 次触发 alert，说「别戳啦！」并清零计数。卡片/详情按 slug 共享历史；Hero 使用独立的 `mascot:<key>` 历史，不污染货架 |
| 点「一键导入」 | 该卡 Bot 播 comet（「嗖」一下） |
| 复制成功 | wink |
| 30 秒没有任何输入（减少动效时不触发） | data-running=true 的 Bot 依次进入 sleep，整波次错开 0–800ms；一个全局超时器管理整波 |
| 睡着后有任何输入 | 取消待睡队列，所有 sleep Bot 立即 exclaim，按 2 秒 duration 回 rest |
| 第一次进站（每个会话一次） | Hero Bot 依次 swirl 入场，间隔 120ms |
| Hero 里的 Bot | 悬停跳一下 + wide，点击 = 戳；仍然 aria-hidden |
| 空货架 | 一只 160px Bot，rest=sleep，无灰度滤镜 |
| 404 页 | not-found Layout 插槽；200px Bot 先 exclaim、再常驻 rest=thinking；「这一页走丢了」+「这个 Bot 可能已经下架了，或者链接写错了。」+ href=/「回货架看看」 |
| 触摸 | 点按 = 戳 + 气泡显示 4 秒；点别处关闭；不跟随视线 |

戳台词：「哎，痒！」「再戳我就变形了」「好啦好啦，我在呢」「你找我呀？」。全部新增文案在 meta.mjs。

`live/reactions.ts` 仅挂一组 capture/passive 全局输入监听：pointermove、pointerdown、keydown、wheel、scroll、touchstart。URL 的 `?bz-idle=<毫秒>` 仅在客户端首次注册时读取一次，只接受 200–600000 的整数；默认代码值 `30_000`。若演示短阈值遇到未播完的戳/惊醒/入场，整波睡眠每秒检查一次、等临时动作完成后再睡，避免打断反馈；不增加每只 Bot 的计时循环。最后一个 Bot 卸载清理监听和计时器。

Hero 首次首页挂载在 sessionStorage 记 `bz-hero-entered`；仅会动的头像依次入场，间隔 120ms；存储不可用则退化为当前文档一次。卸载取消待入场计时器，减少动效不记标记、不播放。悬停在 `.hero-portrait` 上跳一次，离开释放 wide；戳不弹气泡、不进入 Tab 顺序。

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

## 7. 排序与外链

- 分段控件「热门 / 最新」，role=group、aria-label=排序，按钮 aria-pressed；高 36px、圆角 999px、soft 底、内边距 3px；选中墨底纸色字，未选二级字。单个指示块用 spring 在 300ms 内滑动，data-testid 不变。
- 默认热门；stats 失败且用户未手选时改最新。不记住选择。热门按 heat、addedAt 降序，再按 name；最新按 addedAt 降序，再按 name。
- 首次热度改变顺序时网格淡入 200ms；之后点击只改数字，不重排，切换排序或刷新才重排。热度不是导入成功数。
- 新标签链接（导入、作者、投稿、技能源码、定时任务）有 12px「↗」（aria-hidden）、读屏「（在新标签页打开）」及 rel="noopener noreferrer"。

## 8. 手动复制对话框

原生 dialog，data-testid=prompt-fallback。标题「复制没成功，请手动复制」，说明「全选下面的文字，复制后发给你的 Grok Bot」。只读 textarea 内容等于安装提示词，打开自动全选聚焦；「关闭」按钮、Esc、点遮罩均可关，关闭后焦点回复制按钮。

## 9. 详情页

- 顶部「← 返回货架」。≥768px 头部左右布局，窄屏上下布局。舞台 280×280、圆角 28px、同卡片渐变；头像 160px、底距约 26px。名字圆体 36px/800，介绍 17px。
- 信息保留分类、外部收录、作者、上架日期、热度、两个按钮；「改编自 <原 Bot 名>」链原详情页，data-testid=forked-from。头像也支持说话和跳动。
- 区块间距 40px：导入前准备列表 → 额度（彩色低/中/高 + 说明）→ 权限（名称标签 + 说明；无则「不需要额外权限」）→ 截图（≥768px 两列，lazy，圆角 12px、1px 边框，新标签原图）→ 技能（等宽技能名、description、查看源码）→ 定时任务（有 routines.md 才显示）→ 设计说明（vp-doc、最大宽度 720px）。
- 小标题圆体，技能卡圆角 18px，描边 Bot 色 30% 混 border。
- 外部收录显示「这个 Bot 由原作者在 x.ai 发布，本站只收录链接。」，只显示准备、额度、权限三个内容区块。

## 10. 空状态与出错

| 情况 | 表现 |
|---|---|
| 无 Bot | 大号 sleep Bot +「货架上还没有 Bot」+「做第一个投稿的人 ↗」；data-testid=empty-state |
| 404 | exclaim 后循环 thinking，「这一页走丢了」及「回货架看看」 |
| 热度失败 | 热度 —；未手选时切最新，不弹错误 |
| 自定义头像失败 | 回退该 slug 默认头像 |
| 截图失败 | 同尺寸浅灰占位块和「图片加载失败」 |

## 11. 减少动效与深色模式

`prefers-reduced-motion: reduce` 下保持 SSR 静态帧；无 rAF、跟随、变身、睡醒、入场、跳动、上浮、网格淡入、光斑漂移；气泡仍能开关，去位移缩放，只保留 120ms 透明度淡入淡出（覆盖 VitePress 全局 0s 规则）。

深色按 §1 token 切换；Bot 颜色、按钮色与舞台色也按 darkSwap 规则适配，不再要求所有 Bot 颜色主题不变。浅深主题都验对比度，切换不用 JS 监听。

## 12. 验收要点

验收脚本在批次目录 `/Users/Admin/Documents/pi-prompts/2026-11-14-bot-zhipin-living/verify/`，不是仓库内目录。LB0 纯文档只跑 LB0-check.sh；实现线跑 npm run check、隔离端口全部 e2e，vendor diff 为空、不越 scope、产物无 _worker.js。

1. **LB1**：idle 眼睛隔 1.5 秒不同；左右 ±300px 的眼睛平均 x 差 ≥10、上下 y 差 ≥6；≥6 Bot 时 rAF ≤75 次/秒；离屏 500ms 内暂停，隐藏停钟；reduce 首帧不变；SSR 有 body path、无 hydration 警告。burst 300ms 内生效、有粒子，2.6±0.6 秒回 idle 且双眼存在；14 状态 0–3 秒每 0.1 秒采样无 NaN/Infinity。
2. **LB2**：真实四条为 feishu-app-keeper / memory-keeper 的 #777777 hex、media-downloader 的 #936439 pebble、quota-saver 的 #ff9800 tablet（存储小写）；离线校验通过、损坏时报中文错误；25 轮廓合法、fixtures 不变；暗色换色对卡片底 ≥3:1；真实构建带官方色。25 形状接触表人工看名字和眼位。
3. **LB4**：两主题 token、236/112 与详情 280/160 尺寸正确（舞台高容差 ±2）；按钮与全部文字对比度 ≥4.5；1280/1100/1024/900/680/390/320 七宽无横滚，足量数据验证 Hero 7/5 个和中心最大。30 字气泡最多两行、上沿在舞台内、尖角净距 ≥8；按钮 ≥40/44、焦点可见，无 Google 字体请求。浅深 ×1280/390 首页、悬停、详情截图人工目视。
4. **LB3**：全卡进入 300ms 内 wide，typing 先出现，350+28×字数+300ms 内全文；离开 200ms 内关气泡、600ms 内 idle。键盘、触摸、单开回归通过；戳 200ms 内进集合、状态时长+0.6 秒内回 idle，连戳 alert；导入 200ms 内 comet 且正常上报/开页；复制 wink；30 秒睡眠、输入 300ms 内 exclaim、2.5 秒内 idle；会话首次 1 秒内有 swirl、刷新不重播。Hero、空货架、404 与真实脸接线通过，录屏人工看流畅、眼位、闪跳。
5. **LB6**：固定 7/5 只彩色吉祥物、中央橙色、至少 5 种形状；货架保持官方颜色；黑眼睛、attentif 首帧、身体占比 ≥80%、SVG 特效外溢；八类标签浅深对比度 ≥4.5、外部标签中性。补充 SSR/客户端帧一致性和两种表情下 25 形状眼睛包含关系回归。`LB6-check.sh` 在 4196 跑仓库 e2e、LB1/LB4/LB3/LB6 验收与真实 bots 构建，`verify/out/LB6/` 的浅深 ×1280/390 截图必须目视。
6. **发布边界**：LB6 仅在 feat/living-color 提交，不推送、不开 PR；实际检查结果以交付说明为准。
