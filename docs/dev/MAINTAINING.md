# 维护者手册：审核投稿

## 投稿从哪来

| 来源 | 样子 | 说明 |
|---|---|---|
| 网站投稿（默认） | PR 作者是 `bot-zhipin-submit[bot]`，分支 `submission/web-<数字id>-<slug>`，标题「新增 Bot：…」或「更新 Bot：…」；提交作者是投稿人本人；已开启自动合并 | 投稿人在 `/submit` 登录后提交，`functions/api/submit/` 建 PR。CI 自动运行，不用点批准运行 |
| Issue 表单（备用） | Issue 带 `投稿` 标签，几十秒后 Issue 下出现自动回复；通过的会开一个 `submission/issue-<号>` 分支的 PR，作者是 github-actions | `.github/workflows/submission.yml`。网站投稿关闭或投稿人打不开投稿页时用 |
| 自己 fork 提 PR | 普通 PR，只改 `bots/<slug>/`，或只改 `squads/<slug>/squad.yaml`（投稿小队） | 外部贡献者改了这两处以外的文件（包括 `curation/`），CI 的范围检查会直接失败 |

## 审核一个网站投稿 PR

1. 打开 PR，等 `validate-and-build` 通过（网站投稿的 PR 会自动跑，不需要点批准运行）。
2. **标题以「⚠ 更新已上架 Bot」开头的要多看一眼**：这个 Bot 之前没有绑定作者的数字 ID，系统只按 GitHub 用户名核对，要确认提交的人确实是原作者（对照原 PR、作者主页）。
3. 人工核对机器判断不了的：
   - DESIGN.md 是不是真实情况（没有编造效果数据）；
   - 「实际效果」里摘的原文像不像这个 Bot 的真实输出，有没有露出密钥、内部信息、隐私（投稿不再带截图，DECISIONS 第 43 条）；
   - `permissions` 是否如实（对照 ROLE.md 和 SKILL.md 看它会做什么）；
   - `templateUrl` 在**无痕窗口**里能打开；
   - 有没有借投稿夹带推广、引流内容；
   - 名字（`name`）不是中文的，看有没有给中文叫法（`nameZh`）、起得像不像岗位名、会不会和货架上别的 Bot 混。没给不算错（它是可选的），页面会直接显示原名；想让它在货架上好认，请投稿人补一个，或者合并后由维护者补。外部收录的英文名 Bot，收录时一并起好。
4. 没问题就点 **Approve**。检查通过后会**自动合并**（普通合并），不用再点 Merge。约 1 分钟后网站更新，`上线通知` 工作流会在 PR 里评论「已上线」并 @ 投稿人，然后删掉投稿分支。
5. 合并新 Bot 后，在仓库根运行 `node scripts/sync-faces.mjs`，检查每个 Bot 的颜色、形状和警告，再运行 `node scripts/sync-faces.mjs --check` 做**离线校验**；确认后把 `site/.vitepress/data/faces.json` 的改动提交上去。抓取失败保留旧条目，没有旧数据则继续 seed 回退，不能把警告当成功。构建不联网，不把抓取加进 build。
6. 有问题就在 PR 里留言（不要点 Approve）。投稿人把意见发给他的 AI，改好后用新链接再提交一次，会更新同一个 PR；推送新提交会让之前的批准自动作废，需要重新看过再批准。

## 审核 Issue 表单投稿的 PR（备用链路）

1. 页面提示有工作流**等待批准**时，先点 **Approve and run workflows**，等 `validate-and-build` 通过（自动投稿另外派发的那次 CI 不能代替 PR 上这次）。
2. 人工核对同上。
3. **Approve**，再 **Merge**（普通合并，保留投稿人的提交）。上线后同样会收到「已上线」评论。

注意：维护者自己提的 PR（比如改网站代码）作者是你本人，GitHub 不允许自己批准自己，只能用管理员身份绕过规则合并。投稿 PR 的作者不是你，走正常的批准流程即可。规则集要求代码所有者（`.github/CODEOWNERS`）批准。

## 审核一个小队 PR

小队只能走 fork + PR，PR 里应该只有 `squads/<slug>/squad.yaml` 一个文件（多了别的文件范围检查会失败）。

1. 等 `validate-and-build` 通过：机器已经查过格式、成员都在货架上且不重复、`flow` 两头都是成员或 `you`、「带队」恰好一个队长。
2. 人工核对：分工和交接是不是真的跑得通（对照各成员的详情页）；`kickoff`、`setup` 里有没有密钥、内部链接；`origin` 写得对不对（投稿人自己编的写「社区投稿」，照搬原作者成套发布的写「原作者成套」）。
3. 已有小队被修改时，`addedAt` 和 `author.github` 不能变（CI 会拦）。

## 策展（只有维护者能改）

首页主推、推荐排序、专题和编辑点评都在 `curation/shelf.yaml`，文件里每一段都有注释；规则见 `schema/curation.schema.json`。改完运行 `npm run validate`：

- `featured` 最多 3 个；`picks` 是「推荐」排序的置顶顺序，写在前面的先出现；`collections` 按写的顺序显示，每个 2 到 12 个 Bot；`editorNotes` 是 slug 对一句话。
- 里面的 slug 必须是货架上的 Bot。写错了，或者那个 Bot 已经下架，校验会报错并指到具体位置（比如 `collections.1.bots.3`）。

## 收录或下架 Prompt / Skill（仅维护者）

1. 查重，打开原始文章、具体文件或 skill 目录，核实作者和许可（单条 / 子目录优先），保留精确出处及许可证原文链接。不要根据仓库首页的许可推断转载权。
2. 在 `prompts/` 或 `skills/` 新建 `<slug>.yaml`，文件名与 `slug` 一致。对照对应 schema 选分类，写中文用途、场景、作者、许可和 `addedAt`。Prompt 不分许可，原文放在 `body`，英文另配本站译文 `bodyZh`；`copyright` 照原页填写（单行 1–200 字），原页没写就填「版权归原作者，原页未声明许可」。摘要和用法用自己的话写。Skill 写原名、确认支持的 agents、自写摘要、按顺序列 1–3 个安装命令（说明放 note）、必要依赖，不收 SKILL.md。
3. 跑 `npm run check`，在列表点进详情核对分类、署名、来源与复制值；有中文译文时，核对主按钮复制译文，展开「英文原文」可单独复制原文；没有正文时仍显示仅摘要。原作者要求下架时删除对应 YAML 后重新校验、构建；列表、静态路径及下架兜底清单一起更新，无需改 Bot 计数。

## 下架

提一个 PR 删掉 `bots/<slug>/`，合并后约 1 分钟首页消失；详情页由 `functions/bots/[slug].ts` 兜底，立即返回 404。

**下架前先搜一下这个 slug 有没有被引用**：`grep -rn "<slug>" squads curation`。被小队或策展引用的 Bot 不能单独删，`npm run validate` 会失败。要在同一个 PR 里一起处理：从 `curation/shelf.yaml` 里删掉它；它所在的小队，要么去掉这个成员（剩下不到 2 个就整支下架），要么把它记到 `missing` 里。

小队下架同理：提 PR 删掉 `squads/<slug>/`，小队页由 `functions/squads/[slug].ts` 兜底返回 404；成员 Bot 不受影响。

## 网站投稿的开关与排障

- **临时关掉网站投稿**：在 Cloudflare 后台 Pages → bot-zhipin → 设置 → 变量与密钥，删掉 `OAUTH_CLIENT_SECRET`，重新部署后 `/api/auth/*` 和 `/api/submit*` 返回 503，投稿页自动显示「改用 GitHub Issue 投稿」。恢复时从本机 `~/.config/bot-zhipin/oauth-app.json` 取回原值写回去。
- **限流**（D1 `rate_limits` 表，见 `docs/dev/SUBMIT.md` §3.8）：每人每天最多 10 次提交、60 张截图，全站每小时 20 次提交，同时最多 3 个未合并的投稿 PR。被刷时先看这张表。
- **状态查询**有缓存（D1 `pr_status`），每小时最多真正问 GitHub 600 次；投稿人看到「状态暂时刷新不了」一般过一会儿就好。
- **作者绑定**：D1 `bot_owners` 记录每个 slug 的作者数字 ID，网站首投成功时写入。要把一个 Bot 转给别人，在 D1 Console 改这一行。
- 密钥在 Cloudflare：`GITHUB_APP_PRIVATE_KEY`、`OAUTH_CLIENT_SECRET`、`SESSION_SECRET`；原件在维护者本机 `~/.config/bot-zhipin/`。换 `SESSION_SECRET` 时先把旧值放进 `SESSION_SECRET_PREV`，24 小时后删掉。

## 分享图

构建日志出现「[分享图] 缺字」时，在维护机上安装 FontTools（`pip install fonttools==4.60.1`），确认 `pyftsubset` 和 `curl` 在 PATH 中，运行 `npm run gen:og-fonts`，重新构建核对，再将更新的字体子集纳入版本管理。只有这个手动命令会下载并校验字体，正常构建不需要 Python、系统中文字体或联网。若原版字体也没有这个字，更新子集不能补出字形，需要另选用字或字体。

改了分享图版式、配色或字体，要把 `scripts/lib/share.mjs` 的 `OG_LAYOUT_VERSION` 加 1，让平台重新抓图。

## 计数数据

Cloudflare D1 `bot-zhipin` 的 `click_counts` 按 `(slug, kind)` 存累计数，`click_dedupe` 存去重窗口。查开场白和口令的复制点击次数（已去重，不计入热度；`starter` 的 slug 是 Bot，`kickoff` 的是小队）：

```sql
SELECT slug, kind, n FROM click_counts
WHERE kind IN ('starter', 'kickoff')
ORDER BY kind, n DESC, slug;
```

要清零全部计数（比如上线前清掉测试点击），在 Cloudflare 控制台 D1 → bot-zhipin → Console 执行：

```sql
DELETE FROM click_counts;
DELETE FROM click_dedupe;
```
