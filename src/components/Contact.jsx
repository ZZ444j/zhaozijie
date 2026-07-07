import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiMail, HiPhone, HiLocationMarker, HiUser } from 'react-icons/hi'
import { FaGithub } from 'react-icons/fa'
import ScrollReveal from './ScrollReveal'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 3000)
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <section id="contact" className="py-24 px-6 bg-surface-light/30 relative overflow-hidden">
      {/* Background decorative orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-20 -right-20 w-80 h-80 bg-primary rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            <span className="gradient-text">联系我</span>
          </h2>
          <p className="text-text-muted text-center mb-16 max-w-lg mx-auto">
            2027届应届生 · 杭州 · AI应用 + Java后端方向 · 期待交流
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* 联系信息 */}
          <ScrollReveal direction="left">
            <div>
              <h3 className="text-xl font-bold mb-6">联系方式</h3>
              <div className="space-y-4 mb-8">
                {[
                  { icon: HiUser, label: '赵子杰', value: '男 · 21岁 · 应届生 · 团员' },
                  { icon: HiMail, label: '邮箱', value: '15380704370@163.com', href: 'mailto:15380704370@163.com' },
                  { icon: HiPhone, label: '电话', value: '15380704370', href: 'tel:15380704370' },
                  { icon: HiLocationMarker, label: '所在地', value: '浙江 · 杭州' },
                ].map((item) => {
                  const content = (
                    <div className="flex items-center gap-3 text-text-muted hover:text-primary transition-colors group">
                      <div className="w-10 h-10 rounded-full glass-card flex items-center justify-center shrink-0 group-hover:border-primary/50 transition-all">
                        <item.icon size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-text-muted/60">{item.label}</p>
                        <p className="text-sm font-medium">{item.value}</p>
                      </div>
                    </div>
                  )
                  return item.href ? (
                    <a key={item.label} href={item.href} className="block">{content}</a>
                  ) : (
                    <div key={item.label}>{content}</div>
                  )
                })}
              </div>

              <h4 className="text-sm font-semibold text-text-muted mb-4 uppercase tracking-wider">
                个人标签
              </h4>
              <div className="flex flex-wrap gap-2 mb-8">
                {['AI应用开发', 'Java后端', '高并发架构', 'RAG', 'AI Agent', 'Spring Boot'].map((tag) => (
                  <motion.span key={tag} whileHover={{ scale: 1.05, y: -1 }}
                    className="px-3 py-1.5 bg-primary/10 text-primary text-xs rounded-full font-medium cursor-default"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>

              <h4 className="text-sm font-semibold text-text-muted mb-4 uppercase tracking-wider">
                社交平台
              </h4>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/50 transition-all inline-flex"
                aria-label="GitHub"
              >
                <FaGithub size={18} />
              </motion.a>
            </div>
          </ScrollReveal>

          {/* 联系表单 */}
          <ScrollReveal direction="right">
            <div className="glass-card p-6 relative group">
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: 'radial-gradient(circle at 80% 20%, rgba(99,102,241,0.08) 0%, transparent 70%)' }}
              />
              <h3 className="text-lg font-bold mb-6 relative">发送消息</h3>
              <form onSubmit={handleSubmit} className="space-y-4 relative">
                <div>
                  <input type="text" placeholder="你的名字" required
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-surface border border-primary/15 rounded-lg text-text placeholder-text-muted focus:outline-none focus:border-primary transition-colors text-sm"
                  />
                </div>
                <div>
                  <input type="email" placeholder="邮箱地址" required
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 bg-surface border border-primary/15 rounded-lg text-text placeholder-text-muted focus:outline-none focus:border-primary transition-colors text-sm"
                  />
                </div>
                <div>
                  <textarea rows={4} placeholder="你的消息..." required
                    value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 bg-surface border border-primary/15 rounded-lg text-text placeholder-text-muted focus:outline-none focus:border-primary transition-colors text-sm resize-none"
                  />
                </div>
                <motion.button type="submit"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 rounded-full font-medium text-white transition-all duration-300 ${sent ? 'bg-emerald-500' : 'bg-primary hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/30'}`}
                >
                  {sent ? '✓ 发送成功！' : '发送消息'}
                </motion.button>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
