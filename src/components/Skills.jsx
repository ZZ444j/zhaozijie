import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import ScrollReveal from './ScrollReveal'

const skillCategories = [
  {
    title: 'AI工程化',
    icon: '🧠',
    skills: [
      { name: 'RAG 检索增强生成', level: 88 },
      { name: 'AI Agent 工作流编排', level: 86 },
      { name: 'Prompt Engineering', level: 90 },
      { name: '大模型 API 集成 (MCP)', level: 85 },
      { name: 'LLM 调用层/路由/异常修复', level: 84 },
      { name: '向量数据库 Milvus/Chroma', level: 78 },
    ],
  },
  {
    title: '后端架构与中间件',
    icon: '⚙️',
    skills: [
      { name: 'Spring Boot / Cloud', level: 90 },
      { name: 'Redis (Lua脚本/限流)', level: 88 },
      { name: 'RocketMQ (削峰/事务消息)', level: 85 },
      { name: 'ShardingSphere 分库分表', level: 82 },
      { name: 'MySQL 索引/事务优化', level: 86 },
      { name: 'Docker / Maven / Git', level: 86 },
    ],
  },
  {
    title: '工程素养与软实力',
    icon: '🚀',
    skills: [
      { name: '设计模式/代码重构', level: 84 },
      { name: '风控与异常流量识别', level: 78 },
      { name: '技术文档撰写', level: 88 },
      { name: '项目统筹与任务拆解', level: 86 },
      { name: '跨部门沟通推动', level: 88 },
      { name: '持续学习与技术嗅觉', level: 90 },
    ],
  },
]

function GlowBar({ name, level, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="mb-4 group">
      <div className="flex justify-between mb-1.5">
        <span className="text-sm font-medium group-hover:text-primary transition-colors">{name}</span>
        <motion.span
          className="text-xs text-text-muted"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: index * 0.08 + 0.6 }}
        >
          {inView ? (
            <CountUp target={level} duration={1.5} delay={index * 0.08 + 0.3} />
          ) : '0'}%
        </motion.span>
      </div>
      <div className="h-2 bg-surface rounded-full overflow-hidden relative">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : {}}
          transition={{ delay: index * 0.08 + 0.3, duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full relative overflow-hidden"
          style={{ background: 'linear-gradient(90deg, #6366f1, #06b6d4)' }}
        >
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 w-1/2"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }}
          />
        </motion.div>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
          style={{ boxShadow: '0 0 12px rgba(99,102,241,0.4)' }} />
      </div>
    </div>
  )
}

function CountUp({ target, duration, delay }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <motion.span ref={ref} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay, duration: 0.1 }}>
      {inView ? (
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: duration + delay }}>
          {target}
        </motion.span>
      ) : '0'}
    </motion.span>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6 bg-surface-light/30 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/20"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{
              y: [0, -30, 0, 30, 0], x: [0, 20, -10, -20, 0],
              opacity: [0.2, 0.6, 0.2, 0.6, 0.2], scale: [1, 1.5, 1, 1.5, 1],
            }}
            transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 5, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            <span className="gradient-text">专业技能</span>
          </h2>
          <p className="text-text-muted text-center mb-16 max-w-lg mx-auto">
            AI工程化 + 高并发架构 + 工程素养 · 全链路能力
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8">
          {skillCategories.map((cat, ci) => (
            <ScrollReveal key={cat.title} delay={ci * 0.15}>
              <motion.div whileHover={{ y: -4, scale: 1.01 }}
                className="glass-card p-6 h-full hover:border-primary/30 transition-all duration-300 relative group"
              >
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'radial-gradient(circle at 50% 0%, rgba(99,102,241,0.1) 0%, transparent 70%)' }}
                />
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 relative">
                  <span className="text-xl">{cat.icon}</span>
                  <span className="gradient-text">{cat.title}</span>
                </h3>
                {cat.skills.map((skill, i) => (
                  <GlowBar key={skill.name} name={skill.name} level={skill.level} index={i} />
                ))}
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
