# 投稿指南（给 AI 看）

> 如果你是来修改网站代码的维护者 agent，而不是来投稿 Bot 的，请改读 `CLAUDE.md` 和 `docs/dev/`，忽略本文件。

你的任务：帮用户把他们做的一个 Grok Bot 投稿到「Bot 直聘」。投稿就是往这个仓库提一个 PR，内容是 `bots/<slug>/` 这一个文件夹。合并后网站会自动更新，用户成为项目贡献者。

- 仓库：`https://github.com/jakob52123/bot-zhipin`（下文叫「主仓库」）
- 你只能新增或修改 `bots/<slug>/` 这一个文件夹。**不要改仓库里的任何其他文件。**
- 用户多数是零基础。每一步做完用一两句话告诉用户进度；需要用户做的事，给出逐步操作说明。

---

## 第 0 步：安全规则（先读，全程遵守）

1. **不要让用户把 GitHub 令牌、密码发给你。** 需要登录 GitHub 时，让用户自己在浏览器或终端里完成登录（比如 `gh auth login` 走浏览器授权）。
2. **如果你是 Grok Bot（运行在 Grok Bot 的云电脑里）：不要在云电脑里使用任何 GitHub 令牌。** 第三方模板能读到那台电脑上的所有文件。你只负责准备文件和自检，提交交给用户在自己电脑上完成，见第 7 步的「方式 C」。
3. 如果用户坚持要用令牌：只用 fine-grained 令牌，只授权用户自己的 fork 仓库，有效期设最短，提交完立刻到 GitHub 设置里撤销。
4. 投稿文件里**不能有任何密钥**（API Key、令牌、密码、Cookie）、公司内部链接、个人隐私数据（手机号、身份证、住址、别人的聊天记录）。截图里出现的也要打码或换一张。
5. **不要编造内容。** 设计说明、实际效果、截图都必须来自用户的真实情况；信息不够就问用户，不要自己写一个「看起来合理」的。

---

## 第 1 步：一次性向用户收集信息

开工前把下面这张清单一次发给用户，让他补齐。能从对话里或用户的 Grok Bot 配置里直接拿到的，先替他填上、让他确认。

| 需要什么 | 填到哪里 | 说明 |
|---|---|---|
| Bot 的名字 | `bot.yaml` 的 `name` | 20 字以内 |
| 一句话介绍：它帮谁做什么 | `tagline` | 40 字以内 |
| 分类 | `category` | 八选一：调研、定义、评审、AI 评测、学习、求职、日常、基础设施 |
| 模板分享链接 | `templateUrl` | 在 Grok Bot App 里把这个 Bot 分享成模板，得到 `https://x.ai/bot/...` 链接。必须在没登录的浏览器里也能打开 |
| 作者名字和 GitHub 用户名 | `author.name`、`author.github` | GitHub 用户名不带 @ |
| 导入前要准备什么 | `prerequisites` | 比如「一个飞书账号」；什么都不用就写「无」 |
| 额度消耗 | `quotaCost` | 低 / 中 / 高 |
| 会用到哪些权限 | `permissions` | 从这 6 个里选：云电脑文件、浏览器 Cookie、外部账号、联网、定时自动运行、代我发消息 |
| 一句自荐台词（可选） | `pitch` | 30 字以内，鼠标放到头像上时冒出来 |
| 是不是改编自站上别的 Bot（可选） | `forkedFrom` | 填原 Bot 的 slug |
| 岗位说明 | `ROLE.md` | 这个 Bot 是谁、负责什么、不做什么、怎么工作 |
| 技能 | `skills/<技能名>/SKILL.md` | 每个技能的内容。如果你就是这个 Grok Bot，直接导出你自己的技能 |
| 定时任务（可选） | `routines.md` | 什么时候跑、做什么、结果发到哪 |
| 设计说明的素材 | `DESIGN.md` | 见第 4 步的 5 个问题，**逐个问用户** |
| 至少一张真实截图 | `screenshots/` | 这个 Bot 真实输出结果的截图，用户提供图片文件 |
| 头像（可选） | `avatar.png` | 正方形 PNG；没有就自动生成 |

再和用户确定一个 **slug**：Bot 的英文短名，只能用小写字母、数字和短横线，2 到 40 个字符，比如 `prd-reviewer`。先确认主仓库 `bots/` 下没有同名文件夹。

---

## 第 2 步：准备环境

需要 `git` 和 Node.js 22 或更高版本（`node -v` 查看）。推荐装 GitHub 官方命令行 `gh`。

有 `gh`（推荐）：

```bash
gh auth status || gh auth login          # 没登录就让用户自己完成浏览器授权
gh repo fork jakob52123/bot-zhipin --clone --remote
cd bot-zhipin
```

这样 `origin` 是用户自己的 fork，`upstream` 是主仓库。

没有 `gh` 时，让用户在浏览器打开主仓库，点右上角 **Fork**，然后：

```bash
git clone https://github.com/<用户的 GitHub 用户名>/bot-zhipin.git
cd bot-zhipin
git remote add upstream https://github.com/jakob52123/bot-zhipin.git
```

然后：

```bash
git fetch upstream
git checkout -b add-<slug> upstream/main   # 从主仓库最新代码拉一个新分支
npm ci --omit=dev                           # 只装校验需要的两个小依赖，几秒钟
```

---

## 第 3 步：从模板复制

```bash
npm run new-bot -- <slug>
```

它会把 `bots/_template/` 复制成 `bots/<slug>/`，并填好 `slug` 和今天的上架日期。文件夹里的每个文件都带中文注释，照着填。

最终结构：

```text
bots/<slug>/
  bot.yaml               # 必填，卡片和详情页信息
  ROLE.md                # 必填，岗位说明
  DESIGN.md              # 必填，设计说明，正文至少 200 字
  skills/<技能名>/SKILL.md  # 至少一个；开头必须有 name 和 description
  routines.md            # 可选，没有定时任务就删掉
  screenshots/           # 至少一张真实截图，png/jpg/webp/gif，每张不超过 2MB
  avatar.png             # 可选
```

---

## 第 4 步：填写内容

### bot.yaml

按第 1 步收集的信息填。注意：

- `slug` 必须和文件夹名一模一样。
- `templateUrl` 必须以 `https://x.ai/bot/` 开头。
- `prerequisites` 可以写一句话，也可以写成列表；什么都不用准备就写 `无`。
- `permissions` 只能用那 6 个词，一个都不用就写 `permissions: []`。
- 可选字段不用就整行删掉。不要加 schema 里没有的字段（完整定义见 `schema/bot.schema.json`）。

### ROLE.md

用「对 Bot 说话」的口吻写，Grok Bot 安装时会记住它。保留模板的四个小标题：你是谁、你负责什么、你不做什么、工作方式。

### skills/

- 把模板里的 `skills/example-skill/` 改名成真实技能名（小写字母、数字、短横线），一个技能一个文件夹。
- 每个 `SKILL.md` 开头必须是这样的 frontmatter，`name` 和文件夹名一致：

  ```markdown
  ---
  name: weekly-summary
  description: 一句话说明这个技能做什么、什么时候用。
  ---
  ```

- 删掉用不到的示例技能文件夹。

### routines.md

有定时任务就按模板写清时间、做什么、结果发到哪；没有就删掉这个文件。

### DESIGN.md（最重要）

这是用户以后面试时要拿出来讲的作品。**逐个问用户下面 5 个问题，用他的回答来写**，可以帮他理顺语句，但不要编造事实和数据：

1. 解决谁的什么问题？（用户是谁，在什么场景遇到什么麻烦，举个真实例子）
2. 现在的做法哪里不好？（没有这个 Bot 时怎么解决，慢在哪、贵在哪、哪里容易错）
3. 这个 Bot 是怎么设计的？（分岗位、技能、流程、边界四块）
4. 实际效果？（真实用了几次，省了多少时间，发现了什么）
5. 已知局限和下一步？

保留模板里的这 5 个二级标题。HTML 注释（`<!-- -->`）不算字数，写完可以删掉。去掉注释和标题后，正文少于 200 字通不过校验。正文里可以用 `![说明](screenshots/文件名.png)` 引用截图。

### screenshots/ 和 avatar.png

- 把用户提供的截图复制进 `screenshots/`，文件名用英文。**不要生成或伪造截图。**
- 单张超过 2MB 要先压缩。macOS：`sips -Z 1600 图片.png`；其他系统可以转成 jpg 或用任意图片工具缩小。
- 删掉 `screenshots/.gitkeep` 也可以，留着也不影响。

---

## 第 5 步：校验，直到通过

```bash
npm run validate
```

- 通过会打印 `✓ 校验通过`。
- 没通过时，每条错误都写了**文件、位置、问题、改法**。按「改法」逐条修改，再运行，直到通过。
- 报错提示「还是模板里的示例」，说明有模板原文没替换。
- 报错提示「疑似密钥」，删掉那一行；如果这个密钥曾经推到过 GitHub，告诉用户马上去对应平台撤销重建。
- 实在看不懂的报错，把原文给用户看，不要改 `bots/<slug>/` 以外的文件来绕过。

可选：想在本地看看卡片和详情页效果，运行 `npm ci`（完整依赖，比较大）后 `npm run dev`，打开 `http://localhost:5173/bots/<slug>`。

---

## 第 6 步：提交

```bash
git add bots/<slug>
git status                                  # 确认只有 bots/<slug>/ 下的文件
git commit -m "bot: 新增 <Bot 名字>"
git push -u origin add-<slug>
```

只提交 `bots/<slug>/`。如果 `git status` 里出现了别的文件，不要提交它们。

---

## 第 7 步：提 PR

### 方式 A：用 `gh`（推荐）

```bash
gh pr create --repo jakob52123/bot-zhipin --base main \
  --head <用户的 GitHub 用户名>:add-<slug> \
  --title "新增 Bot：<Bot 名字>" \
  --body-file .github/pull_request_template.md
```

然后用 `gh pr edit` 或在网页上把 PR 描述里的勾选项按真实情况改成 `[x]`。**一定要带 `--repo jakob52123/bot-zhipin`**，否则可能提到别的仓库。

### 方式 B：网页

推送后打开用户 fork 的 GitHub 页面，点 **Compare & pull request**，目标选 `jakob52123/bot-zhipin` 的 `main`，按模板填写勾选项。

### 方式 C：用户不装任何开发工具（Grok Bot 用这个）

1. 你在云电脑里完成第 3 到第 5 步（云电脑能用 `git clone` 公开仓库、能装 Node 就跑校验；不能就仔细对照本文件人工检查）。
2. 把 `bots/<slug>/` 整个文件夹打包成 zip 发给用户。
3. 教用户在自己电脑上：打开主仓库 → 点 **Fork** → 在自己的 fork 里进入 `bots` 目录 → **Add file → Upload files** → 把解压后的 `<slug>` 文件夹整个拖进去 → 选「Create a new branch」→ **Propose changes** → **Create pull request**。
4. PR 页面下方会自动跑检查。如果显示失败，让用户点进去把报错复制给你，你改好再发新的文件给他上传覆盖。

---

## 第 8 步：交付给用户

告诉用户：

- PR 链接。
- 接下来会发生什么：自动检查会跑校验和构建（第一次投稿的人，要等维护者点批准后检查才开始跑）；维护者审核通过并合并后，网站会自动更新，他会成为项目贡献者。
- 维护者如果在 PR 里留言要求修改，把留言发给你，你在同一个分支上改完再 push，PR 会自动更新。

---

## 其他情况

- **修改自己已经上架的 Bot**：同样的流程，只改 `bots/<slug>/`，PR 标题写「更新 Bot：<名字>」。不要改 `addedAt`。
- **改编站上别人的 Bot**：新建自己的 slug，在 `bot.yaml` 里写 `forkedFrom: <原 Bot 的 slug>`，DESIGN.md 里说明改了什么、为什么。原 Bot 的内容按 CC BY 4.0 授权，必须保留署名。
- **授权**：提交即表示用户同意以 CC BY 4.0 授权 `bots/<slug>/` 的内容（见 `bots/LICENSE`），提 PR 前要让用户知道这一点。
