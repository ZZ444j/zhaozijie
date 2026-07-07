import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { HiArrowDown } from 'react-icons/hi'

function ParticleBackground() {
  const canvasRef = useRef(null)

  const init = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let mouseX = -1000, mouseY = -1000

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const handleMouse = (e) => { mouseX = e.clientX; mouseY = e.clientY }
    window.addEventListener('mousemove', handleMouse)

    const isMobile = window.innerWidth < 768
    const particles = Array.from({ length: isMobile ? 35 : 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 0.8,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
    }))

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p, i) => {
        const dx = mouseX - p.x, dy = mouseY - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 200 && dist > 0) {
          p.vx += (dx / dist) * 0.03
          p.vy += (dy / dist) * 0.03
        }
        p.vx *= 0.99; p.vy *= 0.99
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(99, 102, 241, 0.35)'
        ctx.fill()

        for (let j = i + 1; j < particles.length; j++) {
          const pdx = particles[j].x - p.x, pdy = particles[j].y - p.y
          const pdist = Math.sqrt(pdx * pdx + pdy * pdy)
          if (pdist < 140) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - pdist / 140)})`
            ctx.lineWidth = 0.5; ctx.stroke()
          }
        }
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouse)
    }
  }, [])

  useEffect(() => { const cleanup = init(); return cleanup }, [init])

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
}

function Typewriter({ texts, className = '' }) {
  const [textIndex, setTextIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = texts[textIndex]
    let timeout
    if (!deleting && charIndex < current.length) {
      timeout = setTimeout(() => setCharIndex(charIndex + 1), 60)
    } else if (!deleting && charIndex === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000)
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex(charIndex - 1), 30)
    } else if (deleting && charIndex === 0) {
      setDeleting(false)
      setTextIndex((textIndex + 1) % texts.length)
    }
    return () => clearTimeout(timeout)
  }, [charIndex, deleting, textIndex, texts])

  return (
    <span className={className}>
      {texts[textIndex].slice(0, charIndex)}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        className="inline-block w-[2px] h-[1em] bg-accent ml-0.5 align-middle"
      />
    </span>
  )
}

export default function Hero() {
  const mouseX = useMotionValue(0), mouseY = useMotionValue(0)
  const springX = useSpring(0, { stiffness: 50, damping: 20 })
  const springY = useSpring(0, { stiffness: 50, damping: 20 })

  const handleMouse = (e) => {
    const x = (e.clientX - window.innerWidth / 2) / 30
    const y = (e.clientY - window.innerHeight / 2) / 30
    mouseX.set(x); mouseY.set(y)
    springX.set(x); springY.set(y)
  }

  return (
    <section
      onMouseMove={handleMouse}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <ParticleBackground />

      <motion.div
        animate={{ scale: [1, 1.3, 1], x: [0, 40, -20, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.4, 1], x: [0, -50, 30, 0], y: [0, 40, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
      />

      <div className="relative z-10 text-center px-6 max-w-3xl">
        {/* 证件照 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex justify-center"
          style={{ x: springX, y: springY }}
        >
          <div className="relative group">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-3 rounded-md opacity-40 group-hover:opacity-70 transition-opacity"
              style={{
                background: 'conic-gradient(from 0deg, #6366f1, #06b6d4, #6366f1)',
                filter: 'blur(8px)',
              }}
            />
            <div className="relative w-32 h-40 rounded-md overflow-hidden border-2 border-white/20 bg-white shadow-lg shadow-primary/20">
              {/* 替换: <img src="/avatar.jpg" alt="赵子杰" className="w-full h-full object-cover" /> */}
              <div className="w-full h-full bg-gradient-to-b from-blue-50 to-white flex items-center justify-center text-4xl text-primary/40 select-none">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
                </svg>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-surface" />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-primary font-mono text-sm mb-4 tracking-[0.2em]"
        >
          HELLO, I&apos;M
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold mb-4 leading-tight"
        >
          <span className="gradient-text">赵子杰</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-text-muted text-base md:text-lg mb-2 h-7"
        >
          <Typewriter
            texts={[
              'AI应用开发工程师',
              '技术 × 商业复合型人才',
              'AI Agent & RAG 落地实战派',
              'FastGPT 解决方案架构',
            ]}
            className="text-accent font-medium"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-text-muted text-sm mb-2"
        >
          江苏大学 · 软件工程 · 2027届应届生 · 21岁 · 男 · 团员
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-text-muted/60 text-sm mb-2"
        >
          15380704370 · 15380704370@163.com
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="text-text-muted/50 text-xs mb-10 max-w-md mx-auto leading-relaxed"
        >
          求职意向: AI应用开发 / AI解决方案架构 / 技术售前 · 杭州 · 目标20-30万
          <br />
          职业定位: 懂技术的商业人 × 懂商业的技术人 · 目标38岁财富自由
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center justify-center gap-4"
        >
          <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            href="#projects"
            className="relative px-7 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-full font-medium transition-all duration-300 overflow-hidden group"
          >
            <span className="relative z-10">项目经历</span>
            <motion.div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ filter: 'blur(8px)' }} />
          </motion.a>
          <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            href="#about"
            className="px-7 py-3.5 border border-primary/30 hover:border-primary text-text rounded-full font-medium transition-all duration-300 hover:bg-primary/5"
          >
            了解更多
          </motion.a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: 1.2, y: { repeat: Infinity, duration: 1.5 } }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-text-muted"
      >
        <HiArrowDown size={24} />
      </motion.div>
    </section>
  )
}
