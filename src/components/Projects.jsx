import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import ScrollReveal from './ScrollReveal'

const projects = [
  {
    title: 'AI驱动广告素材生成引擎 · HookFactory',
    role: 'AI应用全栈实习生 · 挖财AILAB',
    period: '2026.01 - 至今',
    description: '围绕「热点理解→历史素材召回→脚本生成→多模态视频生成→ASR转写→字幕增强→质量评估」构建端到端AIGC生产闭环，实现从内容洞察到可投放短视频的自动化闭环。',
    highlights: [
      '构建多模型LLM调用层，支持WacAiRouter与阿里云百炼，实现模型路由、超时处理、JSON提取、异常修复和few-shot注入',
      '搭建20+ Prompt模板体系，覆盖选题/钩子/脚本/分镜/字幕/爆款改写等场景，批量10条视频Prompt格式强校验+去重增强',
      '基于历史素材CTR/CVR/转化数等投放表现实现RAG生成服务，关键词/向量召回+余弦相似度加权重排',
      '开发素材评估模块，按合规分与转化分LLM评分，结合红线词和决策矩阵形成「生成→评估→反馈→再生成」闭环',
    ],
    image: '🎬',
    tags: ['Java', 'Spring Boot', 'LLM API', 'RAG', 'Prompt Engineering', 'AIGC Pipeline'],
    color: 'from-violet-500 to-purple-600',
  },
  {
    title: 'AI驱动智慧交通票务平台 · 灵犀票务',
    role: 'AI应用全栈开发',
    period: '2025.06 - 2026.01',
    description: '深度融合AI Agent与大流量高并发架构的智慧交通票务服务平台，针对"瞬时流量洪峰、库存超卖、复杂出行意图检索门槛高"三大痛点，依托Redis、RocketMQ与分库分表构建交易底座，接入大模型Agent实现意图精准提取与个性化出行规划。',
    highlights: [
      '基于Redis Lua脚本实现原子购票令牌分配与限流，彻底解决库存超卖；RocketMQ延时消息完善分布式交易闭环',
      '引入AI Agent工作流处理自然语言购票指令，Prompt Engineering精准提取出发地/目的地/时间等结构化参数，结合MCP协议对接底层票务工具',
      '大模型实时分析历史客流+实时余票+运力数据，秒级生成最优候补建议与动态票额投放策略',
      '构建基于机器学习的实时反刷票风控策略，多维数据分析实现毫秒级精准甄别，异常请求自动降级至慢速队列',
    ],
    image: '🚄',
    tags: ['Spring Boot', 'Redis', 'RocketMQ', 'ShardingSphere', 'AI Agent', 'MCP', 'ML风控'],
    color: 'from-cyan-500 to-blue-600',
  },
]

function TiltCard({ children, className = '' }) {
  const ref = useRef(null)
  const x = useMotionValue(0), y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 20 })
  const springY = useSpring(y, { stiffness: 200, damping: 20 })
  const rotateX = useTransform(springY, [-0.5, 0.5], [6, -6])
  const rotateY = useTransform(springX, [-0.5, 0.5], [-6, 6])
  const [glowX, setGlowX] = useState(50), [glowY, setGlowY] = useState(50)

  const handleMouse = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    x.set(px); y.set(py)
    setGlowX((e.clientX - rect.left) / rect.width * 100)
    setGlowY((e.clientY - rect.top) / rect.height * 100)
  }

  const handleLeave = () => { x.set(0); y.set(0); setGlowX(50); setGlowY(50) }

  return (
    <motion.div
      ref={ref} onMouseMove={handleMouse} onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      className={`relative ${className}`}
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
        style={{ background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(99,102,241,0.2) 0%, transparent 60%)` }}
      />
      {children}
    </motion.div>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            <span className="gradient-text">项目经历</span>
          </h2>
          <p className="text-text-muted text-center mb-16 max-w-lg mx-auto">
            AI应用 + 高并发架构 · 从0到1工程落地
          </p>
        </ScrollReveal>

        <div className="space-y-8">
          {projects.map((project, i) => (
            <ScrollReveal key={project.title} delay={i * 0.15}>
              <TiltCard className="group">
                <motion.div whileHover={{ y: -4 }} className="glass-card overflow-hidden relative z-10">
                  <div className="grid md:grid-cols-5">
                    <div className={`md:col-span-1 bg-gradient-to-br ${project.color} flex items-center justify-center text-5xl py-8 md:py-0 relative overflow-hidden`}>
                      <motion.span whileHover={{ scale: 1.2, rotate: -8 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="relative z-10 drop-shadow-lg"
                      >
                        {project.image}
                      </motion.span>
                      <motion.div animate={{ rotate: 360 }}
                        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-4 rounded-full border border-white/10"
                      />
                      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
                    </div>

                    <div className="md:col-span-4 p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-2">
                        <div>
                          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{project.title}</h3>
                          <p className="text-sm text-primary/70">{project.role}</p>
                        </div>
                        <span className="text-text-muted text-xs bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap">{project.period}</span>
                      </div>
                      <p className="text-text-muted text-sm leading-relaxed mb-4">{project.description}</p>
                      <ul className="space-y-1.5 mb-4">
                        {project.highlights.map((h, j) => (
                          <li key={j} className="text-text-muted text-sm flex items-start gap-2">
                            <span className="text-primary mt-1 shrink-0 text-xs">✦</span>
                            {h}
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <motion.span key={tag} whileHover={{ scale: 1.05, y: -1 }}
                            className="px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium cursor-default"
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
