# 资源库入库报告（library/）

2026-11-20（抓取时间 2026-11-21T06:44:43Z，UTC）从 7 个开源仓库收进 `library/` 的结果。`library/` 是给 Prompt、Skills 两个板块和 Bot 货架攒的原料：原文保留、另配中文和评分，不上页面、不进 `bots.data`（决策 49–55）。这份报告做到入库第 10 步为止，页面等你看过再做。

## 一眼看

- **全文条目 939 条**：提示词 798、岗位设定 49、技能 47、配方 23、团队 14、定时任务 8。每条一个 Markdown 文件，文件头写着出处、作者、许可、改了什么。
- **分享链接 8,066 个**（15,359 条记录按 x.ai/bot ID 合并而来），其中 93 个已失效。英文摘要剩 6,074 个有、中文摘要 8,058 个有。
- **只留标题和链接 85 条**：botdirectory 里原作者不明、又没有来源链接的，清单在 `library/link-only.jsonl`。
- **许可**：全文条目里 MIT 786、CC BY 4.0 138、CC0 15。
- **评分**（0–5）：5 分 369、4 分 312、3 分 173、2 分 60、1 分 22、0 分 3。
- **安全**：密钥扫描命中 0 条；有 101 条全文含「付款、删除、自动发送」这类指令，标了 needsReview。
- **国内适配**：全文 610 条「好」、329 条「一般」。
- **和货架对上的**：货架 83 个 Bot 里 81 个在链接表里找到了，标了 `listed`；全文条目里有 1 条就是货架上某个 Bot 的原文。

## 每个来源收了多少、没收什么

| 来源 | 提交 | 许可 | 收了 | 没收（数量、原因） |
|---|---|---|---|---|
| [cobusgreyling/grok-bot-templates](https://github.com/cobusgreyling/grok-bot-templates) | `4f3f28b` | MIT | 岗位设定 49、技能 47、配方 12、团队 10、定时任务 8 | 未收录说明文档、示例和其他非入库文件 145 |
| [ZeroPointRepo/GrokBotDev](https://github.com/ZeroPointRepo/GrokBotDev) | `48fec85` | CC-BY-4.0 | 分享链接 1,904、提示词 138 | 集合成员找不到对应的模板 5；不收录 content/ 以外的文件及 content/ 内非用例、模板、集合的文件 480 |
| [elie222/botdirectory.ai](https://github.com/elie222/botdirectory.ai) | `447d18f` | MIT | 提示词 650、分享链接 254 | 无 |
| [RongleCat/awesome-grok-bot](https://github.com/RongleCat/awesome-grok-bot) | `e50ac2f` | CC0-1.0 | 提示词 10、分享链接 9 | 同批提示词的英文版，只收中文版 1；资源导航链接，不含有效的 Bot 分享 ID 2,174；未收录说明文档和其他非入库文件 302 |
| [sit-in/awesome-grokbot-playbooks](https://github.com/sit-in/awesome-grokbot-playbooks) | `a098478` | MIT | 配方 10 | 案例填写模板，不是实际配方 1；未收录说明文档和其他非入库文件 43 |
| [majiayu000/awesome-grok-bot](https://github.com/majiayu000/awesome-grok-bot) | `34ae6ed` | CC0-1.0 | 分享链接 8,026、团队 4、配方 1 | 站点生成的分语言目录副本，不重复收录 18；本次只收目录分享链接、队伍和指定配方，不收模板目录 18；未收录说明文档和其他非入库文件 38 |
| [kydlikebtc/awesome-grokbot](https://github.com/kydlikebtc/awesome-grokbot) | `f64dc25` | 逐行 CC0 / CC BY | 分享链接 5,103 | 无 |

「没收」里大头是说明文档、示例、站点代码这类不属于七类的文件；不是条目被丢了。几处值得说的：

- **RongleCat 的资源导航**：`data/catalog.json` 里 2,183 条链接，只有 9 条是 Bot 分享链接；另有 30 条是 `x.ai/bot/guides/…` 教程页，其余是文档、文章、开源项目的导航。不属于七类，没收，但里面的 skills、opensource 两节可以当 Skills 板块的线索。
- **RongleCat 和本仓库 fork 来源是同一作者**：拿 20 字片段和 grok-bot-learn 全仓比对，玩法提示词和导航简介的重合都是 0%，照收。
- **GrokBotDev**：16 个合集没有单独成条，合集名并进了成员的 `collections`；有 2 个合集共 5 个成员在模板里找不到。
- **majiayu000** 的 `catalog/`（站点生成的分语言副本）和 `templates/`（6 个 Bot 的配置模板）没收；后者你点头可以补。

## 许可怎么落实的

- 每个全文文件头写 `source`、`sourceUrl`（钉在提交上）、`author`、`license`、`fetchedAt`、`changes`；CC BY 的另有 `attribution`。总说明在 `library/LICENSES.md`，MIT 来源的版权声明进了 `THIRD_PARTY_NOTICES.md`。`library/` 不适用 `bots/LICENSE`。
- **许可回溯 640 行**：majiayu000 把目录全标 CC0，但有的摘要和 GrokBotDev（CC BY）的文字一样；这些行改按 CC BY 署名。
- **照抄 x.ai 分享页的摘要不收**：kydlikebtc 保存了分享页上的介绍原文（`official_summary`），拿它的指纹一比，发现好几家的「摘要」就是照抄的：kydlikebtc 2,493 条、majiayu000 2,295 条、botdirectory 122 条、GrokBotDev 2 条。这些摘要都没收，分享页原文一个字没进库，只留了指纹哈希。kydlikebtc 另有 9 条中文摘要是分享页中文原文照抄，也扣下了。
- **botdirectory 收不收正文**，按它自己 CONTRIBUTING 的定义：`contributor` 是「这套设置是谁的」，`scouted_by` 是「谁找到的」。站方账号 BotDirectoryAI 代投、又标了 scouted_by 的，算原作者不明；分享链接和产品官网不算来源链接。结果：650 条收正文（648 条作者本人、2 条有来源链接），85 条只留标题和链接，169 条本来就没正文。
- **GrokBotDev 的用例**：116 条是策展人照着别人的做法重写的，作者署「GrokBot.dev contributors」，原型作者记在 `extra.inspiredBy`；22 条是原作者公开的原文，作者署原作者，其中 3 条上游没写作者是谁，但都附了来源视频，正文照收、作者留空。

## 去重

- 分享链接按 `x.ai/bot/<21 位 ID>` 合并：15,359 条记录 → 8,066 个 Bot。只在一家出现的 2,870 个，两家 3,316 个，三家及以上 1,880 个。每个 Bot 的标题、作者、摘要按固定顺序取第一个可用的，每段文字都带着自己的许可和出处。
- 全文按去掉空白后的 sha256 去重：939 → 939，各家之间没有一字不差的重复（同一个 Bot 在不同站的提示词各写各的）。
- 货架 83 个 Bot 有 81 个对上；没对上的 2 个：`feishu-app-keeper`、`quota-saver`，这几个来源目录里都没有。

## 评分

每条看五项写没写，每项 1 分：明确的产出物、要用户给什么或连什么、3 步以上有先后的做法、至少一条能逐项核对的验收标准、点名了要先问人或禁止做的动作。由模型逐条读原文判断，代码求和；只给全文条目打分，分享链接只有一句简介，不打分。

第一轮定义太松（把「交付格式」也算验收），65% 拿满分，挑不出前 50；收紧定义后重判了一遍，下面是重判后的结果：

| 来源 | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| cobusgreyling/grok-bot-templates | 2 | 5 | 7 | 7 | 3 | 102 |
| ZeroPointRepo/GrokBotDev | 0 | 0 | 1 | 10 | 47 | 80 |
| elie222/botdirectory.ai | 1 | 16 | 51 | 150 | 250 | 182 |
| RongleCat/awesome-grok-bot | 0 | 0 | 1 | 3 | 5 | 1 |
| sit-in/awesome-grokbot-playbooks | 0 | 0 | 0 | 0 | 7 | 3 |
| majiayu000/awesome-grok-bot | 0 | 1 | 0 | 3 | 0 | 1 |

分数衡量的是「写全了没有」，不是「写得深不深」：botdirectory 的提示词照固定模板写，五项各一两句也能拿满分；cobus 的 12 条设计守则本来就不是能跑的 Bot，分数低是对的。

## 国内适配和安全标记

- **cnFit** 只看依赖的服务在国内打不打得开（清单在 `scripts/ingest/config/cn-blocked.json`，Grok 和 X 不算，每条都要用）。拖累最多的是 Gmail、Google 日历和云盘、YouTube。美国本地服务（Instacart、Costco 这类）打得开但国内用不上，没算进去。分享链接只能看集成字段和一句简介，判断比全文粗。LINE、Signal、Threads、Medium 这几个名字也是英文常用词，正文里只认明确写法，免得「timeline」「email threads」被误判。
- **needsReview** 按句子找这几类指令，同一句里有「不要、未经、先问、草稿、never」这类词的不算：付款 71、删除 19、自动发送 9、往外部地址上传 6、读取凭据 5、关闭审批 1。这是规则匹配，会有漏判和误判；上货架前每条还要人读。

## 中文字段

- 全文 939 条都配了中文标题、一句话用途、适合谁，原文没有翻译。按你的规矩交给写作模型：前 4 批（520 条）由 Gemini 写，其中约 35 条返工时撞上 Gemini 周额度，改由 GPT 写；后 4 批（504 条）和前 50 的首个任务，Gemini 周额度已用完，全部是 GPT 写的。
- 分享链接的中文摘要沿用来源自带的（majiayu000、kydlikebtc，CC0），8,058 个有。它们多半是分享页介绍的中文转述，放进库里没问题，**上页面前要换成本站自己写的**（决策 9）。

## 前 50

只从全文条目里选：先按分数，同分的不需要复核的在前、国内适配好的在前，再按来源轮流取，免得被一家包圆。每条配了一句能直接发给 Bot 的首个任务和「看到什么算跑对了」。

| # | 中文名 | 类 | 来源 | 首个任务 | 看到什么算跑对了 |
|---|---|---|---|---|---|
| 1 | [工作日晚间拓客背调定时任务](../../library/routines/cobus--nightly-outbound-research.md) | 定时任务 | cobusgreyling | 只用这份虚构名单：甲做企业培训，本周征集课程工具报价；乙做个人家教，正在招老师。面向企业培训商，客户匹配和出现采购意向各计1分。列两行评分并引用依据，只给高分客户写一句询问草稿。别查联系人、发消息或录入系统，不开定时。 | 评分表中甲为2分、乙为0分，各有样例依据，表后只有给甲的一句草稿。 |
| 2 | [联盟分销项目巡检管家](../../library/prompts/grokbotdev--affiliate-program-manager.md) | 提示词 | ZeroPointRepo | 若未接入，说明正式巡检需要 Affonso 只读数据。本次只用模拟订单数：前30天到近30天，渠道甲从8单到12单，乙从6单到3单。列出各自增减，为下滑渠道写一个待查问题。只回草稿，不联系伙伴、不动佣金或付款，不开定时。 | 两行渠道表分别标出甲增4单、乙减3单，另有一个针对乙的待查问题。 |
| 3 | [3D打印流水线管家](../../library/prompts/botdirectory--3d-printing-autopilot.md) | 提示词 | elie222 | 我想打印一块60×30×3毫米的桌牌，材料是PLA。只给这一个样件出纸面方案：写明建模尺寸、建议摆放方向，以及估算耗时前还缺什么。若工具未连，说明 Blender、PrusaSlicer、OctoPrint 各管哪一步；别启动软件、排队打印或开定时。 | 方案里能核对桌牌的三项尺寸，有一种摆放建议，且未把耗时写成实测值。 |
| 4 | [操作示范整理员](../../library/recipes/sitin--teach-a-task.md) | 配方 | sit-in | 你先做观察员，只读我这次周报示范：我挑出本周已关闭的工单，按项目分组，每组核对条数后才写摘要。请把记录整理成一张待审技能卡，每步附一个检查点。只在这里出草稿，不打开工单、不保存技能，也不开定时。 | 一张技能卡按顺序列出筛工单、分组、核数、写摘要四步，每步都有检查点。 |
| 5 | [发布简报核稿员](../../library/teams/majiayu--team-release-brief.md) | 团队 | majiayu000 | 版本协调员，请先给审核同事拟一份内部简报。只看三条模拟记录：合并单写「标签筛选已合并」，上线台账写「仍在候发」，验收单写「平板未测」。每项结论旁标明依据，末尾留一个待核实的问题。草稿只放在这里，不接团队频道，不转交，不设定时。 | 草稿分别引用三条记录，写清已合并但尚未上线、平板未测，末尾有一个核实问题。 |
| 6 | [工作日早间CI巡检定时任务](../../library/routines/cobus--weekday-ci-sweep.md) | 定时任务 | cobusgreyling | 若没连 GitHub，说明正式巡检需仓库的只读构建日志。本次只看两段模拟记录：排版检查「昨日通过，今日缩进错误」；截图检查「同一提交首次超时，第二次通过」。分清新故障与疑似偶发项，各引一句日志并给一条排查建议。只回报告，不重跑、不改仓库、不开定时。 | 报告有两项：排版列为新故障，截图列为疑似偶发，每项都有日志摘录和建议。 |
| 7 | [夜间投研早报台](../../library/prompts/grokbotdev--ai-research-desk.md) | 提示词 | ZeroPointRepo | 只用这份虚构记录写一则早报草稿：昨日判断是「甲股要放量才会上涨」，今日收盘涨2%，成交量与昨日持平。用这两个数复盘昨日判断，指出一个还查不清的问题。只回在聊天里，不查实盘、不交易。 | 早报写出甲股未放量也涨了2%，说明昨日判断与记录不符，涨因仍待核实。 |
| 8 | [在投广告线索挖掘员](../../library/prompts/botdirectory--ad-active-lead-finder.md) | 提示词 | elie222 | 只筛杭州在投广告的企业培训商。模拟广告卡：甲在杭州做企业培训，广告在投；乙同城同业，广告已停。出待审表，缺电话就写未知。未接入时说明查证需 Meta 广告库或 Google 广告透明度中心，补电话可用 Google 地图，入库需连所用 CRM。本次不外查、不联系、不同步、不开定时。 | 待审表只有甲一行，依据是在投广告卡，电话标未知，乙未入表。 |
| 9 | [周五周报起草员](../../library/recipes/sitin--weekly-review.md) | 配方 | sit-in | 周报起草员，你先给合伙人写本周草稿。上周计划：完成两轮访谈、交付看板。只读这两条模拟记录：纪要甲写「做完第一轮，第二轮延期」，签收单乙写「看板已交付」。逐项对照并标来源，延期原因没写就留待补。正式取数需相应文档只读权限，本次不读账号、不发周报、不开定时。 | 两项对照中，访谈标部分完成并注明原因待补，看板标完成，各自能对回纪要或签收单。 |
| 10 | [工作日早间幕僚简报定时任务](../../library/routines/cobus--weekday-cos-digest.md) | 定时任务 | cobusgreyling | 今天只关注试点验收。请从昨早以来的两条模拟记录写晨会简报草稿：纪要甲说「试点验收缺签收人，等负责人指定」，便签乙说「茶水间换了杯子」。只留符合优先级的事，注明来源、影响和下一步，另列待拍板项。不查真实频道、不发消息、不改会议、不开定时。 | 正文只保留纪要甲，说明缺签收人对验收的影响，待拍板栏有一项指定签收人的决定。 |
| 11 | [AI搜索优化主笔](../../library/prompts/grokbotdev--ai-search-lead.md) | 提示词 | ZeroPointRepo | 若未连接，先说正式查引用需要接入对应的 DevTune 项目。只用这条模拟问答：问「能离线记笔记吗」，回答只引了乙；甲的产品说明写着「断网可新建文字笔记」。指出甲的引用缺口，写一条供甲审核的问答草稿，不猜流量，不发布、不开定时。 | 指出该回答只引用乙，另给甲一条问答草稿，离线能力限于新建文字笔记。 |
| 12 | [竞品拆解口播广告生成员](../../library/prompts/botdirectory--ad-creative-generator.md) | 提示词 | elie222 | 若未连MaxFusion，先说明做样片才需要它，这次不用连。只看虚构竞品广告「包里又湿了？倒置水杯给你看，点进来看杯盖」。拆解这一条，再给折叶杯写30秒口播和竖屏自拍生成提示草稿。杯盖可拆洗，没测过防漏。只在聊天里交文字，不生成视频或花点数。 | 能看到竞品用倒置回应漏水顾虑，折叶杯脚本和拍摄提示改为演示拆洗，没有防漏承诺。 |
| 13 | [海外社媒盯帖员](../../library/recipes/sitin--x-radar.md) | 配方 | sit-in | 负责筛帖的同学，这次先别开定时。只读我贴的两条虚构帖：甲「白帆笔记新增离线导出」https://example.org/a；乙「白帆笔记限时抽奖」https://example.org/b。挑出产品变化，回一句摘要并带上对应样例链接。若未接入X公开帖检索就说明，不搜帖、不推送。 | 只有一条关于离线导出的摘要，链接指向样例甲，没有把抽奖列为更新。 |
| 14 | [周五更新日志起草定时任务](../../library/routines/cobus--weekly-changelog.md) | 定时任务 | cobusgreyling | 只用这两条虚构的本周已合入记录写更新草稿：#12 修好空表导出后打不开（https://example.org/12）；#13 整理测试目录（https://example.org/13）。给用户的修复说明和仅供内部核对的条目分开，各带原链接。GitHub未连就说明，不改库、不发布、不开定时。 | 用户可见的修复说明链接到第12条，第13条只出现在内部清单。 |
| 15 | [通讯长文初稿撰稿员](../../library/prompts/grokbotdev--article-newsletter-writer.md) | 提示词 | ZeroPointRepo | 若未连X、通讯后台或邮箱，先说明各自在哪一步才用得上，本次不用连。只用虚构访谈笔记写一篇短通讯：「6人试用，4人卡在导入；改版后没人再卡」；后半句还没复测。聊天里给5个备选标题和正文，文末单列待核实的话，不发稿。 | 有5个标题，正文注明4人卡在导入的依据，改版后是否解决被单列为待核实。 |
| 16 | [Agent配置与记忆打包迁移员](../../library/prompts/botdirectory--ai-setup-migrator.md) | 提示词 | elie222 | 只拟一份搬家清单。我贴三项虚构配置：回复偏好是中文、周报每周五提醒、凭据栏里有密钥。逐项标明哪些能带走、哪些必须剔除，再写一句提醒迁移后如何核对周报设置。文件存储未连就说明，不读文件、不打包、不开定时。 | 清单有三项，密钥标为剔除，周五提醒有核对说明但未启用。 |
| 17 | [周一竞品页面比对定时任务](../../library/routines/cobus--weekly-competitor-diff.md) | 定时任务 | cobusgreyling | 假设今天是11月16日，只看虚构定价页摘录：云尺基础版29元/月（yun.example/price）。没有上周快照，请在聊天里拟一行首次基线，说明这次能不能判断调价。不访问网页，不保存快照，也别开启每周定时。 | 基线一行列出11月16日、样例页地址和29元/月，没有把首次记录说成调价。 |
| 18 | [模拟盘交易提案记录员](../../library/prompts/grokbotdev--autonomous-trading-agent.md) | 提示词 | ZeroPointRepo | 只做一笔纸面推演：假设甲标的突破20元才考虑买入，按21元买、19元止损，最多承受100元亏损，不计费用和滑点。写出买入理由、最多买多少及止损时的盈亏。行情源或模拟盘未连就注明，只用这组数，不下单、不记账、不开定时。 | 提案写明突破20元的前提，仓位上限为50份，按19元止损时模拟亏损100元。 |
| 19 | [数字人带货广告批量制作员](../../library/prompts/botdirectory--ai-ugc-avatar-ads.md) | 提示词 | elie222 | 只写两条编号口播草稿：虚构商品是一只有提环、杯身带刻度的水杯，给通勤族看。每条只讲一个卖点，配一个拿杯演示动作，不补材质或保温时长。若AITuber未连，说明出片才需接入，先用这些资料写，不生成视频、不花点数、不投放、不开定时。 | 两条口播分别讲提环和刻度，各带一个能在镜头前演示的动作。 |
| 20 | [周一费用报销核对定时任务](../../library/routines/cobus--weekly-expenses.md) | 定时任务 | cobusgreyling | 只核对这份虚构周账：甲报车费60元，有60元收据；乙报车费40元，没附收据。样例制度第2条要求车费附收据。列申报总额、有票金额和差额，给缺票人拟一句补票消息并标条款。报销系统未连就说明，只出草稿，不发消息、不审批付款、不开定时。 | 申报100元、有票60元、差额40元，只有乙有补票草稿，并注明第2条。 |
| 21 | [日历人脉建库员](../../library/prompts/grokbotdev--build-a-crm-from-your-calendar.md) | 提示词 | ZeroPointRepo | 若日历、Notion或领英未连，先说各自用来查什么或存什么，这次不用连。只看3条虚构日历：4月2日和小栗做需求访谈；4月8日独自写稿；4月12日和小栗看原型。在聊天里拟联系人表，职位没给就留空，不查真人也不建库。 | 表里只有小栗一行，初识是4月2日需求访谈，最近见面是4月12日，职位为空。 |
| 22 | [AI视频分镜出片师](../../library/prompts/botdirectory--ai-video-generator.md) | 提示词 | elie222 | 只拟两个竖屏分镜，每镜3秒：先拍空白便签，再拍手写下周会日期。用虚构报价每秒2点，算每镜和整片点数，与15点预算比较，不当作平台实价。若AITuber未连就说明，只按我贴的条件出草稿，不生成片段、不扣点、不开定时。 | 分镜表有两个3秒镜头，各估6点，合计12点，比预算少3点。 |
| 23 | [带出处考据调研技能](../../library/skills/cobus--cited-research.md) | 技能 | cobusgreyling | 只读两段虚构摘录：甲版手册「每批上限20条」https://example.org/manual；乙版公告「每批上限30条」https://example.org/note。写一段核对草稿，各引对应链接，说明能否据此判断今天适用哪个上限、还缺什么证据。不打开链接、不补日期、不发布、不开定时。 | 20条和30条各有对应样例链接，现行上限列为未查明，并指出缺少生效日期。 |
| 24 | [流失原因分析员](../../library/prompts/grokbotdev--churn-exit-feedback.md) | 提示词 | ZeroPointRepo | 只分析三位虚构退订者各自的回复：甲「月费太贵」、乙「用得少，月费不值」、丙「导出总失败」。按原因数人数，不足三人的组标「样本少」，各拟一项本周改动和两周后要看的指标。若回复日志或问卷未接入就说明，只用样例出草稿，不联系客户、不改产品、不开定时。 | 月费组两人、导出组一人，两组均标样本少，各有一项改动和一个观察指标。 |
| 25 | [七天记忆法练习教练](../../library/prompts/botdirectory--alter-learning.md) | 提示词 | elie222 | 假设我是周一开练的在职用户，笔记只有一句：访谈先问上次发生了什么，再问当时怎么处理。若要读教材，请说明需连接哪个本地文件夹；这次只用这句做两张回忆卡，答案放末尾，列出七天内哪天再练哪张。只出草稿，不读写文件，不开定时。 | 能先看到两道题再核对两条答案，七天复习草案里能按卡号找到各自的复习日。 |
| 26 | [零散功能需求归拢技能](../../library/skills/cobus--collate-feature-asks.md) | 技能 | cobusgreyling | 若没连Slack或工单系统，先说明读原帖和查重各需要什么，不用连接。只看本周两条虚构群帖：帖甲「对账时想下载明细」，帖乙「月末核账得逐行抄」。已有工单7「对账明细导出」。按使用场景归组，引用原话并标出帖号，只在聊天里拟问题描述，不建单。 | 两帖归到对账取明细这一组，频次是2个帖子，原话能对上帖号，并关联已有工单7。 |
| 27 | [赞助报价跟单员](../../library/prompts/grokbotdev--close-inbound-sponsorships.md) | 提示词 | ZeroPointRepo | 若没连商务邮箱，先说明读真实来信需要邮箱，这次不用连。看两封虚构来信：甲「想赞助一期通讯，放一段文案，请报价」；乙「资源多，合作加群」。我的价卡是单期1500元。只在聊天里给甲拟一封报价回信，问清投放日期，再标明乙要不要跟，不发信。 | 给甲的回信报价单期1500元并询问日期，乙因没有具体赞助需求被标为暂不跟进。 |
| 28 | [Bot动态头像制作师](../../library/prompts/botdirectory--animated-bot-avatars.md) | 提示词 | elie222 | 用文字样例代替原图：米白底上画着一只蓝铅笔小鸟。给我一份两秒眨眼循环的三帧分镜草稿，保留笔触，末帧接回首帧。若未连，说明生成动画需连 fal.ai、换头像需连 X；这次只写分镜，不调用生成服务，不换头像，不开定时。 | 三帧写清睁眼、闭眼、再睁眼，首尾姿态一致，回复中没有声称已生成动图。 |
| 29 | [发版分工跟进技能](../../library/skills/cobus--coordinate-launch.md) | 技能 | cobusgreyling | 模拟周五给内测用户上线笔记导出，验收条件是样例笔记能完整导出，目前还没人核对结果。只拟分工草稿：小陈调研、小吴撰稿、小林审核，各写一项要交的东西，最后列出我拍板前还缺的证据。不通知本人，不实际发版，不开定时。 | 分工表有三人各一项交付，待拍板栏明确缺少导出完整性的核对结果。 |
| 30 | [高低模型省钱分流器](../../library/prompts/grokbotdev--connect-deepseek-to-grok-bot.md) | 提示词 | ZeroPointRepo | 只在回复里模拟一次模型分工。样例工单是「导出慢」「找不到账单」：给工单打标签是一项任务，判断先改哪个问题是另一项。各选低价模型或主力模型，写一句理由。外部模型接口未接入就注明，只用样例，不索要密钥、不调用接口、不改配置、不开定时。 | 分工表有两行，打标签归低价模型，优先级判断归主力模型，每行都有理由。 |
| 31 | [待办审批分诊员](../../library/prompts/botdirectory--approval-queue-triage.md) | 提示词 | elie222 | 若Slack或Linear未连，先说看原帖和记工单各需要什么，不用连。只看两条虚构请求：帖甲「今天要把客户名单发给外包，授权没找到」；帖乙「下周例会延后半小时，参会人已同意」。聊天里按紧急程度和风险给建议，保留帖号，不代批、不建单或开监控。 | 帖甲排在前面，建议先核实外发授权；帖乙标为低风险，建议同意而非已经批准。 |
| 32 | [重点事项每日简报技能](../../library/skills/cobus--daily-digest.md) | 技能 | cobusgreyling | 今天只盯内测报名。群消息样例：①报名页已好，等负责人定名额；②茶水间补了咖啡。若群聊未连，说明实读需哪个群的只读权限。这次只用这两条出简报草稿，给相关变化标消息编号，解释影响，并写我下一步要定什么。不进群、不发消息、不开定时。 | 简报只引消息①，把确定内测名额列为待拍板事项，没有收录咖啡消息。 |
| 33 | [多平台发文同步员](../../library/prompts/grokbotdev--content-pipeline.md) | 提示词 | ZeroPointRepo | 样例原稿：导出清单时可以隐藏空列。模拟原文地址是 https://demo.invalid/list 。只出草稿：先写官网短文，再写 Dev.to 摘要并标出 canonical 地址；给 LinkedIn 写个使用场景，给 X 写一句短帖。哪个平台未连就说明要连什么，仍只用样例，不访问、不发布、不开定时。 | 有四份草稿，Dev.to 的原文地址与样例一致，两条社媒文案措辞不同且都没多报功能。 |
| 34 | [量化策略资金风控调配员](../../library/prompts/botdirectory--asset-allocator.md) | 提示词 | elie222 | 只做纸面模拟：研究池有100个虚拟点，甲乙两种策略等分；每种单日换手上限为各自额度的一成，数据过期就暂停模拟。列两行预算草稿，算出换手上限。若未连，说明读取账户需连 eToro MCP，但只用上述数字，不读账户、不下单、不写配置、不开定时。 | 预算表两行各分50个虚拟点，单日换手上限各5点，两行都注明数据过期即暂停模拟。 |
| 35 | [代码与文档偏差排查技能](../../library/skills/cobus--detect-docs-drift.md) | 技能 | cobusgreyling | 只读两段安全样例：README.md 写着“每页默认显示20条”，src/list.ts 的默认页长常量是10。若仓库未连，说明查看原件需 GitHub 只读访问；这次只比较贴文，用一行表写出两处依据，再给一句能替换原文的草稿。不运行代码、不改文件、不开定时。 | 偏差表列出两条路径及20与10的差异，替换句写的是每页默认显示10条。 |
| 36 | [单任务Bot调教教练](../../library/prompts/grokbotdev--dangerously-good-at-grok-bot.md) | 提示词 | ZeroPointRepo | 我只想从纪要里提取有主的待办。样例第1句：小唐周四整理访谈笔记。第2句：下次再聊定价。请把这件事写成五格简报草稿：目标、来源、限制、交付格式、等我确认的位置。只拿这两句试跑一次，给待办标句号编号就停，不保存技能，不开定时。 | 五格简报后只有一条待办，标明小唐、周四、整理访谈笔记及来源第1句。 |
| 37 | [协会官网内容更新员](../../library/prompts/botdirectory--association-website-updater.md) | 提示词 | elie222 | 只在回复里给一页文字预览和一条改动摘要。样例：活动页写着“读书会｜周六14点｜二楼”，请把地点改成三楼。网站后台没连就说明实操需接内容管理系统或托管账号，这次只用样例，不登录、不改站、不发布、不开定时。 | 预览写着“读书会｜周六14点｜三楼”，摘要只列地点这一处改动。 |
| 38 | [竞品页面变动比对技能](../../library/skills/cobus--diff-competitors.md) | 技能 | cobusgreyling | 只比这两期虚构定价快照，单位都是元/月：11月9日甲29、乙39、丙49；11月16日甲35、乙39、丙49。甲定价页是jia.example/price。在聊天里给甲写一条带日期和页址的前后对照，没变的合写一行，不访问网页或保存结果。 | 甲的页址旁能看到11月9日29元/月与11月16日35元/月，乙和丙同列为未变。 |
| 39 | [竞品差评挖客侦察兵](../../library/prompts/grokbotdev--find-customers-complaining-about-competitors.md) | 提示词 | ZeroPointRepo | 我卖对账工具，竞品叫账栗。只看这条虚构帖：纸舟店财务阿禾说「账栗导不出明细，月底前得换」，阿团跟帖「我也只能手抄」。给两人排跟进顺序，各拟一句回复，缺的资料写未知。账号没连就先说明X用来找帖、Amplemarket用来查公司和职位。这次不连接，只在聊天里出稿，不发帖、不私信、不开定时。 | 阿禾因月底前要换工具排第一，阿团排第二且公司和职位标为未知，两句回稿分别回应账栗导不出明细和手抄的问题。 |
| 40 | [航司里程票余票监控员](../../library/prompts/botdirectory--award-seat-watcher.md) | 提示词 | elie222 | 若未连Etihad Guest，先说明查真实余票需要该账户，不用登录。只筛这两条虚构北京直飞阿布扎比的经济舱记录：12月3日1座，4万分加税320元；4日1座，6万分加税260元。我需1座，最多5万分。只在聊天里拟匹配提醒，没给核验链接就注明，不订票或开定时。 | 提醒只列12月3日北京直飞阿布扎比的经济舱1座，标出4万分加税320元及缺少核验链接。 |
| 41 | [会后跟进包起草技能](../../library/skills/cobus--draft-call-followup.md) | 技能 | cobusgreyling | 只用这次模拟纪要：我方说“周四发报价”，客户说“我确认席位数”。起草跟进邮件和客户记录，双方待办分开列，日期有原话才填。日历、历史邮件若未接，说明各用来查什么；没给空闲时间就别约。不发信、不建日程、不写入客户系统、不开定时。 | 有邮件和客户记录两份草稿，双方各一项待办，仅报价标周四，下次时间待确认。 |
| 42 | [建站潜客搜寻员](../../library/prompts/grokbotdev--find-local-website-leads.md) | 提示词 | ZeroPointRepo | 只用两条虚构的杭州花店记录模拟筛选：甲店的手机端预约按钮被遮住，联系页是 a.invalid/contact；乙店手机预约正常。按记录挑一家，注明问题和联系路径，写一封待确认问题的短邮件草稿。别说你看过网站，不查店、不联系、不开定时。 | 只列甲店和样例联系页，附一封询问手机预约按钮是否被遮挡的邮件草稿。 |
| 43 | [账目流水与抵税查账员](../../library/prompts/botdirectory--bookkeeping-auditor.md) | 提示词 | elie222 | 仅做纸面对账：虚构的六月文具费，账本记86元，同笔银行卡扣款68元，没有发票。写一条异常，列两边金额、差额和待补凭证，别判定能否抵税。若未连接，说明实账核对需只读的QuickBooks账本和对应流水；本次只用样例，不改账、不申报、不开定时。 | 一条异常写明账本比流水多18元，列出缺的发票，抵税结论留待核实。 |
| 44 | [发版更新日志起草器](../../library/skills/cobus--draft-changelog.md) | 技能 | cobusgreyling | 假设上次打标后只合入两项：#21 修正导出表格缺少表头，#22 整理内部测试目录。给用户写一条更新说明草稿，另列不对外写的项及原因，都保留编号。若没连GitHub，先说明核对合并记录需要仓库只读权限，仍用样例，不改文件、不打标发布、不开定时。 | 对外草稿只有#21，说明导出的表格恢复表头；#22只在内部清单里，附排除原因。 |
| 45 | [业务计划追问官](../../library/prompts/grokbotdev--grill-me-interview.md) | 提示词 | ZeroPointRepo | 我的计划只有一句：“这季度想把访谈整理做得更好。”先只在对话里模拟一轮访谈：引用一句里最含糊的词，问我一个能厘清完成标准的问题，等我回答再追问。访谈不用连账号；若共享简报需连 GitHub，就说明所需连接，不保存、不通知团队、不开定时。 | 只收到一个针对“更好”的完成标准问题，没有替我设定指标，也没有开始实施。 |
| 46 | [书签转样机双审流水线](../../library/prompts/botdirectory--bookmark-to-demo-pipeline.md) | 提示词 | elie222 | 虚构书签只有一条：“想看问卷有几人选了每个选项”。只出样机方案草稿，用甲、乙、甲三张模拟选票写预期画面，列一项截图验收点，停在等我审方案。若没接X书签、Cursor或Cloudflare，说明各在哪步需要，本次不读账号、不写代码、不部署、不开定时。 | 一份待审方案里，预期画面是甲两票、乙一票，附一项截图验收点，没有部署链接。 |
| 47 | [缺陷工单草稿整理器](../../library/skills/cobus--draft-issue.md) | 技能 | cobusgreyling | 只用这条虚构反馈起草一张工单：“在网页版订单列表点下一页，页码变成2，列表还显示第一页的订单。”按标题、编号操作步骤、实际与预期、环境来写，浏览器版本留未知。若没连GitHub就说明套用仓库模板需只读权限，先用这些字段，不实测、不提交、不开定时。 | 一张草稿含编号步骤，区分页码已变和列表未变，预期显示第二页订单，浏览器版本未知。 |
| 48 | [订阅砍价谈判员](../../library/prompts/grokbotdev--grinder-subscription-killer.md) | 提示词 | ZeroPointRepo | 只做一次纸面谈价：虚构订阅每月标价60元、实扣50元，客服还没报价。列出这三个价格字段，拟一句询问续费折扣的话。没连账号就说明核实实扣和报价分别要看商户账单页和客服会话，仍用样例，不联系商家、不付款或退订、不开定时。 | 价格栏分别为每月60元、50元和待报价，附一句询价草稿，不把差额算作谈判成果。 |
| 49 | [X评论区小号与辱骂筛查员](../../library/prompts/botdirectory--burner-account-bouncer.md) | 提示词 | elie222 | 只读两条虚构回复：甲有80名粉丝、注册两年，说“图例太小”；乙有300名粉丝、注册两个月，说“你是笨蛋”。按不足百粉或注册未满一年筛查，账号标记和辱骂判断分列，写出依据。若X未连就说明需只读回复及账号资料，本次只用样例，不拉黑、不删评、不开定时。 | 两行分别标出甲不足百粉、乙注册未满一年，甲的意见归为批评，只有乙被标为辱骂。 |
| 50 | [数据库查询草稿编写器](../../library/skills/cobus--draft-sql.md) | 技能 | cobusgreyling | 只看样例表 orders：每行是一笔订单，channel 表示订单来源。请写一条按渠道统计订单数的只读 SQL 草稿，用一句话解释怎么计数，再提醒我全表统计可能带来什么负载。不连库，不运行查询，不设定时。 | 草稿按 channel 分组，用 COUNT(*) 统计每组行数，并提示全表统计的负载风险。 |

## 能挂到货架哪个 Bot 的详情页

按「同一件事更细的一步，或者紧接着的下一步」配，每个 Bot 最多 3 条，宁缺毋滥。67 个 Bot 配到了，共 116 条；其余没找到合适的。

| 货架 Bot | 配套条目 | 配合在哪 |
|---|---|---|
| 客户背调员 | [客户决策关系图](../../library/prompts/botdirectory--org-chart-keeper.md)（提示词） | 细化干系人地图：每周更新客户组织图，标谁影响成交 |
|  | [对客承诺登记器](../../library/skills/cobus--log-promises.md)（技能） | 通话后把我方承诺连原话和期限记进台账，盯没落地的事 |
|  | [客户会前内部简报编写](../../library/skills/cobus--prep-meeting.md)（技能） | 会前内部简报补上次承诺和禁提项；靠 Gmail，可贴邮件 |
| 广告花费监控员 | [广告预算调配建议书](../../library/skills/cobus--recommend-media-realloc.md)（技能） | 超线后的下一步：按目标获客成本出调拨表；预算表可换本地 |
|  | [异常原因排查员](../../library/prompts/botdirectory--sherlock-holmes.md)（提示词） | 指标异动时按证据排查真因，分清流量变贵还是转化变差 |
| AI 说法核查员 | [带出处考据调研技能](../../library/skills/cobus--cited-research.md)（技能） | 逐条找证据时的考据方法：两源互证，查不到就标未核实 |
| AI 早报员 | [带出处考据调研技能](../../library/skills/cobus--cited-research.md)（技能） | 早报里某条要深挖时，查一手资料出带出处的考据简报 |
|  | [周刊内容编纂器](../../library/skills/cobus--draft-newsletter.md)（技能） | 把一周条目编成带引用的周刊草稿；素材放本地也能跑 |
| 需求把关人 | [前提假设查验器](../../library/skills/cobus--interrogate-assumptions.md)（技能） | 细化标假设：逐条判有据、推论、争议、无据并说缺什么 |
|  | [零散功能需求归拢技能](../../library/skills/cobus--collate-feature-asks.md)（技能） | 写需求前先把群里零散诉求按用户任务归拢，附原话频次 |
|  | [决策来由档案员](../../library/prompts/botdirectory--witness.md)（提示词） | 补全决策日志：记备选方案、取舍理由和重开条件；短但对口 |
| AI 推荐排查员 | [AI搜索引用监测技能](../../library/skills/cobus--watch-aeo.md)（技能） | 把一次排查变成固定问题集定期重跑，记谁被引用出补缺单 |
|  | [AI搜索优化主笔](../../library/prompts/grokbotdev--ai-search-lead.md)（提示词） | 补缺下一步：按证据队列写补位稿比上线前后（需DevTune） |
| Bot 团队顾问 | [机器人公开分享脱敏器](../../library/skills/cobus--sanitize-share.md)（技能） | 细化分享前审查：清密钥、客户名和内网地址，出删改对照 |
|  | [先跑通单次任务再转定时法](../../library/recipes/cobus--draft-then-routine.md)（配方） | 试跑再启用的做法：先跑通单次存技能再开定时；短但正是这步 |
|  | [机器人岗位模板编写技能](../../library/skills/cobus--design-bot-template.md)（技能） | 方案落成带自检表的Bot配置；复查命中的是禁付款条款，误报 |
| bill-import | [订阅扣费月检](../../library/prompts/botdirectory--subscription-audit.md)（提示词） | 账单入账后的下一步：翻90天流水揪出订阅、涨价和重复扣费 |
| 通话跟进助理 | [对客承诺登记器](../../library/skills/cobus--log-promises.md)（技能） | 把双方承诺续记进台账，下次通话前查谁逾期 |
|  | [客户需求回顾页](../../library/prompts/botdirectory--live-discovery-slide.md)（提示词） | 把通话里的客户难题提炼成一页，填回下次要讲的演示稿 |
| 校招求职助理 | [技术面试逐题练](../../library/prompts/botdirectory--interview-prep.md)（提示词） | 投递之后的下一步：按技术方向逐题练代码面试题 |
| 考证教练 | [七天记忆法练习教练](../../library/prompts/botdirectory--alter-learning.md)（提示词） | 摸底后针对弱项做七天检索练习包，含复习日历和错题本 |
| 切片剪辑师 | [视频出片校样台](../../library/prompts/botdirectory--video-timeline-renderer.md)（提示词） | 烧字幕前先预览帧，确认字幕不挡嘴再出片 |
|  | [多社交平台改稿分发助手](../../library/prompts/botdirectory--cross-platform-publisher.md)（提示词） | 切片出完的下一步：按各平台字数时长改配文并排期分发 |
| 竞品盯梢员 | [竞品页面变化简报](../../library/recipes/sitin--competitor-radar.md)（配方） | 快照比对的定时做法：先滤掉时间戳推荐位，只推实质变化 |
|  | [竞品官网改版巡检员](../../library/prompts/botdirectory--competitor-website-watch.md)（提示词） | 比对时存截图基线、滤掉轮播噪音，附改前改后截图 |
|  | [软件功能拆解员](../../library/prompts/botdirectory--reverse-engineer.md)（提示词） | 竞品上了新功能后，拆它怎么实现，分清证据和推测 |
| 去 AI 味编辑 | [多渠道稿件改写工具](../../library/skills/cobus--remix-content.md)（技能） | 定稿后的下一步：改成各渠道版本，每句对回原稿论据 |
| 界面挑刺师 | [网站体验修复提案](../../library/prompts/botdirectory--journey-friction-pr-agent.md)（提示词） | 挑出流程卡点后，用真实访问录像核实，再拟修复 PR |
| 客户案例整理员 | [多渠道稿件改写工具](../../library/skills/cobus--remix-content.md)（技能） | 案例定稿后改成社媒和邮件多渠道版本，每句可溯源 |
|  | [客户反馈广告策划](../../library/prompts/botdirectory--voc-ad-angle-generator.md)（提示词） | 把客户原话转成广告切入点；靠Gmail表格，可换访谈稿 |
| 增长操盘手 | [热点选题雷达](../../library/prompts/botdirectory--viral-story-finder.md)（提示词） | 细化找热点：按势头和梗感排序，附来源和切入角度 |
|  | [热点回应拟稿台](../../library/prompts/botdirectory--rapid-response-desk.md)（提示词） | 热点选定后，把能核实的部分写成帖子和15秒视频开头 |
| Bot 设计师 | [先跑通单次任务再转定时法](../../library/recipes/cobus--draft-then-routine.md)（配方） | 建完先用安全输入跑通一次再开定时；条目短但正补这步 |
|  | [现有Bot提示词与流程调优师](../../library/prompts/botdirectory--bot-optimizer.md)（提示词） | 把反复纠正处改成提示词方案，先在副本上试；短但对口 |
|  | [定时任务用量盘点表](../../library/recipes/sitin--routine-budget.md)（配方） | 细化查白烧额度：先暂停、盘点、分级，再逐条恢复 |
| 开发组长 | [代码合并风险审查包](../../library/skills/cobus--review-pr-risk.md)（技能） | PR能否合并的把关：先查会坏什么、漏测什么、描述没兑现 |
|  | [持续集成失败巡检报告](../../library/skills/cobus--sweep-ci.md)（技能） | 细化CI巡检：报错聚类、分出偶发抖动，附日志和建议排查人 |
|  | [发版更新日志起草器](../../library/skills/cobus--draft-changelog.md)（技能） | PR合并后的下一步：按类整理成面向用户的更新日志草稿 |
| 活动统筹 | [活动排班巡检员](../../library/prompts/botdirectory--live-event-staffer.md)（提示词） | 细化流程表：每天查缺人和缺到场时间的场次，起草邀约 |
| 邀约筛选助理 | [新项目取舍顾问](../../library/prompts/botdirectory--gatekeeper.md)（提示词） | 答应前先算清会挤掉哪件事，给做、不做、延后或小试建议 |
| 设计稿标注员 | [自动布局层级整理器](../../library/prompts/botdirectory--figma-autolayout-flattener.md)（提示词） | 同作者细分步：把自动布局拍平成好写CSS的结构；短但对口 |
|  | [设计稿图层规范巡检员](../../library/prompts/botdirectory--figma-cleanup-assistant.md)（提示词） | 同作者细分步：按命名和间距规范整理图层变体；短但对口 |
| 复习卡制作员 | [七天记忆法练习教练](../../library/prompts/botdirectory--alter-learning.md)（提示词） | 做完卡的下一步：排七天检索练习和复习日历 |
|  | [笔记过期事实检查员](../../library/prompts/botdirectory--stale-fact-detector.md)（提示词） | 做卡前先对照权威来源，查笔记里已过时的事实 |
| 绿植养护员 | [花园问诊员](../../library/prompts/botdirectory--green-thumb-granny.md)（提示词） | 植物出问题时：看照片诊断先给低风险处理；短但同类仅此 |
| 游戏美术指导 | [游戏美术素材出图员](../../library/prompts/grokbotdev--game-art-png-pipeline.md)（提示词） | 提示词定好后按定稿画风批量出透明素材；网盘可换本地 |
| Grok Bot 入门教练 | [单任务Bot调教教练](../../library/prompts/grokbotdev--dangerously-good-at-grok-bot.md)（提示词） | 学完课的下一步：用五要素简报搭第一个真干活的 Bot |
|  | [操作示范整理员](../../library/recipes/sitin--teach-a-task.md)（配方） | 把一次手动操作录成技能卡，小样本复跑再放手 |
| 点子拆解员 | [前提假设查验器](../../library/skills/cobus--interrogate-assumptions.md)（技能） | 细化可证伪改写：把论断拆成可检验句并判有无依据 |
|  | [关键假设复核簿](../../library/prompts/botdirectory--interrogator.md)（提示词） | 决定试下去后，把关键假设记成台账每周复查；短但对口 |
| 用户任务梳理员 | [零散功能需求归拢技能](../../library/skills/cobus--collate-feature-asks.md)（技能） | 画任务地图前，把群聊诉求按用户任务归拢，补原话证据 |
| 线索管理员 | [客户分级清洗员](../../library/prompts/botdirectory--account-tiering.md)（提示词） | 细化打分分档：按匹配度乘热度分级，给头部补联系人 |
|  | [领英邀约写手](../../library/prompts/botdirectory--linkedin-personalization-writer.md)（提示词） | A档线索的下一步：按近况和意向写领英邀请与跟进草稿 |
| 手把手老师 | [七天记忆法练习教练](../../library/prompts/botdirectory--alter-learning.md)（提示词） | /book 学完一本书后，排七天检索练习和复习日历 |
| 术语讲解员 | [笔记复习排期员](../../library/prompts/botdirectory--note-mastery-reviewer.md)（提示词） | 学过的词按掌握度出题、排下次复习；短但正接这步 |
| ledger-keeper | [订阅扣费月检](../../library/prompts/botdirectory--subscription-audit.md)（提示词） | 记账之后的下一步：每月查订阅扣费、涨价和重复项 |
| 竞品广告分析师 | [竞品拆解口播广告生成员](../../library/prompts/botdirectory--ad-creative-generator.md)（提示词） | 拆完竞品广告的下一步：挑投得最久的视频写口播脚本 |
| 投放数据分析师 | [广告预算调配建议书](../../library/skills/cobus--recommend-media-realloc.md)（技能） | 报表后的下一步：比目标获客成本出预算调整表；表可换本地 |
|  | [异常原因排查员](../../library/prompts/botdirectory--sherlock-holmes.md)（提示词） | 数字异常时按证据排查真因，列嫌疑、排除项和下一步验证 |
| media-downloader | [播客项目笔记](../../library/prompts/botdirectory--podcast-summarizer.md)（提示词） | 转写后按你的项目提炼主张和可试做法；源可换成B站 |
|  | [播客投资要点提炼器](../../library/prompts/grokbotdev--podcast-summarizer.md)（提示词） | 转写后提炼8条数据观点和带时间戳的金句，存成文档 |
| 会后回顾制作员 | [对客承诺登记器](../../library/skills/cobus--log-promises.md)（技能） | 回顾里列的承诺续记进台账，下次会前查逾期 |
|  | [客户需求回顾页](../../library/prompts/botdirectory--live-discovery-slide.md)（提示词） | 从会议笔记提炼客户难题，填回演示稿对应那一页 |
| memory-cleanup | [机器人记忆修剪器](../../library/skills/cobus--garden-memory.md)（技能） | 对照权威资料改掉Bot记错的旧事实，出设定修改对比稿 |
| 行政助理 | [新员工首周入职计划表](../../library/skills/cobus--ramp-new-hire.md)（技能） | 物品备好后排新人首周见谁读什么；日历占位可手动建 |
| 客户开发员 | [目标客户画像调研清单](../../library/skills/cobus--research-accounts.md)（技能） | 把建名单、查背景、写开场信固化成可定时跑的技能 |
|  | [商务对接联络员](../../library/prompts/botdirectory--john-wick.md)（提示词） | 细化找人：在目标公司里找到真能推动决策的那个人 |
|  | [领英邀约写手](../../library/prompts/botdirectory--linkedin-personalization-writer.md)（提示词） | 领英渠道的细化：按每人近况和意向写邀请和跟进 |
| 品牌舆情员 | [品牌与高管舆情摘录技能](../../library/skills/cobus--watch-brand.md)（技能） | 命中的提及分四类，单列要人工跟进的客诉和报道 |
|  | [社媒回帖起草员](../../library/prompts/botdirectory--reply-drafter.md)（提示词） | 扫到提及后的下一步：挑值得回的帖子，按你口吻拟回复 |
| 投放周报员 | [广告预算调配建议书](../../library/skills/cobus--recommend-media-realloc.md)（技能） | 周报后的下一步：出预算调拨建议和汇报草稿；表可换本地 |
|  | [广告测试待办池整理员](../../library/prompts/botdirectory--ad-test-backlog.md)（提示词） | 看出赢家后把下轮测试假设写进待办；短但正接这步 |
| 头像画师 | [Bot动态头像制作师](../../library/prompts/botdirectory--animated-bot-avatars.md)（提示词） | 同作者的下一步：把静态头像做成同画风的循环动图 |
| 路演稿教练 | [前提假设查验器](../../library/skills/cobus--interrogate-assumptions.md)（技能） | 细化标事实推断假设：逐条核对资料，判有无依据 |
| 需求撰写员 | [上线前证据打包器](../../library/skills/cobus--package-evidence.md)（技能） | 开发完的下一步：对照验收标准把日志和测试整成证据包 |
|  | [研发问题单起草员](../../library/prompts/botdirectory--github-issue-drafter.md)（提示词） | 把需求切片写成带预期和验收条件的 GitHub 工单 |
| 定位文案师 | [社媒周更草稿排期器](../../library/skills/cobus--queue-social.md)（技能） | 文案定稿后，把一个选题拆成一周多渠道帖子排进待审 |
|  | [用户原话广告文案写手](../../library/prompts/botdirectory--customer-voice-ad-writer.md)（提示词） | 写广告时直接用客户原话；源是Reddit，可换你的评论区 |
| 项目经理 | [发版分工跟进技能](../../library/skills/cobus--coordinate-launch.md)（技能） | 细化倒排计划：给调研、撰稿、审核派活并汇总卡点 |
|  | [上线前证据打包器](../../library/skills/cobus--package-evidence.md)（技能） | 合并发布前问你时，先整成已验证、未验证和残余风险 |
| Bot 派活主管 | [多机器人任务分派器](../../library/skills/cobus--route-work.md)（技能） | 细化派活：按职责名册只派给一个负责Bot，写交接单 |
|  | [任务看板日报](../../library/prompts/botdirectory--notion-work-board.md)（提示词） | 细化看板：分积压、卡在我、等下一步、完成四栏并发日报 |
|  | [多助手工作日报](../../library/prompts/botdirectory--swarm-daily-summarizer.md)（提示词） | 按项目和Bot汇总昨天做完的和没解的，附对话链接 |
| quota-saver | [定时任务用量盘点表](../../library/recipes/sitin--routine-budget.md)（配方） | 挪检查前先盘点：哪些定时任务该停或降频，排恢复顺序 |
| 反方辩手 | [关键假设复核簿](../../library/prompts/botdirectory--interrogator.md)（提示词） | 稿子发出后每周复查它依赖的关键假设；短但对口 |
|  | [决策来由档案员](../../library/prompts/botdirectory--witness.md)（提示词） | 定案后记下备选和取舍理由，复盘有据可查；短但对口 |
| 资料调查员 | [个人调研看板](../../library/prompts/botdirectory--research-command-center.md)（提示词） | 查完的下一步：按项目存结论和来源，回头看还剩哪些疑点 |
| 简历定制师 | [领英主页改稿员](../../library/prompts/botdirectory--linkedin-profile-audit.md)（提示词） | 简历改完的下一步：照新经历改领英标题、简介和经历 |
| 销售通话教练 | [赢单丢单证据复盘技能](../../library/skills/cobus--write-win-loss.md)（技能） | 成单或丢单后，用CRM和通话原话写团队可复用的成败复盘 |
| 搜索广告复盘员 | [苹果搜索广告消耗晨报员](../../library/prompts/botdirectory--ad-pacing-digest.md)（提示词） | 周复盘之外每天发消耗对比，你回帖确认后再改出价 |
| 销售助理 | [客户健康度分级排查器](../../library/skills/cobus--rank-account-health.md)（技能） | 细化盯用量：按用量、工单、续约期排客户，分流失和增购 |
|  | [会后跟进包起草技能](../../library/skills/cobus--draft-call-followup.md)（技能） | 细化通话后整理：出纪要草稿、双方待办和下次时间建议 |
|  | [客户通话技术答疑助手](../../library/prompts/botdirectory--product-expert.md)（提示词） | 细化答客户问题：从代码库或知识库找依据，给能念的答复 |
| 搜索选题编辑 | [搜索掉队页修订员](../../library/prompts/botdirectory--seo-improver.md)（提示词） | 细化单页体检：每两周找掉曝光的页，改标题描述内链提PR |
|  | [文稿SEO体检报告员](../../library/prompts/botdirectory--content-and-seo-assistant.md)（提示词） | 按简报写完稿后，测可读性和关键词密度出SEO体检报告 |
| 开发信排期员 | [领英邀约写手](../../library/prompts/botdirectory--linkedin-personalization-writer.md)（提示词） | 细化领英那条线：按每人近况和意向写邀请和跟进 |
|  | [客户约会排期助手](../../library/prompts/botdirectory--prospect-meeting-booker.md)（提示词） | 进入商谈后按双方空档约会；靠Gmail日历，可只拟邮件 |
| 产品巡检员 | [测试环境缺陷复现包](../../library/skills/cobus--reproduce-bug.md)（技能） | 发现坏了的下一步：在测试环境复现，出步骤和预期实际对比 |
|  | [缺陷工单草稿整理器](../../library/skills/cobus--draft-issue.md)（技能） | 把复现包按仓库模板整理成缺陷工单草稿，确认后再提 |
| 公司拆解员 | [软件功能拆解员](../../library/prompts/botdirectory--reverse-engineer.md)（提示词） | 找到机会后，拆它的关键功能怎么实现，分清证据和推测 |
| 封面截取员 | [多社交平台改稿分发助手](../../library/prompts/botdirectory--cross-platform-publisher.md)（提示词） | 导出多尺寸后的下一步：按平台规则改配文并排期分发 |
| sweeper | [定时任务用量盘点表](../../library/recipes/sitin--routine-budget.md)（配方） | 细化砍空转任务：先暂停、盘点、分级，再逐条恢复 |
|  | [Bot队列周度成本审计员](../../library/prompts/botdirectory--bot-fleet-auditor.md)（提示词） | 每周算各Bot花费和产出，给去留建议，你点头才砍 |
| 人才搜寻员 | [公司人员分布图](../../library/prompts/botdirectory--mappy-talent-map.md)（提示词） | 找人前先画目标公司人员分布图再定向搜；短但对口 |
| 视频剪辑助理 | [视频出片校样台](../../library/prompts/botdirectory--video-timeline-renderer.md)（提示词） | 加字幕或改构图后先预览一帧，确认不挡嘴再出片 |
|  | [视频粗剪审片员](../../library/prompts/botdirectory--video-review-editor.md)（提示词） | 剪前先审素材出带时间码剪辑单；网盘可换本地上传 |
| 口播剪辑师 | [视频粗剪审片员](../../library/prompts/botdirectory--video-review-editor.md)（提示词） | 细化开剪前方案：标连贯问题和可剪段；网盘可换本地 |
|  | [视频出片校样台](../../library/prompts/botdirectory--video-timeline-renderer.md)（提示词） | 出片前逐帧预览确认字幕不挡嘴，保留可改时间线 |
|  | [多社交平台改稿分发助手](../../library/prompts/botdirectory--cross-platform-publisher.md)（提示词） | 成片交付后的下一步：按各平台改配文并排期分发 |
| 官网体检员 | [网站体验修复提案](../../library/prompts/botdirectory--journey-friction-pr-agent.md)（提示词） | 细化转化体检：用访问录像核实用户卡点，再拟修复PR |
|  | [搜索掉队页修订员](../../library/prompts/botdirectory--seo-improver.md)（提示词） | 细化SEO体检：找掉曝光或在第二页的页，改标题内链提PR |
| 改稿编辑 | [多渠道稿件改写工具](../../library/skills/cobus--remix-content.md)（技能） | 改完稿的下一步：拆成社媒、邮件等版本，每句对回原稿 |
| X 简报员 | [帖子事实核查员](../../library/prompts/botdirectory--research-ruby.md)（提示词） | 细化核对长帖数字：逐条判真假或存疑，附带日期来源 |
|  | [发帖时机参谋](../../library/prompts/botdirectory--x-posting-advisor.md)（提示词） | 起草帖子后，按排序信号建议现在发、引用转发还是再等 |
| zuozuo-ai-intel | [带出处考据调研技能](../../library/skills/cobus--cited-research.md)（技能） | 情报里某条要深挖时，查一手资料出带出处的考据简报 |
|  | [周刊内容编纂器](../../library/skills/cobus--draft-newsletter.md)（技能） | 把一周情报编成带引用的周刊草稿；素材放本地也能跑 |

货架上 Bot 本身的原文在库里的：资料调查员（`botdirectory:bots/research-bot.md`）。

## 线索：没收，等你定

- **麦当 Bot 小镇离线包**（自媒体区 `素材库/Grok-Bot小镇`）：站点没有开放许可，包里的 123 段原文不收。包里提到的 41 个 GitHub 仓库查了许可：25 个开放许可（MIT 21、Apache-2.0 3、CC BY 1），13 个没写或写得不清楚，3 个 AGPL。开放许可的可以回原仓库按各自许可收，其中 human-writing、superpowers、Humanizer-zh 三个，正在做的 Prompt/Skills 板块那条线已经收了。包里 3 个 x.ai 链接有 2 个库里已有，1 个是新的。
- **RongleCat 导航里的 skills、opensource 两节**，以及 **majiayu000 的 `templates/`**：适合 Skills 板块找料。

开放许可的这 25 个仓库：

| 仓库 | 许可 | Star |
|---|---|---|
| [obra/superpowers](https://github.com/obra/superpowers) | MIT | 322,990 |
| [virgiliojr94/book-to-skill](https://github.com/virgiliojr94/book-to-skill) | MIT | 38,601 |
| [QwenLM/qwen-code](https://github.com/QwenLM/qwen-code) | Apache-2.0 | 30,826 |
| [alchaincyf/huashu-design](https://github.com/alchaincyf/huashu-design) | MIT | 29,972 |
| [op7418/Humanizer-zh](https://github.com/op7418/Humanizer-zh) | MIT | 23,454 |
| [larksuite/cli](https://github.com/larksuite/cli) | MIT | 18,173 |
| [MoonshotAI/kimi-code](https://github.com/MoonshotAI/kimi-code) | MIT | 8,273 |
| [XBuilderLAB/cheat-on-content](https://github.com/XBuilderLAB/cheat-on-content) | MIT | 7,617 |
| [KKKKhazix/human-writing](https://github.com/KKKKhazix/human-writing) | MIT | 4,684 |
| [imraywang/wewrite](https://github.com/imraywang/wewrite) | MIT | 3,740 |
| [cloudflare/skills](https://github.com/cloudflare/skills) | Apache-2.0 | 3,416 |
| [WeComTeam/wecom-cli](https://github.com/WeComTeam/wecom-cli) | MIT | 3,358 |
| [MrGeDiao/shuorenhua](https://github.com/MrGeDiao/shuorenhua) | MIT | 2,727 |
| [louisedesadeleer/clipify](https://github.com/louisedesadeleer/clipify) | MIT | 687 |
| [zenstory-ai/video-recap-skills](https://github.com/zenstory-ai/video-recap-skills) | MIT | 647 |
| [michalparkola/tapestry-skills](https://github.com/michalparkola/tapestry-skills) | MIT | 585 |
| [chenxiachan/xhs-claude-skills](https://github.com/chenxiachan/xhs-claude-skills) | MIT | 435 |
| [Li-Evan/Bloom](https://github.com/Li-Evan/Bloom) | MIT | 323 |
| [hezkvectory/hermes-edu-skills](https://github.com/hezkvectory/hermes-edu-skills) | MIT | 144 |
| [HAEGONG/grok-bot-profiles](https://github.com/HAEGONG/grok-bot-profiles) | CC-BY-4.0 | 64 |
| [nathanskill/niubiskill](https://github.com/nathanskill/niubiskill) | Apache-2.0 | 43 |
| [lowwwbank/anything-to-course](https://github.com/lowwwbank/anything-to-course) | MIT | 38 |
| [mingze21/bazi-ziwei-skill](https://github.com/mingze21/bazi-ziwei-skill) | MIT | 30 |
| [tavily-ai/tavily-grok-plugin](https://github.com/tavily-ai/tavily-grok-plugin) | MIT | 6 |
| [getsentry/plugin-grok](https://github.com/getsentry/plugin-grok) | MIT | 3 |

## 还没解决、要你知道的

- 链接表 `links.jsonl` 有 10MB 左右，GitHub 的 PR 页面不会展开它。
- botdirectory 收正文靠的是「投稿人就是作者」，再加上整个仓库的 MIT 声明；作者本人有没有授权给 botdirectory，我们核实不了。GrokBotDev 那 22 条原作者原文同理，靠的是 GrokBotDev 的 CC BY 声明。上货架的条目再逐条核一次。
- 分数和安全标记都是机器判断；前 50 里每条在挂上页面前要有人读一遍原文。
- 配对表里有几条依赖第三方工具：「AI搜索优化主笔」要 DevTune 账号，「活动排班巡检员」要 Soundcheck，「客户需求回顾页」要 Granola 和 Figma；领英相关的几条按规则算「国内好用」，但对国内用户不一定实用。挂之前再筛一遍。

## 怎么重跑

```bash
# 来源克隆放在仓库外，只当数据读；提交号以 scripts/ingest/sources.json 为准
node scripts/ingest/run.mjs --src <克隆目录>                 # 重建 library/ 的生成物
node scripts/ingest/run.mjs --src <克隆目录> --dump-records /tmp/records.jsonl   # 另存去重前的统一 JSONL，排查用
```

`library/annotations/` 下的中文字段、评分和首个任务是写作模型的产出，重跑不会覆盖；上游正文变了的条目会标 `zhStale`。输出是确定的：同样的输入跑两遍，文件逐字节相同。
