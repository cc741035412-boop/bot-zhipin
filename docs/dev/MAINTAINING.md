# 维护者手册：审核投稿

## 投稿从哪来

| 来源 | 样子 | 说明 |
|---|---|---|
| 网站投稿（默认） | PR 作者是 `bot-zhipin-submit[bot]`，分支 `submission/web-<数字id>-<slug>`，标题「新增 Bot：…」或「更新 Bot：…」；提交作者是投稿人本人；已开启自动合并 | 学员在 `/submit` 登录后提交，`functions/api/submit/` 建 PR。CI 自动运行，不用点批准运行 |
| Issue 表单（备用） | Issue 带 `投稿` 标签，几十秒后 Issue 下出现自动回复；通过的会开一个 `submission/issue-<号>` 分支的 PR，作者是 github-actions | `.github/workflows/submission.yml`。网站投稿关闭或学员打不开投稿页时用 |
| 自己 fork 提 PR | 普通 PR，只改 `bots/<slug>/` | 外部贡献者改了 `bots/` 以外的文件，CI 的范围检查会直接失败 |

## 审核一个网站投稿 PR

1. 打开 PR，等 `validate-and-build` 通过（网站投稿的 PR 会自动跑，不需要点批准运行）。
2. **标题以「⚠ 更新已上架 Bot」开头的要多看一眼**：这个 Bot 之前没有绑定作者的数字 ID，系统只按 GitHub 用户名核对，要确认提交的人确实是原作者（对照原 PR、作者主页）。
3. 人工核对机器判断不了的：
   - DESIGN.md 是不是真实情况（没有编造效果数据）；
   - 截图是不是这个 Bot 的真实输出，有没有露出密钥、内部信息、隐私；
   - `permissions` 是否如实（对照 ROLE.md 和 SKILL.md 看它会做什么）；
   - `templateUrl` 在**无痕窗口**里能打开；
   - 有没有借投稿夹带推广、引流内容。
4. 没问题就点 **Approve**。检查通过后会**自动合并**（普通合并），不用再点 Merge。约 1 分钟后网站更新，`上线通知` 工作流会在 PR 里评论「已上线」并 @ 投稿人，然后删掉投稿分支。
5. 合并新 Bot 后，在仓库根运行 `node scripts/sync-faces.mjs`，检查每个 Bot 的颜色、形状和警告，再运行 `node scripts/sync-faces.mjs --check` 做**离线校验**；确认后把 `site/.vitepress/data/faces.json` 的改动提交上去。抓取失败保留旧条目，没有旧数据则继续 seed 回退，不能把警告当成功。构建不联网，不把抓取加进 build。
6. 有问题就在 PR 里留言（不要点 Approve）。投稿人把意见发给他的 AI，改好后用新链接再提交一次，会更新同一个 PR；推送新提交会让之前的批准自动作废，需要重新看过再批准。

## 审核 Issue 表单投稿的 PR（备用链路）

1. 页面提示有工作流**等待批准**时，先点 **Approve and run workflows**，等 `validate-and-build` 通过（自动投稿另外派发的那次 CI 不能代替 PR 上这次）。
2. 人工核对同上。
3. **Approve**，再 **Merge**（普通合并，保留投稿人的提交）。上线后同样会收到「已上线」评论。

注意：维护者自己提的 PR（比如改网站代码）作者是你本人，GitHub 不允许自己批准自己，只能用管理员身份绕过规则合并。投稿 PR 的作者不是你，走正常的批准流程即可。规则集要求代码所有者（`.github/CODEOWNERS`）批准。

## 下架

提一个 PR 删掉 `bots/<slug>/`，合并后约 1 分钟首页消失；详情页由 `functions/bots/[slug].ts` 兜底，立即返回 404。

## 网站投稿的开关与排障

- **临时关掉网站投稿**：在 Cloudflare 后台 Pages → bot-zhipin → 设置 → 变量与密钥，删掉 `OAUTH_CLIENT_SECRET`，重新部署后 `/api/auth/*` 和 `/api/submit*` 返回 503，投稿页自动显示「改用 GitHub Issue 投稿」。恢复时从本机 `~/.config/bot-zhipin/oauth-app.json` 取回原值写回去。
- **限流**（D1 `rate_limits` 表，见 `docs/dev/SUBMIT.md` §3.8）：每人每天最多 10 次提交、60 张截图，全站每小时 20 次提交，同时最多 3 个未合并的投稿 PR。被刷时先看这张表。
- **状态查询**有缓存（D1 `pr_status`），每小时最多真正问 GitHub 600 次；学员看到「状态暂时刷新不了」一般过一会儿就好。
- **作者绑定**：D1 `bot_owners` 记录每个 slug 的作者数字 ID，网站首投成功时写入。要把一个 Bot 转给别人，在 D1 Console 改这一行。
- 密钥在 Cloudflare：`GITHUB_APP_PRIVATE_KEY`、`OAUTH_CLIENT_SECRET`、`SESSION_SECRET`；原件在维护者本机 `~/.config/bot-zhipin/`。换 `SESSION_SECRET` 时先把旧值放进 `SESSION_SECRET_PREV`，24 小时后删掉。

## 计数数据

热度存在 Cloudflare D1 `bot-zhipin` 的 `click_counts`、`click_dedupe` 两张表。要清零（比如上线前清掉测试点击），在 Cloudflare 控制台 D1 → bot-zhipin → Console 执行：

```sql
DELETE FROM click_counts;
DELETE FROM click_dedupe;
```
