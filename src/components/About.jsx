import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'

const advantages = [
  {
    title: 'AI工程化落地',
    desc: '具备从0到1的AI应用实战经验，精通大模型API集成、Prompt Engineering及RAG原理，能够将模糊业务需求转化为标准化的AI自动化工作流。',
    icon: '🧠',
  },
  {
    title: '技术 × 商业翻译',
    desc: 'AI行业最稀缺的复合能力——把技术语言翻译成商业价值，把客户需求翻译成技术方案。在HookFactory实习中主动承担售前方案与商业化交付，证明了自己"最懂客户的技术人"定位。',
    icon: '🎯',
  },
  {
    title: '高并发架构底蕴',
    desc: '熟练掌握Spring Boot/Cloud微服务及Redis、RocketMQ等高并发中间件，擅长处理复杂链路下的异常追踪与数据一致性。AI应用层的工程底座同样扎实，非"只会调API"。',
    icon: '⚙️',
  },
]

const experiences = [
  {
    company: '挖财AILAB',
    role: 'AI应用全栈实习生',
    period: '2026.01 - 至今',
    project: 'HookFactory — AI驱动的信息流广告素材生成引擎',
    summary: '围绕「热点理解→素材召回→脚本生成→视频合成→ASR转写→字幕增强→质量评估」构建端到端AIGC生产闭环，实现从内容洞察到可投放短视频的全自动化。',
    highlights: [
      '主导AI广告素材自动化生产闭环：设计并落地从热点洞察到视频合成的全链路系统，覆盖私域解析、RAG召回、脚本/分镜生成、文生视频、字幕增强与BGM合成；支撑多个广告账户日常投放，大幅缩短素材交付周期。',
      '构建高可用多模型LLM网关：封装WacAiRouter与阿里云百炼等OpenAI兼容接口，实现智能路由、超时重试、JSON修复、网关错误识别及用户反馈Few-shot动态注入；将大模型结构化输出可用率提升至90%+，保障生产Pipeline零中断。',
      '创新性将CTR/CVR业务指标纳入RAG重排：对历史素材的转化数、性能分和人群标签建索引，关键词/向量双路召回+余弦相似度+投放表现加权重排，使AI生成脚本的高转化样本命中率显著提升——这证明了你理解"AI生成不是目的，高转化才是"。',
      '设计「生成→评估→反馈→再生成」自动化质检闭环：按合规分与转化分双维度调用LLM评分，结合红线词、等级规则和决策矩阵输出可执行优化建议；拦截合规风险素材，单条审核效率提升80%+。',
      '搭建工业级多模态视频合成Pipeline：整合五音/可灵/Seedance等异步生成接口，封装OSS上传、任务轮询、参考视频裁剪与链式生成；通过JavaCV实现打字机/滑入/缩放/发光等多动效字幕烧录，结合FFmpeg完成混音拼接与封面插入。',
      '搭建多源数据采集与ASR三级兜底链路：基于FastAPI+Playwright实现抖音/创量素材解析、评论抓取与OCR识别；集成Qwen3-ASR-Flash/DashScope Fun-ASR/本地Whisper三级兜底，保障下游生成质量。',
    ],
  },
  {
    company: 'FastGPT 生态 · AI解决方案',
    role: 'AI解决方案架构（独立交付）',
    period: '2025.09 - 至今',
    project: '面向B端客户的 FastGPT 企业级 AI 工作流落地',
    summary: '基于 FastGPT 开源平台，独立完成多个企业级 AI 解决方案的架构设计、开发与交付。覆盖 RAG 知识库问答、Agent 工具调用、企业微信/飞书机器人集成、多媒体素材生成等场景。以下为已交付的标杆案例：',
    highlights: [
      '【售后知识库 RAG 案例】基于 Word 知识库搭建 FastGPT RAG 应用 + 企微机器人，解决图片不召回/不展示/企微端不渲染三大难题。沉淀了完整的 Markdown 知识卡改造方案、知识库搜索参数调优指南、企微图片消息发送方案，以及"先查检索→再查提示词→最后查通道"的三步排查方法论。',
      '【销售 BOM 报价助手】搭建 FastGPT Agent + Python FastAPI + MySQL 三层架构，实现销售自然语言输入→AI识别产品配置→调用BOM成本接口→输出销售可读报价。核心设计：工具只查数据、Agent负责理解与表达，后端接口与AI逻辑完全解耦。支持按自制件/采购件/委外件分类统计成本，含精细化物料摘要和价格完整性提醒。',
      '【KAPA风格技术文档AI助手】设计对标 Datadog KAPA.AI 的技术文档+SDK代码问答方案，涵盖多源数据接入策略、代码语义检索分段方案、Query改写→检索→ReRank→生成的完整工作流。特别针对 SDK 代码库提出 Tree-sitter 语义单元切片方案，解决 FastGPT 默认分段对代码不友好的问题。',
      '【电商广告AI生产线】设计从"编导填表→AI写脚本→质量自检→TTS口播→即梦关键帧→字幕SRT→素材包打包"的端到端AIGC管线。支持5种广告类型（种草/硬广/痛点/对比/场景），完整的分镜解析+并行素材生成架构，可直接对接剪映时间轴。',
    ],
  },
]

const education = {
  school: '江苏大学',
  degree: '软件工程 · 本科',
  period: '2023.09 - 2027.06',
  highlights: [
    '担任计算机学院国际交流部部长，组织多项国际交流活动，提升跨部门沟通与组织推进能力',
    '担任科研立项小组组长，负责项目需求分析、任务拆解与日常维护，持续提升工程落地与团队协作能力',
    '活跃于计算机协会，长期参与技术讨论与实践，保持对后端开发与AI应用方向的持续投入',
  ],
}

const selfEval = [
  '具备扎实的AI工程化与Java高并发架构双重技术底蕴。熟练掌握Spring Boot/Cloud微服务及Redis、RocketMQ等中间件，擅长处理复杂链路下的异常追踪与数据一致性；同时具备从0到1的AI应用实战经验，精通大模型API集成、Prompt Engineering及RAG原理。',
  '拥有卓越的业务洞察与全栈工程落地能力。兼具技术实现深度与业务理解广度，善于充当技术与业务的"翻译官"，能够将模糊的业务需求转化为标准化的AI自动化工作流；拥有丰富的项目统筹经验，能独立承担核心开发任务，并高效推动问题闭环。',
  '具备出色的团队领导力、跨部门沟通与持续学习自驱力。曾担任科研立项组长及学院国际交流部部长，在复杂的项目拆解、日常维护及多项国际活动组织中，锤炼了极强的组织推进与团队协作能力。',
]

export default function About() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            <span className="gradient-text">关于我</span>
          </h2>
          <p className="text-text-muted text-center mb-4 max-w-lg mx-auto">
            2027届应届生 · 21岁 · AI应用 + Java后端复合方向
          </p>
          <p className="text-primary/60 text-center mb-16 text-sm max-w-lg mx-auto">
            定位"懂技术的商业人 × 懂商业的技术人"——AI行业最稀缺的复合型人才
          </p>
        </ScrollReveal>

        {/* 核心优势 */}
        <ScrollReveal>
          <h3 className="text-xl font-bold mb-8 text-center">
            <span className="gradient-text">核心优势</span>
          </h3>
        </ScrollReveal>
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {advantages.map((adv, i) => (
            <ScrollReveal key={adv.title} delay={i * 0.15}>
              <motion.div whileHover={{ y: -4 }}
                className="glass-card p-6 h-full hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="text-3xl mb-3">{adv.icon}</div>
                <h4 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{adv.title}</h4>
                <p className="text-text-muted text-sm leading-relaxed">{adv.desc}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* 经历时间线 */}
        <ScrollReveal>
          <h3 className="text-xl font-bold mb-8 text-center">
            经历<span className="gradient-text">时间线</span>
          </h3>
        </ScrollReveal>
        <div className="max-w-3xl mx-auto mb-20 space-y-8">
          {experiences.map((exp, ei) => (
            <ScrollReveal key={exp.company} delay={ei * 0.2}>
              <div className="glass-card p-6 relative overflow-hidden group">
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'radial-gradient(circle at 30% 0%, rgba(99,102,241,0.08) 0%, transparent 70%)' }}
                />
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-2 relative">
                  <div>
                    <h4 className="text-xl font-bold">{exp.role}</h4>
                    <p className="text-primary font-medium">{exp.company}</p>
                  </div>
                  <span className="text-text-muted text-sm bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap">
                    {exp.period}
                  </span>
                </div>
                <p className="text-text font-medium mb-1 relative">{exp.project}</p>
                <p className="text-text-muted text-sm mb-4 relative">{exp.summary}</p>
                <ul className="space-y-2.5 relative">
                  {exp.highlights.map((h, j) => (
                    <li key={j} className="text-text-muted text-sm flex items-start gap-2">
                      <span className="text-primary mt-0.5 shrink-0 text-xs">✦</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* 教育经历 */}
        <ScrollReveal>
          <h3 className="text-xl font-bold mb-8 text-center">
            教育<span className="gradient-text">经历</span>
          </h3>
        </ScrollReveal>
        <div className="max-w-3xl mx-auto mb-20">
          <ScrollReveal>
            <div className="glass-card p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                <div>
                  <h4 className="text-lg font-bold">{education.school}</h4>
                  <p className="text-text-muted text-sm">{education.degree}</p>
                </div>
                <span className="text-text-muted text-sm bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap">
                  {education.period}
                </span>
              </div>
              <ul className="space-y-2">
                {education.highlights.map((h, i) => (
                  <li key={i} className="text-text-muted text-sm flex items-start gap-2">
                    <span className="text-primary mt-0.5 shrink-0">●</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>

        {/* 自我评价 */}
        <ScrollReveal>
          <h3 className="text-xl font-bold mb-8 text-center">
            自我<span className="gradient-text">评价</span>
          </h3>
        </ScrollReveal>
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {selfEval.map((text, i) => (
              <ScrollReveal key={i} delay={i * 0.15}>
                <motion.div whileHover={{ x: 4 }} className="glass-card p-5 flex items-start gap-4 border-l-2 border-primary/30 hover:border-primary transition-all duration-300">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-primary text-sm font-bold">{i + 1}</span>
                  </div>
                  <p className="text-text-muted text-sm leading-relaxed">{text}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
