import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiChevronDown, HiLightBulb, HiChip, HiDatabase, HiCode } from 'react-icons/hi'
import ScrollReveal from './ScrollReveal'

const cases = [
  {
    id: 'rag-knowledge',
    number: '01',
    icon: '📚',
    title: '售后知识库 RAG 与企业微信机器人',
    subtitle: '从 Word 知识库到企微客服机器人的完整落地',
    tags: ['FastGPT', 'RAG', '企业微信机器人', 'Markdown知识卡', 'ASR'],
    overview: '基于一份售后团队 Word 知识库（约52条知识条目 + 31张图片），搭建 FastGPT RAG 应用并接入企业微信机器人，回答家长关于课程、售后权益、退费规则、教材领取、APP操作等高频问题。',
    sections: [
      {
        title: '业务背景与挑战',
        icon: '🎯',
        content: `原始资料：一份 .docx 格式的售后知识库，包含标准问题、相似问法、标准答案、推荐话术、适用范围、风险等级、生效时间等结构化字段。

核心目标：
1. 家长提问后，AI 能准确命中知识库条目
2. AI 优先使用「推荐话术」进行客服式回复
3. 涉及退费、权益、金额、到账时间等高风险问题时，不乱承诺
4. 相关条目中有图片时，能在回答中展示对应图片
5. 在 FastGPT 网页端和企业微信机器人端都能稳定展示图片`,
      },
      {
        title: '问题现象与根因分析',
        icon: '🔍',
        content: `测试问题："买了 20 天想退费，会怎么扣？"

AI 回复：文本回答基本正确，但没有展示售后权益图片。用户追问「有图片吗」时，AI 只回复"有的"，仍然没有输出图片。

根因拆解（三步排查法）：

情况一：AI 对话节点没有接知识库引用
知识库搜索节点能搜到内容，但 AI 对话节点的「知识库引用」字段为空，AI 看不到图片 Markdown。

情况二：知识库搜索结果没有召回图片
原因是 Markdown 中图片与答案距离太远，FastGPT 切块时图片被切到另一个 chunk；或引用上限太小，只召回了文字没有召回图片；或用户追问时没有开启问题优化，检索丢失了上一轮上下文。

情况三：FastGPT 网页端能显示，企业微信机器人不显示
这是接入企微后最容易踩的坑。FastGPT 知识库图片路径为 dataset/xxx.png（内部相对路径），企微客户端无法直接访问。企微图片消息需要 base64+md5，且 Markdown 内联图片不一定被企微通道渲染。`,
      },
      {
        title: '解决方案架构',
        icon: '🏗️',
        content: `建议分两层处理：

第一层：保证检索链路完整
知识库里有图片 → 检索时召回图片 → AI 节点收到图片 Markdown → AI 原样输出图片 Markdown → 输出渠道能渲染

第二层：企业微信专属处理
文本回复走 FastGPT AI 对话；图片展示走公网图片 URL 或企业微信 image 消息；不长期依赖 dataset 内部相对路径。

知识库 Markdown 改造方案：
\`\`\`markdown
## 售后权益
### 标准问题：售后权益
### 相似问法：怎么退费？/退费权益介绍/...
### 标准答案：【售后无忧】1、付费七天内无理由退费...
### 推荐话术：【售后无忧】1、付费七天内无理由退费...
### 相关图片
回答本条问题时，需要展示以下图片：
![售后权益 - 图片](dataset/xxx/xxx.png)
### 元数据：适用范围：正式用户 / 风险等级：高 / 更新时间：2026年5月10日
\`\`\`

关键原则：图片必须放在对应条目内部，紧跟推荐话术，给图片前加标题"相关图片"，加明确说明"回答本条问题时需要展示以下图片"。`,
      },
      {
        title: '关键配置参数',
        icon: '⚙️',
        content: `知识库搜索节点推荐参数：
• 搜索方式：语义检索 + 全文检索
• 引用上限：3000-5000（太小会拿不到图片 Markdown）
• 最低相关度：0.55-0.6
• 结果数量：2-3
• 结果重排：开启
• 问题优化：开启（用户追问时保持上一轮上下文）

AI 对话节点必填：
• 知识库引用 = 知识库搜索 > 知识库引用（这个字段必须绑定！）
• 聊天记录：6-10
• 模型温度：0.1

提示词核心规则：
• 强制扫描本次知识库引用中的所有 Markdown 图片
• 只要出现图片 Markdown，回答末尾必须原样输出
• 禁止只说"有图片"、禁止只描述图片、禁止省略图片
• 最多输出 2 张最相关图片`,
      },
      {
        title: '企业微信落地方案对比',
        icon: '📱',
        content: `方案 A（简单版）：FastGPT 负责文本回复，关键图片使用公网 HTTPS URL，AI 在回答末尾输出图片链接。优点：快、不需额外开发。缺点：企微不一定稳定渲染 Markdown 图片。

方案 B（稳定版）：FastGPT 负责检索和生成，中间服务把图片转 base64+md5，调用企微 webhook 先发文本再发 image 消息。优点：图片展示最稳定，可控制发送策略。缺点：需要轻量开发中间服务。

方案 C（折中版）：关键图片上传对象存储获取公网 HTTPS URL，知识库 Markdown 中直接写公网地址，AI 原样输出。优点：比 dataset 更适合企微，不需复杂开发。缺点：需要维护图片 URL。

最终推荐：正式使用采用方案 B，文本和图片分开发送；退费/权益/金额类图片走 image 消息，不依赖 Markdown 内联图。`,
      },
      {
        title: '案例复盘与方法论沉淀',
        icon: '💡',
        content: `核心方法论：

最重要的排查原则：先查知识库搜索结果 → 再查 AI 提示词 → 最后查输出通道。
任何一环断掉，最终用户都看不到图片。

图片链路完整性检查清单：
☑ 知识库搜索结果里有没有 ![...](dataset/xxx.png)
☑ AI 对话节点有没有绑定知识库引用
☑ 提示词是否要求原样输出图片 Markdown
☑ 图片是否和答案在同一个知识块附近
☑ 引用上限是否太小导致图片被截断
☑ 企微端图片路径是否是公网可访问 URL

可复用资产：
• Markdown 知识卡模板（标准问题+相似问法+标准答案+推荐话术+相关图片+元数据）
• 三步排查 SOP（检索→提示词→通道）
• 三种企微落地方案的适用场景对比
• 售后类高风险条目的 Prompt 强化模板`,
      },
    ],
    techStack: ['FastGPT', 'RAG', '企业微信机器人 API', 'Markdown', 'Whisper ASR'],
  },
  {
    id: 'bom-quote',
    number: '02',
    icon: '💰',
    title: '销售 BOM 初步报价助手',
    subtitle: '自然语言输入 → AI识别产品 → BOM成本查询 → 销售可读报价',
    tags: ['FastGPT Agent', 'Python FastAPI', 'MySQL', 'BOM', '工具调用'],
    overview: '面向办公家具行业销售人员，搭建 FastGPT Agent + Python FastAPI + MySQL 三层架构。销售只需输入客户需求（如"单人位R，1500木柜，1800*750，带翻转屏"），系统自动识别对应产品、查询 BOM 成本、输出销售可读的初步测算结果。',
    sections: [
      {
        title: '业务痛点',
        icon: '🎯',
        content: `● 销售人员不熟悉 BOM 结构，无法直接看懂 ERP 导出的 BOM 表
● BOM 明细层级复杂，包含自制件、采购件、委外件等多种物料类型
● 产品规格描述不统一，客户通常使用自然语言表达需求
● 报价需要结合物料成本、加工成本、外协成本等多个维度
● 如果每次都依赖技术/生产/商务人员查询，响应速度极慢`,
      },
      {
        title: '系统架构',
        icon: '🏗️',
        content: `四层架构设计：

┌─────────────────────────────┐
│  销售输入（自然语言）          │
│  "单人位R 1500木柜 1800*750"  │
└──────────┬──────────────────┘
           ↓
┌─────────────────────────────┐
│  FastGPT 主 Agent            │
│  · 理解销售自然语言           │
│  · 判断产品匹配               │
│  · 调用 BOM 成本查询工具      │
│  · 整理销售可读报价说明        │
└──────────┬──────────────────┘
           ↓
┌─────────────────────────────┐
│  Python FastAPI 后端          │
│  · 查询 BOM 层级结构          │
│  · 计算物料累计用量           │
│  · 按属性分类统计成本         │
│  · 返回结构化 JSON            │
│  · 部署：Sealos DevBox        │
└──────────┬──────────────────┘
           ↓
┌─────────────────────────────┐
│  MySQL 数据库                 │
│  · bom_headers（产品主表）     │
│  · bom_lines（BOM树形结构）   │
│  · 支持多层级父子关系          │
└─────────────────────────────┘

核心设计原则：工具只负责查数据返回 JSON，Agent 负责理解和表达。两者完全解耦，后续可轻松增加产品、接入真实 ERP 数据。`,
      },
      {
        title: '数据库设计',
        icon: '🗄️',
        content: `BOM 头表（bom_headers）：
| 字段 | 说明 |
|------|------|
| root_item_no | 产品编号 |
| root_item_name | 产品名称 |
| root_spec | 产品规格描述 |
| version | BOM 版本 |

BOM 明细表（bom_lines）：
| 字段 | 说明 |
|------|------|
| bom_header_id | 所属产品 |
| parent_line_id | 父级 BOM 行（树形结构） |
| level_no | BOM 层级 |
| path | 层级路径 |
| item_no | 物料编号 |
| item_name | 物料名称 |
| spec | 规格 |
| quantity | 当前父项下的用量 |
| item_attribute | 自制件 / 采购件 / 委外件 |

BOM 是树形结构，例如：
侧柜组（R）
└── 木侧柜+升降柜
    ├── 四角钉
    ├── 偏芯轮
    ├── 尼龙螺母
    └── 梯形螺母

通过树形遍历计算每个物料在最终产品中的累计用量。`,
      },
      {
        title: 'API 接口设计',
        icon: '🔌',
        content: `后端基于 Python FastAPI，提供四个核心接口：

1. GET /health — 健康检查
2. GET /api/bom/products — 产品列表（返回所有可用产品 BOM）
3. GET /api/bom/{root_item_no}/lines — BOM 明细（完整层级树）
4. GET /api/bom/{root_item_no}/cost — 成本查询

成本接口返回示例：
{
  "root_item_no": "16102000620001",
  "root_item_name": "Y-MOD-LNMS",
  "root_spec": "单人位R/1500木柜/1800*750/翻转屏/桌下屏/...",
  "total_cost": 872.36,
  "breakdown": {
    "自制件": 562.00,
    "采购件": 147.36,
    "委外件": 163.00
  },
  "priced_item_count": 52,
  "missing_price_count": 0
}

成本计算逻辑：物料小计 = 累计用量 × 单价，产品总成本 = 所有物料小计之和，按物料属性分类汇总。Demo 阶段价格写死在代码中，后续迁移至独立价格表。`,
      },
      {
        title: '产品匹配规则',
        icon: '🎯',
        content: `系统内置 5 个模拟产品：

| 产品编号 | 产品名称 | 适用场景 |
|---------|---------|---------|
| 16102000620001 | Y-MOD-LNMS | 单人位 R 标准款 |
| 16102000620002 | Y-MOD-LNMS-L | 单人位 L 款 |
| 16102000620003 | Y-MOD-LNMS-DUO | 双人位款 |
| 16102000620004 | Y-MOD-LNMS-BASIC | 基础款（无翻转屏/书架） |
| 16102000620005 | Y-MOD-LNMS-PRO | 高配款（2000*800/1800木柜） |

销售输入 → AI 自动匹配：
"单人位R、1500木柜、1800*750" → 16102000620001
"双人位、3000木柜、3600*750" → 16102000620003
"基础款、不要翻转屏" → 16102000620004

描述不清楚时，Agent 会主动追问确认产品型号。`,
      },
      {
        title: '报价输出策略',
        icon: '📊',
        content: `Agent 输出内容（精细化物料摘要，非完整 BOM 展开）：

1. 产品信息（编号+名称+规格）
2. 初步测算总额
3. 成本分类汇总（自制件/采购件/委外件饼图数据）
4. 自制件重点物料（按金额 Top 5）
5. 采购件重点物料（按金额 Top 5）
6. 委外件重点物料
7. 其他低金额物料汇总
8. 价格完整性提醒（哪些物料缺价格）
9. 销售注意事项

格式以 Markdown 表格输出，销售可直接复制给客户或导入报价单。

设计考量：不输出完整 BOM 明细（太慢+太长），只输出重点物料+分类汇总，销售 30 秒内能看完。`,
      },
    ],
    techStack: ['FastGPT Agent', 'Python FastAPI', 'MySQL', 'Sealos DevBox', 'HTTP Tool Calling'],
  },
  {
    id: 'kapa-ai',
    number: '03',
    icon: '🤖',
    title: 'KAPA 风格技术文档 AI 助手方案',
    subtitle: '对标 Datadog KAPA.AI，设计技术文档+SDK代码双知识库问答系统',
    tags: ['FastGPT', 'RAG', 'ReRank', 'Tree-sitter', '代码检索', '多源数据'],
    overview: '对标 Datadog KAPA.AI（99%准确率，51%工单消解率），基于 FastGPT 设计"技术文档 + SDK 代码"双知识库问答方案。重点解决代码语义检索分段问题，覆盖多源数据接入、版本感知、PII脱敏、企业合规等需求。',
    sections: [
      {
        title: 'KAPA 能力对标分析',
        icon: '📊',
        content: `KAPA.AI 的三大护城河：
1. 多源数据接入（Confluence/Jira/GitHub/Slack/PDF/Notion/OpenAPI），版本感知——问"v5.3的SDK怎么用"不会拿v4的答案糊弄
2. Answer Engine™：高准确率RAG流水线，找到就答+引来源，找不到明确说"未在文档中找到"或主动报告知识缺口
3. 企业级合规：SSO、RBAC、零数据保留、PII masking、SOC2/GDPR

FastGPT 能做到的（≈70%）：
✅ 知识库 + RAG + ReRank + 引用来源
✅ 工作流编排（拖拽式）
✅ API/网页/iframe 嵌入
✅ 对话日志、点赞点踩、Token 统计
✅ 用户/权限/SSO（内置基本权限）
✅ 私有部署（KAPA 反而不支持）

需要自己补的（≈30%）：
❌ Confluence/Jira/Slack 等多源官方接入器 → 自己写定时同步脚本
❌ 版本感知的代码语义检索 → 需要 Tree-sitter 预处理 + 自定义分段
❌ PII 脱敏 → 数据入库前预处理
❌ 99% 准确率的成熟流水线 → Rerank + 提示词 + 反馈闭环慢慢调`,
      },
      {
        title: '整体架构：三应用分离',
        icon: '🏗️',
        content: `推荐分三个独立应用而非一个大应用：

┌─────────────────────────────────────┐
│     客户入口（统一对话）              │
│  官网浮窗 / 文档站嵌入 / 客服系统      │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│     综合应用（路由）                  │
│     简单工作流：问题分类              │
└──────┬──────────────────┬───────────┘
       ↓                  ↓
┌──────────────┐  ┌──────────────┐
│ 应用A：文档助手 │  │ 应用B：代码助手 │
│ 知识库：技术文档 │  │ 知识库：SDK代码 │
│（段落/章节分段）│  │（语义单元分段） │
└──────────────┘  └──────────────┘

分离原因：
● 检索策略不同：文档按段落章节，代码按"语义单元"（函数/类/方法）
● 提示词不同：文档助手是"技术顾问风格"，代码助手严格输出代码块+文件引用
● Embedding 模型不同：文档用 bge-m3，代码用 unixcoder/codestral-embed
● 后续 A/B 测试和效果监控分开更清晰`,
      },
      {
        title: 'SDK 代码库检索方案（核心创新）',
        icon: '💎',
        content: `FastGPT 默认分段对代码极不友好——按字符/行切，导致函数被切到两段、import 和类定义被切散。

解决方案：Tree-sitter 语义单元切片

自己写代码预处理脚本，按"语义单元"切片，每条数据对应一个完整的代码块：

{
  "file_path": "src/auth/oauth.py",
  "language": "python",
  "sdk_version": "v5.3.0",
  "symbol_type": "class | function | method | example",
  "symbol_name": "OAuth2Client.authorize",
  "signature": "def authorize(self, code: str, state: str) -> Token",
  "docstring": "Exchange authorization code for access token...",
  "code": "完整代码块",
  "context": "所在文件 + 父类/调用方"
}

数据采集流程：
1. 用 Tree-sitter 解析源码，遍历函数/类/方法节点
2. 提取 docstring、签名、代码体、入参/返回类型注释
3. 同样处理 examples/、README.md、API 文档
4. 给每条数据打元数据（语言、版本、模块路径、symbol 类型）

检索优化：
● 用户问"怎么用 OAuth 登录" → 检索 symbol_name + docstring 字段
● 用户问"OAuth2Client.authorize 的入参" → 精确匹配 + 语义兜底
● 工作流加 Query 改写节点：把自然语言先转成"函数名/类名/关键词"，再丢给检索`,
      },
      {
        title: '技术文档知识库配置',
        icon: '📝',
        content: `数据源接入方式（按优先级）：
1. 网页爬取：FastGPT 内置"网页同步"→ 填文档站根 URL，自动递归抓取
2. 文件批量上传：PDF/Word/Markdown/Confluence 导出 HTML → 直接拖入
3. 定时同步：dataset.externalFileUrl 接口，写脚本每周拉取 Confluence 页面
4. API 同步：文档源有 OpenAPI 的话，中间层转成 Markdown 注入

分段策略（RAG 命门）：
● 推荐：按章节/标题层级分段（Markdown 增强分段）
● 每段目标：500-800 字
● 段间重叠：80-120 字
● ❌ 不要按字符数粗暴切——API 文档的"参数说明"和"返回值"会被切散

元数据打标：
● product: <产品线>
● version: <文档版本>
● doc_type: tutorial | api_reference | faq | changelog | troubleshooting
● last_updated: <日期>
● language: zh | en

ReRank 必开：bge-reranker-v2 或 cohere rerank，粗排 Top50 精排到 Top5，准确率可提升 20%+

Embedding 选择：中文→bge-large-zh-v1.5，多语种→bge-m3，避坑→不要用小模型`,
      },
      {
        title: '四阶段迭代路线',
        icon: '🗓️',
        content: `v1 - MVP（第1周）：文档库 + 简单对话应用，50篇核心文档，能跑通即可。准确率约 60-70%。

v2 - 代码助手（第2周）：代码库接入 + 工作流搭建，能回答 SDK 问题 + 输出代码。加 ReRank 后准确率能到 80%。

v3 - 反馈闭环（第3周）：监控埋点 + 提示词迭代 + ReRank 调优。每周拉取点踩 Top20，分类处理（缺内容→补文档，分段差→重新切，提示词弱→改提示词）。准确率摸到 85%+。

v4 - 生产化（第4周）：SSO 接入 + 嵌入官网/客服 + PII 脱敏 + 文档自动同步。

真实预期：v1 上线后准确率 60-70%，加 ReRank + 提示词迭代后到 80%，持续 2-3 个月调优后到 90%+。KAPA 的 99% 是一年调出来的。`,
      },
    ],
    techStack: ['FastGPT', 'RAG', 'ReRank', 'Tree-sitter', 'bge-m3', 'OIDC/SAML SSO'],
  },
  {
    id: 'ad-pipeline',
    number: '04',
    icon: '🎬',
    title: '电商广告 AI 生产线',
    subtitle: '从编导填表到视频素材包的端到端 AIGC 管线',
    tags: ['FastGPT工作流', 'GPT-4o', 'MiniMax TTS', '即梦API', 'AIGC Pipeline'],
    overview: '设计一条完整的电商广告 AI 生产线：编导输入产品信息，AI 自动完成脚本生成→质量自检→分镜解析→TTS 口播→关键帧生成→字幕 SRT→素材包打包，剪辑师只需 5 分钟合片。支持 5 种广告类型和 10 个产品品类。',
    sections: [
      {
        title: '业务流程：两阶段管线',
        icon: '🔄',
        content: `阶段一：脚本生成
[编导填9个字段] → [AI脚本生成] → [AI质量自检(5项打分)] → [AI决策分流] → [输出分镜口播脚本]
不合格的自动打回重写（最多2次）

阶段二：视频素材生成（阶段一通过后并行执行）
[AI分镜解析(N个镜头)] →
  ├─ [HTTP] TTS口播生成 → mp3音频
  ├─ [HTTP×N] 即梦关键帧 → N张关键帧图
  └─ [代码] 字幕SRT生成 → 标准SRT文件
→ [代码] 素材包打包 → JSON格式素材包`,
      },
      {
        title: '五种广告类型',
        icon: '🎭',
        content: `同一条产品信息，切换广告类型生成完全不同风格的脚本：

类型1 · 种草短视频：抖音/小红书信息流。结果前置(0-3s)→使用体验(3-10s)→效果展示(10-20s)→推荐+指引(20-30s)。第一人称真实分享，口语化强。"我最近发现一个面膜，敷完第二天起来脸还是嫩的那种"

类型2 · 硬广口播：千川投放/直播间切片。价格冲击(0-3s)→产品堆料(3-10s)→信任背书(10-20s)→逼单+赠品(20-35s)→CTA(35-40s)。快节奏强促销，数字轰炸。"79块钱两盒还送试用装！就500单，手慢没了"

类型3 · 痛点触发型：美妆/个护/健康。痛点描述(0-5s)→共鸣强化(5-12s)→产品介入(12-25s)→效果对比(25-35s)→信任+下单(35-45s)。先戳痛点再给解药，情绪过山车。

类型4 · 对比测评型：3C/家居/食品。抛出问题(0-5s)→实测过程(5-20s)→结果碾压(20-30s)→优势总结(30-40s)→限时优惠(40-45s)。数据说话，客观碾压。

类型5 · 场景还原型：服饰/厨具/母婴。生活场景(0-5s)→痛点放大(5-15s)→产品改善场景(15-25s)→新场景描绘(25-35s)→引导行动(35-40s)。让用户自己代入。`,
      },
      {
        title: '生成规则与质量控制',
        icon: '✅',
        content: `行文规范（所有类型通用）：
● 每句不超过 18 字，方便口播换气
● 用"你"不用"您"
● 数字具体化："从299打到69"，不写"很便宜"
● 少用形容词，多用动词和画面描述
● 卖点转化："采用纳米级玻尿酸分子"→"涂上去咻一下就被皮肤吃进去了"
● 价格表达：先原价再活动价，拉大对比；赠品具体到数量和品名

质量自检5维度：
| 检查项 | 权重 | 标准 |
|-------|------|------|
| 钩子强度 | 30% | 前3秒必须有具体话术钩子 |
| 口语自然 | 20% | 读出来像人话，不能有说明书味 |
| 结构完整 | 20% | 钩子→展开→亮点→信任→行动 |
| 时长控制 | 15% | 目标时长 ±5秒内 |
| 卖点覆盖 | 15% | 用户给的卖点不能漏 |

质量不过关的脚本自动打回重写（最多2轮），确保输出可直接使用。`,
      },
      {
        title: '技术底座与API集成',
        icon: '🔧',
        content: `核心服务选型：

| 服务 | 用途 | 产品 |
|-----|------|------|
| 编排平台 | 工作流引擎 | FastGPT |
| 大模型 | 脚本生成+自检+分镜 | GPT-4o / Claude Sonnet 4 |
| 语音合成 | TTS 口播 | MiniMax TTS (speech-01-turbo) |
| 图像生成 | 关键帧图片 | 即梦 API (1920×1080) |
| 视频生成 | 视频片段（可选） | 可灵 API (图生视频) |

分镜解析输出结构：
{
  "shot_id": 1,           // 镜头序号
  "stage": "钩子",         // 阶段分类
  "start_time": 0,        // 起始秒
  "end_time": 4,          // 结束秒
  "narration": "...",     // 口播文案
  "visual_prompt_cn": "...", // 中文画面描述
  "visual_prompt_en": "...", // 英文画面描述（给即梦API）
  "camera": "特写"         // 运镜类型
}

拆分规则：按脚本自然阶段切分，每镜头4-8秒，口播超10秒的阶段拆成2个镜头。

TTS 推荐配置：MiniMax TTS，模型 speech-01-turbo，32000Hz MP3，音色选女声知性或男声成熟，电商广告语速 1.05x。

关键帧：即梦 API，1920×1080 写实风格，每个镜头 1 张（8-12 个镜头=8-12 张图）。

字幕：代码节点根据分镜时间轴+口播文案自动生成标准 SRT 字幕文件。`,
      },
      {
        title: '落地策略与后续规划',
        icon: '🚀',
        content: `推荐落地顺序：
P0（今天）：FastGPT 搭阶段一（填表→生成→自检→输出脚本），30分钟可用的脚本生成工具
P1（明天）：加阶段二（分镜解析+TTS+关键帧+字幕），1小时完整素材包
P2（下周）：接入可灵视频生成，等 API 支持批量提交+Webhook 回调后接入

可灵暂时不建议原因：一条45秒广告需要5-9次调用，排队总计15-20分钟，用户在 FastGPT 里等太久。

素材包最终输出格式：
{
  "project": "充电宝_种草短视频",
  "audio": { "url": "https://...mp3", "duration": 60 },
  "shots": [
    { "shot_id": 1, "start": 0, "end": 4, "narration": "...", "keyframe": "https://...png" }
  ],
  "srt": "1\\n00:00:00,000 --> 00:00:04,000\\n...",
  "timeline_json": { ... }  // 可导入剪映
}

后续扩展方向：接入可灵视频片段生成、剪映自动化插件、多产品对比脚本、AB测试不同广告类型效果追踪。`,
      },
    ],
    techStack: ['FastGPT', 'GPT-4o', 'Claude Sonnet', 'MiniMax TTS', '即梦 API', '可灵 API'],
  },
]

export default function CaseStudies() {
  const [expandedCase, setExpandedCase] = useState(null)
  const [expandedSections, setExpandedSections] = useState({})

  const toggleCase = (id) => {
    setExpandedCase(expandedCase === id ? null : id)
    setExpandedSections({})
  }

  const toggleSection = (caseId, sectionIdx) => {
    setExpandedSections((prev) => ({
      ...prev,
      [`${caseId}-${sectionIdx}`]: !prev[`${caseId}-${sectionIdx}`],
    }))
  }

  return (
    <section id="cases" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            <span className="gradient-text">FastGPT 解决方案案例</span>
          </h2>
          <p className="text-text-muted text-center mb-4 max-w-lg mx-auto">
            独立架构设计 · 端到端交付 · 真实企业场景
          </p>
          <p className="text-primary/50 text-center mb-16 text-sm max-w-lg mx-auto">
            以下四个案例均基于 FastGPT 开源平台，从需求分析到架构设计再到落地交付全程独立完成
          </p>
        </ScrollReveal>

        <div className="space-y-6">
          {cases.map((c, ci) => (
            <ScrollReveal key={c.id} delay={ci * 0.1}>
              <motion.div
                className={`glass-card overflow-hidden transition-all duration-300 ${
                  expandedCase === c.id ? 'border-primary/40 shadow-lg shadow-primary/5' : 'hover:border-primary/20'
                }`}
              >
                {/* Header - always visible */}
                <button
                  onClick={() => toggleCase(c.id)}
                  className="w-full text-left p-6 flex items-start gap-5 group"
                >
                  {/* Number + Icon */}
                  <div className="shrink-0 flex flex-col items-center gap-1">
                    <span className="text-3xl">{c.icon}</span>
                    <span className="text-xs text-text-muted font-mono">{c.number}</span>
                  </div>

                  {/* Title area */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg md:text-xl font-bold group-hover:text-primary transition-colors">
                        {c.title}
                      </h3>
                    </div>
                    <p className="text-text-muted text-sm mb-3">{c.subtitle}</p>
                    <p className="text-text-muted/70 text-sm line-clamp-2">{c.overview}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {c.tags.map((t) => (
                        <span key={t} className="px-2 py-0.5 bg-primary/8 text-primary/80 text-xs rounded-full font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Expand icon */}
                  <motion.div
                    animate={{ rotate: expandedCase === c.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="shrink-0 mt-2 text-text-muted"
                  >
                    <HiChevronDown size={20} />
                  </motion.div>
                </button>

                {/* Expandable detail */}
                <AnimatePresence>
                  {expandedCase === c.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 border-t border-primary/10">
                        {/* Tech stack bar */}
                        <div className="flex flex-wrap items-center gap-2 py-4">
                          <span className="text-xs text-text-muted font-semibold uppercase tracking-wider mr-1">技术栈:</span>
                          {c.techStack.map((t) => (
                            <span key={t} className="px-2.5 py-1 bg-surface border border-primary/10 text-text text-xs rounded-full">
                              {t}
                            </span>
                          ))}
                        </div>

                        {/* Detail sections accordion */}
                        <div className="space-y-3">
                          {c.sections.map((section, si) => {
                            const isOpen = expandedSections[`${c.id}-${si}`]
                            return (
                              <div key={si} className="border border-primary/10 rounded-xl overflow-hidden">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleSection(c.id, si)
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-surface-light/50 transition-colors"
                                >
                                  <span className="text-lg">{section.icon}</span>
                                  <span className={`text-sm font-medium flex-1 ${isOpen ? 'text-primary' : 'text-text'}`}>
                                    {section.title}
                                  </span>
                                  <motion.div
                                    animate={{ rotate: isOpen ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-text-muted"
                                  >
                                    <HiChevronDown size={16} />
                                  </motion.div>
                                </button>
                                <AnimatePresence>
                                  {isOpen && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.3 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="px-4 pb-4 pt-1 text-text-muted text-sm leading-relaxed whitespace-pre-line">
                                        {section.content}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
